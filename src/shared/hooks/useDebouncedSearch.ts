import { useState, useEffect } from "react";

export const useDebouncedSearch = (initialValue: string = "", setPage: (page: number) => void, delay: number = 500) => {
    const [search, setSearch] = useState(initialValue);
    const [debouncedSearch, setDebouncedSearch] = useState(initialValue);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, delay);

        setPage(1);

        return () => {
            clearTimeout(handler);
        };
    }, [search, delay]);

    return {
        search,
        debouncedSearch,
        setSearch
    };
};
