import { View, StyleSheet } from 'react-native'

// 원형 진행률 (웹의 conic-gradient 원). 반원 두 개를 돌려서 그림
export default function ProgressRing({ size = 56, thickness = 4, progress = 0, color, track, inner, children }) {
  const p = Math.max(0, Math.min(100, progress))
  const deg = p * 3.6
  const half = size / 2
  const disk = { position: 'absolute', top: 0, width: size, height: size, borderRadius: half, overflow: 'hidden' }

  return (
    <View style={{ width: size, height: size, borderRadius: half, backgroundColor: track }}>
      {/* 오른쪽 절반: 0~180도 */}
      {deg > 0 && (
        <View style={[styles.mask, { left: half, width: half, height: size }]}>
          <View style={[disk, { left: -half, transform: [{ rotate: `${Math.min(deg, 180)}deg` }] }]}>
            <View style={{ position: 'absolute', left: 0, top: 0, width: half, height: size, backgroundColor: color }} />
          </View>
        </View>
      )}
      {/* 왼쪽 절반: 180~360도 */}
      {deg > 180 && (
        <View style={[styles.mask, { left: 0, width: half, height: size }]}>
          <View style={[disk, { left: 0, transform: [{ rotate: `${Math.max(deg - 180, 0)}deg` }] }]}>
            <View style={{ position: 'absolute', left: half, top: 0, width: half, height: size, backgroundColor: color }} />
          </View>
        </View>
      )}
      <View
        style={[
          styles.inner,
          { top: thickness, left: thickness, right: thickness, bottom: thickness, borderRadius: half, backgroundColor: inner },
        ]}
      >
        {children}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  mask: { position: 'absolute', top: 0, overflow: 'hidden' },
  inner: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
})
