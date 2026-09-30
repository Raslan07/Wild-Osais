import { useQuery } from '@tanstack/react-query';
import { getSettings } from '../../services/apiSettings';

export function useSettings() {
  const {
    isLoading,
    error,
    data: settings,
  } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const settings = await getSettings();
      return settings;
    },
  });

  return { isLoading, error, settings };
}
