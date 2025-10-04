import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useAuth } from "features/auth";

import { LoadingOutlined } from "@ant-design/icons";
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

        if (auth_token && location.pathname === "/login") {
            navigate("/games");
        }

        if (!auth_token && location.pathname !== "/login") {
            logout();
        }

        setLoading(false);

    }, [navigate, location.pathname, logout]);

    return (
        <>
            {children}
            <div
                style={{
                    display: "flex",
                    backgroundColor: "#fff",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    zIndex: 999,
                    visibility: isLoading ? "visible" : "hidden",
                }}
            >
                <Spin indicator={<LoadingOutlined spin />} size="large" tip="Загрузка..." />
            </div>
        </>
    );
};
