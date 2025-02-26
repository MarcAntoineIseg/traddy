
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Settings,
  Menu,
  X,
  LogOut,
  FileSpreadsheet,
  Upload,
  FileDown,
  List,
  Package,
} from "lucide-react";
import { toast } from "sonner";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Listing", href: "/listing", icon: List },
    { name: "Packs", href: "/packs", icon: Package },
    { name: "My Leads", href: "/my-leads", icon: FileSpreadsheet },
    { name: "Upload Leads", href: "/upload-leads", icon: Upload },
    { name: "Transactions", href: "/transactions", icon: FileDown },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <button
        className="fixed top-4 right-4 z-50 rounded-full p-2 bg-white shadow-lg md:hidden"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? (
          <X className="h-6 w-6 text-[#333333]" />
        ) : (
          <Menu className="h-6 w-6 text-[#333333]" />
        )}
      </button>

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out md:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center border-b px-6">
            <Link to="/" className="text-2xl font-bold">
              <span className="logo-text">traddy</span>
              <span className="logo-dot">.</span>
            </Link>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-[#333333] hover:bg-primary/5 hover:text-primary"
                  )}
                >
                  <item.icon
                    className={cn(
                      "mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-200",
                      isActive ? "text-primary" : "text-[#333333] group-hover:text-primary"
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-gray-100 p-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-[#333333] hover:bg-primary/5 hover:text-primary"
            >
              <LogOut className="mr-3 h-5 w-5 text-[#333333] group-hover:text-primary" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "transition-all duration-300",
          isSidebarOpen ? "md:pl-64" : ""
        )}
      >
        <main className="min-h-screen p-6">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
