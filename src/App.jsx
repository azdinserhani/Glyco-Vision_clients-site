import { useContext, useState } from "react";
import Navbar from "./components/navbar/Navbar";
import Login from "./pages/login/Login";
import "./app.scss";
import {
  Outlet,
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Register from "./pages/register/Register";
import { AuthContext } from "./context/authContext";
import Home from "./pages/home/Home";
import Conseil from "./pages/conseil/Conseil";
import Suivi from "./pages/suivi/Suivi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DarkModeContext } from "./context/darkModeContext";

function App() {
  const { curentUser } = useContext(AuthContext);
  const { dark } = useContext(DarkModeContext);

  const queryClient = new QueryClient();
  const Layout = () => {
    return (
      <QueryClientProvider client={queryClient}>
        <div className={`theme-${dark ? "dark" : "light"}`}>
          <Navbar />
          <div>
            <Outlet />
          </div>
        </div>
      </QueryClientProvider>
    );
  };

  const ProtectedRoute = ({ children }) => {
    if (!curentUser) {
      return <Navigate to={"/login"} />;
    }
    return children;
  };
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        { path: "/", element: <Home /> },
        { path: "/conseil", element: <Conseil /> },
        { path: "/suivi", element: <Suivi /> },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
