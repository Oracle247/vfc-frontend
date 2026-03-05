"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X, Church } from "lucide-react";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/sermons", label: "Sermons" },
    { href: "/events", label: "Events" },
    { href: "/gallery", label: "Gallery" },
    { href: "/give", label: "Give" },
  ];

  const isHome = pathname === "/";
  const showTransparent = isHome && !isScrolled;

  return (
    <>
      <nav
        className={cn(
          "fixed w-full z-50 transition-all duration-500",
          showTransparent ? "bg-transparent" : "glass shadow-lg shadow-black/5"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div
                className={cn(
                  "p-2 rounded-lg transition-colors duration-300",
                  showTransparent ? "bg-white/10" : "bg-primary/10"
                )}
              >
                <Church
                  className={cn(
                    "h-6 w-6 transition-colors duration-300",
                    showTransparent ? "text-white" : "text-primary"
                  )}
                />
              </div>
              <div className="flex flex-col">
                <span
                  className={cn(
                    "font-bold text-lg leading-tight transition-colors duration-300",
                    showTransparent ? "text-white" : "text-foreground"
                  )}
                >
                  Vision Family
                </span>
                <span
                  className={cn(
                    "text-[11px] uppercase tracking-widest leading-tight transition-colors duration-300",
                    showTransparent ? "text-white/70" : "text-muted-foreground"
                  )}
                >
                  Church
                </span>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                      showTransparent
                        ? isActive
                          ? "bg-white/20 text-white"
                          : "text-white/80 hover:text-white hover:bg-white/10"
                        : isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center gap-3">
              <Button
                asChild
                className="hidden lg:inline-flex btn-gold text-white border-0 rounded-lg px-6"
              >
                <Link href="/register">Join Us</Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "lg:hidden rounded-lg",
                  showTransparent
                    ? "text-white hover:bg-white/10"
                    : "hover:bg-accent"
                )}
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 lg:hidden transition-all duration-500",
          isOpen ? "visible" : "invisible"
        )}
      >
        <div
          className={cn(
            "absolute inset-0 bg-black/60 transition-opacity duration-500",
            isOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setIsOpen(false)}
        />
        <div
          className={cn(
            "absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl transition-transform duration-500 ease-out",
            isOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-2">
                <Church className="h-5 w-5 text-primary" />
                <span className="font-bold text-lg">Menu</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
              {navLinks.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center px-4 py-3 rounded-lg text-base font-medium transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
            <div className="p-6 border-t">
              <Button
                asChild
                className="w-full btn-gold text-white border-0 rounded-lg"
              >
                <Link href="/register" onClick={() => setIsOpen(false)}>
                  Join Us
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
