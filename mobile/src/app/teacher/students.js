import { useCallback, useEffect, useMemo, useState } from 'react'
import { View, Text, Pressable, FlatList, ScrollView, StyleSheet, RefreshControl, useWindowDimensions } from 'react-native'
import { router } from 'expo-router'
import Icon from '../../components/Icon'
import TeacherShell, { TeacherLoading } from '../../components/teacher/TeacherShell'
import ProgressRing from '../../components/teacher/ProgressRing'
import { t } from '../../components/teacher/theme'
import { MUSEUM_NAMES } from '../../components/teacher/halls'
import { useTeacher } from '../../components/teacher/TeacherContext'
import { getClassStudentsWithProgress } from '../../lib/teacherData'

// 학생별 학습 현황 (웹 TeacherDetail.jsx)
export default function TeacherStudentsScreen() {
  const { teacher } = useTeacher()
  return (
    <TeacherShell
      title={`${teacher?.label || ''} 학습 현황`}
      active="students"
      overlay={
        <View style={styles.fabWrap} pointerEvents="box-none">
          <Pressable
            style={({ pressed }) => [styles.fab, pressed && { opacity: 0.9 }]}
            onPress={() => router.push('/teacher/messages/compose')}
          >
            <Icon name="send" size={20} color="#fff" />
            <Text style={styles.fabText}>전체 메시지</Text>
          </Pressable>
        </View>
      }
    >
      {(tc) => <Students teacher={tc} />}
    </TeacherShell>
  )
}

// 진행률에 따른 색 (웹 getProgressColor 등)
const ringColor = (p) => (p < 30 ? t.danger : t.primary)
const ringTrack = (p) => (p < 30 ? '#3f1818' : '#4c1d95')
const textColor = (p) => (p >= 100 ? t.primary : p < 30 ? t.danger : t.gray)

function Students({ teacher }) {
  const { schoolCode, grade, classNum } = teacher
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [students, setStudents] = useState([])
  const [average, setAverage] = useState(0)
  const [sortOrder, setSortOrder] = useState('number')
  const [filter, setFilter] = useState('all') // 'all', 'low', 'completed', 'inProgress'
  const [museum, setMuseum] = useState('all') // 'all', 'palace', 'seoul'
  const { width } = useWindowDimensions()
  const cardWidth = Math.floor((Math.min(width, 480) - 32 - 36) / 4) // 한 줄에 4명

  const load = useCallback(async () => {
    try {
      const r = await getClassStudentsWithProgress({ schoolCode, grade, classNum })
      if (r.success) {
        setStudents(r.students)
        setAverage(r.averageProgress)
      }
    } catch (e) {
      console.error('학생 데이터 로드 오류:', e)
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

  // 박물관 선택에 맞는 진행률
  const withDisplay = useMemo(
    () =>
      students.map((s) => ({
        ...s,
        displayProgress: (museum === 'palace' ? s.palaceProgress : museum === 'seoul' ? s.seoulProgress : s.progress) || 0,
      })),
    [students, museum]
  )

  const completedCount = withDisplay.filter((s) => s.displayProgress >= 100).length
  const inProgressCount = withDisplay.filter((s) => s.displayProgress > 0 && s.displayProgress < 100).length

  const list = useMemo(() => {
    let out = withDisplay
    if (filter === 'low') out = out.filter((s) => s.displayProgress < 50)
    else if (filter === 'completed') out = out.filter((s) => s.displayProgress >= 100)
    else if (filter === 'inProgress') out = out.filter((s) => s.displayProgress > 0 && s.displayProgress < 100)
    out = [...out]
    if (sortOrder === 'number') out.sort((a, b) => a.number - b.number)
    return out
  }, [withDisplay, filter, sortOrder])

  if (loading) return <TeacherLoading />

  // 같은 필터를 다시 누르면 해제
  const toggleFilter = (f) => setFilter(filter === f ? 'all' : f)

  const header = (
    <View>
      <View style={styles.stats}>
        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <Icon name="groups" size={20} color={t.muted} />
          </View>
          <Text style={styles.statValue}>
            {students.length}
            <Text style={styles.statUnit}> 명</Text>
          </Text>
          <Text style={styles.statLabel}>전체 학생</Text>
        </View>
        <View style={[styles.statCard, { borderColor: 'rgba(127,19,236,0.3)', overflow: 'hidden' }]}>
          <View style={styles.statCorner} />
          <View style={[styles.statIcon, { backgroundColor: 'rgba(127,19,236,0.1)' }]}>
            <Icon name="avg_pace" size={20} color={t.primary} />
          </View>
          <Text style={[styles.statValue, { color: t.primary }]}>
            {average}
            <Text style={[styles.statUnit, { color: 'rgba(127,19,236,0.7)' }]}> %</Text>
          </Text>
          <Text style={styles.statLabel}>평균 진도율</Text>
        </View>
      </View>

      <View style={styles.filters}>
        <View style={styles.filtersHeader}>
          <View style={styles.filtersTitleRow}>
            <Text style={styles.filtersTitle}>{museum === 'all' ? '전체' : MUSEUM_NAMES[museum]} 학생별 진도율</Text>
            {museum !== 'all' && (
              <Pressable onPress={() => setMuseum('all')} hitSlop={8} accessibilityLabel="박물관 선택 해제">
                <Icon name="close" size={20} color={t.muted} />
              </Pressable>
            )}
          </View>
          <Pressable style={styles.sortBtn} onPress={() => setSortOrder('number')} hitSlop={8}>
            <Icon name="sort" size={16} color={t.primary} />
            <Text style={styles.sortText}>번호순</Text>
          </Pressable>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 8 }}>
          {museum === 'all' && (
            <>
              <Chip icon="museum" label="국립고궁박물관" onPress={() => setMuseum('palace')} />
              <Chip icon="location_city" label="서울역사박물관" onPress={() => setMuseum('seoul')} />
            </>
          )}
          <Chip icon="warning" label="진도율 낮은순" active={filter === 'low'} onPress={() => toggleFilter('low')} />
          <Chip
            icon="check_circle"
            label={`완료됨 (${completedCount})`}
            active={filter === 'completed'}
            onPress={() => toggleFilter('completed')}
          />
          <Chip
            icon="hourglass_top"
            label={`진행중 (${inProgressCount})`}
            active={filter === 'inProgress'}
            onPress={() => toggleFilter('inProgress')}
          />
        </ScrollView>
      </View>
    </View>
  )

  return (
    <FlatList
      data={list}
      keyExtractor={(s) => s.studentId}
      numColumns={4}
      ListHeaderComponent={header}
      ListEmptyComponent={<Text style={styles.empty}>해당하는 학생이 없습니다.</Text>}
      contentContainerStyle={styles.main}
      columnWrapperStyle={{ gap: 12 }}
      ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={t.muted} />}
      renderItem={({ item }) => <StudentCard student={item} width={cardWidth} />}
    />
  )
}

function Chip({ icon, label, active, onPress }) {
  return (
    <Pressable style={[styles.chip, active && styles.chipActive]} onPress={onPress}>
      <Icon name={icon} size={18} color={active ? '#fff' : t.muted} />
      <Text style={[styles.chipText, active && { color: '#fff' }]}>{label}</Text>
    </Pressable>
  )
}

function StudentCard({ student, width }) {
  const p = student.displayProgress
  const completed = p >= 100
  const exploring = !!student.isExploring
  return (
    <View
      style={[
        styles.card,
        { width },
        p < 30 && { borderColor: 'rgba(239,68,68,0.5)' },
        completed && { borderColor: 'rgba(127,19,236,0.3)' },
        exploring && { borderColor: 'rgba(34,197,94,0.5)' },
      ]}
      accessibilityLabel={`${student.number}번 ${student.name || ''} 진도율 ${p}%`}
    >
      <ProgressRing size={56} thickness={4} progress={p} color={ringColor(p)} track={ringTrack(p)} inner={t.surface}>
        <Text style={[styles.number, { color: textColor(p) }]}>{String(student.number).padStart(2, '0')}</Text>
      </ProgressRing>
      <Text style={[styles.pct, { color: textColor(p), fontWeight: p >= 30 && p < 100 ? '500' : '700' }]}>{p}%</Text>
      {exploring && (
        <View style={styles.exploring}>
          <Icon name="explore" size={12} color={t.exploring} />
          <Text style={styles.exploringText}>탐험 중</Text>
        </View>
      )}
      {completed && !exploring && (
        <View style={styles.check}>
          <Icon name="check_circle" size={16} color={t.primary} />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  main: { padding: 16, paddingBottom: 96 },
  stats: { flexDirection: 'row', gap: 12, paddingTop: 8, paddingBottom: 8 },
  statCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: t.surface,
    borderWidth: 1,
    borderColor: t.border,
  },
  statCorner: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 64,
    height: 64,
    backgroundColor: 'rgba(127,19,236,0.1)',
    borderBottomLeftRadius: 64,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: t.dark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: { color: '#fff', fontSize: 30, fontWeight: '700', letterSpacing: -0.5 },
  statUnit: { color: t.muted, fontSize: 16, fontWeight: '400' },
  statLabel: { color: t.muted, fontSize: 12, fontWeight: '500', marginTop: 4 },
  filters: { paddingTop: 16, paddingBottom: 8 },
  filtersHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  filtersTitleRow: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  filtersTitle: { color: '#fff', fontSize: 16, fontWeight: '700', flexShrink: 1 },
  sortBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  sortText: { color: t.primary, fontSize: 12, fontWeight: '700' },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 32,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: t.dark,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  chipActive: { backgroundColor: t.primary, borderColor: t.primary },
  chipText: { color: t.muted, fontSize: 12, fontWeight: '700' },
  card: {
    aspectRatio: 4 / 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: t.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: t.border,
    overflow: 'hidden',
  },
  number: { fontSize: 18, fontWeight: '700' },
  pct: { fontSize: 12, marginTop: 8 },
  check: { position: 'absolute', top: 4, right: 4 },
  exploring: {
    position: 'absolute',
    top: 4,
    right: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 5,
    paddingVertical: 2,
    backgroundColor: 'rgba(34,197,94,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.5)',
    borderRadius: 999,
  },
  exploringText: { color: t.exploring, fontSize: 9, fontWeight: '700' },
  empty: { color: t.muted, fontSize: 14, textAlign: 'center', paddingVertical: 32 },
  fabWrap: { position: 'absolute', right: 16, bottom: 16 },
  fab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: t.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 999,
    shadowColor: t.primary,
    shadowOpacity: 0.5,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
  },
  fabText: { color: '#fff', fontSize: 16, fontWeight: '700' },
})
