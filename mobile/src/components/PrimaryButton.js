import { Pressable, Text, View, StyleSheet, ActivityIndicator } from 'react-native'
import Icon from './Icon'

export default function PrimaryButton({
  label,
  onPress,
  icon,
  iconLeft,
  color = '#7f13ec',
  textColor = '#fff',
  disabled = false,
  loading = false,
  style,
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.btn,
        { backgroundColor: color, opacity: disabled ? 0.45 : pressed ? 0.85 : 1 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <View style={styles.row}>
          {iconLeft && <Icon name={iconLeft} size={20} color={textColor} />}
          <Text style={[styles.label, { color: textColor }]}>{label}</Text>
          {icon && <Icon name={icon} size={20} color={textColor} />}
        </View>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  btn: {
    height: 54,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  label: { fontSize: 17, fontWeight: '700' },
})
