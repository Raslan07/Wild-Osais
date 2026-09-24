import { useQuery} from "@tanstack/react-query"
import { getCabins } from "@src/services/apiCabins";


export function useCabins() { 
const {
    data: cabins,
    isPending,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["cabins"],
    queryFn: async () => {
      const cabins = await getCabins();
      return cabins;
    },
  });

    return { isPending , error , isLoading , cabins}
}