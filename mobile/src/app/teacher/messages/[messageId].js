import { useEffect, useState } from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import Icon from '../../../components/Icon'
import TeacherShell, { TeacherLoading } from '../../../components/teacher/TeacherShell'
import MessageAvatar from '../../../components/teacher/MessageAvatar'
import { t } from '../../../components/teacher/theme'
import { getTeacherMessage } from '../../../lib/teacherData'

const backToList = () => (router.canGoBack() ? router.back() : router.replace('/teacher/messages'))

// 메시지 상세 (웹 TeacherMessageDetail.jsx)
export default function TeacherMessageDetailScreen() {
  const { messageId } = useLocalSearchParams()
  const [message, setMessage] = useState(null)

  useEffect(() => {
    getTeacherMessage(messageId).then((r) => {
      if (r.success) setMessage(r.message)
      else router.replace('/teacher/messages') // 없는 메시지면 목록으로
    })
  }, [messageId])

  return (
    <TeacherShell title="메시지 상세" active="messages" onBack={backToList} showMail={false}>
      {message ? <Detail message={message} /> : <TeacherLoading text="메시지를 불러오는 중..." />}
    </TeacherShell>
  )
}

// '**강조**'를 굵게 표시
function RichLine({ text }) {
  const parts = text.split(/(\*\*.*?\*\*)/g)
  return (
    <Text style={styles.paragraph}>
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <Text key={i} style={styles.strong}>
            {part.slice(2, -2)}
          </Text>
        ) : (
          part
        )
      )}
    </Text>
  )
}

function Detail({ message }) {
  return (
    <ScrollView contentContainerStyle={styles.main}>
      <View style={styles.card}>
        <View style={styles.header}>
          <MessageAvatar senderType={message.senderType} size={56} />
          <View style={{ flex: 1 }}>
            <Text style={styles.senderLabel}>보낸 사람</Text>
            <Text style={styles.senderName}>{message.senderName}</Text>
            <Text style={styles.time}>{message.fullDateTime}</Text>
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.content}>
          <Text style={styles.title}>{message.title}</Text>
          <View style={{ gap: 20 }}>
            {message.content.split('\n').map((line, i) => (
              <RichLine key={i} text={line} />
            ))}
            {!!message.hint && (
              <View style={styles.hint}>
                <View style={styles.hintHeader}>
                  <Icon name="lightbulb" size={20} color={t.primary} />
                  <Text style={styles.hintLabel}>결정적 힌트</Text>
                </View>
                <Text style={styles.hintText}>{message.hint}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  main: { padding: 16, paddingBottom: 32 },
  card: {
    backgroundColor: t.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden',
    marginTop: 8,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingTop: 20, paddingHorizontal: 20, paddingBottom: 16 },
  senderLabel: { color: t.primary, fontSize: 12, fontWeight: '600', marginBottom: 2 },
  senderName: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 4 },
  time: { color: t.slate, fontSize: 12, fontWeight: '500' },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)' },
  content: { padding: 24 },
  title: { color: '#fff', fontSize: 20, fontWeight: '700', marginBottom: 20, lineHeight: 28 },
  paragraph: { color: t.slateLight, fontSize: 16, lineHeight: 28 },
  strong: { color: '#fff', fontWeight: '700' },
  hint: {
    backgroundColor: 'rgba(127,19,236,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(127,19,236,0.1)',
    borderRadius: 12,
    padding: 16,
  },
  hintHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  hintLabel: { color: t.primary, fontSize: 14, fontWeight: '700' },
  hintText: { color: t.slateLight, fontSize: 14, lineHeight: 21 },
})
