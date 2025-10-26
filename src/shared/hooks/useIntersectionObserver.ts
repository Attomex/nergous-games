import { useEffect, useRef } from "react";

export const useIntersectionObserver = (callback: () => void, options: IntersectionObserverInit = { rootMargin: "250px" }) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                callback();
            }
        }, options);

        const currentRef = ref.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [callback, options]);

    return ref;
};
