import { useEffect, useState } from 'react'
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native'
import Icon from '../Icon'
import { t } from './theme'
import { deleteAllSchoolData } from '@shared/firebase/firestore'

// 활동 종료 (웹 .teacher-modal): 학교 코드 + 비밀번호 입력 → 한 번 더 확인 → 학교 데이터 전체 삭제
export default function EndActivityModal({ visible, defaultSchoolCode = '', onClose, onEnded }) {
  const [schoolCode, setSchoolCode] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (visible) {
      setSchoolCode(defaultSchoolCode)
      setPassword('')
      setError('')
      setConfirming(false)
    }
  }, [visible, defaultSchoolCode])

  const handleSubmit = () => {
    setError('')
    if (!schoolCode.trim() || !password) {
      setError('학교 코드와 비밀번호를 모두 입력해주세요.')
      return
    }
    setConfirming(true)
  }

  const handleConfirm = async () => {
    setLoading(true)
    setError('')
    try {
      const result = await deleteAllSchoolData(schoolCode.trim(), password)
      if (result.success) {
        setConfirming(false)
        onEnded()
      } else {
        setError(result.error || '활동 종료에 실패했습니다.')
        setConfirming(false)
      }
    } catch (e) {
      console.error('활동 종료 오류:', e)
      setError('활동 종료 중 오류가 발생했습니다.')
      setConfirming(false)
    } finally {
      setLoading(false)
    }
  }

  const close = () => !loading && onClose()

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={close}>
      <KeyboardAvoidingView style={styles.overlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Pressable style={StyleSheet.absoluteFill} onPress={confirming ? () => setConfirming(false) : close} />
        {confirming ? (
          <View style={[styles.modal, { maxWidth: 320 }]}>
            <View style={styles.header}>
              <Text style={styles.title}>활동 종료 확인</Text>
            </View>
            <View style={styles.body}>
              <Text style={styles.message}>학교의 모든 데이터가 삭제됩니다. 다른 반 데이터도 전부 삭제됩니다.</Text>
              <Text style={styles.question}>활동을 종료하시겠습니까?</Text>
              <View style={styles.actions}>
                <ModalButton label="취소" kind="cancel" onPress={() => setConfirming(false)} disabled={loading} />
                <ModalButton label="확인" kind="danger" onPress={handleConfirm} loading={loading} />
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.modal}>
            <View style={styles.header}>
              <Text style={styles.title}>활동 종료</Text>
              <Pressable onPress={close} hitSlop={10} accessibilityLabel="닫기">
                <Icon name="close" size={20} color={t.muted} />
              </Pressable>
            </View>
            <View style={styles.body}>
              <View style={styles.field}>
                <Text style={styles.label}>학교 코드</Text>
                <TextInput
                  style={styles.input}
                  value={schoolCode}
                  onChangeText={setSchoolCode}
                  placeholder="학교 코드를 입력하세요"
                  placeholderTextColor={t.gray}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>비밀번호</Text>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="비밀번호를 입력하세요"
                  placeholderTextColor={t.gray}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit}
                />
              </View>
              {!!error && <Text style={styles.error}>{error}</Text>}
              <View style={styles.actions}>
                <ModalButton label="취소" kind="cancel" onPress={close} disabled={loading} />
                <ModalButton label="확인" kind="primary" onPress={handleSubmit} disabled={loading} />
              </View>
            </View>
          </View>
        )}
      </KeyboardAvoidingView>
    </Modal>
  )
}

function ModalButton({ label, kind, onPress, disabled, loading }) {
  const bg = kind === 'danger' ? t.danger : kind === 'primary' ? t.primary : t.dark
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.btn,
        { backgroundColor: bg, opacity: disabled ? 0.5 : pressed ? 0.9 : 1 },
        kind === 'cancel' && { borderWidth: 1, borderColor: t.border },
      ]}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={[styles.btnText, { color: kind === 'cancel' ? t.muted : '#fff' }]}>{label}</Text>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', alignItems: 'center', justifyContent: 'center', padding: 16 },
  modal: {
    width: '100%',
    maxWidth: 384,
    backgroundColor: t.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: t.border,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: t.border,
  },
  title: { color: '#fff', fontSize: 20, fontWeight: '700' },
  body: { padding: 24, gap: 20 },
  field: { gap: 8 },
  label: { color: t.muted, fontSize: 14, fontWeight: '600' },
  input: {
    height: 48,
    paddingHorizontal: 16,
    backgroundColor: t.dark,
    borderWidth: 1,
    borderColor: t.border,
    borderRadius: 8,
    color: '#fff',
    fontSize: 16,
  },
  error: {
    padding: 12,
    backgroundColor: 'rgba(239,68,68,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
    borderRadius: 8,
    color: t.dangerText,
    fontSize: 14,
    overflow: 'hidden',
  },
  message: { color: t.slateLight, fontSize: 14, lineHeight: 22 },
  question: { color: '#fff', fontSize: 16, fontWeight: '700', textAlign: 'center' },
  actions: { flexDirection: 'row', gap: 12, marginTop: 4 },
  btn: { flex: 1, height: 46, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  btnText: { fontSize: 14, fontWeight: '700' },
})
