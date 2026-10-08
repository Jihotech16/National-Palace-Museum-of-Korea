import { useEffect, useRef } from 'react'
import { View, Text, Pressable, ScrollView, StyleSheet, Animated } from 'react-native'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Screen from '../Screen'
import Icon from '../Icon'
import AppHeader, { HeaderIconButton } from '../AppHeader'
import { hallActivities, hallListRoute, questionRoute } from '../../lib/routes'
import { HALL_INFO, HALL_THEMES, LEVEL_LABEL, museumOfHall } from './hallInfo'

// '**굵게**' 표시가 들어간 문단을 Text 조각으로
function RichParagraph({ text, style, boldColor }) {
  const parts = text.split('**')
  return (
    <Text style={style}>
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          <Text key={i} style={{ color: boldColor, fontWeight: '700' }}>
            {p}
          </Text>
        ) : (
          p
        )
      )}
    </Text>
  )
}

// 사진 오른쪽 아래에서 깜빡이는 동그란 아이콘
function PulseIcon({ name, t }) {
  const v = useRef(new Animated.Value(1)).current
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(v, { toValue: 0.5, duration: 1000, useNativeDriver: true }),
        Animated.timing(v, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    )
    loop.start()
    return () => loop.stop()
  }, [v])
  return (
    <Animated.View
      style={[
        styles.pulse,
        { opacity: v, backgroundColor: `rgba(${t.accentRgb},0.2)`, borderColor: `rgba(${t.accentRgb},0.5)` },
      ]}
    >
      <Icon name={name} size={20} color={t.accent} />
    </Animated.View>
  )
}

// 전시관 안내 화면 (웹 각 전시관 1_Start, 열 개를 하나로 합침)
export default function HallStart({ hallId }) {
  const insets = useSafeAreaInsets()
  const info = HALL_INFO[hallId]
  const museum = museumOfHall(hallId)
  const t = HALL_THEMES[museum]

  if (!info) {
    return (
      <Screen bg={t.pageBg}>
        <AppHeader title="전시관 안내" onBack={() => router.replace(hallListRoute(museum))} color={t.text} titleColor={t.text} />
        <View style={styles.missing}>
          <Text style={{ color: t.soft }}>전시관을 찾을 수 없어요.</Text>
        </View>
      </Screen>
    )
  }

  const goBack = () => (router.canGoBack() ? router.back() : router.replace(hallListRoute(museum)))
  // 웹과 같이 전시관의 첫 문제부터 시작
  const start = () => {
    const first = hallActivities(hallId)[0]
    if (first) router.push(questionRoute(first))
  }

  return (
    <Screen bg={t.pageBg} edges={['top']}>
      <AppHeader
        title="전시관 안내"
        onBack={goBack}
        color={t.text}
        titleColor={t.text}
        bg={`rgba(${t.pageRgb},0.9)`}
        borderColor={t.line}
        right={<HeaderIconButton icon="mail" color={t.text} label="쪽지함" onPress={() => router.push('/messages')} />}
      />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 120 + insets.bottom }} showsVerticalScrollIndicator={false}>
        {/* 전시관 사진 */}
        <View style={styles.imageSection}>
          <View style={[styles.imageCard, { shadowColor: t.accent }]}>
            <Image
              source={info.startImage || info.image}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
              contentPosition={info.startPosition}
            />
            <LinearGradient
              colors={[`rgba(${t.pageRgb},0.85)`, 'transparent', 'transparent']}
              start={{ x: 0.5, y: 1 }}
              end={{ x: 0.5, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.location}>
              <Icon name="location_on" size={16} color="#fff" />
              <Text style={styles.locationText}>{info.location}</Text>
            </View>
            <PulseIcon name={museum === 'seoul' ? 'mail' : 'search'} t={t} />
          </View>
        </View>

        {/* 전시관 소개 */}
        <View style={styles.info}>
          <View style={styles.tags}>
            <View style={[styles.tag, { backgroundColor: `rgba(${t.accentRgb},0.15)`, borderColor: `rgba(${t.accentRgb},0.3)` }]}>
              <Icon name={museum === 'seoul' ? 'history_edu' : 'museum'} size={14} color={t.accent} />
              <Text style={[styles.tagText, { color: t.accent, fontWeight: '700' }]}>{info.tag}</Text>
            </View>
            <View style={[styles.tag, { backgroundColor: `rgba(${t.panelRgb},0.6)`, borderColor: `rgba(${t.lineRgb},0.5)` }]}>
              <Text style={[styles.tagText, { color: t.soft }]}>{info.subTag}</Text>
            </View>
          </View>

          <Text style={[styles.title, { color: t.text }]}>
            {info.headline}
            {'\n'}
            <Text style={{ color: t.titleAccent }}>{info.accentTitle}</Text>
          </Text>

          <View style={[styles.divider, { backgroundColor: t.accent }]} />

          <View style={{ gap: 16 }}>
            {info.paragraphs.map((p, i) => (
              <RichParagraph key={i} text={p} style={[styles.paragraph, { color: t.desc }]} boldColor={t.text} />
            ))}
          </View>

          {/* 미션 난이도 */}
          <View style={[styles.difficulty, { backgroundColor: `rgba(${t.panelRgb},0.6)`, borderColor: `rgba(${t.lineRgb},0.5)` }]}>
            <View style={styles.difficultyHeader}>
              <Text style={[styles.difficultyLabel, { color: t.soft }]}>미션 난이도</Text>
              <Text style={[styles.difficultyValue, { color: t.accent }]}>{LEVEL_LABEL[info.level]}</Text>
            </View>
            <View style={styles.bars}>
              {[1, 2, 3].map((n) => (
                <View
                  key={n}
                  style={[styles.bar, { backgroundColor: n <= info.level ? t.accent : `rgba(${t.lineRgb},0.5)` }]}
                />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* 아래 고정 버튼 */}
      <LinearGradient
        colors={['transparent', t.pageBg]}
        style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) }]}
        pointerEvents="box-none"
      >
        <Pressable
          onPress={start}
          style={({ pressed }) => [
            styles.startButton,
            { backgroundColor: pressed ? t.accentPress : t.accent, shadowColor: t.accent },
            pressed && { transform: [{ scale: 0.98 }] },
          ]}
        >
          <Icon name="flag" size={20} color="#fff" />
          <Text style={styles.startText}>탐험 시작하기</Text>
        </Pressable>
      </LinearGradient>
    </Screen>
  )
}

const styles = StyleSheet.create({
  missing: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  imageSection: { paddingTop: 8, paddingHorizontal: 16, paddingBottom: 24 },
  imageCard: {
    width: '100%',
    aspectRatio: 3.5 / 4,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    shadowOpacity: 0.2,
    shadowRadius: 25,
    shadowOffset: { width: 0, height: 20 },
  },
  location: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  locationText: { color: '#fff', fontSize: 12, fontWeight: '700', letterSpacing: 0.6 },
  pulse: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { paddingHorizontal: 20 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 28,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
  },
  tagText: { fontSize: 12, fontWeight: '500' },
  title: { fontSize: 32, fontWeight: '700', lineHeight: 36, letterSpacing: -0.6, paddingTop: 8, paddingBottom: 16 },
  divider: { width: 48, height: 4, borderRadius: 999, marginBottom: 20 },
  paragraph: { fontSize: 15, lineHeight: 26 },
  difficulty: { marginTop: 32, marginBottom: 16, padding: 16, borderRadius: 12, borderWidth: 1 },
  difficultyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  difficultyLabel: { fontSize: 12, fontWeight: '700', letterSpacing: 0.6 },
  difficultyValue: { fontSize: 12, fontWeight: '700' },
  bars: { flexDirection: 'row', gap: 4, height: 8 },
  bar: { flex: 1, borderRadius: 2 },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingTop: 20, paddingHorizontal: 20 },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 12,
    padding: 16,
    shadowOpacity: 0.3,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 10 },
  },
  startText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.8 },
})
