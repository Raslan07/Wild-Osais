import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { createCabins as createCabinApi } from "../../services/apiCabins"

export function useCreateCabin() { 

    const queryClient = useQueryClient();

    const { isLoading:isCreating, mutate:createCabin } = useMutation({
    mutationFn: ({ newCabin }) => createCabinApi(newCabin),
    onSuccess: () => {
      toast.success("Cabin created successfully");
      queryClient.invalidateQueries({ queryKey: ["cabins"] });
      
    },
    onError: (error) => {
      toast.error("Error creating cabin: " + error.message);
    },
  });
    return {isCreating , createCabin}
}