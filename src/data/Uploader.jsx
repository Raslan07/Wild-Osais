import { isFuture, isPast, isToday } from 'date-fns';
import { useState } from 'react';
import supabase from '../services/supabase';
import Button from '../ui/Button';
import { subtractDates } from '../utils/helpers';
import { bookings } from './data-bookings';
import { cabins } from './data-cabins';
import { guests } from './data-guests';

// const originalSettings = {
//   minBookingLength: 3,
//   maxBookingLength: 30,
//   maxGuestsPerBooking: 10,
//   breakfastPrice: 15,
// };

async function deleteGuests() {
  const { error } = await supabase.from('guests').delete().gt('id', 0);
  if (error) console.log(error.message);
}

async function deleteCabins() {
  const { error } = await supabase.from('cabins').delete().gt('id', 0);
  if (error) console.log(error.message);
}

async function deleteBookings() {
  const { error } = await supabase.from('booking').delete().gt('id', 0);
  if (error) console.log(error.message);
}

async function createGuests() {
  const { error } = await supabase.from('guests').insert(guests);
  if (error) console.log(error.message);
}

async function createCabins() {
  const { error } = await supabase.from('cabins').insert(cabins);
  if (error) console.log(error.message);
}

function getRequiredArrayItem(items, index, label) {
  const item = items.at(index);

  if (!item) {
    throw new Error(`Missing ${label} for index ${index}.`);
  }

  return item;
}

async function createBookings() {
  // Bookings need a guestId and a cabinId. We can't tell Supabase IDs for each object, it will calculate them on its own. So it might be different for different people, especially after multiple uploads. Therefore, we need to first get all guestIds and cabinIds, and then replace the original IDs in the booking data with the actual ones from the DB
  const { data: guestsIds, error: guestError } = await supabase
    .from('guests')
    .select('id')
    .order('id');

  if (guestError) throw new Error(`Failed to load guest IDs: ${guestError.message}`);

  const allGuestIds = guestsIds.map((guest) => guest.id);

  const { data: cabinsIds, error: cabinError } = await supabase
    .from('cabins')
    .select('id')
    .order('id');

  if (cabinError) throw new Error(`Failed to load cabin IDs: ${cabinError.message}`);

  const allCabinIds = cabinsIds.map((cabin) => cabin.id);

  if (!allGuestIds.length || !allCabinIds.length) {
    throw new Error('Cannot create bookings: the guests or cabins table is empty.');
  }

  const finalBookings = bookings.map((booking) => {
    // Here relying on the order of cabins, as they don't have an ID yet.
    const cabin = getRequiredArrayItem(
      cabins,
      booking.cabinId - 1,
      `cabin with original ID ${booking.cabinId}`
    );

    const guestId = allGuestIds.at(booking.guestId - 1);
    const cabinId = allCabinIds.at(booking.cabinId - 1);

    if (guestId == null) {
      throw new Error(
        `Missing guest ID mapping for booking guestId ${booking.guestId}.`
      );
    }

    if (cabinId == null) {
      throw new Error(
        `Missing cabin ID mapping for booking cabinId ${booking.cabinId}.`
      );
    }

    const numNights = subtractDates(booking.endDate, booking.startDate);
    const cabinPrice = numNights * (cabin.regularPrice - cabin.discount);
    const extrasPrice = booking.hasBreakfast
      ? numNights * 15 * booking.numGuests
      : 0; // hardcoded breakfast price
    const totalPrice = cabinPrice + extrasPrice;

    let status = 'unconfirmed';
    if (
      isPast(new Date(booking.endDate)) &&
      !isToday(new Date(booking.endDate))
    )
      status = 'checked-out';
    if (
      (isFuture(new Date(booking.endDate)) ||
        isToday(new Date(booking.endDate))) &&
      isPast(new Date(booking.startDate)) &&
      !isToday(new Date(booking.startDate))
    )
      status = 'checked-in';

    return {
      ...booking,
      numNights,
      cabinPrice,
      extrasPrice,
      totalPrice,
      guestId,
      cabinId,
      status,
    };
  });

  console.log(finalBookings);

  const { error } = await supabase.from('booking').insert(finalBookings);
  if (error) console.log(error.message);
}

export default function Uploader() {
  const [isLoading, setIsLoading] = useState(false);

  async function uploadAll() {
    setIsLoading(true);
    // Bookings need to be deleted FIRST
    await deleteBookings();
    await deleteGuests();
    await deleteCabins();

    // Bookings need to be created LAST
    await createGuests();
    await createCabins();
    await createBookings();

    setIsLoading(false);
  }

  async function uploadBookings() {
    setIsLoading(true);
    await deleteBookings();
    await createBookings();
    setIsLoading(false);
  }

  return (
    <div
      style={{
        marginTop: 'auto',
        backgroundColor: '#e0e7ff',
        padding: '8px',
        borderRadius: '5px',
        textAlign: 'center',
      }}
    >
      <h3>DEV AREA</h3>

      <Button
        onClick={uploadAll}
        disabled={isLoading}
      >
        Upload ALL sample data
      </Button>
      <p>Only run this only once!</p>
      <p>
        <em>(Cabin images need to be uploaded manually)</em>
      </p>
      <hr />
      <Button onClick={uploadBookings} disabled={isLoading}>
        Upload CURRENT bookings
      </Button>
      <p>You can run this every day you develop the app</p>
    </div>
  );
}