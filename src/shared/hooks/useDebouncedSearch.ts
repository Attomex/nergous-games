import { useState, useEffect } from "react";

export const useDebouncedSearch = (setPage: (page: number) => void, delay: number = 500) => {
    const initSearch = window.location.search.split("=")[1];
    const [search, setSearch] = useState(initSearch);
    const [debouncedSearch, setDebouncedSearch] = useState(initSearch);

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
