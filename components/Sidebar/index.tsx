"use client";

import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import {
  Church,
  LogOut,
  Menu,
  X,
  BarChart3,
  Users,
  CalendarDays,
  Settings,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const pathname = usePathname();
  const sidebarItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: BarChart3,
    },
    {
      title: "Attendance",
      href: "/admin/attendance",
      icon: Users,
    },
    {
      title: "Events",
      href: "/admin/events",
      icon: CalendarDays,
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-40 h-screen transition-transform bg-white border-r",
        isOpen ? "w-64" : "w-16"
      )}
    >
      <div className="h-full px-3 py-4">
        <div
          className={cn(
            "flex items-center mb-8",
            isOpen ? "justify-between" : "justify-center"
          )}
        >
          {isOpen && (
            <Link href="/admin" className="flex items-center gap-2">
              <Church className="h-6 w-6" />
              <span className="font-semibold">Admin Panel</span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>

        <nav className="space-y-1">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                pathname === item.href
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900",
                !isOpen && "justify-center"
              )}
            >
              <item.icon className="h-5 w-5" />
              {isOpen && <span>{item.title}</span>}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-4 left-0 right-0 px-3">
          <Button
            variant="ghost"
            className={cn(
              "w-full text-red-500 hover:text-red-700 hover:bg-red-50",
              !isOpen && "justify-center"
            )}
          >
            <LogOut className="h-5 w-5" />
            {isOpen && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
