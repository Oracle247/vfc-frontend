"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import {
  Church,
  LogOut,
  Menu,
  X,
  BarChart3,
  Building2,
  UserCheck,
  UserCog,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { authService } from "@/services/authService";
import { useCurrentUser } from "@/hooks/use-current-user";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const WORKER_ITEMS = [
  { title: "Dashboard",      href: "/dashboard",             icon: BarChart3 },
  { title: "My Departments", href: "/dashboard/departments", icon: Building2 },
  { title: "Attendance",     href: "/dashboard/attendance",  icon: UserCheck },
  { title: "Profile",        href: "/dashboard/profile",     icon: UserCog },
];

const WorkerSidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { isAdmin } = useCurrentUser();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    await authService.logout();
    router.push("/login");
  };

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-40 h-screen transition-transform bg-white border-r",
        isOpen ? "w-64" : "w-16",
      )}
    >
      <div className="h-full px-3 py-4">
        <div
          className={cn(
            "flex items-center mb-8",
            isOpen ? "justify-between" : "justify-center",
          )}
        >
          {isOpen && (
            <Link href="/dashboard" className="flex items-center gap-2">
              <Church className="h-6 w-6" />
              <span className="font-semibold">Worker</span>
            </Link>
          )}
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>

        <nav className="space-y-1">
          {WORKER_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                isActive(item.href)
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900",
                !isOpen && "justify-center",
              )}
            >
              <item.icon className="h-5 w-5" />
              {isOpen && <span>{item.title}</span>}
            </Link>
          ))}

          {/* Admins viewing the worker shell get a quick jump back to /admin. */}
          {isAdmin && (
            <Link
              href="/admin"
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors mt-4 border-t pt-4",
                "text-gray-500 hover:bg-gray-50 hover:text-gray-900",
                !isOpen && "justify-center",
              )}
            >
              <Shield className="h-5 w-5" />
              {isOpen && <span>Admin Panel</span>}
            </Link>
          )}
        </nav>

        <div className="absolute bottom-4 left-0 right-0 px-3">
          <Button
            variant="ghost"
            className={cn(
              "w-full text-red-500 hover:text-red-700 hover:bg-red-50",
              !isOpen && "justify-center",
            )}
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            {isOpen && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default WorkerSidebar;
