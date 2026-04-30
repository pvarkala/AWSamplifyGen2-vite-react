import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'blackwhite' | 'darkgreenivoryyellow' | 'darkgreyyellowgreen' | 'blueshadeswhite' | 'whitelimegreen' | 'beigedarkgrey' | 'navyblueelectricblue' | 'classicblueturquoisegold' | 'yellowblue' | 'darkroyalbluegold'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as Theme) || 'light'
    }
    return 'light'
  })

  useEffect(() => {
    const root = window.document.documentElement

    const updateTheme = () => {
      // Remove all theme classes
      root.classList.remove(
        'light', 'dark', 'blackwhite', 'darkgreenivoryyellow', 'darkgreyyellowgreen',
        'blueshadeswhite', 'whitelimegreen', 'beigedarkgrey', 'navyblueelectricblue',
        'classicblueturquoisegold', 'yellowblue', 'darkroyalbluegold'
      )
      // Add current theme class
      root.classList.add(theme)
    }

    updateTheme()
  }, [theme])

  useEffect(() => {
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
