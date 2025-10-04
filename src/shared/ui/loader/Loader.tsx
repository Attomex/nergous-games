// shared/ui/Loader.tsx
import React from "react";
import styles from "./Loader.module.css";

type LoaderProps = {
    size?: "small" | "large" | number;
    tip?: string;
};

export const Loader: React.FC<LoaderProps> = ({ size = "large", tip }) => {
    return (
        <div className={styles.loaderWrapper}>
            <div
                className={styles.spinner}
                style={{
                    width: size === "large" ? 40 : size === "small" ? 20 : size,
                    height: size === "large" ? 40 : size === "small" ? 20 : size,
                }}
            />
            {tip && <div className={styles.tip}>{tip}</div>}
        </div>
    );
};
