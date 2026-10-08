import { useEffect, useState } from 'react'
import { View, Text, ScrollView, Pressable, ActivityIndicator, StyleSheet } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { router, useLocalSearchParams } from 'expo-router'
import RequireAuth from '../../components/RequireAuth'
import StudentTabBar from '../../components/StudentTabBar'
import StudentHeader from '../../components/student/StudentHeader'
import MessageAvatar from '../../components/student/MessageAvatar'
import Icon from '../../components/Icon'
import { markRead, fullDateTime } from '../../components/student/messageHelpers'
import { getClassMessagesForStudent } from '@shared/firebase/firestore'

// 메시지 상세 (웹 StudentMessageDetail). 목록에서 id만 받아 반 메시지를 다시 불러와 찾음
export default function MessageDetailRoute() {
  const { messageId, museum } = useLocalSearchParams()
  const id = Array.isArray(messageId) ? messageId[0] : messageId
  return (
    <RequireAuth>
      {(user) => <MessageDetail key={id} user={user} messageId={id} museum={museum === 'seoul' ? 'seoul' : 'palace'} />}
    </RequireAuth>
  )
}

function MessageDetail({ user, messageId, museum }) {
  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const result = await getClassMessagesForStudent(user.email)
        const found = (result?.messages || []).find((m) => m.id === messageId || m.messageId === messageId) || null
        if (!alive) return
        setMessage(found)
        // 알림 등으로 바로 들어온 경우에도 읽음 처리
        if (found?.unread) markRead(user, found)
      } catch (e) {
        console.warn('메시지 로드 오류:', e)
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [user, messageId])

  const handleBack = () => (router.canGoBack() ? router.back() : router.replace('/messages'))

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <StudentHeader title="메시지 상세" onBack={handleBack} showMessageButton={false} />
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color="#94a3b8" />
          <Text style={styles.muted}>메시지를 불러오는 중...</Text>
        </View>
      ) : !message ? (
        <View style={styles.center}>
          <Text style={styles.muted}>메시지를 찾을 수 없어요.</Text>
          <Pressable onPress={() => router.replace('/messages')} style={styles.backBtn} accessibilityRole="button">
            <Text style={styles.backBtnText}>메시지함으로</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.main}>
          <View style={styles.card}>
            <View style={styles.headerSection}>
              <MessageAvatar uri={message.avatar} senderType={message.senderType} size={56} />
              <View>
                <Text style={styles.senderLabel}>보낸 사람</Text>
                <Text style={styles.senderName}>{message.senderName}</Text>
                <Text style={styles.time}>{message.fullDateTime || fullDateTime(message)}</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.content}>
              <Text style={styles.title} selectable>
                {message.title}
              </Text>
              <View style={styles.body}>
                {String(message.content || '')
                  .split('\n')
                  .map((paragraph, i) => (
                    <Text key={i} style={styles.paragraph} selectable>
                      {/* **굵게** 표시 */}
                      {paragraph.split(/(\*\*.*?\*\*)/g).map((part, j) =>
                        part.startsWith('**') && part.endsWith('**') ? (
                          <Text key={j} style={styles.strong}>
                            {part.slice(2, -2)}
                          </Text>
                        ) : (
                          part
                        )
                      )}
                    </Text>
                  ))}
                {!!message.hint && (
                  <View style={styles.hint}>
                    <View style={styles.hintHeader}>
                      <Icon name="lightbulb" size={20} color="#7f13ec" />
                      <Text style={styles.hintLabel}>결정적 힌트</Text>
                    </View>
                    <Text style={styles.hintText}>{message.hint}</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </ScrollView>
      )}
      <StudentTabBar active="museum" museum={museum} />
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#221d10' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 },
  muted: { color: '#94a3b8', fontSize: 15 },
  backBtn: { backgroundColor: '#7f13ec', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12 },
  backBtnText: { color: '#fff', fontWeight: '700' },
  main: { padding: 16, paddingBottom: 32 },
  card: {
    backgroundColor: '#261933',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden',
    marginTop: 8,
  },
  headerSection: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16, flexDirection: 'row', alignItems: 'center', gap: 16 },
  senderLabel: { fontSize: 12, fontWeight: '600', color: '#7f13ec', marginBottom: 2 },
  senderName: { fontSize: 18, fontWeight: '700', color: '#fff', marginBottom: 4 },
  time: { fontSize: 12, color: '#94a3b8', fontWeight: '500' },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)' },
  content: { padding: 24 },
  title: { fontSize: 20, fontWeight: '700', color: '#fff', marginBottom: 20, lineHeight: 27.5 },
  body: { gap: 20 },
  paragraph: { fontSize: 16, lineHeight: 28, color: '#cbd5e1' },
  strong: { fontWeight: '700', color: '#fff' },
  hint: {
    backgroundColor: 'rgba(127,19,236,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(127,19,236,0.1)',
    borderRadius: 12,
    padding: 16,
  },
  hintHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  hintLabel: { fontSize: 14, fontWeight: '700', color: '#7f13ec' },
  hintText: { fontSize: 14, color: '#cbd5e1', lineHeight: 21 },
})
