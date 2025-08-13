import style from "./modules/AppContent.module.css";

interface AppContentProps {
    children: React.ReactNode;
}

const AppContent = ({ children }: AppContentProps) => {
    return ( 
        <div className={style.content}>
            {children}
        </div>
    )
};

export default AppContent;
