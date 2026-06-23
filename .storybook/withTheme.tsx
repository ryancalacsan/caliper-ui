import { useEffect } from 'react'
import type { Decorator } from '@storybook/react-vite'
import type { ReactNode } from 'react'

// Sets the theme on the document element (not just the story root) so portaled
// content like Modal and Tooltip is themed too. Lives in its own file so the
// preview config exports only its config object, keeping fast refresh happy.
function ThemeWrapper({ theme, children }: { theme: string; children: ReactNode }) {
  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])
  return <>{children}</>
}

export const withTheme: Decorator = (Story, context) => (
  <ThemeWrapper theme={context.globals.theme ?? 'light'}>
    <Story />
  </ThemeWrapper>
)
