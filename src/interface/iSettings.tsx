export type SettingsContextProps = {
  showChatLogs: boolean
  toggleShowChatLogs: () => void
  setShowChatLogs?: React.Dispatch<React.SetStateAction<boolean | undefined>>
}
