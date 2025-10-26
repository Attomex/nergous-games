import React, { useRef, useState } from "react";
import styles from "./StatusButtonGroup.module.css";
import { useTranslation } from "react-i18next";

interface StatusButtonsGroupProps {
    status: string;
    setStatus: (status: string) => void;
    setPage: (page: number) => void;
}

export const StatusButtonsGroup: React.FC<StatusButtonsGroupProps> = ({ status, setStatus, setPage }) => {
    const { t } = useTranslation("translation");
    const buttons: { title: string; status: string }[] = [
        { title: t("filterGames.button.all"), status: "" },
        { title: t("filterGames.button.finished"), status: "finished" },
        { title: t("filterGames.button.planned"), status: "planned" },
        { title: t("filterGames.button.playing"), status: "playing" },
        { title: t("filterGames.button.dropped"), status: "dropped" },
    ];

    const containerRef = useRef<HTMLDivElement | null>(null);

    // refs for dragging logic
    const isPointerDownRef = useRef(false);
    const startXRef = useRef(0);
    const startScrollLeftRef = useRef(0);
    const lastDragTimeRef = useRef(0);

    const [isDragging, setIsDragging] = useState(false);

    const onPointerDown = (e: React.PointerEvent) => {
        const el = containerRef.current;
        if (!el) return;

        // capture pointer for consistent pointer events (works for mouse/touch/pen)
        try {
            (e.target as Element).setPointerCapture(e.pointerId);
        } catch {}
        isPointerDownRef.current = true;
        startXRef.current = e.clientX;
        startScrollLeftRef.current = el.scrollLeft;
        setIsDragging(true);
    };

    const onPointerMove = (e: React.PointerEvent) => {
        const el = containerRef.current;
        if (!el || !isPointerDownRef.current) return;

        const dx = e.clientX - startXRef.current;
        // threshold to start dragging behavior (avoid suppressing small clicks)
        if (Math.abs(dx) > 5) {
            lastDragTimeRef.current = Date.now();
            // scroll opposite to pointer movement (natural feel)
            el.scrollLeft = startScrollLeftRef.current - dx;
            // prevent text selection / native gestures
            e.preventDefault();
        }
    };

    const onPointerUp = (e: React.PointerEvent) => {
        try {
            (e.target as Element).releasePointerCapture(e.pointerId);
        } catch {}
        isPointerDownRef.current = false;
        // keep lastDragTimeRef so we can suppress click that follows a drag
        setIsDragging(false);
    };

    // suppress click if it immediately follows a drag (so dragging doesn't trigger button click)
    const onClickCapture = (e: React.MouseEvent) => {
        const now = Date.now();
        if (now - lastDragTimeRef.current < 200) {
            // 200ms window after dragging
            e.stopPropagation();
            e.preventDefault();
        }
    };

    return (
        <div
            ref={containerRef}
            className={`${styles["status-buttons-group"]} ${isDragging ? styles["dragging"] : ""}`}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onClickCapture={onClickCapture}>
            {buttons.map((button) => (
                <button
                    key={button.status}
                    className={`${styles["status-button"]} ${status === button.status ? styles["active"] : ""}`}
                    onClick={() => {
                        setStatus(button.status);
                        setPage(1);
                    }}>
                    {button.title}
                </button>
            ))}
        </div>
    );
};
