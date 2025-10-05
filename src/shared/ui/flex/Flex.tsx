import React from "react";
import clsx from "clsx";
import styles from "./Flex.module.css";

type FlexProps = React.HTMLAttributes<HTMLDivElement> & {
    vertical?: boolean;
    gap?: number | "small" | "middle" | "large";
    align?: "start" | "center" | "end" | "stretch";
    justify?: "start" | "center" | "end" | "between" | "around";
    wrap?: boolean;
};

export const Flex: React.FC<FlexProps> = ({ vertical, gap, align, justify, wrap, className, style, ...rest }) => {
    return (
        <div
            className={clsx(
                styles.flex,
                vertical && styles.vertical,
                wrap && styles.wrap,
                align && styles[`align-${align}`],
                justify && styles[`justify-${justify}`],
                className
            )}
            style={{
                gap: typeof gap === "number" ? gap : undefined,
                ...style,
            }}
            {...rest}
        />
    );
};
