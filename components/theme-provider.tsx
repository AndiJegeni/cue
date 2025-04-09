"use client"

import type * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { useTheme as useNextTheme } from "next-themes"

interface ThemeProviderProps extends React.PropsWithChildren {
  storageKey?: string
  defaultTheme?: "system" | "dark" | "light"
  attribute?: string
  value?: Record<string, string>
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

export function useTheme() {
  return useNextTheme()
}
