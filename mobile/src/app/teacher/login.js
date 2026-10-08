import { useRef, useState } from 'react'
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native'
import { router, Redirect } from 'expo-router'
import Screen from '../../components/Screen'
import AppHeader from '../../components/AppHeader'
import Icon from '../../components/Icon'
import { t } from '../../components/teacher/theme'
import { useTeacher, saveTeacherRemember } from '../../components/teacher/TeacherContext'
import { signInAsTeacher } from '@shared/firebase/auth'

const GROUP_CLASSROOM = 'classroom'
const GROUP_CLUB = 'club'

// 선생님 로그인 (웹 TeacherLogin.jsx)
export default function TeacherLoginScreen() {
  const { teacher, ready } = useTeacher()
  const [schoolCode, setSchoolCode] = useState('')
  const [groupKind, setGroupKind] = useState(GROUP_CLASSROOM)
  const [grade, setGrade] = useState('')
  const [classNum, setClassNum] = useState('')
  const [clubNum, setClubNum] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const passwordRef = useRef(null)

  // 이미 로그인한 선생님은 바로 대시보드로
  if (ready && teacher && !loading) return <Redirect href="/teacher" />

  const handleSubmit = async () => {
    setError('')
    const code = schoolCode.trim()

    // 관리자 페이지는 웹에서만 씀
    if (code === 'Admin') {
      setError('관리자 페이지는 웹에서 이용해주세요.')
      return
    }

    const isClub = groupKind === GROUP_CLUB
    if (!code || !password) {
      setError('모든 정보를 입력해주세요.')
      return
    }

    let gradeNum
    let classNumNum
    if (isClub) {
      if (!clubNum) {
        setError('모든 정보를 입력해주세요.')
        return
      }
      const clubN = Number(clubNum)
      if (isNaN(clubN) || clubN < 1 || clubN > 50) {
        setError('동아리 번호는 1~50 사이의 숫자여야 합니다.')
        return
      }
      // 동아리: grade 0, classNum = 동아리 번호
      gradeNum = 0
      classNumNum = clubN
    } else {
      if (!grade || !classNum) {
        setError('모든 정보를 입력해주세요.')
        return
      }
      gradeNum = Number(grade)
      classNumNum = Number(classNum)
      if (isNaN(gradeNum) || gradeNum < 1 || gradeNum > 6) {
        setError('학년은 1~6 사이의 숫자여야 합니다.')
        return
      }
      if (isNaN(classNumNum) || classNumNum < 1 || classNumNum > 20) {
        setError('반은 1~20 사이의 숫자여야 합니다.')
        return
      }
    }

    setLoading(true)
    try {
      const result = await signInAsTeacher(code, gradeNum, classNumNum, password)
      if (result.success) {
        await saveTeacherRemember(rememberMe)
        router.replace('/teacher')
      } else {
        setError(result.error || '로그인에 실패했습니다.')
        setLoading(false)
      }
    } catch (err) {
      console.error('로그인 오류:', err)
      setError('로그인 중 오류가 발생했습니다. 다시 시도해주세요.')
      setLoading(false)
    }
  }

  const handleFindInfo = () => {
    Alert.alert('정보 찾기', '학교 코드와 비밀번호는 학교 담당 선생님(관리자)에게 문의해주세요.')
  }

  return (
    <Screen bg={t.bg}>
      <AppHeader
        title="선생님 로그인"
        onBack={() => (router.canGoBack() ? router.back() : router.replace('/'))}
        backIcon="arrow_back"
        color="#fff"
        bg="rgba(25,16,34,0.95)"
        borderColor="rgba(77,50,103,0.3)"
      />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.welcome}>
            <View style={styles.iconGlow}>
              <View style={styles.icon}>
                <Icon name="supervisor_account" size={48} color={t.primary} />
              </View>
            </View>
            <Text style={styles.title}>선생님, 환영합니다!</Text>
            <Text style={styles.subtitle}>
              학교 관리자 계정으로 로그인하여{'\n'}학생들의 탐험 활동을 지도해보세요.
            </Text>
          </View>

          <View style={styles.form}>
            <Field label="학교 코드" icon="domain">
              <TextInput
                style={styles.input}
                value={schoolCode}
                onChangeText={setSchoolCode}
                placeholder="학교 코드를 입력하세요"
                placeholderTextColor={t.gray}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
              />
            </Field>

            <View style={styles.toggle} accessibilityRole="radiogroup" accessibilityLabel="학급 또는 동아리">
              {[
                [GROUP_CLASSROOM, '학급'],
                [GROUP_CLUB, '동아리'],
              ].map(([kind, label]) => {
                const active = groupKind === kind
                return (
                  <Pressable
                    key={kind}
                    style={[styles.toggleBtn, active && styles.toggleBtnActive]}
                    onPress={() => {
                      setGroupKind(kind)
                      if (kind === GROUP_CLUB) {
                        setGrade('')
                        setClassNum('')
                      } else {
                        setClubNum('')
                      }
                    }}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: active }}
                  >
                    <Text style={[styles.toggleText, active && { color: '#fff' }]}>{label}</Text>
                  </Pressable>
                )
              })}
            </View>

            {groupKind === GROUP_CLASSROOM ? (
              <View style={styles.grid}>
                <View style={{ flex: 1 }}>
                  <Field label="학년" icon="school">
                    <NumberInput value={grade} onChange={setGrade} />
                  </Field>
                </View>
                <View style={{ flex: 1 }}>
                  <Field label="반" icon="class">
                    <NumberInput value={classNum} onChange={setClassNum} />
                  </Field>
                </View>
              </View>
            ) : (
              <View>
                <Field label="동아리 번호" icon="groups">
                  <NumberInput value={clubNum} onChange={setClubNum} />
                </Field>
                <Text style={styles.hint}>학교에서 안내한 동아리 번호를 입력하세요.</Text>
              </View>
            )}

            <Field label="비밀번호" icon="lock">
              <TextInput
                ref={passwordRef}
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="비밀번호를 입력하세요"
                placeholderTextColor={t.gray}
                secureTextEntry={!showPassword}
                // 비밀번호를 보이게 해도 한글 자판으로 바뀌지 않게
                keyboardType={Platform.OS === 'ios' ? 'ascii-capable' : 'default'}
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="password"
                returnKeyType="go"
                onSubmitEditing={handleSubmit}
              />
              <Pressable onPress={() => setShowPassword(!showPassword)} hitSlop={10} accessibilityLabel="비밀번호 보기">
                <Icon name={showPassword ? 'visibility' : 'visibility_off'} size={20} color={t.muted} />
              </Pressable>
            </Field>

            <View style={styles.options}>
              <Pressable
                style={styles.checkRow}
                onPress={() => setRememberMe(!rememberMe)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: rememberMe }}
              >
                <View style={[styles.checkbox, rememberMe && styles.checkboxOn]}>
                  {rememberMe && <Icon name="check" size={13} color="#fff" />}
                </View>
                <Text style={styles.optionText}>자동 로그인</Text>
              </Pressable>
              <Pressable onPress={handleFindInfo} hitSlop={8}>
                <Text style={[styles.optionText, { fontWeight: '500' }]}>정보 찾기</Text>
              </Pressable>
            </View>

            {!!error && <Text style={styles.error}>{error}</Text>}

            <Pressable
              onPress={handleSubmit}
              disabled={loading}
              style={({ pressed }) => [styles.submit, { opacity: loading ? 0.6 : pressed ? 0.9 : 1 }]}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text style={styles.submitText}>로그인</Text>
                  <Icon name="login" size={20} color="#fff" />
                </>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  )
}

function Field({ label, icon, children }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputBox}>
        <Icon name={icon} size={20} color={t.muted} style={{ marginRight: 10 }} />
        {children}
      </View>
    </View>
  )
}

function NumberInput({ value, onChange }) {
  return (
    <TextInput
      style={[styles.input, { textAlign: 'center', marginRight: 30 }]}
      value={value}
      onChangeText={(v) => onChange(v.replace(/[^0-9]/g, ''))}
      placeholder="1"
      placeholderTextColor={t.gray}
      keyboardType="number-pad"
      maxLength={2}
    />
  )
}

const styles = StyleSheet.create({
  content: { padding: 24, paddingBottom: 40, gap: 32 },
  welcome: { alignItems: 'center', gap: 24, marginTop: 16 },
  iconGlow: {
    borderRadius: 999,
    padding: 4,
    backgroundColor: 'rgba(127,19,236,0.18)',
    shadowColor: '#a855f7',
    shadowOpacity: 0.5,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },
  icon: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: t.surface,
    borderWidth: 1,
    borderColor: t.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { color: '#fff', fontSize: 24, fontWeight: '700', letterSpacing: -0.5, marginTop: -16 },
  subtitle: { color: t.muted, fontSize: 14, lineHeight: 23, textAlign: 'center', marginTop: -16 },
  form: { gap: 20 },
  field: { gap: 6 },
  label: { color: t.muted, fontSize: 12, fontWeight: '700', marginLeft: 16, letterSpacing: 0.6 },
  inputBox: {
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: t.border,
    backgroundColor: t.surface,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  input: { flex: 1, minWidth: 0, color: '#fff', fontSize: 16, height: '100%' },
  toggle: {
    flexDirection: 'row',
    gap: 8,
    padding: 4,
    borderRadius: 12,
    backgroundColor: t.surface,
    borderWidth: 1,
    borderColor: t.border,
  },
  toggleBtn: { flex: 1, height: 44, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  toggleBtnActive: { backgroundColor: t.primary },
  toggleText: { color: t.muted, fontSize: 14, fontWeight: '600' },
  grid: { flexDirection: 'row', gap: 12 },
  hint: { marginTop: 6, marginLeft: 16, fontSize: 12, color: '#8b7a9e', lineHeight: 17 },
  options: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 4 },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: t.border,
    backgroundColor: t.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxOn: { backgroundColor: t.primary, borderColor: t.primary },
  optionText: { color: t.muted, fontSize: 14 },
  error: {
    backgroundColor: 'rgba(220,38,38,0.1)',
    color: t.dangerText,
    padding: 12,
    borderRadius: 8,
    fontSize: 14,
    lineHeight: 22,
    borderWidth: 1,
    borderColor: 'rgba(220,38,38,0.2)',
    overflow: 'hidden',
  },
  submit: {
    height: 56,
    marginTop: 8,
    borderRadius: 12,
    backgroundColor: t.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: t.primary,
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
  },
  submitText: { color: '#fff', fontSize: 16, fontWeight: '700' },
})
