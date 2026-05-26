import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role'); 

    // 1. Check if user is logged in
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // 2. Check if the route is for Admin only
    if (adminOnly && userRole !== 'admin') {
        
        return <Navigate to="/" replace />;
    }

    // 3. Handling Nested Routes (Outlet) or simple Children
    return children ? children : <Outlet />;
};

export default ProtectedRoute;