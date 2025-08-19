import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useAuth } from "features/auth";

import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from "antd";

interface ProtectedRouteProps {
    children: React.ReactElement;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setLoading] = useState<boolean>(true);
    const { logout } = useAuth();

    useEffect(() => {
        setLoading(true);
        const auth_token = Cookies.get("auth_token");
        
        if(!auth_token && location.pathname !== '/login') {
            logout();
            navigate("/login");
        }

        if(auth_token && location.pathname === '/login') {
            navigate("/games");
        }

        setLoading(false);
    }, [navigate, location.pathname, logout]);

    if (isLoading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <Spin indicator={<LoadingOutlined spin />} size="large" tip="Загрузка..." />
            </div>
        );
    }

    return children;
};
