import { useCallback, useEffect, useState } from 'react'
import { View, Text, Pressable, ScrollView, RefreshControl, StyleSheet } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { router, useLocalSearchParams } from 'expo-router'
import RequireAuth from '../../components/RequireAuth'
import StudentTabBar from '../../components/StudentTabBar'
import StudentHeader from '../../components/student/StudentHeader'
import MessageAvatar from '../../components/student/MessageAvatar'
import { markRead } from '../../components/student/messageHelpers'
import { getClassMessagesForStudent } from '@shared/firebase/firestore'
import { hallListRoute } from '../../lib/routes'
import { gold } from '../../theme/colors'

// 수신 메시지함 (웹 StudentMessage)
export default function MessagesRoute() {
  const { museum } = useLocalSearchParams()
  return <RequireAuth>{(user) => <MessagesScreen user={user} museum={museum === 'seoul' ? 'seoul' : 'palace'} />}</RequireAuth>
}

function MessagesScreen({ user, museum }) {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const load = useCallback(async () => {
    try {
      const result = await getClassMessagesForStudent(user.email)
      setMessages(result?.success ? result.messages || [] : [])
    } catch (e) {
      console.warn('메시지 로드 오류:', e)
      setMessages([])
    }
  }, [user])

  useEffect(() => {
    load().finally(() => setLoading(false))
  }, [load])

  const onRefresh = async () => {
    setRefreshing(true)
    await load()
    setRefreshing(false)
  }

  const open = async (message) => {
    if (message.unread && (await markRead(user, message))) {
      setMessages((prev) => prev.map((m) => (m.id === message.id ? { ...m, unread: false } : m)))
    }
    router.push({ pathname: '/messages/[messageId]', params: { messageId: message.id, museum } })
  }

  const handleBack = () => (router.canGoBack() ? router.back() : router.replace(hallListRoute(museum)))

  // 날짜별로 묶기 (오늘, 어제, 10월 6일 ...)
  const groups = messages.reduce((acc, m) => {
    ;(acc[m.date] = acc[m.date] || []).push(m)
    return acc
  }, {})

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <StudentHeader title="수신 메시지함" onBack={handleBack} showMessageButton={false} />
      <ScrollView
        contentContainerStyle={styles.main}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={gold.accent} />}
      >
        {loading ? (
          <Text style={styles.empty}>메시지를 불러오는 중...</Text>
        ) : messages.length === 0 ? (
          <Text style={styles.empty}>받은 메시지가 없습니다.</Text>
        ) : (
          Object.entries(groups).map(([date, list]) => (
            <View key={date} style={styles.group}>
              <View style={styles.dateDivider}>
                <Text style={styles.dateBadge}>{date}</Text>
              </View>
              {list.map((m) => (
                <MessageItem key={m.id} message={m} old={date === '어제'} onPress={() => open(m)} />
              ))}
            </View>
          ))
        )}
      </ScrollView>
      <StudentTabBar active="museum" museum={museum} />
    </View>
  )
}

function MessageItem({ message, old, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${message.unread ? '안 읽은 메시지, ' : ''}${message.senderName}, ${message.title}`}
      style={({ pressed }) => [
        styles.item,
        message.unread && { borderColor: 'rgba(127,19,236,0.3)' },
        old && { opacity: 0.7 },
        pressed && { transform: [{ scale: 0.98 }] },
      ]}
    >
      {message.unread && <View style={styles.unreadDot} />}
      <MessageAvatar uri={message.avatar} senderType={message.senderType} />
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.sender} numberOfLines={1}>
            {message.senderName}
          </Text>
          <Text style={[styles.time, message.unread && { color: '#7f13ec', marginRight: 18 }]}>{message.time}</Text>
        </View>
        <Text style={styles.title} numberOfLines={1}>
          {message.title}
        </Text>
        <Text style={styles.preview} numberOfLines={2}>
          {message.content}
        </Text>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#221d10' },
  main: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 24, gap: 16, flexGrow: 1 },
  empty: { color: '#fff', textAlign: 'center', padding: 32, fontSize: 16 },
  group: { gap: 16 },
  dateDivider: { alignItems: 'center', paddingVertical: 8 },
  dateBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    fontSize: 12,
    fontWeight: '500',
    color: '#94a3b8',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 9999,
    overflow: 'hidden',
  },
  item: {
    flexDirection: 'row',
    gap: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#261933',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  unreadDot: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#7f13ec',
    boxShadow: '0 0 8px rgba(127,19,236,0.6)',
  },
  content: { flex: 1, minWidth: 0 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  sender: { flexShrink: 1, fontSize: 16, fontWeight: '700', color: '#fff', paddingRight: 16 },
  time: { fontSize: 12, fontWeight: '500', color: '#94a3b8', paddingTop: 2 },
  title: { fontSize: 14, fontWeight: '500', color: '#e2e8f0', marginBottom: 2 },
  preview: { fontSize: 12, color: '#94a3b8', lineHeight: 18 },
})
