import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import GamePage from "./pages/GamePage/GamePage";
import LoginRegPage from "./pages/Auth/LoginRegPage";
import Profile from "./pages/ProfilePage/Profile";
import { AuthProvider } from "./context/AuthContext";
import Lander from "./pages/LanderPage/Lander";
import ProtectedRoute from "./provider/ProtectedRouteProvider";

function App() {
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
                                        <Route path="/games" element={<GamePage />} />
                                        <Route path="/profile" element={<Profile />} />
                                        <Route path="/*" element={<Navigate to="/profile" />} />
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
}

export default App;
