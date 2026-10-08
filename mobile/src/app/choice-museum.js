import { useEffect, useState } from 'react'
import { View, Text, Pressable, ScrollView, StyleSheet, ActivityIndicator } from 'react-native'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import Screen from '../components/Screen'
import Icon from '../components/Icon'
import RequireAuth from '../components/RequireAuth'
import { gold } from '../theme/colors'
import { logout } from '@shared/firebase/auth'
import { getStudentProfile, getMuseumPeriods, isMuseumOpen, periodOf, formatKoreanDateTime } from '../lib/data'
import palaceImage from '@shared/image/NationalPalaceMuseum/국립고궁박물관.jpg'
import seoulImage from '@shared/image/SeoulHistoryMuseum/서울역사박물관.jpeg'

// 고를 수 있는 박물관 두 곳
const MUSEUMS = [
  {
    id: 'palace',
    route: '/palace',
    image: palaceImage,
    label: 'National Palace Museum',
    name: '국립고궁박물관',
    icon: 'explore',
    desc: '조선 왕실의 역사와 문화를 탐험해보세요. 왕의 생활부터 궁중 음악까지 다양한 미션이 기다립니다.',
  },
  {
    id: 'seoul',
    route: '/seoul',
    image: seoulImage,
    label: 'Seoul Museum of History',
    name: '서울역사박물관',
    icon: 'history_edu',
    desc: '서울의 유구한 역사와 도시의 변화를 느껴보세요. 과거와 현재가 공존하는 특별한 공간입니다.',
  },
]

// 곧 추가될 박물관 (웹과 같은 사진)
const COMING_SOON = [
  {
    name: '국립중앙박물관',
    uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTLQfE9xD4mlN8A_HcquDgaXIS1VtkQ_T76D95eM6jsEOTsso5oMifQLCozCRPT4GYzYobjJxhWSS81UwfsoyA3GxQz69oR60xG9MXmK5JsSnDYQyrTFrHjeU14Xxneu8O3goqNKiqkk9uZmircLOQ-DJCq5ggDWZw7O1Np_kdSMBqLQCWJBRAp7FXUmSj3P9ur3ENcFCcYDdmy17uMZKUVBtOZO9-fM29ukdjSJjGYp9kd_l49JPKpeLDd5y37WPzZZ0yseG2tTVu',
  },
  {
    name: '전쟁기념관',
    uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCyv1jIobAtLc84nsXNRs2O6Y1A6fGkekzsfgagKiYQGlk_PFe5ge1GVZyezAz5mHXSjTW_gytPvfgXIS33xgWl-ERJqrX8ZN3KFNwCUM-kztWZ2u7EOAvbnsMDuPrzDNtgk2N7ZyVAK4oMDDbeBBgelZlxOzn9B4CeNWk6_rLjqv5_CQ6LJx8iJf7BlUaGEhnjOfR6b0KalQApK9yzgOETL7tSnPFHGGKDwNYuE7QwJAwzEqD306ZWUigUkVUa9FRSYDVaGh5k0nNH',
  },
]

// 박물관 선택 화면 (웹 ChoiceMuseum)
export default function ChoiceMuseumScreen() {
  return <RequireAuth>{(user) => <ChoiceMuseum user={user} />}</RequireAuth>
}

function ChoiceMuseum({ user }) {
  const [profile, setProfile] = useState(null)
  const [periods, setPeriods] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    ;(async () => {
      const p = await getStudentProfile(user)
      const pr = await getMuseumPeriods(p.schoolCode).catch(() => null)
      if (!alive) return
      setProfile(p)
      setPeriods(pr)
      setLoading(false)
    })()
    return () => {
      alive = false
    }
  }, [user])

  const handleLogout = async () => {
    await logout()
    router.replace('/')
  }

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={gold.accent} />
      </View>
    )
  }

  // "한빛초등학교 5학년 3반 1번"
  const infoText = [
    profile?.schoolName,
    profile?.grade ? `${profile.grade}학년` : '',
    profile?.classNum ? `${profile.classNum}반` : '',
    profile?.number ? `${profile.number}번` : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Screen bg={gold.bg}>
      {/* 위쪽 바: 제목과 로그아웃, 학생 정보 */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <View style={styles.headerIcon}>
              <Icon name="museum" size={24} color={gold.accent} />
            </View>
            <Text style={styles.headerTitle}>박물관 탐험</Text>
          </View>
          <Pressable onPress={handleLogout} hitSlop={8} style={styles.logout} accessibilityLabel="로그아웃">
            <Icon name="logout" size={24} color={gold.accent} />
          </Pressable>
        </View>
        {!!infoText && (
          <View style={styles.studentInfo}>
            <View style={styles.studentBadge}>
              <Icon name="school" size={18} color={gold.accent} />
              <Text style={styles.studentText} numberOfLines={1}>
                {infoText}
              </Text>
            </View>
          </View>
        )}
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 32 }}>
        <Text style={styles.headline}>오늘의 탐험 장소를{'\n'}선택해주세요.</Text>

        <View style={styles.cards}>
          {MUSEUMS.map((m) => (
            <MuseumCard key={m.id} museum={m} periods={periods} />
          ))}
        </View>

        {/* 곧 추가될 박물관 */}
        <View style={styles.soon}>
          <View style={styles.soonHeader}>
            <Text style={styles.soonTitle}>곧 추가될 박물관</Text>
            <Icon name="more_horiz" size={24} color="rgba(255,255,255,0.3)" />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.soonRow}>
            {COMING_SOON.map((c) => (
              <View key={c.name} style={styles.soonCard}>
                <View style={styles.soonImage}>
                  <Image source={{ uri: c.uri }} style={[StyleSheet.absoluteFill, { opacity: 0.3 }]} contentFit="cover" />
                  <View style={styles.soonOverlay}>
                    <View style={styles.soonLock}>
                      <Icon name="lock" size={24} color="rgba(255,255,255,0.6)" />
                    </View>
                    <Text style={styles.soonText}>오픈 예정</Text>
                  </View>
                </View>
                <Text style={styles.soonName}>{c.name}</Text>
              </View>
            ))}
            <View style={styles.soonCard}>
              <LinearGradient
                colors={['rgba(255,255,255,0.05)', 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.soonImage, styles.soonPlaceholder]}
              >
                <Icon name="add_circle" size={48} color="rgba(255,255,255,0.2)" />
              </LinearGradient>
              <Text style={[styles.soonName, { color: 'rgba(255,255,255,0.4)' }]}>Coming Soon</Text>
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </Screen>
  )
}

function MuseumCard({ museum, periods }) {
  const open = isMuseumOpen(periods, museum.id)
  const period = periodOf(periods, museum.id)

  // 기간이 없을 때 안내 문구 (서울은 고궁과 따로 저장해야 함)
  let error = null
  if (!open) {
    if (period) error = '현재 설정된 활동 기간이 아닙니다.'
    else if (museum.id === 'seoul' && periodOf(periods, 'palace'))
      error = '서울역사박물관은 관리자에서 고궁과 별도로 활동 기간을 저장해야 합니다.'
    else if (museum.id === 'seoul') error = '활동 기간이 설정되지 않았습니다.'
  }

  return (
    <View style={[styles.card, !open && { opacity: 0.8 }]}>
      <View style={styles.cardImage}>
        <Image source={museum.image} style={StyleSheet.absoluteFill} contentFit="cover" />
        <LinearGradient
          colors={['transparent', 'rgba(34,29,16,0.95)']}
          style={[StyleSheet.absoluteFill, { opacity: 0.9 }]}
        />
        <View style={[styles.badge, { backgroundColor: open ? gold.accent : 'rgba(239,68,68,0.9)' }]}>
          <Text style={styles.badgeText}>{open ? '이용 가능' : '이용 불가'}</Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.cardHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardLabel}>{museum.label.toUpperCase()}</Text>
            <Text style={styles.cardTitle}>{museum.name}</Text>
          </View>
          <View style={styles.cardIcon}>
            <Icon name={museum.icon} size={20} color={gold.accent} />
          </View>
        </View>

        <Text style={styles.cardDesc} numberOfLines={2}>
          {museum.desc}
        </Text>

        {period && (
          <View style={{ gap: 8, marginTop: 8 }}>
            <LinearGradient
              colors={['rgba(236,182,19,0.15)', 'rgba(236,182,19,0.05)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.periodStart}
            >
              <Icon name="play_circle" size={18} color={gold.accent} />
              <Text style={styles.periodStartText}>
                <Text style={{ color: gold.accent, fontWeight: '700' }}>{formatKoreanDateTime(period.startDate)}</Text>
                부터 시작
              </Text>
            </LinearGradient>
            <View style={styles.periodEnd}>
              <Icon name="stop_circle" size={16} color="#9ca3af" />
              <Text style={styles.periodEndText}>{formatKoreanDateTime(period.endDate)}까지</Text>
            </View>
          </View>
        )}

        {error && (
          <View style={styles.error}>
            <Icon name="error" size={16} color="#fca5a5" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <Pressable
          disabled={!open}
          onPress={() => router.push(museum.route)}
          style={({ pressed }) => [
            styles.button,
            open
              ? { backgroundColor: pressed ? gold.accentDark : gold.accent, shadowColor: gold.accent, shadowOpacity: 0.25, shadowRadius: 12, shadowOffset: { width: 0, height: 8 } }
              : { backgroundColor: '#4b5563', opacity: 0.6 },
            open && pressed && { transform: [{ scale: 0.98 }] },
          ]}
        >
          <Text style={[styles.buttonText, { color: open ? gold.bg : '#9ca3af' }]}>
            {open ? '탐험 시작하기' : '활동 기간이 아닙니다'}
          </Text>
          <Icon name={open ? 'arrow_forward' : 'lock'} size={18} color={open ? gold.bg : '#9ca3af'} />
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: gold.bg },
  header: { backgroundColor: gold.bg, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(236,182,19,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '700', letterSpacing: -0.3 },
  logout: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  studentInfo: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 16 },
  studentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  studentText: { color: gold.accent, fontSize: 14, fontWeight: '500', flexShrink: 1 },
  headline: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 31,
    letterSpacing: -0.5,
    padding: 16,
  },
  cards: { gap: 24, paddingHorizontal: 16, paddingBottom: 32 },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(34,29,16,0.8)',
    borderWidth: 1,
    borderColor: 'rgba(236,182,19,0.2)',
  },
  cardImage: { height: 192, width: '100%' },
  badge: { position: 'absolute', top: 12, left: 12, paddingVertical: 4, paddingHorizontal: 10, borderRadius: 8 },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  cardBody: { gap: 12, padding: 20, paddingTop: 8, marginTop: -16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardLabel: { color: gold.accent, fontSize: 12, fontWeight: '700', letterSpacing: 0.6, marginBottom: 4 },
  cardTitle: { color: '#fff', fontSize: 20, fontWeight: '700', lineHeight: 24, letterSpacing: -0.4 },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(236,182,19,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardDesc: { color: '#94a3b8', fontSize: 14, lineHeight: 22 },
  periodStart: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(236,182,19,0.3)',
  },
  periodStartText: { color: '#fff', fontSize: 14, fontWeight: '500', flexShrink: 1 },
  periodEnd: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  periodEndText: { color: '#d1d5db', fontSize: 13, flexShrink: 1 },
  error: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    padding: 8,
    borderRadius: 6,
    backgroundColor: 'rgba(239,68,68,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
  },
  errorText: { color: '#fca5a5', fontSize: 13, flexShrink: 1 },
  button: {
    marginTop: 8,
    height: 48,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: { fontSize: 14, fontWeight: '700' },
  soon: { gap: 12, paddingHorizontal: 16, paddingBottom: 16 },
  soonHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  soonTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  soonRow: { gap: 16, paddingBottom: 16 },
  soonCard: { width: 160 },
  soonImage: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#2a2a2a',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  soonOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  soonLock: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  soonText: { color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: '700' },
  soonPlaceholder: { alignItems: 'center', justifyContent: 'center' },
  soonName: { marginTop: 8, color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: '500' },
})
