"use client"

import { Search, Globe, Library, User } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex-1"></div>

        <nav className="flex items-center gap-2">
          <Button variant="ghost" className="flex items-center gap-2 text-gray-600 rounded-full px-4">
            <Search className="h-4 w-4" />
            <span>Search</span>
          </Button>

          <Button variant="ghost" className="flex items-center gap-2 text-gray-600 rounded-full px-4">
            <Globe className="h-4 w-4" />
            <span>Explore</span>
          </Button>

          <Button variant="ghost" className="flex items-center gap-2 text-gray-600 rounded-full px-4">
            <Library className="h-4 w-4" />
            <span>Library</span>
          </Button>
        </nav>

        <div className="flex-1 flex justify-end">
          <Button variant="ghost" size="icon" className="rounded-full bg-black text-white h-8 w-8">
            <User className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
