import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoutes = () => {
    const location = useLocation();
    const { isLoading, isAuthenticated } = useSelector((state) => state.auth);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {

        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoutes;