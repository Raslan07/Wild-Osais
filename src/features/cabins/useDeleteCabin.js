import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCabin as deleteCabinApi } from '../../services/apiCabins';
import { toast } from 'react-hot-toast';

export function useDeleteCabin() {
  const queryClient = useQueryClient();

  const { isLoading: isDeleting, mutate: deleteCabin } = useMutation({
    // mutationFn : for the function that will be called when the mutation is triggered
    mutationFn: (id) => {
      return deleteCabinApi(id);
    },
    onSuccess: async () => {
      toast.success('Cabin deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['cabins'] });
    },
    onError: async (error) => {
      toast.error('Error deleting cabin: ' + error.message);
    },
  });

  return { isDeleting, deleteCabin };
}
