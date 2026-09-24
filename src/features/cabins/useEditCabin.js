import { useMutation, useQueryClient } from "@tanstack/react-query";
import {editCabins as EditCabinsApi} from "../../services/apiCabins"
import { toast } from "react-hot-toast"

export function useEditCabin() { 
        const queryClient = useQueryClient();

const { isLoading:isEditing, mutate:editCabins } = useMutation({
    mutationFn: ({ newCabin ,id})=> EditCabinsApi(newCabin , id),
    onSuccess: () => {
      toast.success("Cabin successfully edited");
      queryClient.invalidateQueries({ queryKey: ["cabins"] });
    },
    onError: (error) => {
      toast.error("Error creating cabin: " + error.message);
    },
});


    return {isEditing , editCabins}
}