import { useEffect, useMemo, useState } from 'react'
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
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { router, Redirect } from 'expo-router'
import Screen from '../components/Screen'
import AppHeader from '../components/AppHeader'
import Icon from '../components/Icon'
import PrimaryButton from '../components/PrimaryButton'
import { violet } from '../theme/colors'
import { useAuth, isStudent } from '../lib/AuthContext'
import { signInWithStudentId } from '@shared/firebase/auth'
import { getAllSchools } from '@shared/firebase/firestore'

// 학생 로그인 (웹 Login.jsx)
export default function LoginScreen() {
  const { user, loading: authLoading } = useAuth()
  const [schools, setSchools] = useState([])
  const [selectedSchool, setSelectedSchool] = useState('')
  const [query, setQuery] = useState('')
  const [grade, setGrade] = useState('')
  const [classNum, setClassNum] = useState('')
  const [number, setNumber] = useState('')
  const [error, setError] = useState('')
  const [schoolError, setSchoolError] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingSchools, setLoadingSchools] = useState(true)

  useEffect(() => {
    ;(async () => {
      const result = await getAllSchools()
      if (result.success) {
        setSchools(result.schools || [])
        if (!result.schools?.length) setSchoolError('등록된 학교가 없습니다.')
      } else {
        setSchoolError('학교 목록을 불러오는데 실패했습니다.')
      }
      setLoadingSchools(false)
    })()
  }, [])

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return schools.filter(
      (s) => s.schoolName?.toLowerCase().includes(q) || s.id?.toLowerCase().includes(q)
    )
  }, [schools, query])

  if (!authLoading && isStudent(user)) return <Redirect href="/choice-museum" />

  const selectSchool = (school) => {
    setSelectedSchool(school.id)
    setQuery(school.schoolName || school.id)
  }

  const handleSubmit = async () => {
    setError('')
    if (!selectedSchool || !grade || !classNum || !number) {
      setError('학교, 학년, 반, 번호를 모두 입력해주세요.')
      return
    }
    const gradeNum = Number(grade)
    const classNumNum = Number(classNum)
    const numberNum = Number(number)
    if ([gradeNum, classNumNum, numberNum].some((n) => !Number.isInteger(n) || n <= 0)) {
      setError('학년, 반, 번호는 올바른 숫자여야 합니다.')
      return
    }
    const school = schools.find((s) => s.id === selectedSchool)
    const schoolCode = school?.schoolCode || '1'
    // 형식: 학교 코드 + 학년(1자리) + 반(2자리) + 번호(2자리)
    const studentId = `${schoolCode}${gradeNum}${String(classNumNum).padStart(2, '0')}${String(numberNum).padStart(2, '0')}`

    setLoading(true)
    const result = await signInWithStudentId(studentId, school?.schoolName || null, schoolCode, gradeNum, classNumNum, numberNum)
    setLoading(false)
    if (result.success) {
      router.replace('/choice-museum')
    } else {
      setError(result.error || '로그인에 실패했습니다.')
    }
  }

  const showDropdown = query.length > 0 && !selectedSchool && filtered.length > 0

  return (
    <Screen bg={violet.bg}>
      <AppHeader
        title="로그인"
        onBack={() => (router.canGoBack() ? router.back() : router.replace('/'))}
        backIcon="arrow_back"
        color="#fff"
        borderColor="rgba(255,255,255,0.08)"
      />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.headline}>
            <LinearGradient colors={['#7f13ec', '#5e0eb0']} style={styles.headlineIcon}>
              <Icon name="explore" size={34} color="#fff" />
            </LinearGradient>
            <Text style={styles.title}>탐험을 시작해볼까요?</Text>
            <Text style={styles.subtitle}>반가워요! 학생 정보를 입력하고{'\n'}나만의 박물관 미션을 시작하세요.</Text>
          </View>

          <Text style={styles.label}>학교</Text>
          <View style={styles.inputBox}>
            <TextInput
              style={styles.input}
              value={query}
              onChangeText={(t) => {
                setQuery(t)
                if (selectedSchool) setSelectedSchool('')
              }}
              placeholder={loadingSchools ? '학교 목록을 불러오는 중...' : '학교 이름을 검색하세요'}
              placeholderTextColor={violet.muted}
              editable={!loadingSchools}
              autoCorrect={false}
            />
            {loadingSchools ? (
              <ActivityIndicator color={violet.muted} />
            ) : (
              <Icon name={selectedSchool ? 'check_circle' : 'search'} size={22} color={selectedSchool ? '#a855f7' : violet.muted} />
            )}
          </View>
          {showDropdown && (
            <View style={styles.dropdown}>
              {filtered.slice(0, 8).map((s) => (
                <Pressable key={s.id} style={styles.dropdownItem} onPress={() => selectSchool(s)}>
                  <Text style={styles.dropdownText}>{s.schoolName || s.id}</Text>
                </Pressable>
              ))}
            </View>
          )}

          <View style={styles.row}>
            <NumberField label="학년" suffix="학년" value={grade} onChange={setGrade} />
            <NumberField label="반" suffix="반" value={classNum} onChange={setClassNum} />
          </View>
          <NumberField label="번호" suffix="번" value={number} onChange={setNumber} />

          {!!schoolError && <Text style={styles.error}>{schoolError}</Text>}
          {!!error && <Text style={styles.error}>{error}</Text>}
        </ScrollView>

        <View style={styles.bottom}>
          <PrimaryButton label="로그인 및 박물관 선택하기" icon="arrow_forward" onPress={handleSubmit} loading={loading} />
        </View>
      </KeyboardAvoidingView>
    </Screen>
  )
}

function NumberField({ label, suffix, value, onChange }) {
  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputBox}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={(t) => onChange(t.replace(/[^0-9]/g, ''))}
          placeholder="1"
          placeholderTextColor={violet.muted}
          keyboardType="number-pad"
          maxLength={2}
        />
        <Text style={styles.suffix}>{suffix}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 40 },
  headline: { alignItems: 'center', marginTop: 12, marginBottom: 28 },
  headlineIcon: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    transform: [{ rotate: '3deg' }],
  },
  title: { color: '#fff', fontSize: 24, fontWeight: '800', marginBottom: 8 },
  subtitle: { color: violet.muted, fontSize: 14, textAlign: 'center', lineHeight: 21 },
  label: { color: '#fff', fontSize: 14, fontWeight: '700', marginBottom: 8, marginTop: 16 },
  inputBox: {
    height: 56,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: violet.border,
    backgroundColor: violet.surface,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  input: { flex: 1, minWidth: 0, color: '#fff', fontSize: 16, height: '100%' },
  suffix: { color: violet.muted, fontSize: 14 },
  row: { flexDirection: 'row', gap: 12 },
  dropdown: {
    marginTop: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: violet.border,
    backgroundColor: violet.surfaceAlt,
    overflow: 'hidden',
  },
  dropdownItem: { paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: violet.border },
  dropdownText: { color: '#fff', fontSize: 15 },
  error: { color: '#fca5a5', fontSize: 14, marginTop: 16, textAlign: 'center', lineHeight: 20 },
  bottom: { padding: 16, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: 'rgba(255,255,255,0.08)' },
})
