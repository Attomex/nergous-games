import AppHeader from "../components/AppHeader";
import AppSidebar from "../components/AppSidebar";
import AppContent from "../components/AppContent";
import style from "./MainLayout.module.css"
import Notification from "../features/Notification/Notification";

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
    return (
        <div className={style.layout}>
            <AppHeader />
            <AppSidebar />
            <AppContent children={children} />
            <Notification />
        </div>
    );
};

export default MainLayout;
