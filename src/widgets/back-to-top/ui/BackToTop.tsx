import React, { useState, useEffect, useCallback, useRef } from 'react';
import styles from "./BackToTop.module.css";
import { ChevronUp } from "widgets/icons"
import { throttle } from "../lib"

interface BackToTopProps {
    scrollableId?: string;
    scrollThreshold?: number;
    throttleDelay?: number;
    duration?: number
}

const easeInOutQuad = (t: number): number => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

export const BackToTop: React.FC<BackToTopProps> = ({
    scrollableId = "app-content",
    scrollThreshold = 200,
    throttleDelay = 200,
    duration = 300
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const animationRef = useRef<number | null>(null);

    const getScrollElement = useCallback((): HTMLElement | null => {
        return document.getElementById(scrollableId);
    }, [scrollableId]);

    const scrollToTop = (): void => {
        const element = getScrollElement();
        if (!element) return;

        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
        };

        const startPos = element.scrollTop;
        const startTime = performance.now();

        const animateScroll = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = easeInOutQuad(progress);

            const newPosition = startPos * (1 - easeProgress);
            element.scrollTop = newPosition;

            if (progress < 1) {
                animationRef.current = requestAnimationFrame(animateScroll);
            } else {
                element.scrollTop = 0;
                animationRef.current = null;
            }
        };

        animationRef.current = requestAnimationFrame(animateScroll);
    };

    const checkScroll = useCallback((): void => {
        const element = getScrollElement();
        if (!element) return;

        const scrolled: number = element.scrollTop;
        const canScroll = element.scrollHeight > element.clientHeight;

        setIsVisible(canScroll && scrolled > scrollThreshold);
    }, [scrollThreshold, getScrollElement]);

    useEffect(() => {
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    useEffect(() => {
        const element: HTMLElement | null = getScrollElement();
        if (!element) {
            console.warn(`BackToTop: Element with ID "${scrollableId}" not found.`);
            return;
        }

        const throttledCheckScroll = throttle(checkScroll, throttleDelay);

        element.addEventListener('scroll', throttledCheckScroll as EventListener);

        window.addEventListener('resize', throttledCheckScroll);

        return () => {
            element.removeEventListener('scroll', throttledCheckScroll as EventListener);
            window.removeEventListener('resize', throttledCheckScroll);
        };
    }, [throttleDelay, getScrollElement, scrollableId]);

    useEffect(() => {
        checkScroll();
    }, [checkScroll]);

    return (
        <div className={`${styles["back-to-top"]} ${isVisible ? styles["visible"] : ''}`}>
            {isVisible && (
                <button onClick={scrollToTop} title="Наверх">
                    <ChevronUp />
                </button>
            )}
        </div>
    )
}