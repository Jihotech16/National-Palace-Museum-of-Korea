import { View, StyleSheet } from 'react-native'
import { Image } from 'expo-image'
import Icon from '../Icon'

// 보낸 사람 사진 + 오른쪽 아래 작은 배지 (선생님: 학사모, 시스템: 톱니바퀴)
export default function MessageAvatar({ uri, senderType, size = 48 }) {
  const badge = Math.round(size * 0.34)
  return (
    <View style={{ width: size, height: size }}>
      <View style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}>
        {!!uri && <Image source={{ uri }} style={StyleSheet.absoluteFill} contentFit="cover" />}
        {!uri && <Icon name="person" size={size * 0.55} color="rgba(255,255,255,0.6)" />}
      </View>
      {(senderType === 'teacher' || senderType === 'system') && (
        <View
          style={[
            styles.badge,
            { width: badge, height: badge, borderRadius: badge / 2, backgroundColor: senderType === 'teacher' ? '#7f13ec' : '#6b7280' },
          ]}
        >
          <Icon name={senderType === 'teacher' ? 'school' : 'settings'} size={badge * 0.62} color="#fff" />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: '#475569',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: { position: 'absolute', right: -4, bottom: -4, alignItems: 'center', justifyContent: 'center' },
})
