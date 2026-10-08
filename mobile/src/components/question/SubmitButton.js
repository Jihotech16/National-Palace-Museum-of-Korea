import { Pressable, Text, View, StyleSheet } from 'react-native'
import Icon from '../Icon'

// 정답 제출 버튼 (웹 ActivityFooter의 .activity-submit-btn)
export default function SubmitButton({ theme, onPress, saving = false, saved = false }) {
  const bg = saved ? '#10b981' : theme.submit
  const shadow = saved ? 'rgba(16,185,129,0.3)' : theme.submitShadow
  return (
    <Pressable
      onPress={onPress}
      disabled={saving || saved}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.btn,
        { backgroundColor: bg, boxShadow: `0 10px 15px -3px ${shadow}` },
        (saving || saved) && { opacity: 0.6 },
        pressed && { transform: [{ scale: 0.98 }], opacity: 0.9 },
      ]}
    >
      <View style={styles.row}>
        <Text style={styles.label}>{saving ? '저장 중...' : saved ? '✓ 저장됨' : '정답 제출'}</Text>
        <Icon name="send" size={20} color="#fff" />
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  btn: { height: 56, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  label: { color: '#fff', fontSize: 16, fontWeight: '700' },
})
