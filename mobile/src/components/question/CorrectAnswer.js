import { useEffect, useRef, useState } from 'react'
import { View, Text, Pressable, ScrollView, Animated, Easing, Platform, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { StatusBar } from 'expo-status-bar'
import { router } from 'expo-router'
import Icon from '../Icon'
import { correctTheme } from './questionTheme'
import { getAllActivityStatus } from '@shared/firebase/firestore'
import {
  hallActivities,
  hallOfActivity,
  museumOfActivity,
  nextActivityInHall,
  questionRoute,
  hallListRoute,
} from '../../lib/routes'

const native = Platform.OS !== 'web'

// 계속 반복되는 위아래 움직임 (웹의 float, bounce 애니메이션)
function useLoop(distance, duration, delay = 0) {
  const v = useRef(new Animated.Value(0)).current
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(v, { toValue: 1, duration: duration / 2, easing: Easing.inOut(Easing.ease), useNativeDriver: native }),
        Animated.timing(v, { toValue: 0, duration: duration / 2, easing: Easing.inOut(Easing.ease), useNativeDriver: native }),
      ])
    )
    loop.start()
    return () => loop.stop()
  }, [v, duration, delay])
  return v.interpolate({ inputRange: [0, 1], outputRange: [0, -distance] })
}

// 아래에서 올라오며 나타나기 (웹의 fadeIn + animation-delay)
function FadeIn({ delay = 0, style, children }) {
  const v = useRef(new Animated.Value(0)).current
  useEffect(() => {
    Animated.timing(v, { toValue: 1, duration: 500, delay, easing: Easing.out(Easing.ease), useNativeDriver: native }).start()
  }, [v, delay])
  return (
    <Animated.View
      style={[style, { opacity: v, transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }]}
    >
      {children}
    </Animated.View>
  )
}

// 정답 화면 (웹 CorrectAnswer)
export default function CorrectAnswer({ explanation, activityId, user, onReplay }) {
  const insets = useSafeAreaInsets()
  const museum = museumOfActivity(activityId)
  const t = correctTheme(museum)
  const list = hallActivities(hallOfActivity(activityId))
  const isLastQuestion = list.length > 0 && list[list.length - 1] === activityId
  const [progress, setProgress] = useState(0)

  const float = useLoop(20, 3000)
  const bounce1 = useLoop(10, 2000)
  const bounce2 = useLoop(10, 2000, 300)
  const scaleIn = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(scaleIn, { toValue: 1, duration: 500, easing: Easing.out(Easing.ease), useNativeDriver: native }).start()
  }, [scaleIn])

  // 이 전시관에서 끝낸 문제 비율
  useEffect(() => {
    let alive = true
    ;(async () => {
      if (!user?.uid || !list.length) return
      const result = await getAllActivityStatus(user.uid, user.email)
      if (!alive || !result.success) return
      const status = result.status || {}
      const done = list.filter((id) => status[id] === true).length
      setProgress(Math.round((done / list.length) * 100))
    })()
    return () => {
      alive = false
    }
  }, [user, activityId])

  // 다음 문제로. 전시관 마지막 문제면 박물관의 전시관 목록으로
  const handleNext = () => {
    const next = isLastQuestion ? null : nextActivityInHall(activityId)
    if (next) router.replace(questionRoute(next))
    else router.dismissTo(hallListRoute(museum))
  }

  const goExhibition = () => router.dismissTo(hallListRoute(museum))

  return (
    <View style={[styles.root, { backgroundColor: t.bg }]}>
      <StatusBar style="light" />
      {/* 배경의 은은한 빛 */}
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <View style={[styles.glow, { top: '18%', left: '-10%', width: 300, height: 300, experimental_backgroundImage: `radial-gradient(circle, ${t.glow1} 0%, transparent 70%)` }]} />
        <View style={[styles.glow, { bottom: '15%', right: '-15%', width: 360, height: 360, experimental_backgroundImage: `radial-gradient(circle, ${t.glow2} 0%, transparent 70%)` }]} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 32, paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* 축하 아이콘 */}
        <Animated.View
          style={[
            styles.iconWrap,
            { opacity: scaleIn, transform: [{ scale: scaleIn.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) }] },
          ]}
        >
          <Animated.View style={{ transform: [{ translateY: float }] }}>
            <LinearGradient
              colors={t.iconGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.celebrate, { boxShadow: `0 25px 50px -12px ${t.iconShadow}` }]}
            >
              <Icon name="celebration" size={48} color="#fff" />
            </LinearGradient>
          </Animated.View>
          <Animated.View style={[styles.star1, { transform: [{ translateY: bounce1 }] }]}>
            <Icon name="star" size={24} color="#fff" />
          </Animated.View>
          <Animated.View style={[styles.star2, { backgroundColor: t.star2, transform: [{ translateY: bounce2 }] }]}>
            <Icon name="star" size={20} color="#fff" />
          </Animated.View>
        </Animated.View>

        {/* 축하 메시지 */}
        <FadeIn style={styles.message}>
          <Text style={[styles.title, { color: t.title }]}>정답입니다!</Text>
          <Text style={[styles.subtitle, { color: t.subtitle }]}>훌륭한 관찰력이에요</Text>
          <Text style={[styles.description, { color: t.description }]}>
            {isLastQuestion ? '이 전시관의 모든 문제를 완료하셨습니다! 훌륭해요!' : '잘하셨어요! 다음 문제로 넘어가볼까요?'}
          </Text>
        </FadeIn>

        {/* 정답 정보 카드 */}
        <FadeIn
          delay={200}
          style={[styles.infoCard, { backgroundColor: t.cardBg, borderColor: t.cardBorder, boxShadow: `0 20px 25px -5px ${t.cardShadow}` }]}
        >
          <View style={styles.infoHeader}>
            <View style={[styles.checkIcon, { backgroundColor: t.checkBg }]}>
              <Icon name="check_circle" size={24} color={t.check} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.infoTitle, { color: t.title }]}>정답</Text>
              <Text style={[styles.infoSubtitle, { color: t.cardSubtitle }]}>문제를 완벽하게 해결하셨습니다</Text>
            </View>
          </View>
          <View style={[styles.scoreSection, { borderTopColor: t.scoreBorder }]}>
            <View style={styles.scoreHeader}>
              <Text style={[styles.scoreLabel, { color: t.scoreLabel }]}>탐험 진행도</Text>
              <Text style={[styles.scoreValue, { color: t.scoreValue }]}>{progress}%</Text>
            </View>
            <View style={styles.progressTrack} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: progress }}>
              <LinearGradient
                colors={t.progress}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.progressFill, { width: `${progress}%` }]}
              />
            </View>
          </View>
        </FadeIn>

        {/* 설명 카드 */}
        <FadeIn delay={300} style={styles.explanationCard}>
          <Icon name="lightbulb" size={20} color={t.explanationIcon} style={{ marginTop: 2 }} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.explanationTitle, { color: t.title }]}>정답 설명</Text>
            <Text style={[styles.explanationText, { color: t.explanationText }]}>{explanation}</Text>
          </View>
        </FadeIn>

        {/* 버튼 */}
        <FadeIn delay={400} style={styles.buttons}>
          <Pressable
            onPress={handleNext}
            accessibilityRole="button"
            style={({ pressed }) => [styles.nextWrap, { boxShadow: `0 10px 15px -3px ${t.nextShadow}` }, pressed && { transform: [{ scale: 0.98 }] }]}
          >
            <LinearGradient colors={t.next} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.next}>
              <Text style={styles.nextText}>{isLastQuestion ? '목록으로 돌아가기' : '다음 문제로'}</Text>
              <Icon name={isLastQuestion ? 'list' : 'arrow_forward'} size={20} color="#fff" />
            </LinearGradient>
          </Pressable>
          <Pressable onPress={onReplay} accessibilityRole="button" style={({ pressed }) => [styles.subBtn, pressed && styles.subBtnPressed]}>
            <Icon name="replay" size={18} color="#f3e8ff" />
            <Text style={styles.subBtnText}>다시 보기</Text>
          </Pressable>
          {!isLastQuestion && (
            <Pressable onPress={goExhibition} accessibilityRole="button" style={({ pressed }) => [styles.subBtn, pressed && styles.subBtnPressed]}>
              <Icon name="museum" size={18} color="#f3e8ff" />
              <Text style={styles.subBtnText}>전시관 탐험</Text>
            </Pressable>
          )}
        </FadeIn>
      </ScrollView>
    </View>
  )
}

const CARD_MAX = 384

const styles = StyleSheet.create({
  root: { flex: 1, overflow: 'hidden' },
  glow: { position: 'absolute', borderRadius: 9999 },
  content: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 },
  iconWrap: { marginBottom: 32, marginTop: 20 },
  celebrate: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center' },
  star1: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fbbf24',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)',
  },
  star2: {
    position: 'absolute',
    bottom: -8,
    left: -8,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)',
  },
  message: { alignItems: 'center', marginBottom: 32 },
  title: {
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 12,
    lineHeight: 36,
    fontFamily: Platform.select({ web: "'Gowun Batang', Batang, serif", default: undefined }),
  },
  subtitle: { fontSize: 20, fontWeight: '500', marginBottom: 8 },
  description: { fontSize: 14, textAlign: 'center' },
  infoCard: { width: '100%', maxWidth: CARD_MAX, marginBottom: 32, borderWidth: 1, borderRadius: 16, padding: 24 },
  infoHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  checkIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  infoTitle: { fontSize: 18, fontWeight: '700', marginBottom: 4 },
  infoSubtitle: { fontSize: 14 },
  scoreSection: { paddingTop: 16, borderTopWidth: 1 },
  scoreHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  scoreLabel: { fontSize: 12, letterSpacing: 0.6 },
  scoreValue: { fontSize: 18, fontWeight: '700' },
  progressTrack: { width: '100%', height: 8, borderRadius: 4, backgroundColor: '#0f0716', overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  explanationCard: {
    width: '100%',
    maxWidth: CARD_MAX,
    marginBottom: 32,
    backgroundColor: 'rgba(29,18,38,0.5)',
    borderWidth: 1,
    borderColor: '#362447',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  explanationTitle: { fontSize: 14, fontWeight: '700', marginBottom: 8 },
  explanationText: { fontSize: 14, lineHeight: 24.5 },
  buttons: { width: '100%', maxWidth: CARD_MAX, gap: 12 },
  nextWrap: { borderRadius: 12 },
  next: { height: 56, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal: 24 },
  nextText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  subBtn: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#1d1226',
    borderWidth: 1,
    borderColor: '#362447',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  subBtnPressed: { backgroundColor: '#2a1b36', borderColor: 'rgba(168,85,247,0.5)' },
  subBtnText: { color: '#f3e8ff', fontSize: 14, fontWeight: '500' },
})
