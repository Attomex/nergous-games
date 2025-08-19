import { AppHeader, AppContent, AppSidebar } from "./ui";
import style from "./MainLayout.module.css";
import { Notification } from "shared/ui";

interface MainLayoutProps {
    children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
    return (
        <div className={style.layout}>
            <AppHeader />
            {/* <AppSidebar /> */}
            <AppContent children={children} />
            <Notification />
        </div>
    );
};
