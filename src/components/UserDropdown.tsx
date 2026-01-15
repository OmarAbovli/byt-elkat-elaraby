import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/providers/AuthProvider";
import { User, Settings, LogOut, LayoutDashboard, Award } from "lucide-react";
import { Link } from "react-router-dom";

const UserDropdown = () => {
    const { user, logout } = useAuth();

    if (!user) return null;

    const initials = user.username?.slice(0, 2).toUpperCase() || "U";

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 border border-gold/20">
                        {/* <AvatarImage src={user.avatarUrl} alt={user.username} /> */}
                        <AvatarFallback className="bg-gold/10 text-gold">{initials}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none font-cairo">{user.username}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user.role}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="font-cairo cursor-pointer" asChild>
                    <Link to="/dashboard">
                        <LayoutDashboard className="mr-2 h-4 w-4 ml-2" />
                        <span>لوحة التحكم</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="font-cairo cursor-pointer" asChild>
                    <Link to="/settings">
                        <User className="mr-2 h-4 w-4 ml-2" />
                        <span>الملف الشخصي</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="font-cairo cursor-pointer" asChild>
                    <Link to="/my-certificates">
                        <Award className="mr-2 h-4 w-4 ml-2" />
                        <span>شهاداتي</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="font-cairo cursor-pointer text-destructive focus:text-destructive" onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4 ml-2" />
                    <span>تسجيل خروج</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default UserDropdown;
