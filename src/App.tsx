import { 
  Route, 
  RouterProvider, 
  createBrowserRouter, 
  createRoutesFromElements, 
  Navigate 
} from "react-router-dom";
import './App.css';
import Home from "./Home/home";
import Dashboard from "./dashboard/Dashboard";
import Login from "./authentication/login/login";
import ForgotPassword from "./authentication/forgotPassword/forgotPassword";
import ResetPassword from "./authentication/resetPassword/resetPassword";
import ErrorPage from "./components/ErrorPage";
import type { ReactNode } from "react";
import Layout from "./components/DashboardLayout";

// Route paths as constants for maintainability
const ROUTE_PATHS = {
  HOME: "/",
  LOGIN: "/login",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/resetPassword",
  DASHBOARD: "/dashboard",
} as const;

// Authentication check function with TypeScript
interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthenticated = localStorage.getItem("authToken") !== null;
  
  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to={ROUTE_PATHS.LOGIN} replace />;
  }
  
  return <Layout>{children}</Layout>;
};

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        {/* Public routes */}
        <Route index path={ROUTE_PATHS.HOME} element={<Home />} />
        <Route path={ROUTE_PATHS.LOGIN} element={<Login />} />
        <Route path={ROUTE_PATHS.FORGOT_PASSWORD} element={<ForgotPassword />} />
        <Route path={ROUTE_PATHS.RESET_PASSWORD} element={<ResetPassword />} />
        
        {/* Protected routes */}
        <Route 
          path={ROUTE_PATHS.DASHBOARD} 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
          // Example of adding a loader:
          // loader={async () => {
          //   const data = await fetchDashboardData();
          //   return data;
          // }}
        />
        
        {/* Catch-all route for 404 */}
        <Route path="*" element={<ErrorPage />} />
      </Route>
    )
  );
  
  return <RouterProvider router={router} />;
}

export default App;