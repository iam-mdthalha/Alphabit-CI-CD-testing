import type React from "react";
import { useState } from "react";
import Navbar from "Components/Admin/AdminNavbar";
import Sidebar from "Components/Admin/AdminSidebar";

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title, description }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="font-gilroyRegular tracking-wider flex h-screen bg-gray-100">
      <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar toggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
