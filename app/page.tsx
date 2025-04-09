"use client"

import SearchInterface from "@/components/search-interface"
import LibraryInterface from "@/components/library-interface"
import Sidebar from "@/components/sidebar"
import { ThemeProvider } from "@/components/theme-provider"
import { createClient, User, Session } from "@supabase/supabase-js"
import { useState, useEffect } from 'react';


// Supabase Configuration
const supabaseUrl = 'https://qrvafrcngfgsnablldit.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFydmFmcmNuZ2Znc25hYmxsZGl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0NjUyNDIsImV4cCI6MjA1OTA0MTI0Mn0.QIykZcBsbwIqsQfx6673pmP0kYp-1EO8Amum0JzYqyM'

export default function Home() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [currentView, setCurrentView] = useState<"search" | "library">("search")
  const [user, setUser] = useState<User | null>(null)
  const [supabase] = useState(() => createClient(supabaseUrl, supabaseAnonKey))

  // Authentication State Management
  useEffect(() => {
    // Check initial session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
      } else {
        setUser(null)
      }
    }

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user)
      } else {
        setUser(null)
      }
    })

    checkSession()

    // Cleanup subscription
    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  // Authentication Functions
  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    })

    if (error) console.error('Sign in error:', error)
  }

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) console.error('Sign out error:', error)
  }

  return (
    <ThemeProvider defaultTheme="light" storageKey="cue-theme">
      <div className="min-h-screen bg-[#F0F0F0] flex">
        {/* Authentication Button */}
        <div className="absolute top-4 right-4 z-50">
          {user ? (
            <button 
              onClick={handleSignOut} 
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Sign Out
            </button>
          ) : (
            <button 
              onClick={handleSignIn} 
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Sign In with Google
            </button>
          )}
        </div>

        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          currentView={currentView}
          onViewChange={setCurrentView}
        />
        <main className="flex-1 flex flex-col items-center justify-center p-4 pl-6 transition-all duration-300 ease-in-out">
          <div className="w-full max-w-5xl">
            {user ? (
              <>
                {currentView === "search" && <SearchInterface />}
                {currentView === "library" && <LibraryInterface />}
              </>
            ) : (
              <div className="text-center">
                <p>Please sign in to access the application</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </ThemeProvider>
  )
}