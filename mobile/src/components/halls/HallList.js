import { useEffect, useMemo, useState } from 'react'
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import Screen from '../Screen'
import Icon from '../Icon'
import AppHeader, { HeaderIconButton } from '../AppHeader'
import StudentTabBar from '../StudentTabBar'
import { gold } from '../../theme/colors'
import { hallRoute, hallActivities } from '../../lib/routes'
import { getAllActivityStatus } from '@shared/firebase/firestore'
import { HALL_INFO, HALL_THEMES, HALL_FILTERS, hallIdsOf } from './hallInfo'

// 진행률 → 상태 (탐험 가능 / 진행중 / 완료됨)
const statusOf = (progress) => (progress === 0 ? 'available' : progress === 100 ? 'completed' : 'progress')

const STATUS_BADGE = {
  progress: { icon: 'timelapse', label: '진행중' },
  available: { icon: 'lock_open', label: '탐험 가능' },
  completed: { icon: 'check_circle', label: '완료됨' },
}

// 전시관 목록 (웹 ExhibitionHallList / SeoulHistoryMuseumHallList)
export default function HallList({ user, museum = 'palace' }) {
  const t = HALL_THEMES[museum]
  const hallIds = hallIdsOf(museum)
  const [filter, setFilter] = useState('전체')
  const [status, setStatus] = useState({})
  // 이달의 추천은 화면을 열 때 한 번만 무작위로 고름
  const [featuredId] = useState(() => hallIds[Math.floor(Math.random() * hallIds.length)])

  useEffect(() => {
    let alive = true
    if (!user?.uid) return
    getAllActivityStatus(user.uid, user.email).then((result) => {
      if (alive && result?.success) setStatus(result.status || {})
    })
    return () => {
      alive = false
    }
  }, [user])

  // 전시관마다 완료한 문제 비율 계산
  const halls = useMemo(
    () =>
      hallIds.map((id) => {
        const list = hallActivities(id)
        const done = list.filter((a) => !!status[a]).length
        const ratio = list.length ? (done / list.length) * 100 : 0
        // 고궁은 내림, 서울은 반올림 (웹과 같게)
        let progress = museum === 'seoul' ? Math.round(ratio) : Math.floor(ratio)
        if (list.length && done === list.length) progress = 100
        return { id, ...HALL_INFO[id], progress, status: statusOf(progress) }
      }),
    [hallIds, status, museum]
  )

  const featured = halls.find((h) => h.id === featuredId)
  const shown = filter === '전체' ? halls : halls.filter((h) => h.floor === filter)
  const open = (id) => router.push(hallRoute(id))

  return (
    <Screen bg={gold.bg} edges={['top']}>
      <AppHeader
        title="전시관 탐험"
        onBack={() => (router.canGoBack() ? router.back() : router.replace(museum === 'seoul' ? '/seoul' : '/palace'))}
        bg="rgba(34,29,16,0.95)"
        borderColor="rgba(255,255,255,0.05)"
        right={<HeaderIconButton icon="mail" badge label="쪽지함" onPress={() => router.push('/messages')} />}
      />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 24 }}>
        {/* 이달의 추천 */}
        {featured && (
          <View style={styles.featuredWrap}>
            <Pressable style={({ pressed }) => [styles.featured, pressed && { opacity: 0.9 }]} onPress={() => open(featured.id)}>
              <Image source={featured.image} style={StyleSheet.absoluteFill} contentFit="cover" contentPosition={featured.listPosition} />
              <LinearGradient
                colors={['transparent', `rgba(${t.pageRgb},0.4)`, t.pageBg]}
                style={StyleSheet.absoluteFill}
              />
              <View style={styles.featuredContent}>
                <Text style={[styles.featuredBadge, { backgroundColor: `rgba(${t.accentRgb},0.9)` }]}>이달의 추천</Text>
                <Text style={styles.featuredTitle}>{featured.title}</Text>
                <Text style={styles.featuredSub}>{featured.summary}</Text>
              </View>
            </Pressable>
          </View>
        )}

        {/* 층 / Zone 필터 */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          {HALL_FILTERS[museum].map((f) => {
            const active = filter === f.value
            return (
              <Pressable
                key={f.value}
                onPress={() => setFilter(f.value)}
                style={({ pressed }) => [
                  styles.chip,
                  active
                    ? { backgroundColor: t.accent, borderColor: 'transparent', shadowColor: t.accent, shadowOpacity: 0.2, shadowRadius: 6, shadowOffset: { width: 0, height: 4 } }
                    : { backgroundColor: t.card, borderColor: t.chipLine },
                  pressed && { transform: [{ scale: 0.95 }] },
                ]}
              >
                <Icon name={f.icon} size={20} color={active ? '#fff' : t.soft} />
                <Text style={[styles.chipText, { color: active ? '#fff' : t.soft }]}>{f.value}</Text>
              </Pressable>
            )
          })}
        </ScrollView>

        {/* 목록 제목 */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <View style={[styles.indicator, { backgroundColor: t.accent }]} />
            <Text style={[styles.sectionTitle, { color: t.text }]}>전시관 목록</Text>
          </View>
          <Text style={[styles.count, { color: t.soft, backgroundColor: t.card, borderColor: t.line }]}>
            총 {shown.length}개
          </Text>
        </View>

        {/* 전시관 카드 */}
        <View style={styles.items}>
          {shown.map((h) => (
            <HallCard key={h.id} hall={h} t={t} onPress={() => open(h.id)} />
          ))}
        </View>
      </ScrollView>

      <StudentTabBar active="museum" museum={museum} />
    </Screen>
  )
}

function HallCard({ hall, t, onPress }) {
  const badge = STATUS_BADGE[hall.status]
  const badgeStyle =
    hall.status === 'completed'
      ? { backgroundColor: 'rgba(20,83,45,0.8)', borderColor: 'rgba(34,197,94,0.5)', color: '#bbf7d0' }
      : hall.status === 'progress'
        ? { backgroundColor: `rgba(${t.pageRgb},0.8)`, borderColor: `rgba(${t.accentRgb},0.2)`, color: t.accent }
        : { backgroundColor: `rgba(${t.pageRgb},0.8)`, borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, { backgroundColor: t.card, borderColor: t.line }, pressed && { opacity: 0.92 }]}
    >
      <View style={styles.cardImage}>
        <Image source={hall.image} style={StyleSheet.absoluteFill} contentFit="cover" contentPosition={hall.listPosition} />
        <View style={[styles.status, { backgroundColor: badgeStyle.backgroundColor, borderColor: badgeStyle.borderColor }]}>
          <Icon name={badge.icon} size={18} color={badgeStyle.color} />
          <Text style={[styles.statusText, { color: badgeStyle.color }]}>{badge.label}</Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, { color: t.text }]} numberOfLines={1}>
            {hall.title}
          </Text>
          <Text style={[styles.meta, { color: t.soft }]}>
            {hall.floor} • 난이도 <Text style={{ color: '#fbbf24' }}>{hall.stars}</Text>
          </Text>
        </View>
        <Text style={styles.cardDesc} numberOfLines={2}>
          {hall.summary}
        </Text>

        <View style={[styles.footer, { borderTopColor: t.line }]}>
          {hall.status === 'progress' && (
            <View style={{ gap: 4 }}>
              <Text style={[styles.progressLabel, { color: t.soft }]}>진행률</Text>
              <View style={[styles.progressBar, { backgroundColor: t.pageBg }]}>
                <View style={[styles.progressFill, { width: `${hall.progress}%`, backgroundColor: t.accent }]} />
              </View>
            </View>
          )}
          {hall.status === 'completed' && (
            <View style={[styles.earned, { backgroundColor: `rgba(${t.accentRgb},0.1)` }]}>
              <Icon name="emoji_events" size={16} color={t.accent} />
              <Text style={[styles.earnedText, { color: t.accent }]}>뱃지 획득함</Text>
            </View>
          )}

          {hall.status === 'progress' && (
            <View style={[styles.button, { backgroundColor: t.accent }]}>
              <Text style={[styles.buttonText, { color: '#fff' }]}>계속하기</Text>
              <Icon name="arrow_forward" size={18} color="#fff" />
            </View>
          )}
          {hall.status === 'available' && (
            <View style={[styles.button, { backgroundColor: t.cardAlt, borderWidth: 1, borderColor: `rgba(${t.accentRgb},0.3)` }]}>
              <Text style={[styles.buttonText, { color: t.accent }]}>탐험 시작</Text>
              <Icon name="play_arrow" size={18} color={t.accent} />
            </View>
          )}
          {hall.status === 'completed' && (
            <View style={[styles.button, { backgroundColor: t.cardAlt }]}>
              <Text style={[styles.buttonText, { color: t.soft }]}>다시 보기</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  featuredWrap: { padding: 16 },
  featured: { minHeight: 240, borderRadius: 12, overflow: 'hidden', justifyContent: 'flex-start' },
  featuredContent: { padding: 20 },
  featuredBadge: {
    alignSelf: 'flex-start',
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: 8,
  },
  featuredTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 29,
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  featuredSub: { color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: '500', lineHeight: 21 },
  filters: { gap: 12, paddingHorizontal: 16, paddingVertical: 8 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
  },
  chipText: { fontSize: 14, fontWeight: '500' },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 8,
  },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  indicator: { width: 4, height: 20, borderRadius: 999 },
  sectionTitle: { fontSize: 18, fontWeight: '700' },
  count: {
    fontSize: 12,
    fontWeight: '500',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    overflow: 'hidden',
  },
  items: { gap: 20, paddingHorizontal: 16, paddingBottom: 24, paddingTop: 4 },
  card: { borderRadius: 12, borderWidth: 1, overflow: 'hidden' },
  cardImage: { height: 176, width: '100%' },
  status: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusText: { fontSize: 12, fontWeight: '700' },
  cardBody: { padding: 20, gap: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 },
  cardTitle: { fontSize: 18, fontWeight: '700', lineHeight: 22, flexShrink: 1 },
  meta: { fontSize: 14 },
  cardDesc: { fontSize: 14, color: '#9ca3af', lineHeight: 21 },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  progressLabel: { fontSize: 10, letterSpacing: 0.5 },
  progressBar: { width: 96, height: 6, borderRadius: 999, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 999 },
  earned: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 4, paddingHorizontal: 8, borderRadius: 4 },
  earnedText: { fontSize: 12, fontWeight: '500' },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    height: 36,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginLeft: 'auto',
  },
  buttonText: { fontSize: 14, fontWeight: '700' },
})
