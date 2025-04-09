"use client"

import { useState } from "react"
import SearchInterface from "@/components/search-interface"
import LibraryInterface from "@/components/library-interface"
import Sidebar from "@/components/sidebar"
import { ThemeProvider } from "@/components/theme-provider"

export default function Home() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [currentView, setCurrentView] = useState<"search" | "library">("search")

  return (
    <ThemeProvider defaultTheme="light" storageKey="cue-theme">
      <div className="min-h-screen bg-[#F0F0F0] flex">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          currentView={currentView}
          onViewChange={setCurrentView}
        />
        <main className="flex-1 flex flex-col items-center justify-center p-4 pl-6 transition-all duration-300 ease-in-out">
          <div className="w-full max-w-5xl">
            {currentView === "search" && <SearchInterface />}
            {currentView === "library" && <LibraryInterface />}
          </div>
        </main>
      </div>
    </ThemeProvider>
  )
}
