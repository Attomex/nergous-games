import { useLayoutEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
// import { useAuth } from "features/auth";

import { Loader } from "shared/ui";

interface ProtectedRouteProps {
    children: React.ReactElement;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    // const navigate = useNavigate();
    // const location = useLocation();
    // const { logout } = useAuth();
    const [isLoading, setLoading] = useState<boolean>(true);

    useLayoutEffect(() => {
        setLoading(true);

        const auth_token = Cookies.get("auth_token");

        let timeout: number;

        if (!auth_token && window.location.pathname !== "/") {
            window.location.href = "/";
            timeout = setTimeout(() => {
                setLoading(false);
            }, 200)
        } else {
            setLoading(false);
        }

        return () => {
            clearTimeout(timeout);
        };
    }, []);

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
                    pointerEvents: "none",
                    visibility: isLoading ? "visible" : "hidden",
                }}
            >
                <Loader size="large" tip="Загрузка..." />
            </div>
        </>
    );
};
