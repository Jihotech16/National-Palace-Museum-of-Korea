import { useCallback, useEffect, useRef, useState } from 'react'
import { View, Text, Pressable, ScrollView, StyleSheet, RefreshControl } from 'react-native'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import Icon from '../../components/Icon'
import TeacherShell, { TeacherLoading } from '../../components/teacher/TeacherShell'
import { useTeacher } from '../../components/teacher/TeacherContext'
import { t } from '../../components/teacher/theme'
import { getStudentsProgress } from '@shared/firebase/firestore'
import heroImage from '@shared/image/조선국왕실.jpg'

// 선생님 대시보드 (웹 TeacherPage.jsx)
export default function TeacherDashboard() {
  return (
    <TeacherShell title="선생님 대시보드" active="home">
      {(teacher) => <Dashboard teacher={teacher} />}
    </TeacherShell>
  )
}

function Dashboard({ teacher }) {
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [stats, setStats] = useState({ students: 0, average: 0, completed: 0, increase: 0 })
  const prevCompleted = useRef(0)
  const { schoolCode, grade, classNum } = teacher

  const load = useCallback(async () => {
    try {
      const r = await getStudentsProgress(schoolCode, grade, classNum)
      if (r.success) {
        // 모두 탐험한 학생 = 진행률 100%
        const completed = Object.values(r.progress).filter((p) => p.progress >= 100).length
        setStats({ students: r.totalStudents, average: r.averageProgress, completed, increase: completed - prevCompleted.current })
        prevCompleted.current = completed
      }
    } catch (e) {
      console.error('학생 데이터 로드 오류:', e)
    }
    setLoading(false)
  }, [schoolCode, grade, classNum])

  // 처음 한 번 + 30초마다 새로 불러오기
  useEffect(() => {
    load()
    const timer = setInterval(load, 30000)
    return () => clearInterval(timer)
  }, [load])

  const onRefresh = async () => {
    setRefreshing(true)
    await load()
    setRefreshing(false)
  }

  if (loading) return <TeacherLoading />

  const helpRequests = 0 // 도움 요청은 웹도 아직 0 (추후 구현)

  return (
    <ScrollView
      contentContainerStyle={styles.main}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={t.muted} />}
    >
      <View style={styles.welcome}>
        <Text style={styles.welcomeTitle}>
          안녕하세요,{'\n'}
          <Text style={{ color: t.primary }}>선생님!</Text> 👋
        </Text>
        <Text style={styles.welcomeSub}>오늘도 학생들과 즐거운 박물관 탐험 되세요.</Text>
      </View>

      <Pressable
        style={({ pressed }) => [styles.activity, pressed && { opacity: 0.92 }]}
        onPress={() => router.push('/teacher/class')}
        accessibilityRole="button"
      >
        <Image source={heroImage} style={[StyleSheet.absoluteFill, { opacity: 0.4 }]} contentFit="cover" />
        <LinearGradient
          colors={['rgba(127,19,236,0.9)', 'rgba(127,19,236,0.4)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.activityContent}>
          <View style={styles.activityHeader}>
            <View style={{ flex: 1 }}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>진행 중</Text>
              </View>
              <Text style={styles.activityTitle}>박물관 탐험</Text>
              <Text style={styles.activitySub}>{teacher.label} • 현장학습</Text>
            </View>
            <View style={styles.activityIcon}>
              <Icon name="museum" size={24} color="#fff" />
            </View>
          </View>
          <View style={styles.divider} />
          <View style={{ flexDirection: 'row', gap: 24 }}>
            <Stat label="참여 학생" value={stats.students} unit="명" />
            <Stat label="평균 진행률" value={stats.average} unit="%" />
          </View>
        </View>
      </Pressable>

      <View style={styles.grid}>
        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <Icon name="check_circle" size={16} color={t.green} />
            <Text style={styles.statLabel}>모두 탐험한 학생</Text>
          </View>
          <View style={styles.statContent}>
            <Text style={styles.statValue}>{stats.completed}</Text>
            {stats.increase > 0 && <Text style={styles.greenBadge}>+{stats.increase}명 증가</Text>}
            {stats.increase === 0 && stats.completed > 0 && <Text style={styles.greenBadge}>완료</Text>}
          </View>
        </View>
        <View style={[styles.statCard, styles.helpCard]}>
          <View style={styles.statHeader}>
            <Icon name="notifications_active" size={16} color={t.danger} />
            <Text style={[styles.statLabel, { color: t.danger }]}>도움 요청</Text>
          </View>
          <View style={styles.statContent}>
            <Text style={[styles.statValue, { color: t.danger }]}>
              {helpRequests}
              <Text style={styles.statUnit}>건</Text>
            </Text>
            <Icon name="arrow_forward" size={20} color="rgba(239,68,68,0.4)" />
          </View>
        </View>
      </View>

      <View style={{ gap: 12 }}>
        <Text style={styles.featuresTitle}>주요 기능</Text>
        <Feature
          icon="monitoring"
          color={t.primary}
          bg="rgba(127,19,236,0.1)"
          title="학생 진도 상세 확인"
          subtitle="학생별 위치 및 문제 해결 현황"
          onPress={() => router.push('/teacher/class')}
        />
        <Feature
          icon="quiz"
          color="#3b82f6"
          bg="rgba(59,130,246,0.1)"
          title="문제 및 정답 관리"
          subtitle="미스터리 문제 수정 및 힌트 설정"
          onPress={() => router.push('/teacher/questions')}
        />
      </View>
    </ScrollView>
  )
}

function Stat({ label, value, unit }) {
  return (
    <View>
      <Text style={styles.statLabelWhite}>{label}</Text>
      <Text style={styles.activityValue}>
        {value}
        <Text style={styles.activityUnit}> {unit}</Text>
      </Text>
    </View>
  )
}

function Feature({ icon, color, bg, title, subtitle, onPress }) {
  return (
    <Pressable style={({ pressed }) => [styles.feature, pressed && { transform: [{ scale: 0.98 }] }]} onPress={onPress}>
      <View style={[styles.featureIcon, { backgroundColor: bg }]}>
        <Icon name={icon} size={24} color={color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureSub}>{subtitle}</Text>
      </View>
      <Icon name="chevron_right" size={24} color={t.gray} />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  main: { padding: 16, gap: 24, paddingBottom: 32 },
  welcome: { gap: 4, marginTop: 8 },
  welcomeTitle: { color: '#fff', fontSize: 24, fontWeight: '700', lineHeight: 30 },
  welcomeSub: { color: t.muted, fontSize: 14 },
  activity: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: t.surface,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  },
  activityContent: { padding: 20, gap: 16 },
  activityHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: 8,
  },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '500' },
  activityTitle: { color: '#fff', fontSize: 20, fontWeight: '700' },
  activitySub: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginTop: 2 },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
  statLabelWhite: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: 4 },
  activityValue: { color: '#fff', fontSize: 24, fontWeight: '700' },
  activityUnit: { color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: '400' },
  grid: { flexDirection: 'row', gap: 16 },
  statCard: {
    flex: 1,
    height: 112,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: t.border,
    backgroundColor: t.surface,
    padding: 16,
    justifyContent: 'space-between',
  },
  helpCard: { borderColor: 'rgba(239,68,68,0.3)', backgroundColor: 'rgba(239,68,68,0.1)' },
  statHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statLabel: { color: t.muted, fontSize: 12, fontWeight: '700' },
  statContent: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  statValue: { color: '#fff', fontSize: 30, fontWeight: '700' },
  statUnit: { fontSize: 18, fontWeight: '400' },
  greenBadge: {
    color: t.green,
    backgroundColor: 'rgba(16,185,129,0.1)',
    fontSize: 12,
    fontWeight: '500',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: 'hidden',
    marginBottom: 6,
  },
  featuresTitle: { color: t.muted, fontSize: 14, fontWeight: '700', paddingHorizontal: 4 },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: t.border,
    backgroundColor: t.surface,
  },
  featureIcon: { width: 48, height: 48, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  featureTitle: { color: '#fff', fontSize: 16, fontWeight: '700' },
  featureSub: { color: t.muted, fontSize: 12, marginTop: 2 },
})
