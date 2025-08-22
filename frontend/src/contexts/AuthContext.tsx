import React, { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { toast } from "react-hot-toast";
import { authService } from "../services";
import type {
  AuthContextType,
  User,
  LoginRequest,
  RegisterRequest,
  UpdateProfileRequest,
  ChangePasswordRequest,
} from "../types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = authService.getAuthToken();
        const storedUser = authService.getUserData();

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(storedUser);

          // Verify token is still valid by fetching user profile
          try {
            const profile = await authService.getUserProfile();
            // Backend trả về role lowercase (admin, user)
            const normalizedRole = profile.role.toUpperCase() as
              | "USER"
              | "ADMIN";
            const updatedUser: User = {
              id: profile.id,
              name: profile.name,
              email: profile.email,
              role: normalizedRole,
              createdAt: profile.createdAt,
              updatedAt: profile.updatedAt,
            };
            setUser(updatedUser);
            authService.setUserData(updatedUser);
          } catch (error) {
            // Token is invalid or user profile not accessible, clear auth state
            console.log("Token validation failed, clearing auth state:", error);
            handleLogout();
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        handleLogout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await authService.login(credentials);

      // Backend trả về role lowercase (admin, user)
      const normalizedRole = response.role.toUpperCase() as "USER" | "ADMIN";

      const userData: User = {
        id: response.id,
        name: response.name,
        email: response.email,
        role: normalizedRole,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Store auth data
      authService.setAuthToken(response.token);
      authService.setUserData(userData);

      // Update state
      setToken(response.token);
      setUser(userData);

      toast.success(`Welcome back, ${response.name}!`);
    } catch (error: any) {
      console.error("Login error:", error);

      // Show specific error message if available
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Login failed. Please check your credentials.");
      }

      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterRequest): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await authService.register(userData);

      // Backend trả về role lowercase (admin, user)
      const normalizedRole = response.role.toUpperCase() as "USER" | "ADMIN";

      const user: User = {
        id: response.id,
        name: response.name,
        email: response.email,
        role: normalizedRole,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Store auth data first
      authService.setAuthToken(response.token);
      authService.setUserData(user);

      // Update state after storage
      setToken(response.token);
      setUser(user);

      // Wait a bit to ensure state is updated
      await new Promise((resolve) => setTimeout(resolve, 100));

      toast.success(
        `Welcome, ${response.name}! Your account has been created.`
      );
    } catch (error: any) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    handleLogout();
    toast.success("You have been logged out successfully.");
  };

  const handleLogout = (): void => {
    // Clear auth data
    authService.removeAuthToken();
    authService.removeUserData();

    // Update state
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (data: UpdateProfileRequest): Promise<void> => {
    try {
      setIsLoading(true);
      await authService.updateProfile(data);

      // Refresh user profile
      const profile = await authService.getUserProfile();
      // Backend trả về role lowercase (admin, user)
      const normalizedRole = profile.role.toUpperCase() as "USER" | "ADMIN";
      const updatedUser: User = {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        role: normalizedRole,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
      };

      setUser(updatedUser);
      authService.setUserData(updatedUser);

      toast.success("Profile updated successfully!");
    } catch (error: any) {
      console.error("Profile update error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (data: ChangePasswordRequest): Promise<void> => {
    try {
      setIsLoading(true);
      await authService.changePassword(data);
      toast.success("Đổi mật khẩu thành công!");
    } catch (error: any) {
      console.error("Change password error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const isAuthenticated = !!token && !!user;

  const contextValue: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    isLoading,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
