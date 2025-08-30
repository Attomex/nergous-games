import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import styles from "./CustomRate.module.css";
import Star from "./Star";

interface CustomRateProps {
    count?: number;
    defaultValue?: number;
    allowHalf?: boolean;
    onChange?: (rating: number) => void;
    className?: string;
}

export const CustomRate = ({ count = 5, defaultValue = 0, allowHalf = false, onChange, className }: CustomRateProps) => {
    const [rating, setRating] = useState(defaultValue);
    const [hoverRating, setHoverRating] = useState(0);

    // Используем useMemo для создания массива звезд, чтобы избежать его пересоздания при каждом рендере
    const stars = useMemo(() => Array.from({ length: count }, (_, i) => i + 1), [count]);

    const handleMouseMove = (index: number, event: React.MouseEvent<HTMLSpanElement>) => {
        if (allowHalf) {
            // Получаем позицию курсора внутри звезды
            const { left, width } = event.currentTarget.getBoundingClientRect();
            const percent = (event.clientX - left) / width;
            setHoverRating(percent < 0.5 ? index - 0.5 : index);
        } else {
            setHoverRating(index);
        }
    };

    const handleMouseLeave = () => {
        setHoverRating(0);
    };

    const handleClick = (index: number, event: React.MouseEvent<HTMLSpanElement>) => {
        let newRating;
        if (allowHalf) {
            const { left, width } = event.currentTarget.getBoundingClientRect();
            const percent = (event.clientX - left) / width;
            newRating = percent < 0.5 ? index - 0.5 : index;
        } else {
            newRating = index;
        }
        setRating(newRating);
        if (onChange) {
            onChange(newRating);
        }
    };

    const finalRating = hoverRating > 0 ? hoverRating : rating;

    return (
        <div className={`${styles.ratingContainer} ${className || ""}`} onMouseLeave={handleMouseLeave}>
            {stars.map((index) => (
                <Star key={index} index={index} rating={finalRating} onMouseMove={handleMouseMove} onClick={handleClick} />
            ))}
        </div>
    );
};

CustomRate.propTypes = {
    count: PropTypes.number,
    defaultValue: PropTypes.number,
    allowHalf: PropTypes.bool,
    onChange: PropTypes.func,
    className: PropTypes.string,
};
