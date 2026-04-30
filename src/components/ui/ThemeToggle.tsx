import { Moon, Sun, Palette } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { Button } from './Button'

const themes = [
  'light',
  'dark', 
  'blackwhite',
  'darkgreenivoryyellow',
  'darkgreyyellowgreen',
  'blueshadeswhite',
  'whitelimegreen',
  'beigedarkgrey',
  'navyblueelectricblue',
  'classicblueturquoisegold',
  'yellowblue',
  'darkroyalbluegold'
] as const

const themeLabels: Record<string, string> = {
  light: 'Light',
  dark: 'Dark',
  blackwhite: 'Black & White',
  darkgreenivoryyellow: 'Dark Green & Ivory',
  darkgreyyellowgreen: 'Dark Grey & Yellow',
  blueshadeswhite: 'Blue Shades',
  whitelimegreen: 'White & Lime',
  beigedarkgrey: 'Beige & Dark Grey',
  navyblueelectricblue: 'Navy & Electric Blue',
  classicblueturquoisegold: 'Classic Blue & Turquoise',
  yellowblue: 'Yellow & Blue',
  darkroyalbluegold: 'Dark Royal Blue & Gold'
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    const currentIndex = themes.indexOf(theme as any)
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex])
  }

  const getIcon = () => {
    if (theme === 'light' || theme === 'blackwhite') return <Sun className="w-4 h-4" />
    if (theme === 'dark') return <Moon className="w-4 h-4" />
    return <Palette className="w-4 h-4" />
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="w-full justify-start"
    >
      {getIcon()}
      <span className="ml-2">Theme: {themeLabels[theme]}</span>
    </Button>
  )
}

export function ThemeToggleCompact() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    const currentIndex = themes.indexOf(theme as any)
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex])
  }

  const getIcon = () => {
    if (theme === 'light' || theme === 'blackwhite') return <Sun className="w-5 h-5" />
    if (theme === 'dark') return <Moon className="w-5 h-5" />
    return <Palette className="w-5 h-5" />
  }

  const getTooltip = () => {
    return `Current theme: ${themeLabels[theme]}`
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      title={getTooltip()}
    >
      {getIcon()}
    </button>
  )
}
