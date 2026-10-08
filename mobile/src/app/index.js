import { View, Text, Pressable, StyleSheet } from 'react-native'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { router, Redirect } from 'expo-router'
import Screen from '../components/Screen'
import Icon from '../components/Icon'
import { gold } from '../theme/colors'
import { useAuth, isStudent } from '../lib/AuthContext'
import heroImage from '@shared/image/조선국왕실.jpg'

// 첫 화면 (웹 MainPage)
export default function MainScreen() {
  const { user, loading } = useAuth()
  if (!loading && isStudent(user)) return <Redirect href="/choice-museum" />

  return (
    <View style={styles.root}>
      <Image source={heroImage} style={StyleSheet.absoluteFill} contentFit="cover" />
      <LinearGradient
        colors={['rgba(34,29,16,0.6)', 'rgba(34,29,16,0.85)', 'rgba(34,29,16,0.98)']}
        style={StyleSheet.absoluteFill}
      />
      <Screen bg="transparent">
        <View style={styles.top}>
          <View style={styles.iconBox}>
            <Icon name="explore" size={30} color={gold.accent} />
          </View>
          <Text style={styles.kicker}>DIGITAL HERITAGE</Text>
          <Text style={styles.title}>박물관{'\n'}미션 클리어</Text>
          <View style={styles.divider} />
          <Text style={styles.desc}>과거와 현재를 잇는{'\n'}디지털 탐험</Text>
        </View>

        <View style={styles.bottom}>
          <Pressable
            style={({ pressed }) => [styles.primary, pressed && { opacity: 0.85 }]}
            onPress={() => router.push('/login')}
          >
            <Icon name="play_arrow" size={22} color={gold.bg} />
            <Text style={styles.primaryText}>탐험 시작하기</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.secondary, pressed && { opacity: 0.7 }]}
            onPress={() => router.push('/teacher/login')}
          >
            <Icon name="badge" size={18} color="#fff" />
            <Text style={styles.secondaryText}>교사 로그인</Text>
          </Pressable>
          <Text style={styles.footer}>v1.0.0 • Museum Mission Service</Text>
        </View>
      </Screen>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: gold.bg },
  top: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  iconBox: {
    width: 76,
    height: 76,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(236,182,19,0.3)',
    backgroundColor: 'rgba(236,182,19,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  kicker: { color: gold.accent, letterSpacing: 2.5, fontSize: 13, fontWeight: '700', marginBottom: 14 },
  title: { color: '#fff', fontSize: 34, fontWeight: '800', textAlign: 'center', lineHeight: 42 },
  divider: { width: 32, height: 3, borderRadius: 2, backgroundColor: gold.accent, marginVertical: 22 },
  desc: { color: 'rgba(255,255,255,0.85)', fontSize: 16, textAlign: 'center', lineHeight: 25 },
  bottom: { paddingHorizontal: 20, paddingBottom: 12, gap: 14 },
  primary: {
    height: 54,
    borderRadius: 12,
    backgroundColor: gold.accent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    shadowColor: gold.accent,
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  primaryText: { color: gold.bg, fontSize: 17, fontWeight: '800' },
  secondary: {
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  secondaryText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  footer: { color: 'rgba(255,255,255,0.3)', fontSize: 11, textAlign: 'center', marginTop: 6 },
})
