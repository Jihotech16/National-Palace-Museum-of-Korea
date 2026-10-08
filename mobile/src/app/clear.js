import { useEffect, useRef, useState } from 'react'
import { View, Text, Pressable, ScrollView, ActivityIndicator, Animated, Alert, Platform, StyleSheet } from 'react-native'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { StatusBar } from 'expo-status-bar'
import { router, useLocalSearchParams } from 'expo-router'
import { captureRef } from 'react-native-view-shot'
import * as MediaLibrary from 'expo-media-library/legacy'
import * as Sharing from 'expo-sharing'
import RequireAuth from '../components/RequireAuth'
import StudentTabBar from '../components/StudentTabBar'
import StudentHeader from '../components/student/StudentHeader'
import Certificate, { certificateTitle } from '../components/student/Certificate'
import Icon from '../components/Icon'
import { getAllActivityStatus } from '@shared/firebase/firestore'
import { getStudentProfile } from '../lib/data'
import { PALACE_HALLS, SEOUL_ZONES, hallActivities, hallListRoute } from '../lib/routes'
import palaceImage from '@shared/image/NationalPalaceMuseum/국립고궁박물관.jpg'
import seoulImage from '@shared/image/SeoulHistoryMuseum/서울역사박물관.jpeg'

const native = Platform.OS !== 'web'

// 알림창 (웹 미리보기에서는 Alert가 동작하지 않아 window.alert 사용)
function notify(title, message) {
  if (Platform.OS === 'web') window.alert(message ? `${title}\n${message}` : title)
  else Alert.alert(title, message)
}

// 박물관의 모든 전시관 문제를 끝냈는지
const museumDone = (status, halls) =>
  halls.every((hallId) => {
    const list = hallActivities(hallId)
    return list.length === 0 || list.every((id) => status[id])
  })

// 수료증 화면 (웹 StudentClear)
export default function ClearRoute() {
  const params = useLocalSearchParams()
  const museumParam = params.museum === 'seoul' || params.museum === 'palace' ? params.museum : null
  return <RequireAuth>{(user) => <ClearScreen user={user} museumParam={museumParam} />}</RequireAuth>
}

function ClearScreen({ user, museumParam }) {
  const certRef = useRef(null)
  const [info, setInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [completed, setCompleted] = useState({ palace: false, seoul: false })
  const [activeTab, setActiveTab] = useState(museumParam || 'palace')
  const [showTabSelection, setShowTabSelection] = useState(true)
  const [showCelebration, setShowCelebration] = useState(false)
  const [showCertificate, setShowCertificate] = useState(false)
  const [busy, setBusy] = useState(false)
  const timer = useRef(null)

  useEffect(() => {
    let alive = true
    ;(async () => {
      const [profile, result] = await Promise.all([
        getStudentProfile(user),
        getAllActivityStatus(user.uid, user.email).catch(() => ({ success: false })),
      ])
      if (!alive) return
      setInfo(profile)
      if (result?.success) {
        const status = result.status || {}
        const palace = museumDone(status, PALACE_HALLS)
        const seoul = museumDone(status, SEOUL_ZONES)
        setCompleted({ palace, seoul })
        // 어느 박물관인지 정해서 오지 않았으면 끝낸 박물관을 먼저 고름 (웹과 같음)
        if (!museumParam && (palace || seoul)) setActiveTab(seoul && !palace ? 'seoul' : 'palace')
      }
      setLoading(false)
    })()
    return () => {
      alive = false
      clearTimeout(timer.current)
    }
  }, [])

  const selectTab = (museum) => {
    setActiveTab(museum)
    setShowTabSelection(false)
    clearTimeout(timer.current)
    if (completed[museum]) {
      // 축하 메시지를 2초 보여준 뒤 수료증 공개
      setShowCelebration(true)
      setShowCertificate(false)
      timer.current = setTimeout(() => {
        setShowCelebration(false)
        setShowCertificate(true)
      }, 2000)
    } else {
      setShowCelebration(false)
      setShowCertificate(false)
    }
  }

  const handleBack = () => {
    if (!showTabSelection) {
      clearTimeout(timer.current)
      setShowTabSelection(true)
      setShowCelebration(false)
      setShowCertificate(false)
    } else if (router.canGoBack()) router.back()
    else router.replace(hallListRoute(activeTab))
  }

  // 수료증 부분만 사진으로 찍기
  const capture = () => captureRef(certRef, { format: 'png', quality: 1, result: 'tmpfile' })

  const handleSaveImage = async () => {
    if (Platform.OS === 'web') {
      notify('이미지 저장은 앱에서 할 수 있어요', '휴대폰 앱에서 수료증을 사진 앱에 저장할 수 있어요.')
      return
    }
    if (busy) return
    setBusy(true)
    try {
      const perm = await MediaLibrary.requestPermissionsAsync(true)
      if (!perm.granted) {
        notify('사진 접근 권한이 필요해요', '설정 앱에서 사진 접근을 허용한 뒤 다시 시도해 주세요.')
        return
      }
      const uri = await capture()
      await MediaLibrary.saveToLibraryAsync(uri)
      notify('저장 완료', '수료증 이미지를 사진 앱에 저장했어요.')
    } catch (e) {
      console.warn('이미지 저장 오류:', e)
      notify('저장 실패', '이미지 저장 중 오류가 발생했습니다.')
    } finally {
      setBusy(false)
    }
  }

  const handleShare = async () => {
    if (Platform.OS === 'web') {
      notify('공유는 앱에서 할 수 있어요', '휴대폰 앱에서 수료증 이미지를 공유할 수 있어요.')
      return
    }
    if (busy) return
    setBusy(true)
    try {
      if (!(await Sharing.isAvailableAsync())) {
        notify('공유할 수 없어요', '이 기기에서는 공유 기능을 쓸 수 없어요.')
        return
      }
      const uri = await capture()
      await Sharing.shareAsync(uri, { mimeType: 'image/png', UTI: 'public.png', dialogTitle: certificateTitle(activeTab) })
    } catch (e) {
      console.warn('공유 오류:', e)
      notify('공유 실패', '공유 중 오류가 발생했습니다.')
    } finally {
      setBusy(false)
    }
  }

  const goHalls = () => router.dismissTo(hallListRoute(activeTab))

  const seoul = activeTab === 'seoul'
  const primaryColor = seoul ? '#2563eb' : '#7f13ec'
  const title = showTabSelection ? '탐험 수료증' : certificateTitle(activeTab)

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <StudentHeader title={title} onBack={handleBack} museum={activeTab} />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color="#ad92c9" />
          <Text style={styles.loadingText}>로딩 중...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.main} showsVerticalScrollIndicator={false}>
          {showTabSelection && (
            <View style={styles.tabs}>
              <MuseumTab
                museum="palace"
                label="고궁박물관"
                icon="museum"
                image={palaceImage}
                active={activeTab === 'palace'}
                done={completed.palace}
                onPress={() => selectTab('palace')}
              />
              <MuseumTab
                museum="seoul"
                label="서울역사박물관"
                icon="location_city"
                image={seoulImage}
                active={activeTab === 'seoul'}
                done={completed.seoul}
                onPress={() => selectTab('seoul')}
              />
            </View>
          )}

          {!showTabSelection && !completed[activeTab] && (
            <View style={styles.full}>
              <LockedNotice museum={activeTab} />
              <Certificate museum={activeTab} info={info} locked />
              <View style={styles.actions}>
                <ActionButton label="탐험 계속하기" color={primaryColor} primary onPress={goHalls} />
              </View>
            </View>
          )}

          {!showTabSelection && completed[activeTab] && showCertificate && (
            <FadeUp style={styles.full}>
              <Certificate ref={certRef} museum={activeTab} info={info} />
              <View style={styles.actions}>
                <ActionButton label="이미지 저장" onPress={handleSaveImage} disabled={busy} />
                <ActionButton label="공유" onPress={handleShare} disabled={busy} />
                <ActionButton label="확인" color={primaryColor} primary onPress={goHalls} />
              </View>
            </FadeUp>
          )}
        </ScrollView>
      )}

      {showCelebration && <Celebration museum={activeTab} />}
      <StudentTabBar active="certificate" museum={activeTab} />
    </View>
  )
}

function MuseumTab({ museum, label, icon, image, active, done, onPress }) {
  const seoul = museum === 'seoul'
  // 서울 탭의 파란 스타일은 웹처럼 선택됐을 때만 적용
  const blue = seoul && active
  const borderColor = active ? (seoul ? '#2563eb' : '#7f13ec') : 'rgba(168,85,247,0.2)'
  const textColor = blue ? '#2563eb' : active ? '#f3e8ff' : '#ad92c9'
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${label} 수료증${done ? ', 완료' : ''}`}
      style={({ pressed }) => [
        styles.tab,
        {
          borderColor,
          backgroundColor: blue ? 'rgba(37,99,235,0.1)' : 'rgba(54,35,72,0.5)',
          boxShadow: active ? `0 0 0 2px ${seoul ? 'rgba(37,99,235,0.3)' : 'rgba(127,19,236,0.3)'}` : undefined,
        },
        pressed && { transform: [{ translateY: -2 }], opacity: 0.95 },
      ]}
    >
      <View style={styles.tabImage}>
        <Image source={image} style={StyleSheet.absoluteFill} contentFit="cover" />
        <LinearGradient colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.6)']} style={StyleSheet.absoluteFill} />
      </View>
      <View style={styles.tabContent}>
        <Icon name={icon} size={20} color={textColor} />
        <Text style={[styles.tabText, { color: textColor }]}>{label}</Text>
      </View>
      {done && (
        <View style={styles.tabBadge}>
          <Icon name="check_circle" size={12} color="#fff" />
        </View>
      )}
    </Pressable>
  )
}

function LockedNotice({ museum }) {
  return (
    <FadeUp style={styles.locked}>
      <View style={styles.lockedIcon}>
        <View style={[styles.lockedGlow, { experimental_backgroundImage: 'radial-gradient(circle, rgba(156,163,175,0.3) 0%, transparent 70%)' }]} />
        <Icon name="lock" size={48} color="#9ca3af" />
      </View>
      <Text style={styles.lockedTitle}>수료증이 잠겨있습니다</Text>
      <Text style={styles.lockedSubtitle}>
        {museum === 'palace' ? '국립고궁박물관' : '서울역사박물관'}의 모든 전시관 미션을 완료하고{'\n'}나만의 멋진 수료증을 획득하세요!
      </Text>
    </FadeUp>
  )
}

// 가운데에 잠깐 떴다가 사라지는 축하 메시지
function Celebration({ museum }) {
  const v = useRef(new Animated.Value(0)).current
  useEffect(() => {
    Animated.sequence([
      Animated.timing(v, { toValue: 1, duration: 600, useNativeDriver: native }),
      Animated.delay(900),
      Animated.timing(v, { toValue: 2, duration: 500, useNativeDriver: native }),
    ]).start()
  }, [v])
  const seoul = museum === 'seoul'
  return (
    <View pointerEvents="none" style={styles.celebrationWrap}>
      <Animated.View
        style={[
          styles.celebration,
          {
            opacity: v.interpolate({ inputRange: [0, 1, 2], outputRange: [0, 1, 0] }),
            transform: [
              { translateY: v.interpolate({ inputRange: [0, 1, 2], outputRange: [20, 0, 0] }) },
              { scale: v.interpolate({ inputRange: [0, 1, 2], outputRange: [1, 1, 0.9] }) },
            ],
          },
        ]}
      >
        <View style={styles.celebrationIcon}>
          <View
            style={[
              styles.lockedGlow,
              { experimental_backgroundImage: `radial-gradient(circle, ${seoul ? 'rgba(59,130,246,0.4)' : 'rgba(250,204,21,0.3)'} 0%, transparent 70%)` },
            ]}
          />
          <Icon name="emoji_events" size={48} color={seoul ? '#3b82f6' : '#eab308'} />
        </View>
        <Text style={[styles.celebrationTitle, seoul && { color: '#dbeafe' }]}>축하합니다!</Text>
        <Text style={[styles.celebrationSubtitle, seoul && { color: '#93c5fd' }]}>
          {seoul ? '서울역사박물관' : '국립고궁박물관'}의 모든 전시관 미션을 성공적으로 마쳤습니다.
        </Text>
      </Animated.View>
    </View>
  )
}

function FadeUp({ style, children }) {
  const v = useRef(new Animated.Value(0)).current
  useEffect(() => {
    Animated.timing(v, { toValue: 1, duration: 600, useNativeDriver: native }).start()
  }, [v])
  return (
    <Animated.View
      style={[style, { opacity: v, transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }]}
    >
      {children}
    </Animated.View>
  )
}

function ActionButton({ label, onPress, color, primary = false, disabled = false }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.btn,
        primary
          ? { backgroundColor: color, boxShadow: `0 10px 15px -3px ${color === '#2563eb' ? 'rgba(37,99,235,0.3)' : 'rgba(127,19,236,0.3)'}` }
          : { backgroundColor: '#e5e7eb' },
        (pressed || disabled) && { opacity: 0.8 },
      ]}
    >
      <Text style={[styles.btnText, { color: primary ? '#fff' : '#1f2937' }]}>{label}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#221d10' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 },
  loadingText: { color: '#ad92c9' },
  main: { padding: 24, paddingBottom: 24, alignItems: 'center' },
  full: { width: '100%' },
  tabs: { width: '100%', gap: 16, paddingHorizontal: 24, marginBottom: 24 },
  tab: { borderRadius: 12, borderWidth: 1, overflow: 'hidden' },
  tabImage: { height: 120, width: '100%' },
  tabContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12, paddingHorizontal: 16 },
  tabText: { fontSize: 14, fontWeight: '600' },
  tabBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#10b981',
    borderWidth: 2,
    borderColor: '#0f0716',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locked: { alignItems: 'center', marginBottom: 32 },
  lockedIcon: { marginBottom: 12, alignItems: 'center', justifyContent: 'center' },
  // 웹의 흐린 빛(blur) 대신 가운데서 퍼지는 원형 그라데이션
  lockedGlow: {
    position: 'absolute',
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  lockedTitle: { fontSize: 24, fontWeight: '700', color: '#f3e8ff', marginBottom: 4, textAlign: 'center' },
  lockedSubtitle: { fontSize: 14, color: '#6b7280', lineHeight: 21, textAlign: 'center' },
  actions: { width: '100%', flexDirection: 'row', gap: 12, marginTop: 32 },
  btn: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  btnText: { fontSize: 14, fontWeight: '700' },
  celebrationWrap: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  celebration: { alignItems: 'center' },
  celebrationIcon: { marginBottom: 12, alignItems: 'center', justifyContent: 'center' },
  celebrationTitle: { fontSize: 24, fontWeight: '700', color: '#f3e8ff', marginBottom: 4 },
  celebrationSubtitle: { fontSize: 14, color: '#ad92c9', textAlign: 'center' },
})
