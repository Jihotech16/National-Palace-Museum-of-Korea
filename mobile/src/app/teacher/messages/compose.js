import { useEffect, useState } from 'react'
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  FlatList,
  Modal,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native'
import { router } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Icon from '../../../components/Icon'
import TeacherShell from '../../../components/teacher/TeacherShell'
import { t } from '../../../components/teacher/theme'
import { getTeacherStudents } from '@shared/firebase/firestore'
import { sendTeacherMessage } from '../../../lib/teacherData'

const MAX_CHARS = 500
const backToList = () => (router.canGoBack() ? router.back() : router.replace('/teacher/messages'))

// 메시지 보내기 (웹 TeacherEditMessage.jsx)
export default function TeacherComposeScreen() {
  return (
    <TeacherShell title="메시지 보내기" active="messages" onBack={backToList} showMail={false} showTabBar={false}>
      {(teacher) => <Compose teacher={teacher} />}
    </TeacherShell>
  )
}

function Compose({ teacher }) {
  const [students, setStudents] = useState([])
  const [loadingStudents, setLoadingStudents] = useState(true)
  const [recipient, setRecipient] = useState('class_all')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [pickerOpen, setPickerOpen] = useState(false)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    getTeacherStudents(teacher.schoolCode, teacher.grade, teacher.classNum)
      .then((r) => r.success && setStudents(r.students))
      .catch((e) => console.error('학생 목록 로드 오류:', e))
      .finally(() => setLoadingStudents(false))
  }, [teacher.schoolCode, teacher.grade, teacher.classNum])

  // 받는 사람: 반 전체 + 학생 한 명씩
  const options = [
    { value: 'class_all', label: `${teacher.label} 전체 (${students.length}명)` },
    ...students.map((s) => ({ value: s.studentId, label: `${s.number}번 ${s.name || s.studentId}` })),
  ]
  const selected = options.find((o) => o.value === recipient) || options[0]
  const canSend = !!title.trim() && !!content.trim() && !sending

  const handleSubmit = async () => {
    if (!canSend) return
    setSending(true)
    await sendTeacherMessage(teacher, { recipient, title: title.trim(), content: content.trim() })
    setSending(false)
    backToList()
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.label}>받는 사람</Text>
          <Pressable style={styles.select} onPress={() => setPickerOpen(true)} disabled={loadingStudents}>
            <Text style={styles.selectText} numberOfLines={1}>
              {selected.label}
            </Text>
            {loadingStudents ? <ActivityIndicator color={t.slate} /> : <Icon name="arrow_drop_down" size={24} color={t.slate} />}
          </Pressable>
          <View style={styles.hintRow}>
            <Icon name="info" size={14} color="#64748b" />
            <Text style={styles.hint}>선택한 대상에게 푸시 알림이 함께 전송됩니다.</Text>
          </View>
        </View>

        <View style={[styles.card, { minHeight: 240 }]}>
          <View style={styles.titleSection}>
            <Text style={styles.label}>제목</Text>
            <TextInput
              style={styles.titleInput}
              value={title}
              onChangeText={setTitle}
              placeholder="제목을 입력하세요"
              placeholderTextColor={t.slateLight}
              returnKeyType="next"
            />
          </View>
          <TextInput
            style={styles.textarea}
            value={content}
            onChangeText={(v) => setContent(v.slice(0, MAX_CHARS))}
            placeholder={'학생들에게 전달할 메시지 내용을 입력하세요.\n예: 힌트 제공, 집합 장소 안내, 격려의 말 등'}
            placeholderTextColor={t.slate}
            multiline
            textAlignVertical="top"
            maxLength={MAX_CHARS}
            accessibilityLabel="내용"
          />
          <View style={styles.toolbar}>
            <Text style={styles.count}>
              {content.length}/{MAX_CHARS}
            </Text>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [styles.submit, { opacity: !canSend ? 0.5 : pressed ? 0.9 : 1 }]}
          onPress={handleSubmit}
          disabled={!canSend}
        >
          {sending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.submitText}>메시지 전송하기</Text>
              <Icon name="send" size={20} color="#fff" />
            </>
          )}
        </Pressable>
      </ScrollView>

      <RecipientPicker
        visible={pickerOpen}
        options={options}
        value={recipient}
        onClose={() => setPickerOpen(false)}
        onPick={(v) => {
          setRecipient(v)
          setPickerOpen(false)
        }}
      />
    </KeyboardAvoidingView>
  )
}

// 웹의 <select> 대신 아래에서 올라오는 목록
function RecipientPicker({ visible, options, value, onClose, onPick }) {
  const insets = useSafeAreaInsets()
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.sheetOverlay} onPress={onClose} />
      <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>받는 사람</Text>
          <Pressable onPress={onClose} hitSlop={10} accessibilityLabel="닫기">
            <Icon name="close" size={22} color={t.muted} />
          </Pressable>
        </View>
        <FlatList
          data={options}
          keyExtractor={(o) => o.value}
          renderItem={({ item }) => {
            const on = item.value === value
            return (
              <Pressable style={styles.option} onPress={() => onPick(item.value)}>
                <Text style={[styles.optionText, on && { color: '#c084fc', fontWeight: '700' }]}>{item.label}</Text>
                {on && <Icon name="check" size={20} color="#c084fc" />}
              </Pressable>
            )
          }}
        />
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  form: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 24, gap: 20 },
  card: {
    backgroundColor: t.surface,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 20,
  },
  label: { color: t.slate, fontSize: 12, fontWeight: '700', letterSpacing: 0.6, marginBottom: 8 },
  select: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingVertical: 14,
    paddingLeft: 16,
    paddingRight: 12,
  },
  selectText: { flex: 1, color: '#fff', fontSize: 16, fontWeight: '500' },
  hintRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 },
  hint: { color: '#64748b', fontSize: 12 },
  titleSection: { paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  titleInput: { color: '#fff', fontSize: 18, fontWeight: '700', paddingVertical: 4 },
  textarea: { minHeight: 200, paddingTop: 20, color: t.slateLighter, fontSize: 16, lineHeight: 28 },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 16,
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  count: { color: t.slate, fontSize: 12, fontWeight: '500' },
  submit: {
    height: 56,
    borderRadius: 12,
    backgroundColor: t.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: t.primary,
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  submitText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  sheetOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  sheet: {
    maxHeight: '60%',
    backgroundColor: t.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderTopWidth: 1,
    borderColor: t.border,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: t.border,
  },
  sheetTitle: { color: '#fff', fontSize: 17, fontWeight: '700' },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: t.border,
  },
  optionText: { color: '#fff', fontSize: 15 },
})
