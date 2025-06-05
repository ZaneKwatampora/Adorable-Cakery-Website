import React, { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axiosInstance from "../services/axios";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const getStoredTokens = () =>
        localStorage.getItem("authTokens")
            ? JSON.parse(localStorage.getItem("authTokens"))
            : null;

    const decodeAccess = (tokens) => {
        if (!tokens) return null;
        try {
            return jwtDecode(tokens.access);
        } catch (error) {
            console.error("Invalid token:", error);
            return null;
        }
    };

    const [authTokens, setAuthTokens] = useState(getStoredTokens);
    const [user, setUser] = useState(() => decodeAccess(getStoredTokens()));
    const [currentUser, setCurrentUser] = useState(null);

    const loginUser = async (username, password) => {
        const res = await axiosInstance.post("/api/login/", { username, password });
        if (res.status === 200) {
            setAuthTokens(res.data);
            const decoded = jwtDecode(res.data.access);
            setUser(decoded);
            localStorage.setItem("authTokens", JSON.stringify(res.data));
        }
    };

    const logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        setCurrentUser(null);
        localStorage.removeItem("authTokens");
    };

    const refreshToken = async () => {
        if (!authTokens?.refresh) return logoutUser();

        try {
            const res = await axiosInstance.post("/api/token/refresh/", {
                refresh: authTokens.refresh,
            });

            const newTokens = { ...authTokens, access: res.data.access };
            localStorage.setItem("authTokens", JSON.stringify(newTokens));
            setAuthTokens(newTokens);
            setUser(jwtDecode(newTokens.access));
        } catch {
            logoutUser();
        }
    };

    // Refresh token every 4 minutes
    useEffect(() => {
        const interval = setInterval(() => {
            if (authTokens) refreshToken();
        }, 4 * 60 * 1000);
        return () => clearInterval(interval);
    }, [authTokens]);

    // Fetch full profile of authenticated user
    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!user || !authTokens?.access) return;

            try {
                const res = await axiosInstance.get("/api/profile");
                setCurrentUser(res.data);
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        };

        fetchUserProfile();
    }, [user, authTokens]);

    const isAdmin =
        user?.is_admin === true || user?.is_staff === true || user?.role === "admin";

    const value = {
        user,
        currentUser,
        authTokens,
        isAuthenticated: !!user,
        isAdmin,
        loginUser,
        logoutUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
    return useContext(AuthContext);
}

export default AuthProvider;