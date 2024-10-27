import { useAuth } from "@/auth/AuthProvider";
import { cn } from "@/lib/utils";
import { FileIcon, FileTextIcon, MenuIcon } from "lucide-react";
import React, { useCallback, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = useMemo(
    () => [
      {
        name: "Resumes",
        path: "/resumes",
        icon: <FileTextIcon className="w-4 h-4" />,
      },
      { name: "Jobs", path: "/jobs", icon: <FileIcon className="w-4 h-4" /> },
    ],
    []
  );

  const handleSignOut = useCallback(() => {
    signOut();
  }, [signOut]);

  const userInitials = useMemo(() => {
    return user?.fullName
      ? user.fullName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "";
  }, [user?.fullName]);

  const isNavItemActive = useCallback(
    (itemPath: string) => {
      if (itemPath === "/") {
        return location.pathname === "/";
      }
      return location.pathname.startsWith(itemPath);
    },
    [location.pathname]
  );

  const toggleSidebar = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <nav className="bg-gray-800 text-white p-4 flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="mr-4 text-white hover:bg-gray-700"
        >
          <MenuIcon className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-bold flex-grow">VirtueVita</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarImage
                src={
                  user?.picture
                    ? `https://images.weserv.nl/?url=${encodeURIComponent(
                        user.picture
                      )}`
                    : undefined
                }
                alt={user?.fullName}
              />
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleSignOut}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        <aside
          className={cn(
            "bg-gray-100 transition-all duration-300 ease-in-out",
            isCollapsed ? "w-16" : "w-64"
          )}
        >
          <ul className="space-y-2 p-4">
            {navItems.map((item) => (
              <li key={item.name} className="relative">
                <TooltipProvider>
                  {isCollapsed ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          to={item.path}
                          className={cn(
                            "flex items-center p-2 rounded overflow-hidden justify-center",
                            isNavItemActive(item.path)
                              ? "bg-gray-200 font-semibold"
                              : "hover:bg-gray-200"
                          )}
                        >
                          <span className="flex-shrink-0">{item.icon}</span>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>{item.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <Link
                      to={item.path}
                      className={cn(
                        "flex items-center p-2 rounded overflow-hidden pr-8",
                        isNavItemActive(item.path)
                          ? "bg-gray-200 font-semibold"
                          : "hover:bg-gray-200"
                      )}
                    >
                      <span className="flex-shrink-0">{item.icon}</span>
                      <span className="ml-2 whitespace-nowrap transition-all duration-300 ease-in-out opacity-100 w-auto">
                        {item.name}
                      </span>
                    </Link>
                  )}
                </TooltipProvider>
              </li>
            ))}
          </ul>
        </aside>

        <main className="flex-1 p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
