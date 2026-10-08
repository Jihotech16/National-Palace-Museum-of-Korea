import { useCallback, useEffect, useMemo, useState } from 'react'
import { View, Text, Pressable, FlatList, StyleSheet, RefreshControl } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Icon from '../../components/Icon'
import TeacherShell, { TeacherLoading } from '../../components/teacher/TeacherShell'
import { t, hallColors } from '../../components/teacher/theme'
import { MUSEUM_NAMES, hallIcon } from '../../components/teacher/halls'
import { useTeacher } from '../../components/teacher/TeacherContext'
import { getStudentsProgress, getHallProgress } from '@shared/firebase/firestore'

// 반 진도 현황 (웹 TeacherClass.jsx)
export default function TeacherClassScreen() {
  const { teacher } = useTeacher()
  return (
    <TeacherShell title={`${teacher?.label || ''} 진도 현황`} active="progress">
      {(tc) => <ClassProgress teacher={tc} />}
    </TeacherShell>
  )
}

const avg = (list, key) => (list.length ? Math.round(list.reduce((s, h) => s + h[key], 0) / list.length) : 0)
const sum = (list, key) => list.reduce((s, h) => s + h[key], 0)

function ClassProgress({ teacher }) {
  const { schoolCode, grade, classNum } = teacher
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [summary, setSummary] = useState({ average: 0, total: 0, completed: 0 })
  const [halls, setHalls] = useState([])
  const [museum, setMuseum] = useState(null) // null이면 박물관 목록, 값이 있으면 그 박물관의 전시관 목록

  const load = useCallback(async () => {
    try {
      const [progress, hallResult] = await Promise.all([
        getStudentsProgress(schoolCode, grade, classNum),
        getHallProgress(schoolCode, grade, classNum),
      ])
      if (progress.success) {
        const completed = Object.values(progress.progress).filter((p) => p.progress >= 100).length
        setSummary({ average: progress.averageProgress, total: progress.totalStudents, completed })
      }
      setHalls(hallResult.success ? hallResult.halls : [])
    } catch (e) {
      console.error('반 데이터 로드 오류:', e)
    }
    setLoading(false)
  }, [schoolCode, grade, classNum])

  useEffect(() => {
    load()
  }, [load])

  const onRefresh = async () => {
    setRefreshing(true)
    await load()
    setRefreshing(false)
  }

  // 박물관 카드 2개 또는 선택한 박물관의 전시관 카드들
  const cards = useMemo(() => {
    if (museum) {
      return halls
        .filter((h) => h.museum === museum)
        .map((h) => ({
          key: h.id,
          name: h.name,
          sub: `미션 ${h.missions}개 포함`,
          icon: hallIcon(h.icon),
          color: h.color,
          progress: h.progress,
          inProgress: h.inProgress,
          completed: h.completed,
        }))
    }
    return [
      ['palace', 'museum', 'orange'],
      ['seoul', 'location_city', 'blue'],
    ].map(([id, icon, color]) => {
      const list = halls.filter((h) => h.museum === id)
      return {
        key: id,
        museum: id,
        name: MUSEUM_NAMES[id],
        sub: `전시관 ${list.length}개`,
        icon,
        color,
        progress: avg(list, 'progress'),
        inProgress: sum(list, 'inProgress'),
        completed: sum(list, 'completed'),
      }
    })
  }, [halls, museum])

  if (loading) return <TeacherLoading />

  const header = (
    <View style={{ gap: 24, marginBottom: 16 }}>
      <LinearGradient colors={[t.primary, '#5b0ea8']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.summary}>
        <View style={[styles.blob, { right: -40, top: -40, width: 160, height: 160 }]} />
        <View style={[styles.blob, { left: -40, bottom: -40, width: 128, height: 128 }]} />
        <View style={styles.summaryHeader}>
          <View>
            <Text style={styles.summaryLabel}>우리 반 평균 달성률</Text>
            <Text style={styles.summaryValue}>{summary.average}%</Text>
          </View>
          <View style={styles.summaryIcon}>
            <Icon name="groups" size={24} color="#fff" />
          </View>
        </View>
        <View style={{ gap: 8 }}>
          <View style={styles.bar}>
            <View style={[styles.barFill, { width: `${summary.average}%` }]} />
          </View>
          <View style={styles.barStats}>
            <Text style={styles.barStatText}>전체 학생 {summary.total}명</Text>
            <Text style={styles.barStatText}>탐험 완료 {summary.completed}명</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.hallsHeader}>
        {museum ? (
          <Pressable style={styles.backRow} onPress={() => setMuseum(null)} hitSlop={8} accessibilityLabel="박물관 목록으로">
            <Icon name="arrow_back" size={24} color="#fff" />
            <Text style={[styles.hallsTitle, { flex: 1 }]}>{MUSEUM_NAMES[museum]} - 전시관별 완료 현황</Text>
          </Pressable>
        ) : (
          <>
            <Text style={styles.hallsTitle}>박물관별 완료 현황</Text>
            <Text style={styles.liveBadge}>실시간 집계중</Text>
          </>
        )}
      </View>
    </View>
  )

  return (
    <FlatList
      data={halls.length ? cards : []}
      keyExtractor={(c) => c.key}
      ListHeaderComponent={header}
      ListEmptyComponent={<TeacherLoading text="전시관 정보가 없습니다." />}
      contentContainerStyle={styles.main}
      ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={t.muted} />}
      renderItem={({ item }) => <HallCard item={item} onPress={item.museum ? () => setMuseum(item.museum) : undefined} />}
    />
  )
}

function HallCard({ item, onPress }) {
  const c = hallColors[item.color] || hallColors.orange
  return (
    <Pressable style={({ pressed }) => [styles.card, pressed && onPress && { borderColor: 'rgba(127,19,236,0.5)' }]} onPress={onPress} disabled={!onPress}>
      <View style={styles.cardHeader}>
        <View style={styles.cardInfo}>
          <View style={[styles.cardIcon, { backgroundColor: c.bg }]}>
            <Icon name={item.icon} size={24} color={c.fg} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardName}>{item.name}</Text>
            <Text style={styles.cardSub}>{item.sub}</Text>
          </View>
        </View>
        <Text style={styles.cardValue}>{item.progress}%</Text>
      </View>
      <View style={styles.cardBar}>
        <View style={[styles.cardBarFill, { width: `${item.progress}%`, backgroundColor: c.fg }]} />
      </View>
      <View style={styles.cardStats}>
        <Text style={styles.cardStatText}>진행중 {item.inProgress}명</Text>
        <Text style={styles.cardStatText}>완료 {item.completed}명</Text>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  main: { padding: 16, paddingBottom: 32 },
  summary: {
    borderRadius: 16,
    padding: 24,
    gap: 16,
    overflow: 'hidden',
    shadowColor: t.primary,
    shadowOpacity: 0.3,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  },
  blob: { position: 'absolute', borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.08)' },
  summaryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  summaryLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: '500', marginBottom: 4 },
  summaryValue: { color: '#fff', fontSize: 48, fontWeight: '700', letterSpacing: -1 },
  summaryIcon: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8, padding: 8 },
  bar: { height: 8, borderRadius: 999, backgroundColor: 'rgba(0,0,0,0.2)', overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 999, backgroundColor: '#fff' },
  barStats: { flexDirection: 'row', justifyContent: 'space-between' },
  barStatText: { color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: '500' },
  hallsHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 4 },
  backRow: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  hallsTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  liveBadge: {
    color: t.muted,
    fontSize: 12,
    fontWeight: '500',
    backgroundColor: t.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    overflow: 'hidden',
  },
  card: { backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, borderRadius: 12, padding: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  cardInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  cardIcon: { width: 40, height: 40, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  cardName: { color: '#fff', fontSize: 16, fontWeight: '700' },
  cardSub: { color: t.muted, fontSize: 12, marginTop: 2 },
  cardValue: { color: '#fff', fontSize: 18, fontWeight: '700', marginLeft: 8 },
  cardBar: { height: 8, borderRadius: 999, backgroundColor: '#111827', overflow: 'hidden', marginBottom: 8 },
  cardBarFill: { height: '100%', borderRadius: 999 },
  cardStats: { flexDirection: 'row', justifyContent: 'space-between' },
  cardStatText: { color: t.gray, fontSize: 12 },
})
