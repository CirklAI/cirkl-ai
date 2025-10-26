"use client";

import { motion } from "framer-motion";
import HamburgerMorph from "./ui/hamburger-morph";
import { IconChevronRight, IconLayoutSidebarLeftCollapse, IconLayoutSidebarRightCollapse } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconCirkl } from "./ui/icons";
import { useSidebar } from "@/lib/hooks/useSidebar";

const breadcrumbVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const breadcrumbItemVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0 },
};

const Breadcrumb = () => {
  const pathname = usePathname();
  const { showingResults } = useSidebar();
  const pathSegments = pathname.split("/").filter((segment) => segment);

  return (
    <motion.nav
      key={pathname}
      className="flex items-center text-sm text-muted-foreground"
      variants={breadcrumbVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.span variants={breadcrumbItemVariants}>
        <Link href="/" className="hover:text-foreground">
          Cirkl
        </Link>
      </motion.span>
      {pathSegments.map((segment, index) => {
        const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
        const isLast = index === pathSegments.length - 1;
        return (
          <motion.span
            key={href}
            className="flex items-center"
            variants={breadcrumbItemVariants}
          >
            <IconChevronRight size={16} />
            <Link
              href={href}
              className={`${
                isLast && !showingResults
                  ? "text-foreground"
                  : "hover:text-foreground"
              }`}
            >
              {segment.charAt(0).toUpperCase() + segment.slice(1)}
            </Link>
          </motion.span>
        );
      })}
      {pathname === "/dashboard" && showingResults && (
        <motion.span
          className="flex items-center"
          variants={breadcrumbItemVariants}
        >
          <IconChevronRight size={16} />
          <span className="text-foreground">Results</span>
        </motion.span>
      )}
    </motion.nav>
  );
};

export default function Header() {
  const { isSidebarOpen, toggleSidebar, isDesktopSidebarOpen, toggleDesktopSidebar } = useSidebar();

  return (
    <header className="fixed top-0 left-0 w-full h-16 border-b-2 select-none bg-background-transparent backdrop-blur-xl border-border grid grid-cols-3 items-center px-6 z-[1000]">
      <div className="flex items-center gap-4">
        <div className="md:hidden">
          <HamburgerMorph isOpen={isSidebarOpen} onClick={toggleSidebar} />
        </div>
        <div className="md:hidden">
          <Link href="/">
            <IconCirkl size={24} />
          </Link>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <button 
            className="hidden md:block"
            onClick={toggleDesktopSidebar}
          >
            {isDesktopSidebarOpen ? <IconLayoutSidebarLeftCollapse size={24} /> : <IconLayoutSidebarRightCollapse size={24} />}
          </button>
          <Breadcrumb />
        </div>
      </div>

      <div className="hidden md:flex items-center justify-center">
        <Link href="/">
          <IconCirkl size={24} />
        </Link>
      </div>

      <div className="flex items-center justify-end">
      </div>
    </header>
  );
}
