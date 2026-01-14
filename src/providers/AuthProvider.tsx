import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { db } from "@/lib/db";
import { profiles } from "@/lib/schema";
import { eq, and, ilike } from "drizzle-orm";
import * as bcrypt from "bcryptjs";

interface User {
    id: string;
    username: string;
    fullName: string | null;
    email: string | null;
    phone: string | null;
    role: "admin" | "user" | "instructor";
}

interface RegisterData {
    username: string;
    password: string;
    fullName: string;
    email: string;
    phone: string;
}

interface AuthContextType {
    user: User | null;
    login: (username: string, password: string) => Promise<boolean>;
    register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    // Load user from localStorage on mount
    useEffect(() => {
        const savedUser = localStorage.getItem("user_session"); // Changed key
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const login = async (username: string, pass: string) => {
        try {
            // Find user (case-insensitive)
            const users = await db.select().from(profiles).where(ilike(profiles.username, username)).limit(1);

            if (users.length === 0) {
                throw new Error("Invalid credentials");
            }

            const user = users[0];

            // Check password using bcrypt
            const isValid = await bcrypt.compare(pass, user.password || "");

            if (!isValid) {
                throw new Error("Invalid credentials");
            }

            // Create session (mock)
            const sessionUser: User = {
                id: user.id,
                username: user.username || "",
                fullName: user.fullName || "",
                email: user.email || "",
                phone: user.phone || "",
                role: (user.role as "admin" | "user" | "instructor") || "user",
            };

            setUser(sessionUser);
            localStorage.setItem("user_session", JSON.stringify(sessionUser));

            return true;
        } catch (error) {
            console.error("Login error:", error);
            return false;
        }
    };

    const register = async (data: RegisterData) => {
        try {
            // Check if username exists
            const existingUser = await db.select().from(profiles).where(ilike(profiles.username, data.username)).limit(1);
            if (existingUser.length > 0) {
                return { success: false, error: "اسم المستخدم موجود بالفعل" };
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(data.password, 10);

            // Create user
            const [newUser] = await db.insert(profiles).values({
                username: data.username,
                password: hashedPassword,
                fullName: data.fullName,
                email: data.email,
                phone: data.phone,
                role: "user",
                skillLevel: "beginner"
            }).returning();

            // Auto login
            const sessionUser: User = {
                id: newUser.id,
                username: newUser.username || "",
                fullName: newUser.fullName || "",
                email: newUser.email || "",
                phone: newUser.phone || "",
                role: (newUser.role as "admin" | "user" | "instructor") || "user",
            };

            setUser(sessionUser);
            localStorage.setItem("user_session", JSON.stringify(sessionUser));

            return { success: true };
        } catch (error) {
            console.error("Registration error:", error);
            return { success: false, error: "حدث خطأ أثناء التسجيل. تأكد من أن قاعدة البيانات محدثة." };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user_session");
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
