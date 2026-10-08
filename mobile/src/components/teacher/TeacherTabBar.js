import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Icon from '../Icon'
import { t } from './theme'

// 교사 화면 아래쪽 메뉴 (웹 .teacher-nav): 홈 / 진도 관리 / 학생 관리 / 문제 보기 / 활동 종료 / 로그아웃
export const TEACHER_TABS = [
  { key: 'home', icon: 'dashboard', label: '홈' },
  { key: 'progress', icon: 'monitoring', label: '진도 관리' },
  { key: 'students', icon: 'groups', label: '학생 관리' },
  { key: 'questions', icon: 'quiz', label: '문제 보기' },
  { key: 'end', icon: 'stop_circle', label: '활동 종료' },
  { key: 'logout', icon: 'logout', label: '로그아웃' },
]

export default function TeacherTabBar({ active, onSelect }) {
  const insets = useSafeAreaInsets()
  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      {TEACHER_TABS.map((it) => {
        const isActive = it.key === active
        const color = it.key === 'logout' ? t.danger : isActive ? t.primary : t.gray
        return (
          <Pressable
            key={it.key}
            style={styles.item}
            onPress={() => onSelect(it.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
          >
            <Icon name={it.icon} size={26} color={color} />
            <Text style={[styles.label, { color }]} numberOfLines={1}>
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
    backgroundColor: t.surface,
    borderTopWidth: 1,
    borderTopColor: t.navBorder,
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  item: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4, minHeight: 48 },
  label: { fontSize: 10, fontWeight: '500' },
})
