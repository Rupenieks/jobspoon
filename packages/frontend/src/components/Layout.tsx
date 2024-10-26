import React, { useState, useCallback, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/auth/AuthProvider";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { HomeIcon, FileTextIcon, FileIcon } from "@radix-ui/react-icons";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const navItems = useMemo(
    () => [
      { name: "Start", path: "/", icon: <HomeIcon className="w-4 h-4 mr-2" /> },
      {
        name: "Resumes",
        path: "/resumes",
        icon: <FileTextIcon className="w-4 h-4 mr-2" />,
      },
      {
        name: "Jobs",
        path: "/jobs",
        icon: <FileIcon className="w-4 h-4 mr-2" />,
      },
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

  return (
    <div className="flex flex-col h-screen">
      <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">VirtueVita</h1>
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
        <aside className="w-64 bg-gray-100 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center p-2 gap-2 rounded ${
                    isNavItemActive(item.path)
                      ? "bg-gray-200 font-semibold"
                      : "hover:bg-gray-200"
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
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
