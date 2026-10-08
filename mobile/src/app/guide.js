import { View, Text, Pressable, ScrollView, Linking, Platform, Alert, StyleSheet } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { StatusBar } from 'expo-status-bar'
import { router } from 'expo-router'
import AppHeader, { HeaderIconButton } from '../components/AppHeader'
import Icon from '../components/Icon'
import { useAuth, isStudent } from '../lib/AuthContext'

const EMAIL = 'jihotech16@outlook.kr'
const HERO = 'https://images.unsplash.com/photo-1545167622-3a6ac756afa4?q=80&w=1000&auto=format&fit=crop'

const STEPS = [
  { icon: 'museum', title: '박물관 탐험', text: '국립고궁박물관의 전시실을 돌아다니며 앱에서 지정한 유물을 찾아보세요.' },
  { icon: 'search', title: '단서 찾기', text: '유물 주변에 숨겨진 QR코드나 이미지 마커를 스캔하여 단서를 획득하세요.' },
  { icon: 'extension', title: '문제 해결', text: '획득한 단서를 조합하여 퀴즈를 풀고 다음 스테이지 잠금을 해제하세요.' },
]

// 이용안내 (웹 UserGuide). 박물관 첫 화면의 '이용안내'에서 들어옴
export default function GuideScreen() {
  const insets = useSafeAreaInsets()
  const { user } = useAuth()

  const handleBack = () => (router.canGoBack() ? router.back() : router.replace('/'))

  // 웹은 클립보드 복사, 앱은 메일 앱 열기 (주소는 길게 눌러 복사 가능)
  const handleEmail = async () => {
    if (Platform.OS === 'web') {
      try {
        await navigator.clipboard.writeText(EMAIL)
        window.alert('이메일이 복사되었습니다.')
      } catch {
        window.alert(EMAIL)
      }
      return
    }
    try {
      await Linking.openURL(`mailto:${EMAIL}`)
    } catch {
      Alert.alert('메일 앱을 열 수 없어요', `${EMAIL} 로 메일을 보내 주세요.`)
    }
  }

  const handleStart = () => (isStudent(user) ? router.replace('/choice-museum') : router.push('/login'))

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <SafeAreaView edges={['top']} style={styles.headerWrap}>
        <AppHeader
          title="이용안내"
          onBack={handleBack}
          color="#f3e8ff"
          titleColor="#f3e8ff"
          borderColor="#362447"
          right={<HeaderIconButton icon="close" color="#f3e8ff" label="닫기" onPress={() => router.dismissTo('/')} />}
        />
      </SafeAreaView>

      <ScrollView contentContainerStyle={[styles.main, { paddingBottom: 110 + insets.bottom }]} showsVerticalScrollIndicator={false}>
        {/* 상단 배너 */}
        <LinearGradient colors={['#7f13ec', '#581c87']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.hero}>
          <Image source={{ uri: HERO }} style={[StyleSheet.absoluteFill, { opacity: 0.25 }]} contentFit="cover" />
          <Text style={styles.heroKicker}>NATIONAL PALACE MUSEUM</Text>
          <Text style={styles.heroTitle}>박물관 탐험 가이드</Text>
        </LinearGradient>

        {/* 학교 단체 관람 공지 */}
        <View style={styles.notice}>
          <View style={styles.noticeGlow} />
          <View style={styles.noticeRow}>
            <View style={styles.warnIcon}>
              <Icon name="warning" size={24} color="#f59e0b" />
            </View>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={styles.noticeTitle}>학교 단체 관람 필수 공지</Text>
              <Text style={styles.noticeText}>학교에서 사용을 시작하기 전에 원활한 진행을 위해 반드시 아래 메일로 사전 문의해 주세요.</Text>
            </View>
          </View>
          <View style={styles.emailBox}>
            <Text style={styles.email} selectable numberOfLines={1}>
              {EMAIL}
            </Text>
            <Pressable
              onPress={handleEmail}
              accessibilityRole="button"
              style={({ pressed }) => [styles.copyBtn, pressed && { transform: [{ scale: 0.95 }], opacity: 0.9 }]}
            >
              <Icon name={Platform.OS === 'web' ? 'content_copy' : 'mail_outline'} size={16} color="#fff" />
              <Text style={styles.copyText}>{Platform.OS === 'web' ? '복사' : '메일 보내기'}</Text>
            </Pressable>
          </View>
        </View>

        {/* 탐험 방법 */}
        <View style={styles.sectionHead}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.sectionBar} />
            <Text style={styles.sectionTitle}>탐험 방법</Text>
          </View>
          <Text style={styles.sectionDesc}>박물관 곳곳에 숨겨진 단서를 찾아 미션을 완료하세요.</Text>
        </View>

        <View style={styles.timeline}>
          <View style={styles.timelineLine} />
          {STEPS.map((s, i) => (
            <View key={s.title} style={styles.step}>
              <View style={styles.stepIconCol}>
                <View style={styles.stepIcon}>
                  <Icon name={s.icon} size={20} color="#7f13ec" />
                </View>
              </View>
              <View style={styles.stepCard}>
                <Text style={styles.stepBadge}>STEP {i + 1}</Text>
                <Text style={styles.stepTitle}>{s.title}</Text>
                <Text style={styles.stepText}>{s.text}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* 아래 고정 버튼 */}
      <LinearGradient
        colors={['rgba(25,16,34,0)', '#191022']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.45 }}
        style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 14) }]}
        pointerEvents="box-none"
      >
        <Pressable
          onPress={handleStart}
          accessibilityRole="button"
          style={({ pressed }) => [styles.startBtn, pressed && { transform: [{ scale: 0.98 }], opacity: 0.9 }]}
        >
          <Text style={styles.startText}>탐험 시작하기</Text>
          <Icon name="arrow_forward" size={20} color="#fff" />
        </Pressable>
      </LinearGradient>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#191022' },
  headerWrap: { backgroundColor: 'rgba(15,7,22,0.95)' },
  main: { paddingHorizontal: 14, paddingTop: 15 },
  hero: { height: 128, borderRadius: 16, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', marginBottom: 32 },
  heroKicker: { color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: '500', letterSpacing: 0.7, marginBottom: 4 },
  heroTitle: { color: '#fff', fontSize: 24, fontWeight: '700' },
  notice: {
    backgroundColor: '#2d1f3f',
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#fbbf24',
    padding: 17.5,
    gap: 16,
    overflow: 'hidden',
    marginBottom: 32,
    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
  },
  noticeGlow: {
    position: 'absolute',
    top: -16,
    right: -16,
    width: 96,
    height: 96,
    borderRadius: 48,
    experimental_backgroundImage: 'radial-gradient(circle, rgba(127,19,236,0.2) 0%, transparent 70%)',
  },
  noticeRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  warnIcon: { marginTop: 2, padding: 6, borderRadius: 9999, backgroundColor: 'rgba(245,158,11,0.1)' },
  noticeTitle: { color: '#fff', fontSize: 16, fontWeight: '700' },
  noticeText: { color: '#cbd5e1', fontSize: 14, lineHeight: 22.75 },
  emailBox: {
    flexDirection: 'column',
    gap: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    padding: 10.5,
  },
  email: {
    color: '#e2e8f0',
    fontSize: 14,
    fontWeight: '500',
    paddingLeft: 4,
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#7f13ec',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    boxShadow: '0 4px 6px -1px rgba(127,19,236,0.2)',
  },
  copyText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  sectionHead: { marginTop: 16, marginBottom: 16 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 4, marginBottom: 7 },
  sectionBar: { width: 4, height: 24, borderRadius: 2, backgroundColor: '#7f13ec' },
  sectionTitle: { color: '#fff', fontSize: 20, fontWeight: '700' },
  sectionDesc: { color: '#94a3b8', fontSize: 14, paddingHorizontal: 4 },
  timeline: { paddingHorizontal: 8 },
  timelineLine: { position: 'absolute', left: 34, top: 16, bottom: 16, width: 2, backgroundColor: 'rgba(255,255,255,0.1)' },
  step: { flexDirection: 'row', gap: 16, marginBottom: 32 },
  stepIconCol: { width: 48, alignItems: 'center', paddingTop: 4 },
  stepIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#7f13ec',
    backgroundColor: '#2d1f3f',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCard: {
    flex: 1,
    backgroundColor: '#2d1f3f',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 14,
  },
  stepBadge: {
    alignSelf: 'flex-start',
    color: '#7f13ec',
    backgroundColor: 'rgba(127,19,236,0.1)',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  stepTitle: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 4 },
  stepText: { color: '#94a3b8', fontSize: 14, lineHeight: 22.75 },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingTop: 28, paddingHorizontal: 14 },
  startBtn: {
    height: 56,
    borderRadius: 16,
    backgroundColor: '#7f13ec',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    boxShadow: '0 10px 15px -3px rgba(127,19,236,0.3)',
  },
  startText: { color: '#fff', fontSize: 16, fontWeight: '700' },
})
