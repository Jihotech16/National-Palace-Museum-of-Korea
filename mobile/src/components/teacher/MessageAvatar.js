import { View, StyleSheet } from 'react-native'
import Icon from '../Icon'
import { t } from './theme'

// 보낸 사람 동그라미 + 작은 배지 (선생님: 학교 모자, 시스템: 톱니바퀴)
// 웹은 외부 사진 주소를 썼는데, 앱은 인터넷 없이도 보이도록 아이콘으로 그림
export default function MessageAvatar({ senderType, size = 48 }) {
  const isSystem = senderType === 'system'
  const badge = Math.round(size * 0.36)
  return (
    <View style={{ width: size, height: size }}>
      <View style={[styles.circle, { width: size, height: size, borderRadius: size / 2, backgroundColor: isSystem ? '#475569' : '#3b2556' }]}>
        <Icon name={isSystem ? 'notifications' : 'person'} size={size * 0.55} color={isSystem ? '#e2e8f0' : '#d8b4fe'} />
      </View>
      <View
        style={[
          styles.badge,
          { width: badge, height: badge, borderRadius: badge / 2, backgroundColor: isSystem ? t.gray : t.primary },
        ]}
      >
        <Icon name={isSystem ? 'settings' : 'school'} size={badge * 0.65} color="#fff" />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  circle: { alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.1)' },
  badge: {
    position: 'absolute',
    right: -4,
    bottom: -4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: t.bg,
  },
})
