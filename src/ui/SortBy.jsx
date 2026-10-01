import Select from "./Select"
import { useSearchParams } from "react-router";

export default function SortBy({ options }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const sortBy = searchParams.get('sortBy') || 'name-asc';
    function handlChange(e) { 
        searchParams.set('sortBy', e.target.value);
        setSearchParams(searchParams);
        
    }
    return (
        <>
            <Select options={options} type="white" onChange={handlChange} value={sortBy} />
        </>
    )
}