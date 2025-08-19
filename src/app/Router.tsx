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
                                        <Route path="/games" element={<UserGames />} />
                                        <Route path="/profile" element={<Profile />} />
                                        <Route path="/*" element={<Navigate to="/profile" />} />
                                        <Route path="/updates" element={<UpdatePage />} />
                                        <Route path="/all-games" element={<AllGames />} />
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
