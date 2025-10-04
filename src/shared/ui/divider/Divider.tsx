// shared/ui/Divider.tsx
import React from "react";
import styles from "./Divider.module.css";

type DividerProps = {
    className?: string;
    style?: React.CSSProperties;
};

export const Divider: React.FC<DividerProps> = ({ className, style }) => {
    return <div className={`${styles.divider} ${className ?? ""}`} style={style} />;
};
