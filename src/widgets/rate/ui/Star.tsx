import React from "react";
import styles from "./CustomRate.module.css";

interface StarProps {
    index: number;
    rating: number;
    onMouseMove: (index: number, event: React.MouseEvent<HTMLSpanElement>) => void;
    onClick: (index: number, event: React.MouseEvent<HTMLSpanElement>) => void;
}

const Star = ({ index, rating, onMouseMove, onClick }: StarProps) => {
    const getStarStatus = () => {
        if (rating >= index) {
            return "full";
        }
        if (rating >= index - 0.5) {
            return "half";
        }
        return "empty";
    };

    const status = getStarStatus();

    return (
        <span className={`${styles.star} ${styles[status]}`} onMouseMove={(e) => onMouseMove(index, e)} onClick={(e) => onClick(index, e)}>
            ★
        </span>
    );
};

export default Star;
