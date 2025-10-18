import styles from "./Preloader.module.css";

interface PreloaderProps {
    width: string;
    height: string;
    borderRadius: string;
}

export const Preloader: React.FC<PreloaderProps> = ({
    width,
    height,
    borderRadius
}) => {
    return (
        <span style={{ 
            width: width, 
            height: height, 
            borderRadius: borderRadius 
        }}
        className={styles.preloader}></span>
    );
};