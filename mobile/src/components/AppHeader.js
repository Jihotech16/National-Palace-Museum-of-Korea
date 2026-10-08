import { View, Text, Pressable, StyleSheet } from 'react-native'
import Icon from './Icon'

// 화면 위쪽 제목 줄: 왼쪽 버튼, 가운데 제목, 오른쪽 버튼
export default function AppHeader({
  title,
  onBack,
  backIcon = 'arrow_back_ios_new',
  right,
  color = '#ecb613',
  titleColor = '#fff',
  bg = 'transparent',
  borderColor = 'rgba(255,255,255,0.06)',
}) {
  return (
    <View style={[styles.bar, { backgroundColor: bg, borderBottomColor: borderColor }]}>
      {onBack ? (
        <Pressable onPress={onBack} hitSlop={12} style={styles.side} accessibilityLabel="뒤로">
          <Icon name={backIcon} size={22} color={color} />
        </Pressable>
      ) : (
        <View style={styles.side} />
      )}
      <Text style={[styles.title, { color: titleColor }]} numberOfLines={1}>
        {title}
      </Text>
      <View style={[styles.side, { alignItems: 'flex-end' }]}>{right}</View>
    </View>
  )
}

export function HeaderIconButton({ icon, onPress, color = '#ecb613', badge = false, label }) {
  return (
    <Pressable onPress={onPress} hitSlop={12} accessibilityLabel={label}>
      <Icon name={icon} size={24} color={color} />
      {badge && <View style={styles.badge} />}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  bar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  side: { width: 48, justifyContent: 'center' },
  title: { flex: 1, textAlign: 'center', fontSize: 19, fontWeight: '700' },
  badge: {
    position: 'absolute',
    top: -2,
    right: -3,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#ef4444',
    borderWidth: 1.5,
    borderColor: '#fff',
  },
})
