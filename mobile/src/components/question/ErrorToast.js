import { useEffect, useRef } from 'react'
import { Animated, Platform, StyleSheet } from 'react-native'

const native = Platform.OS !== 'web'

// 오답 등 짧은 안내를 화면 위쪽에 띄움 (웹 ErrorToast). 사라지는 시점은 화면 쪽에서 정함
export default function ErrorToast({ message, top = 70 }) {
  const anim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (message) {
      anim.setValue(0)
      Animated.timing(anim, { toValue: 1, duration: 300, useNativeDriver: native }).start()
    }
  }, [message, anim])

  if (!message) return null

  return (
    <Animated.View
      pointerEvents="none"
      accessibilityLiveRegion="polite"
      accessibilityRole="alert"
      style={[
        styles.toast,
        {
          top,
          opacity: anim,
          transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }],
        },
      ]}
    >
      <Animated.Text style={styles.text}>{message}</Animated.Text>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    alignSelf: 'center',
    maxWidth: '90%',
    backgroundColor: 'rgba(204,51,51,0.95)',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    zIndex: 1000,
    elevation: 10,
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },
  text: { color: '#ffcccc', fontSize: 14, textAlign: 'center' },
})
