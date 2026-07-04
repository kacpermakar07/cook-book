import { Platform, Pressable, PressableProps, StyleSheet } from 'react-native'

import { useTheme } from '@hooks/useTheme'

export const AppPressable = ({ style, ...pressableProps }: PressableProps) => {
  const theme = useTheme()

  return (
    <Pressable
      android_ripple={{ color: theme.backgroundSelected }}
      style={(state) => [
        typeof style === 'function' ? style(state) : style,
        state.pressed && Platform.OS === 'ios' && styles.pressed,
      ]}
      {...pressableProps}
    />
  )
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.8,
  },
})
