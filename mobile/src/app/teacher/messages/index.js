import { useEffect, useMemo, useState } from 'react'
import { View, Text, Pressable, SectionList, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import Icon from '../../../components/Icon'
import TeacherShell, { TeacherLoading } from '../../../components/teacher/TeacherShell'
import MessageAvatar from '../../../components/teacher/MessageAvatar'
import { t } from '../../../components/teacher/theme'
import { getTeacherMessages } from '../../../lib/teacherData'

// 수신 메시지함 (웹 TeacherMessage.jsx)
export default function TeacherMessagesScreen() {
  return (
    <TeacherShell
      title="수신 메시지함"
      active="messages"
      overlay={
        <Pressable
          style={({ pressed }) => [styles.compose, pressed && { transform: [{ scale: 0.95 }] }]}
          onPress={() => router.push('/teacher/messages/compose')}
          accessibilityLabel="메시지 쓰기"
        >
          <Icon name="edit" size={22} color="#fff" />
        </Pressable>
      }
    >
      <MessageList />
    </TeacherShell>
  )
}

function MessageList() {
  const [messages, setMessages] = useState(null)

  useEffect(() => {
    getTeacherMessages().then((r) => setMessages(r.success ? r.messages : []))
  }, [])

  // 날짜별로 묶기 (오늘, 어제 ...)
  const sections = useMemo(() => {
    const groups = []
    ;(messages || []).forEach((m) => {
      const g = groups.find((x) => x.title === m.date)
      if (g) g.data.push(m)
      else groups.push({ title: m.date, data: [m] })
    })
    return groups
  }, [messages])

  if (!messages) return <TeacherLoading text="메시지를 불러오는 중..." />

  return (
    <SectionList
      sections={sections}
      keyExtractor={(m) => m.id}
      contentContainerStyle={styles.main}
      stickySectionHeadersEnabled={false}
      ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
      ListEmptyComponent={<Text style={styles.empty}>받은 메시지가 없습니다.</Text>}
      renderSectionHeader={({ section }) => (
        <View style={styles.divider}>
          <Text style={styles.dateBadge}>{section.title}</Text>
        </View>
      )}
      renderItem={({ item, section }) => <MessageItem message={item} old={section.title === '어제'} />}
    />
  )
}

function MessageItem({ message, old }) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.item,
        message.unread && { borderColor: 'rgba(127,19,236,0.3)' },
        old && { opacity: 0.7 },
        pressed && { transform: [{ scale: 0.98 }] },
      ]}
      onPress={() => router.push(`/teacher/messages/${message.id}`)}
    >
      {message.unread && <View style={styles.unreadDot} />}
      <MessageAvatar senderType={message.senderType} size={48} />
      <View style={{ flex: 1, minWidth: 0 }}>
        <View style={styles.headerRow}>
          <Text style={styles.sender} numberOfLines={1}>
            {message.senderName}
          </Text>
          <Text style={[styles.time, message.unread && { color: t.primary }]}>{message.time}</Text>
        </View>
        <Text style={styles.title} numberOfLines={1}>
          {message.title}
        </Text>
        <Text style={styles.preview} numberOfLines={2}>
          {message.preview || message.content}
        </Text>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  main: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 96 },
  divider: { alignItems: 'center', paddingVertical: 16 },
  dateBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    fontSize: 12,
    fontWeight: '500',
    color: t.slate,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 999,
    overflow: 'hidden',
  },
  item: {
    flexDirection: 'row',
    gap: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: t.surface,
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
    backgroundColor: t.primary,
    shadowColor: t.primary,
    shadowOpacity: 0.6,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  sender: { flex: 1, color: '#fff', fontSize: 16, fontWeight: '700', paddingRight: 16 },
  time: { color: t.slate, fontSize: 12, fontWeight: '500', paddingTop: 2, marginRight: 18 },
  title: { color: t.slateLighter, fontSize: 14, fontWeight: '500', marginBottom: 2 },
  preview: { color: t.slate, fontSize: 12, lineHeight: 18 },
  empty: { color: t.muted, fontSize: 14, textAlign: 'center', paddingVertical: 48 },
  compose: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: t.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: t.primary,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
})
