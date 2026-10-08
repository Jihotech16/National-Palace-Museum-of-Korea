import { forwardRef } from 'react'
import { View, Text, Platform, StyleSheet } from 'react-native'
import { Image } from 'expo-image'
import Icon from '../Icon'

// 수료증 카드 (웹 StudentClear.css의 .student-clear-certificate). 이미지 저장 때 이 View를 그대로 찍음
const SEAL_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC_AxzfzRa4MEJBINdVI6Fexf7R2tVBZiqYxGK0pM9rq8oy4gg1CSYTA-SMyphTpuKxaaqKASqOK8TFCeLyYnv2mDMibZ5p8Qn3gehplqa2aCofFnhARWgV__y0YtouJjWDGJqZxjA5VtkkgAjxqkF4skavFTcbXxom8SK07DMna2fBpm_egy_0fSnQmujizls5p-1UHjrRm4BI5e99qstX3NFQM6VcSo4nfUMqpbOsMZfGnujM1CaXwS-9V_Tkb-fIy-9GhhsY2E9v'

const serif = Platform.select({ web: "Batang, 'Gowun Batang', Georgia, serif", default: undefined })

export const certificateTitle = (museum) => (museum === 'palace' ? '궁궐 탐험 수료증' : '서울 역사 탐험 수료증')
const museumFullName = (museum) => (museum === 'palace' ? '국립고궁박물관' : '서울역사박물관')

// 소속: "학교 학년 반 번호" 중 있는 것만
export function schoolLine(info) {
  if (!info) return ''
  const { schoolName, grade, classNum, number } = info
  if (schoolName && grade && classNum && number) return `${schoolName} ${grade}학년 ${classNum}반 ${number}번`
  if (schoolName && grade && classNum) return `${schoolName} ${grade}학년 ${classNum}반`
  if (grade && classNum && number) return `${grade}학년 ${classNum}반 ${number}번`
  if (grade && classNum) return `${grade}학년 ${classNum}반`
  return ''
}

export function teacherSignature(info) {
  if (!info) return '담임 일동'
  if (info.schoolName && info.grade) return `${info.schoolName} ${info.grade}학년 담임 일동`
  if (info.schoolName) return `${info.schoolName} 담임 일동`
  if (info.grade) return `${info.grade}학년 담임 일동`
  return '담임 일동'
}

export function todayDots() {
  const now = new Date()
  return `${now.getFullYear()}. ${String(now.getMonth() + 1).padStart(2, '0')}. ${String(now.getDate()).padStart(2, '0')}`
}

const Certificate = forwardRef(function Certificate({ museum = 'palace', info, locked = false }, ref) {
  const seoul = museum === 'seoul'
  const frame = locked ? '#d1d5db' : seoul ? '#2563eb' : '#d4af37'
  const corner = locked ? '#9ca3af' : seoul ? '#2563eb' : '#d4af37'
  const accent = locked ? '#6b7280' : seoul ? '#2563eb' : '#7f13ec'
  const titleLine = locked ? 'rgba(156,163,175,0.3)' : seoul ? 'rgba(37,99,235,0.3)' : 'rgba(212,175,55,0.3)'
  const school = schoolLine(info)

  return (
    // 웹의 6px 이중 테두리를 두 겹 테두리로 표현
    <View ref={ref} collapsable={false} style={[styles.outer, { borderColor: frame }]}>
      <View style={[styles.inner, { borderColor: frame }]}>
        <View style={[styles.body, locked && styles.blurred]}>
          {['tl', 'tr', 'bl', 'br'].map((k) => (
            <View
              key={k}
              style={[styles.corner, styles[k], { borderColor: corner }]}
            />
          ))}
          <View pointerEvents="none" style={styles.sealBg}>
            <Image source={{ uri: SEAL_IMAGE }} style={styles.sealImage} contentFit="contain" />
          </View>

          <View style={styles.header}>
            <Text style={[styles.label, { color: accent }]}>CERTIFICATE</Text>
            <Text style={[styles.title, { borderBottomColor: titleLine }]}>{certificateTitle(museum)}</Text>
          </View>

          {!!school && (
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>소속</Text>
              <Text style={styles.infoValue}>{school}</Text>
            </View>
          )}

          <Text style={[styles.description, locked && { opacity: 0 }]}>
            위 학생은 {museumFullName(museum)}의 역사와 문화를 탐구하는 모든 과정을 성실히 마치고, 주어진 문제를 훌륭하게
            해결하였기에 이 증서를 수여합니다.
          </Text>

          <View style={styles.footer}>
            <Text style={styles.date}>{locked ? 'YYYY. MM. DD' : todayDots()}</Text>
            <View style={styles.signature}>
              <Text style={styles.signatureText}>{teacherSignature(info)}</Text>
              <View
                style={[
                  styles.stamp,
                  seoul && !locked && { backgroundColor: 'rgba(37,99,235,0.05)', borderColor: '#2563eb' },
                  locked && { borderColor: '#9ca3af', backgroundColor: 'rgba(156,163,175,0.05)' },
                ]}
              >
                <Text style={[styles.stampText, seoul && { color: '#2563eb' }, locked && { color: '#9ca3af' }]}>인</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 잠긴 수료증 위에 덮는 안내 */}
        {locked && (
          <View style={styles.overlay}>
            <View style={styles.overlayIcon}>
              <Icon name="lock_clock" size={30} color="#6b7280" />
            </View>
            <Text style={styles.overlayText}>미션 완료 후 공개</Text>
          </View>
        )}
      </View>
    </View>
  )
})

export default Certificate

const styles = StyleSheet.create({
  outer: {
    width: '100%',
    borderWidth: 2,
    borderRadius: 12,
    padding: 2,
    backgroundColor: '#fffdf5',
    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
  },
  inner: { borderWidth: 2, borderRadius: 8, overflow: 'hidden', backgroundColor: '#fffdf5' },
  body: { padding: 32, alignItems: 'center' },
  blurred: { opacity: 0.5 },
  corner: { position: 'absolute', width: 64, height: 64, opacity: 0.5, margin: 4 },
  tl: { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 8 },
  tr: { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 8 },
  bl: { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 8 },
  br: { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 8 },
  sealBg: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center', opacity: 0.05 },
  sealImage: { width: 192, height: 192 },
  header: { marginBottom: 24, alignItems: 'center' },
  label: { fontSize: 10, fontWeight: '700', letterSpacing: 4, marginBottom: 4 },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    fontFamily: serif,
    borderBottomWidth: 2,
    paddingBottom: 8,
    paddingHorizontal: 16,
  },
  infoItem: { alignItems: 'center', marginBottom: 24 },
  infoLabel: { fontSize: 12, color: '#9ca3af', marginBottom: 4 },
  infoValue: { fontSize: 14, fontWeight: '500', color: '#374151', fontFamily: serif, textAlign: 'center' },
  description: { fontSize: 14, lineHeight: 28, color: '#4b5563', marginBottom: 32, fontFamily: serif, textAlign: 'center' },
  footer: { width: '100%', alignItems: 'center', gap: 8 },
  date: { fontSize: 12, color: '#9ca3af', letterSpacing: 1.2, fontWeight: '700' },
  signature: { marginTop: 8 },
  signatureText: { fontSize: 16, fontWeight: '700', color: '#1f2937', zIndex: 10 },
  stamp: {
    position: 'absolute',
    top: -12,
    right: -24,
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#b91c1c',
    backgroundColor: 'rgba(185,28,28,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.9,
    transform: [{ rotate: '-12deg' }],
  },
  stampText: { fontSize: 10, fontWeight: '700', color: '#b91c1c', fontFamily: serif },
  overlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    zIndex: 30,
  },
  overlayIcon: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 9999,
    marginBottom: 12,
    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
  },
  overlayText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4b5563',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 9999,
    overflow: 'hidden',
  },
})
