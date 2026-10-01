import Table from '@src/ui/Table';
import Spinner from '@src/ui/Spinner';

import { useCabins } from './useCabins';
import CabinRow from './CabinRow';

import { useSearchParams } from "react-router";

export default function CabinTable() {
  const { isLoading, cabins } = useCabins();
  const [searchParams] = useSearchParams();

  if (isLoading) return <Spinner />;

  
  
  // Filter
  const filterValue = searchParams.get("discount") || "all"
  
  let filterredCabins;
  if (filterValue === "all") filterredCabins = cabins;
  if (filterValue === "no-discount") filterredCabins = cabins.filter(cabin => cabin.discount === 0);
  if (filterValue === "with-discount") filterredCabins = cabins.filter(cabin => cabin.discount > 0);



  //  SortBy
  const sortBy = searchParams.get("sortBy") || "name-asc"
  const [field, direction] = sortBy.split("-");
  const modifier = direction === "asc" ? 1 : -1;
  const sortedCabins = [...filterredCabins].sort((a, b) => {
    const comparison =
      typeof a[field] === "string"
        ? a[field].localeCompare(b[field])
        : a[field] - b[field];

    return comparison * modifier;
  });
  

  return (
    <Table columns="0.6fr 1.8fr 2.2fr 1fr 1fr 1fr">
      <Table.Header>
        <div></div>
        <div>Cabin</div>
        <div>Capacity</div>
        <div>Price</div>
        <div>Discount</div>
        <div></div>
      </Table.Header>

      <Table.Body
        data={sortedCabins}
        render={(cabin) => <CabinRow key={cabin.id} cabin={cabin} />}
      />
    </Table>
  );
}
