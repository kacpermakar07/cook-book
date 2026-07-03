import { StyleSheet, View, ViewProps } from 'react-native'

import { ShadowColor } from '@constants/theme'

export function ShadowView({ style, ...viewProps }: ViewProps) {
  return <View style={[styles.shadow, style]} {...viewProps} />
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: ShadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
})
