import style from "./AppContent.module.css";

interface AppContentProps {
    children: React.ReactNode;
}

export const AppContent = ({ children }: AppContentProps) => {
    return ( 
        <div id="app-content" className={style.content}>
            {children}
        </div>
    )
};
