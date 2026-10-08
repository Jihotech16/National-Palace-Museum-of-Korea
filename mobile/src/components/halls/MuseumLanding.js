import { useEffect, useRef, useState } from 'react'
import { View, Text, Pressable, StyleSheet, Animated, Easing, Linking } from 'react-native'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import Screen from '../Screen'
import Icon from '../Icon'
import { hallListRoute } from '../../lib/routes'
import palaceImage from '@shared/image/NationalPalaceMuseum/국립고궁박물관.jpg'
import seoulImage from '@shared/image/SeoulHistoryMuseum/서울역사박물관.jpeg'

// 박물관별 글과 색 (웹 PalaceLandingPage.css / SeoulHistoryMuseum.css)
const LANDINGS = {
  palace: {
    image: palaceImage,
    brandIcon: 'temple_buddhist',
    brand: '국립고궁박물관',
    site: 'https://www.gogung.go.kr/gogung/main/main.do',
    icon: 'search_check',
    title: '국립고궁박물관',
    desc: '박물관 곳곳에 숨겨진 단서를 찾아\n전시관을 탐험하고 퀴즈를 풀어보세요.',
    accent: '#7f13ec',
    accentRgb: '127,19,236',
    bgRgb: '25,16,34',
    bg: '#191022',
  },
  seoul: {
    image: seoulImage,
    brandIcon: 'account_balance',
    brand: '서울역사박물관',
    site: 'https://www.museum.seoul.kr/',
    icon: 'history_edu',
    title: '서울역사박물관',
    desc: '서울의 유구한 역사와 도시의 변화를\n탐험하고 퀴즈를 풀어보세요.',
    accent: '#2563eb',
    accentRgb: '37,99,235',
    bgRgb: '15,23,42',
    bg: '#0f172a',
  },
}

// 버튼 위를 지나가는 반짝임
function Shine() {
  const [width, setWidth] = useState(0)
  const x = useRef(new Animated.Value(0)).current
  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(x, { toValue: 1, duration: 2000, easing: Easing.linear, useNativeDriver: true })
    )
    loop.start()
    return () => loop.stop()
  }, [x])
  const translateX = x.interpolate({ inputRange: [0, 1], outputRange: [-width, width] })
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none" onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ translateX }] }]}>
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.2)', 'transparent']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  )
}

// 박물관 첫 화면 (웹 PalaceLandingPage / SeoulHistoryMuseum)
export default function MuseumLanding({ museum = 'palace' }) {
  const t = LANDINGS[museum]

  return (
    <View style={[styles.root, { backgroundColor: t.bg }]}>
      <Image source={t.image} style={StyleSheet.absoluteFill} contentFit="cover" />
      <LinearGradient
        colors={['rgba(0,0,0,0.3)', `rgba(${t.bgRgb},0.4)`, `rgba(${t.bgRgb},1)`]}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={['transparent', `rgba(${t.bgRgb},0.9)`, `rgba(${t.bgRgb},1)`]}
        style={styles.bottomFade}
      />

      <Screen bg="transparent">
        <View style={styles.content}>
          {/* 위: 박물관 이름 (누르면 공식 홈페이지) */}
          <Pressable style={styles.brand} onPress={() => Linking.openURL(t.site)} hitSlop={8}>
            <Icon name={t.brandIcon} size={24} color="rgba(255,255,255,0.8)" />
            <Text style={styles.brandText}>{t.brand}</Text>
          </Pressable>

          {/* 아래: 제목과 버튼 */}
          <View style={styles.main}>
            <View
              style={[
                styles.iconBox,
                { backgroundColor: `rgba(${t.accentRgb},0.2)`, borderColor: `rgba(${t.accentRgb},0.5)` },
              ]}
            >
              <Icon name={t.icon} size={48} color={t.accent} />
            </View>

            <Text style={styles.title}>
              {t.title}
              {'\n'}
              <Text style={{ color: t.accent }}>탐험</Text>
            </Text>
            <Text style={styles.desc}>{t.desc}</Text>

            <Pressable
              onPress={() => router.push(hallListRoute(museum))}
              style={({ pressed }) => [
                styles.primary,
                { backgroundColor: t.accent, shadowColor: t.accent },
                pressed && { transform: [{ scale: 0.98 }], opacity: 0.9 },
              ]}
            >
              <View style={styles.primaryRow}>
                <Text style={styles.primaryText}>탐험 시작하기</Text>
                <Icon name="arrow_forward" size={20} color="#fff" />
              </View>
              <Shine />
            </Pressable>

            <View style={styles.secondaryRow}>
              <Pressable style={styles.secondary} onPress={() => router.replace('/choice-museum')} hitSlop={6}>
                <Icon name="museum" size={18} color="#9ca3af" />
                <Text style={styles.secondaryText}>박물관 선택하기</Text>
              </Pressable>
              <View style={styles.divider} />
              <Pressable style={styles.secondary} onPress={() => router.push('/guide')} hitSlop={6}>
                <Icon name="help" size={18} color="#9ca3af" />
                <Text style={styles.secondaryText}>이용안내</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Screen>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  bottomFade: { position: 'absolute', left: 0, right: 0, bottom: 0, height: '67%' },
  content: { flex: 1, justifyContent: 'space-between', paddingHorizontal: 24, paddingTop: 24, paddingBottom: 24 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 8, opacity: 0.8, alignSelf: 'flex-start' },
  brandText: { color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: '500', letterSpacing: 0.7 },
  main: { alignItems: 'center', width: '100%', marginBottom: 8 },
  iconBox: { borderRadius: 16, padding: 16, borderWidth: 1, marginBottom: 24 },
  title: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 38,
    letterSpacing: -0.6,
    marginBottom: 16,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  desc: { color: '#d1d5db', textAlign: 'center', fontSize: 16, lineHeight: 26, marginBottom: 40, maxWidth: 320 },
  primary: {
    width: '100%',
    borderRadius: 12,
    padding: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowOpacity: 0.4,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
  },
  primaryRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  primaryText: { color: '#fff', fontSize: 18, fontWeight: '700', letterSpacing: 0.9 },
  secondaryRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 24 },
  secondary: { flexDirection: 'row', alignItems: 'center', gap: 6, padding: 8 },
  secondaryText: { color: '#9ca3af', fontSize: 14, fontWeight: '500' },
  divider: { width: 1, height: 16, backgroundColor: '#374151' },
})
