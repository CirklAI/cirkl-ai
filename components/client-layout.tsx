"use client";

import { useState, useEffect } from "react";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { UserInfo } from "@/components/auth-form";
import { useSidebar } from "@/lib/hooks/useSidebar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const {
    isSidebarOpen,
    toggleSidebar,
    isDesktopSidebarOpen,
    sidebarWidth,
    isResizing,
    toggleDesktopSidebar,
  } = useSidebar();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        if (isDesktopSidebarOpen) {
          toggleDesktopSidebar();
        }
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isDesktopSidebarOpen, toggleDesktopSidebar]);

  useEffect(() => {
    const handleStorageChange = () => {
      const storedUserInfo = localStorage.getItem("user_info");
      if (storedUserInfo) {
        try {
          setUserInfo(JSON.parse(storedUserInfo));
        } catch (error) {
          console.error("Failed to parse user info:", error);
          setUserInfo(null);
          localStorage.removeItem("user_info");
          localStorage.removeItem("auth_token");
        }
      } else {
        setUserInfo(null);
      }
    };

    handleStorageChange();
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("local-storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("local-storage", handleStorageChange);
    };
  }, []);

  return (
    <>
      <div className="flex flex-col md:flex-row">
        <Header />
        <Sidebar userInfo={userInfo} />
        <main
          className={`flex-1 pt-16 ${isResizing ? "" : "transition-all duration-300 ease-in-out"}`}
          style={{ marginLeft: isDesktopSidebarOpen ? sidebarWidth : 0 }}
        >
          {children}
        </main>
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-[998] md:hidden"
            onClick={toggleSidebar}
          />
        )}
      </div>
    </>
  );
}
