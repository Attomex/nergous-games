import { AppHeader } from "./AppHeader";
import { AppContent } from "./AppContent";
// import { AppSidebar } from "./AppSidebar";
import style from "./MainLayout.module.css";
import { BackToTop } from "widgets/back-to-top";

interface MainLayoutProps {
    children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
    return (
        <div className={style.layout}>
            <AppHeader />
            {/* <AppSidebar /> */}
            <AppContent children={children} />
            <BackToTop />
        </div>
    );
};
