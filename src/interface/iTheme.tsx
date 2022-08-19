export type ThemeContextProps = {
  darkMode: boolean
  setDarkMode?: React.Dispatch<React.SetStateAction<boolean | undefined>>
  toggleDarkMode: () => void
}
