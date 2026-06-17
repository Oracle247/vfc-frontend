"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import WorkerSidebar from "@/components/WorkerSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-100">
      <WorkerSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <main
        className={cn(
          "transition-all duration-200",
          isSidebarOpen ? "ml-64" : "ml-16",
        )}
      >
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
