import { StyleSheet, Text, TextProps } from 'react-native'

import { useTheme } from '@hooks/useTheme'

type TypographyVariant = 'title' | 'subtitle' | 'body' | 'caption'

type TypographyProps = TextProps & {
  variant?: TypographyVariant
}

export function Typography({
  variant = 'body',
  style,
  ...textProps
}: TypographyProps) {
  const theme = useTheme()

  return (
    <Text
      style={[styles[variant], { color: theme.text }, style]}
      {...textProps}
    />
  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  body: {
    fontSize: 14,
    fontWeight: '500',
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
  },
})
