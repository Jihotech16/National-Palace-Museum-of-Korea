import { useEffect, useRef, useState } from 'react'
import { View, Text, ScrollView, Pressable, KeyboardAvoidingView, Keyboard, Platform, StyleSheet } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { StatusBar } from 'expo-status-bar'
import { router, useLocalSearchParams } from 'expo-router'
import RequireAuth from '../../components/RequireAuth'
import AppHeader, { HeaderIconButton } from '../../components/AppHeader'
import Icon from '../../components/Icon'
import AnswerInput from '../../components/question/AnswerInput'
import SubmitButton from '../../components/question/SubmitButton'
import ErrorToast from '../../components/question/ErrorToast'
import ImageViewer from '../../components/question/ImageViewer'
import CorrectAnswer from '../../components/question/CorrectAnswer'
import { questionTheme, hallTitle, imagePositionOf } from '../../components/question/questionTheme'
import { checkAnswer, checkMultipleAnswers } from '@shared/utils/answerCheck'
import { saveActivityData, getActivityData } from '@shared/firebase/firestore'
import {
  QUESTIONS_BY_ACTIVITY,
  hallOfActivity,
  museumOfActivity,
  previousActivityInHall,
  questionRoute,
  hallRoute,
} from '../../lib/routes'

// 문제 화면 (웹 QuestionPage + ActivityFooter)
export default function QuestionRoute() {
  const { activityId } = useLocalSearchParams()
  const id = Array.isArray(activityId) ? activityId[0] : activityId
  return (
    <RequireAuth bg="#0f0716">
      {(user) => <QuestionScreen key={id} user={user} activityId={id} />}
    </RequireAuth>
  )
}

function QuestionScreen({ user, activityId }) {
  const q = QUESTIONS_BY_ACTIVITY[activityId]
  if (!q) return <NotFound />
  return <QuestionBody user={user} q={q} />
}

function QuestionBody({ user, q }) {
  const insets = useSafeAreaInsets()
  const {
    activityId,
    questionNumber,
    title,
    description,
    image,
    answerField,
    answerPlaceholder,
    explanation,
    inputType = 'single',
    multipleCount = 5,
    multipleLabels = [],
  } = q
  const isMultiple = inputType === 'multiple'
  const hallId = hallOfActivity(activityId)
  const museum = museumOfActivity(activityId)
  const t = questionTheme(museum)

  const [answer, setAnswer] = useState(isMultiple ? Array(multipleCount).fill('') : '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showCorrect, setShowCorrect] = useState(false)
  const [error, setError] = useState('')
  const [viewerOpen, setViewerOpen] = useState(false)
  const [keyboardOpen, setKeyboardOpen] = useState(false)

  const scrollRef = useRef(null)
  const inputRefs = useRef([])
  const inputsTop = useRef(0)
  const inputTops = useRef([])

  // 전에 저장한 답 불러오기
  useEffect(() => {
    let alive = true
    ;(async () => {
      const result = await getActivityData(user.uid, activityId, user.email)
      if (!alive || !result?.success || !result.data) return
      const prev = result.data[answerField]
      if (isMultiple) {
        if (Array.isArray(prev)) setAnswer(Array.from({ length: multipleCount }, (_, i) => prev[i] || ''))
      } else {
        setAnswer(prev || '')
      }
    })()
    return () => {
      alive = false
    }
  }, [])

  // 안내 메시지는 3초 뒤에 사라짐
  useEffect(() => {
    if (!error) return
    const timer = setTimeout(() => setError(''), 3000)
    return () => clearTimeout(timer)
  }, [error])

  // 키보드가 올라와 있으면 아래 안전 영역 여백을 줄임
  useEffect(() => {
    const showEvt = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow'
    const hideEvt = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide'
    const s1 = Keyboard.addListener(showEvt, () => setKeyboardOpen(true))
    const s2 = Keyboard.addListener(hideEvt, () => setKeyboardOpen(false))
    return () => {
      s1.remove()
      s2.remove()
    }
  }, [])

  // 이전 문제로, 첫 문제면 전시관 시작 화면으로
  const handleBack = () => {
    const prev = previousActivityInHall(activityId)
    if (prev) router.replace(questionRoute(prev))
    else if (hallId) router.dismissTo(hallRoute(hallId))
    else if (router.canGoBack()) router.back()
    else router.replace('/choice-museum')
  }

  const handleChange = (value, index = null) => {
    if (isMultiple && index !== null) {
      setAnswer((prev) => prev.map((v, i) => (i === index ? value : v)))
    } else {
      setAnswer(value)
    }
    setError('')
  }

  const handleSave = async () => {
    if (saving) return
    setError('')

    if (isMultiple) {
      const check = checkMultipleAnswers(activityId, answerField, answer)
      if (!check.correct) {
        setError(check.message)
        return
      }
    } else {
      if (!answer.trim()) {
        setError('답을 입력해주세요.')
        return
      }
      const check = checkAnswer(activityId, answerField, answer)
      if (!check.correct) {
        setError('다시 생각해보세요.')
        return
      }
    }

    setSaving(true)
    const result = await saveActivityData(user.uid, activityId, { [answerField]: answer }, q, user.email)
    setSaving(false)
    if (result?.success) {
      Keyboard.dismiss()
      setSaved(true)
      setShowCorrect(true)
    } else {
      setError(result?.error || '저장에 실패했습니다.')
    }
  }

  // 여러 칸 입력: 누른 칸이 키보드에 가리지 않게 스크롤
  const scrollToInput = (i) => {
    setTimeout(() => {
      const y = inputsTop.current + (inputTops.current[i] || 0) - 120
      scrollRef.current?.scrollTo({ y: Math.max(0, y), animated: true })
    }, 250)
  }

  if (showCorrect) {
    return (
      <CorrectAnswer
        explanation={explanation}
        activityId={activityId}
        user={user}
        onReplay={() => {
          setShowCorrect(false)
          setSaved(false)
        }}
      />
    )
  }

  const footerBottom = keyboardOpen ? 12 : Math.max(insets.bottom, 16) + 8

  return (
    <View style={[styles.root, { backgroundColor: t.bg }]}>
      <StatusBar style="light" />
      <SafeAreaView edges={['top']} style={{ backgroundColor: t.headerBg }}>
        <AppHeader
          title={hallTitle(hallId)}
          onBack={handleBack}
          color={t.text}
          titleColor={t.text}
          borderColor={t.headerBorder}
          right={
            <HeaderIconButton
              icon="mail_outline"
              color={t.text}
              label="메시지함"
              onPress={() => router.push({ pathname: '/messages', params: { museum } })}
            />
          }
        />
      </SafeAreaView>

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          ref={scrollRef}
          style={styles.flex}
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          showsVerticalScrollIndicator={false}
        >
          {/* 문제 카드 */}
          <Pressable
            onPress={() => setViewerOpen(true)}
            accessibilityRole="imagebutton"
            accessibilityLabel={`${title} 사진 크게 보기`}
            style={styles.imageWrap}
          >
            <Image source={image} style={StyleSheet.absoluteFill} contentFit="cover" contentPosition={imagePositionOf(q)} transition={200} />
            <LinearGradient
              colors={['rgba(25,16,34,0)', 'rgba(25,16,34,0.48)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={StyleSheet.absoluteFill}
              pointerEvents="none"
            />
            <View style={[styles.badge, { backgroundColor: t.badgeBg, borderColor: t.badgeBorder }]}>
              <Text style={styles.badgeText}>문제 {questionNumber}</Text>
            </View>
            <View style={styles.zoomHint}>
              <Icon name="zoom_in" size={18} color="#fff" />
            </View>
          </Pressable>

          <View style={styles.content}>
            <Text style={[styles.title, { color: t.text }]}>{title}</Text>
            <View style={[styles.divider, { backgroundColor: t.divider }]} />
            <Text style={[styles.description, { color: t.description }]}>{description}</Text>
          </View>

          {/* 여러 칸 입력은 키보드에 맞춰 스크롤되도록 본문 안에 둠 */}
          {isMultiple && (
            <View style={styles.multi} onLayout={(e) => (inputsTop.current = e.nativeEvent.layout.y)}>
              {answer.map((value, i) => {
                const label = multipleLabels[i] || `${i + 1}번째`
                const last = i === answer.length - 1
                return (
                  <View key={i} onLayout={(e) => (inputTops.current[i] = e.nativeEvent.layout.y)}>
                    <AnswerInput
                      ref={(r) => (inputRefs.current[i] = r)}
                      theme={t}
                      value={value}
                      onChangeText={(v) => handleChange(v, i)}
                      placeholder={label}
                      label={label}
                      returnKeyType={last ? 'send' : 'next'}
                      submitBehavior={last ? 'blurAndSubmit' : 'submit'}
                      onFocus={() => scrollToInput(i)}
                      onSubmitEditing={() => (last ? handleSave() : inputRefs.current[i + 1]?.focus())}
                    />
                  </View>
                )
              })}
            </View>
          )}
        </ScrollView>

        {/* 아래 입력줄 (웹 ActivityFooter) */}
        <View style={[styles.footer, { borderTopColor: t.footerBorder, paddingBottom: footerBottom, backgroundColor: t.bg }]}>
          {!isMultiple && (
            <AnswerInput
              theme={t}
              value={answer}
              onChangeText={(v) => handleChange(v)}
              placeholder={answerPlaceholder || '답을 입력하세요'}
              label="정답 입력"
              returnKeyType="send"
              onSubmitEditing={handleSave}
            />
          )}
          <SubmitButton theme={t} onPress={handleSave} saving={saving} saved={saved} />
        </View>
      </KeyboardAvoidingView>

      <ErrorToast message={error} top={insets.top + 70} />
      <ImageViewer source={image} title={title} visible={viewerOpen} onClose={() => setViewerOpen(false)} />
    </View>
  )
}

function NotFound() {
  return (
    <View style={[styles.root, { backgroundColor: '#0f0716', alignItems: 'center', justifyContent: 'center', padding: 24 }]}>
      <Text style={{ color: '#f3e8ff', fontSize: 18, fontWeight: '700', marginBottom: 16 }}>문제를 찾을 수 없어요</Text>
      <Pressable onPress={() => router.replace('/choice-museum')} style={styles.notFoundBtn}>
        <Text style={{ color: '#fff', fontWeight: '700' }}>박물관 선택으로</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  scroll: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 24, gap: 16 },
  imageWrap: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.04)',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
  },
  badge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 9999,
    borderWidth: 1,
  },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '500', letterSpacing: 0.6 },
  zoomHint: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { gap: 8, paddingHorizontal: 4 },
  title: { fontSize: 22, fontWeight: '700', lineHeight: 27 },
  divider: { height: 4, width: 48, borderRadius: 2, marginBottom: 8 },
  description: { fontSize: 14, lineHeight: 22.4 },
  multi: { gap: 12, marginTop: 4 },
  footer: { paddingHorizontal: 20, paddingTop: 16, borderTopWidth: 1, gap: 12 },
  notFoundBtn: { backgroundColor: '#a855f7', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12 },
})
