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

export const Router = () => {
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
                                        <Route path="/games" element={<UserGames />} />
                                        <Route path="/profile" element={<Profile />} />
                                        <Route path="/updates" element={<UpdatePage />} />
                                        <Route path="/all-games" element={<AllGames />} />
                                        <Route path="/admin" element={<AdminUsers />} />
                                    </Routes>
                                </MainLayout>
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/" element={<Lander />} />
                    <Route
                        path="/login"
                        element={
                            <ProtectedRoute>
                                <LoginRegPage />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
};
