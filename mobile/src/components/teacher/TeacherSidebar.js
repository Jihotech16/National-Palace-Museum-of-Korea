import { useEffect, useRef } from 'react'
import { View, Text, Pressable, StyleSheet, Modal, Animated, ScrollView, Dimensions } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Icon from '../Icon'
import { t } from './theme'

const WIDTH = Math.min(280, Dimensions.get('window').width * 0.85)

// 왼쪽에서 나오는 메뉴 (웹 .teacher-sidebar)
export default function TeacherSidebar({ visible, onClose, onSelect, teacher }) {
  const insets = useSafeAreaInsets()
  const x = useRef(new Animated.Value(-WIDTH)).current

  useEffect(() => {
    if (visible) {
      x.setValue(-WIDTH)
      Animated.timing(x, { toValue: 0, duration: 220, useNativeDriver: true }).start()
    }
  }, [visible, x])

  const pick = (key) => {
    onClose()
    onSelect(key)
  }

  const sections = [
    {
      title: '빠른 이동',
      items: [
        ['home', 'dashboard', '홈'],
        ['progress', 'monitoring', '진도 관리'],
        ['students', 'groups', '학생 관리'],
        ['questions', 'quiz', '문제 보기'],
        ['messages', 'mail', '메시지'],
      ],
    },
    {
      title: '설정',
      items: [
        ['end', 'stop_circle', '활동 종료'],
        ['logout', 'logout', '로그아웃'],
      ],
    },
  ]

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose} accessibilityLabel="메뉴 닫기" />
      <Animated.View
        style={[styles.panel, { paddingTop: insets.top, paddingBottom: insets.bottom, transform: [{ translateX: x }] }]}
      >
        <View style={styles.header}>
          <Text style={styles.title}>메뉴</Text>
          <Pressable onPress={onClose} hitSlop={10} style={styles.close} accessibilityLabel="닫기">
            <Icon name="close" size={24} color={t.muted} />
          </Pressable>
        </View>
        <ScrollView contentContainerStyle={{ paddingVertical: 16 }}>
          {sections.map((sec) => (
            <View key={sec.title} style={{ paddingVertical: 8 }}>
              <Text style={styles.sectionTitle}>{sec.title}</Text>
              {sec.items.map(([key, icon, label]) => (
                <Pressable
                  key={key}
                  onPress={() => pick(key)}
                  style={({ pressed }) => [styles.item, pressed && { backgroundColor: 'rgba(127,19,236,0.1)' }]}
                >
                  <Icon name={icon} size={24} color={t.muted} />
                  <Text style={styles.itemLabel}>{label}</Text>
                </Pressable>
              ))}
            </View>
          ))}
        </ScrollView>
        {teacher && (
          <View style={styles.footer}>
            <View style={styles.profile}>
              <Text style={styles.profileName}>{teacher.schoolName || '선생님'}</Text>
              <Text style={styles.profileClass}>{teacher.label}</Text>
            </View>
          </View>
        )}
      </Animated.View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
  panel: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: WIDTH,
    backgroundColor: t.surface,
    borderRightWidth: 1,
    borderRightColor: t.border,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 4, height: 0 },
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: t.border,
  },
  title: { color: '#fff', fontSize: 20, fontWeight: '700' },
  close: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  sectionTitle: { color: t.muted, fontSize: 12, fontWeight: '700', letterSpacing: 0.6, paddingVertical: 8, paddingHorizontal: 16 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, paddingHorizontal: 16 },
  itemLabel: { flex: 1, color: '#fff', fontSize: 16, fontWeight: '500' },
  footer: { padding: 16, borderTopWidth: 1, borderTopColor: t.border },
  profile: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(127,19,236,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(127,19,236,0.2)',
  },
  profileName: { color: '#fff', fontSize: 14, fontWeight: '700', marginBottom: 4 },
  profileClass: { color: t.muted, fontSize: 12 },
})
