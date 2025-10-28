import { useState, useEffect } from "react";

export const useDebouncedSearch = (setPage: (page: number) => void, delay: number = 500) => {
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const searchParam = searchParams.get("s");

        if (searchParam) {
            setSearch(decodeURIComponent(searchParam));
        }
    }, []);

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
