"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, GraduationCap, LayoutDashboard, User, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "儀表板", icon: LayoutDashboard },
  { href: "/courses", label: "我的課程", icon: BookOpen },
  { href: "/profile", label: "學員檔案", icon: User },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between px-4 z-40">
        <div className="flex items-center gap-2">
           <GraduationCap className="h-6 w-6 text-brand-600" />
           <span className="font-bold text-lg text-brand-600">Jennifer Academy</span>
        </div>
        <button onClick={() => setIsOpen(true)} className="p-2 text-neutral-600 dark:text-neutral-400">
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div className={cn(
        "fixed top-0 left-0 h-screen w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 z-50 transition-transform duration-300 ease-in-out flex flex-col",
        "md:translate-x-0", // Always visible on desktop
        isOpen ? "translate-x-0" : "-translate-x-full" // Toggle on mobile
      )}>
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between h-20 md:h-auto">
          <h1 className="text-xl font-bold text-brand-600 flex items-center gap-2">
            <GraduationCap className="h-6 w-6" />
            Jennifer Academy
          </h1>
          <button onClick={() => setIsOpen(false)} className="md:hidden p-1 text-neutral-500 hover:text-neutral-900">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
            
            return (
              <Link 
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                  isActive 
                    ? "bg-brand-50 text-brand-600 shadow-sm" 
                    : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-white"
                )}
              >
                <Icon className={cn("h-5 w-5", isActive ? "text-brand-600" : "text-neutral-500")} />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer">
            <div className="h-10 w-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold">
              PC
            </div>
            <div>
              <p className="text-sm font-medium">Peter Chen</p>
              <p className="text-xs text-neutral-500">Student</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
