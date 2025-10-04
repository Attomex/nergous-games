import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "app/layouts";
import { UserGames } from "pages/user-games";
import { LoginRegPage } from "pages/auth";
import { Profile } from "pages/profile";
import { AuthProvider } from "features/auth";
import { Lander } from "pages/lander";
import { ProtectedRoute } from "app/provider";
import { UpdatePage } from "pages/update";
import { AllGames } from "pages/all-games";
import { AdminUsers } from "pages/admin-users";
import { useEffect } from "react";

import { TestPage } from "pages/test-page";
import { useTranslation } from "react-i18next";

export const Router = () => {
    const { t } = useTranslation();

    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route
                        path="/*"
                        element={
                            <ProtectedRoute>
                                <MainLayout>
                                    <Routes>
                                        <Route path="/*" element={<Navigate to="/profile" />} />
                                        <Route path="/games" element={<Page title={t("docTitle.pages.userGames")}><UserGames /></Page>} />
                                        <Route path="/profile" element={<Page title={t("docTitle.pages.profile")}><Profile /></Page>} />
                                        <Route path="/updates" element={<Page title="Обновления"><UpdatePage /></Page>} />
                                        <Route path="/all-games" element={<Page title="Все игры"><AllGames /></Page>} />
                                        <Route path="/admin" element={<Page title="Админ-пользователи"><AdminUsers /></Page>} />
                                        <Route path="/test" element={<Page title="Тест"><TestPage /></Page>} />
                                    </Routes>
                                </MainLayout>
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/" element={<Page title="Добро пожаловать!"><Lander /></Page>} />
                    <Route
                        path="/login"
                        element={
                            <ProtectedRoute>
                                <Page title="Вход">
                                    <LoginRegPage />
                                </Page>
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
};

const Page = ({ title, children }: { title: string; children: React.ReactNode }) => {
    useEffect (() => {
        document.title = title 
    }, [title])

    return <>{children}</> ;
};
