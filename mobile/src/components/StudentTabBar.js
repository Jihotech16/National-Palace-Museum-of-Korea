import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import Icon from './Icon'
import { logout } from '@shared/firebase/auth'
import { gold, seoul } from '../theme/colors'
import { hallListRoute } from '../lib/routes'

// 학생 화면 아래쪽 탭: 전시관 / 수료증 확인 / 로그아웃
export default function StudentTabBar({ active = 'museum', museum = 'palace' }) {
  const insets = useSafeAreaInsets()
  const accent = museum === 'seoul' ? seoul.accentSoft : gold.accent

  const items = [
    { key: 'museum', icon: 'museum', label: '전시관', onPress: () => router.replace(hallListRoute(museum)) },
    { key: 'certificate', icon: 'verified', label: '수료증 확인', onPress: () => router.replace({ pathname: '/clear', params: { museum } }) },
    {
      key: 'logout',
      icon: 'logout',
      label: '로그아웃',
      onPress: async () => {
        await logout()
        router.replace('/')
      },
    },
  ]

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      {items.map((it) => {
        const isActive = it.key === active
        const color = isActive ? accent : 'rgba(236,182,19,0.55)'
        return (
          <Pressable key={it.key} style={styles.item} onPress={it.onPress} accessibilityRole="tab">
            <Icon name={it.icon} size={24} color={museum === 'seoul' && !isActive ? 'rgba(96,165,250,0.55)' : color} />
            <Text
              style={[
                styles.label,
                { color: museum === 'seoul' && !isActive ? 'rgba(96,165,250,0.55)' : color, fontWeight: isActive ? '700' : '500' },
              ]}
            >
              {it.label}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(34,29,16,0.98)',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.08)',
    paddingTop: 10,
  },
  item: { flex: 1, alignItems: 'center', gap: 3 },
  label: { fontSize: 11 },
})
