"use client";

import {
  IconScan,
  IconLogout,
  IconHome,
} from "@tabler/icons-react";
import { useSidebar } from "@/lib/hooks/useSidebar";
import { UserInfo, AuthForm } from "./auth-form";
import Link from "next/link";
import { useState, useCallback, useEffect } from "react";

const sidebarItems = [
  {
    label: "Home",
    icon: <IconHome size={18} />,
    href: "/",
  },
  {
    label: "New Scan",
    icon: <IconScan size={18} />,
    href: "/dashboard",
  },
];

export default function Sidebar({
  userInfo,
}: {
  userInfo: UserInfo | null;
}) {
  const { isSidebarOpen, isDesktopSidebarOpen, sidebarWidth, setSidebarWidth, isResizing, setIsResizing } = useSidebar();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_info");
    window.dispatchEvent(new Event("local-storage"));
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    window.dispatchEvent(new Event("local-storage"));
  };

  const startResizing = useCallback(() => {
    setIsResizing(true);
  }, [setIsResizing]);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, [setIsResizing]);

  const resize = useCallback(
    (mouseMoveEvent: MouseEvent) => {
      if (useSidebar.getState().isResizing) {
        let newWidth = mouseMoveEvent.clientX;
        if (newWidth < 200) newWidth = 200;
        if (newWidth > 500) newWidth = 500;
        setSidebarWidth(newWidth);
      }
    },
    [setSidebarWidth]
  );

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [resize, stopResizing]);

  return (
    <>
      <aside
        className={`
          fixed top-16 left-0 h-[calc(100vh-4rem)] bg-sidebar backdrop-blur-xl border-r-2 border-border
          z-[999] flex flex-col overflow-hidden select-none
          ${isResizing ? '' : 'transition-all duration-300 ease-in-out'}
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          ${isDesktopSidebarOpen ? "md:translate-x-0" : "md:-translate-x-full"}
        `}
        style={{ width: isDesktopSidebarOpen ? sidebarWidth : 0 }}
      >
        <div className={`h-full transition-opacity duration-200 ${isDesktopSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
          <div className="p-4">
            {userInfo ? (
              <div className={`flex items-center gap-3`}>
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-sm shrink-0" title={userInfo.full_name}>
                  {userInfo.full_name.charAt(0)}
                </div>
                <div className="flex-grow overflow-hidden">
                  <p className="font-semibold text-sm truncate">
                    {userInfo.full_name}
                  </p>
                  <p className="text-xs text-neutral-400 truncate">
                    {userInfo.email}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-md hover:bg-neutral-700"
                  title="Logout"
                >
                  <IconLogout size={18} />
                </button>
              </div>
            ) : (
              <div className="flex justify-center">
                  <button
                      onClick={() => setShowAuthModal(true)}
                      className="w-full text-center p-2 rounded-md bg-accent hover:bg-accent-hover"
                      title="Login / Register"
                  >
                      Login / Register
                  </button>
              </div>
            )}
          </div>
          <div className="flex-grow p-4">
            <nav>
              <ul>
                {sidebarItems.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-2 p-2 rounded-md hover:bg-neutral-700`}
                      title={item.label}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
        <div
          className="absolute top-0 right-0 h-full w-2 cursor-col-resize"
          onMouseDown={startResizing}
        />
      </aside>
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[1100] flex items-center justify-center p-4">
          <div className="relative max-w-md w-full">
            <AuthForm
              onClose={() => setShowAuthModal(false)}
              onSuccess={handleAuthSuccess}
            />
          </div>
        </div>
      )}
    </>
  );
}
