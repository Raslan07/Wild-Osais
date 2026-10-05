import { useQuery } from '@tanstack/react-query';
import { getBooking } from '@src/services/apiBookings';

export function useBookings() {
  const {
    data: bookings,
    
    error,
    isLoading,
  } = useQuery({
    queryKey: ['booking'],
    queryFn: async () => {
      const booking = await getBooking();
      return booking;
    },
  });

  return {  error, isLoading, bookings};
}
