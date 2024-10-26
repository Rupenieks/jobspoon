import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { useAuth } from "@/auth/AuthProvider";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { signOut } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: "Start", path: "/" },
    { name: "Resumes", path: "/resumes" },
    { name: "Jobs", path: "/jobs" },
  ];

  return (
    <div className="flex flex-col h-screen">
      <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">VirtueVita</h1>
        <Button
          onClick={signOut}
          variant="outline"
          className="text-white bg-transparent hover:bg-gray-700"
        >
          Logout
        </Button>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 bg-gray-100 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`block p-2 rounded ${
                    location.pathname === item.path
                      ? "bg-gray-200 font-semibold"
                      : "hover:bg-gray-200"
                  }`}
                >
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
