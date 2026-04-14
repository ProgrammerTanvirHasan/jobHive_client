"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { useSession } from "@/lib/session-context";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Accordion } from "@/components/ui/accordion";

import { toast } from "sonner";
import { ModeToggle } from "./ui/MoodToggle";
type UserRole = "USER" | "RECRUITER" | "ADMIN";
interface MenuItem {
  title: string;
  url: string;
}
interface User {
  role?: UserRole;
}
/* ================= MENU CONFIG ================= */

const publicMenu: MenuItem[] = [
  { title: "Home", url: "/" },
  { title: "Jobs", url: "/jobs" },
];

const roleMenus: Record<UserRole, MenuItem[]> = {
  USER: [
    { title: "Home", url: "/" },
    { title: "Jobs", url: "/jobs" },
    { title: "My Applications", url: "/applications" },
    { title: "Become Recruiter", url: "/become-recruiter" },
  ],
  RECRUITER: [
    { title: "Home", url: "/" },
    { title: "Jobs", url: "/jobs" },
    { title: "Post Job", url: "/post-job" },
    { title: "My Jobs", url: "/my-jobs" },
  ],
  ADMIN: [
    { title: "Dashboard", url: "/admin" },
    { title: "Manage Users", url: "/admin/users" },
    { title: "Recruiter Requests", url: "/admin/requests" },
    { title: "Jobs Moderation", url: "/admin/jobs" },
  ],
};

/* ================= COMPONENT ================= */

export function Navbar1({ className }: { className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, setUser } = useSession() as {
    user: { role?: UserRole } | null;
    setUser: (user: any) => void;
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const loginHref =
    pathname === "/"
      ? "/login"
      : `/login?redirect=${encodeURIComponent(pathname)}`;

  const logout = async () => {
    await authClient.signOut();
    setUser(null);
    toast.success("Logged out successfully");
    router.push("/");
  };

  /* ===== Dynamic Menu ===== */
  const menuItems: MenuItem[] = user?.role ? roleMenus[user.role] : publicMenu;

  return (
    <section
      className={cn(
        "absolute top-0 left-0 w-full z-50 py-4 bg-transparent",
        className,
      )}
    >
      <div className="px-2">
        {/* ================= DESKTOP ================= */}
        <nav className="hidden lg:flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl text-primary"
          >
            <span className="text-2xl">🎓</span>
            SkillBridge
          </Link>

          {/* Menu */}
          <NavigationMenu>
            <NavigationMenuList>
              {menuItems.map((item: MenuItem) => {
                const isActive = pathname === item.url;

                return (
                  <NavigationMenuItem key={item.title}>
                    <NavigationMenuLink asChild>
                      <Link
                        href={item.url}
                        className={cn(
                          "px-4 py-2 text-sm font-medium rounded-md transition",
                          isActive ? "bg-muted text-primary" : "hover:bg-muted",
                        )}
                      >
                        {item.title}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            <ModeToggle />

            {user ? (
              <>
                {user.role !== "ADMIN" && (
                  <Link href="/dashboard" className="text-white">
                    Dashboard
                  </Link>
                )}

                <Link href="/profile" className="text-white">
                  Profile
                </Link>

                <Button size="sm" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button size="sm" asChild>
                  <Link href={loginHref}>Login</Link>
                </Button>

                <Button size="sm" asChild>
                  <Link href="/register">Register</Link>
                </Button>
              </>
            )}
          </div>
        </nav>

        {/* ================= MOBILE ================= */}
        <div className="lg:hidden flex justify-between items-center">
          <Link href="/" className="font-bold text-lg">
            SkillBridge
          </Link>

          {!mounted ? (
            <Button size="icon">
              <Menu className="size-4" />
            </Button>
          ) : (
            <Sheet>
              <SheetTrigger asChild>
                <Button size="icon">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>

              <SheetContent>
                <SheetHeader>
                  <SheetTitle />
                </SheetHeader>

                <div className="flex flex-col gap-6 px-4">
                  {/* Menu */}
                  <Accordion type="single" collapsible>
                    {menuItems.map((item: MenuItem) => (
                      <Link
                        key={item.title}
                        href={item.url}
                        className="block py-2 font-semibold"
                      >
                        {item.title}
                      </Link>
                    ))}
                  </Accordion>

                  <ModeToggle />

                  {/* Auth */}
                  {user ? (
                    <>
                      {user.role !== "ADMIN" && (
                        <Link href="/dashboard">Dashboard</Link>
                      )}

                      <Link href="/profile">Profile</Link>

                      <Button variant="outline" onClick={logout}>
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button asChild variant="outline">
                        <Link href={loginHref}>Login</Link>
                      </Button>

                      <Button asChild>
                        <Link href="/register">Register</Link>
                      </Button>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </section>
  );
}
