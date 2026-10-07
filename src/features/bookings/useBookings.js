import { useQuery } from '@tanstack/react-query';
import { getBookings } from '../../services/apiBookings';
import { useSearchParams } from 'react-router';

export function useBookings() {
  const [searchParams] = useSearchParams();

  const filterValue = searchParams.get('status');
  const filter =
    !filterValue || filterValue === 'all'
      ? null
      : { field: 'status', value: filterValue };

  const sortByValue = searchParams.get('sortBy') || 'startDate-desc';
  const [field, direction] = sortByValue.split('-');
  const sortBy = !sortByValue ? null : { field, direction };

  const {
    data,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['bookings', filter, sortBy],
    queryFn: async () => {
      const { data, count } = await getBookings({ filter, sortBy });
      return { bookings: data, count };
    },
  });

  return {
    bookings: data?.bookings ?? [],
    count: data?.count ?? 0,
    error,
    isLoading,
  };
}
