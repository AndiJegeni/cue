"use client"

import { Search, Library, User, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
  currentView: "search" | "library"
  onViewChange: (view: "search" | "library") => void
}

export default function Sidebar({ collapsed, onToggle, currentView, onViewChange }: SidebarProps) {
  return (
    <aside
      className={cn(
        "bg-white shadow-md h-screen sticky top-0 flex flex-col z-10 transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {!collapsed && (
        <div className="p-4 pt-6 flex items-center justify-between">
          <div className="flex items-center">
            <h2 className="text-lg font-semibold">Cue</h2>
          </div>
          <button onClick={onToggle} className="rounded-md p-1 focus:outline-none hover:bg-gray-100 transition-colors">
            <ChevronRight className="h-4 w-4 text-gray-500 transform rotate-180" />
          </button>
        </div>
      )}

      <nav className="flex-1 p-2 mt-4">
        <ul className="space-y-4">
          {collapsed && (
            <li className="mb-6">
              <Button
                onClick={onToggle}
                variant="ghost"
                className="w-full flex justify-center px-0 text-gray-600 rounded-lg py-2"
              >
                <ChevronRight className="h-4 w-4 text-gray-500" />
              </Button>
            </li>
          )}
          <li>
            <Button
              variant="ghost"
              className={cn(
                "text-gray-600 rounded-lg py-2",
                collapsed ? "w-full justify-center px-0" : "w-full justify-start px-4",
                currentView === "search" && "bg-gray-100",
              )}
              onClick={() => onViewChange("search")}
            >
              <Search className="h-4 w-4" />
              {!collapsed && <span className="ml-3 text-sm">Search</span>}
            </Button>
          </li>
          <li>
            <Button
              variant="ghost"
              className={cn(
                "text-gray-600 rounded-lg py-2",
                collapsed ? "w-full justify-center px-0" : "w-full justify-start px-4",
                currentView === "library" && "bg-gray-100",
              )}
              onClick={() => onViewChange("library")}
            >
              <Library className="h-4 w-4" />
              {!collapsed && <span className="ml-3 text-sm">Library</span>}
            </Button>
          </li>
        </ul>
      </nav>

      <div
        className={cn(
          "p-4 mt-auto border-t border-gray-100 flex items-center",
          collapsed ? "justify-center" : "justify-between",
        )}
      >
        {!collapsed && <div className="text-sm text-gray-500">v1.0.0</div>}
        <Button variant="ghost" size="icon" className="rounded-full bg-black text-white h-8 w-8">
          <User className="h-4 w-4" />
        </Button>
      </div>
    </aside>
  )
}
