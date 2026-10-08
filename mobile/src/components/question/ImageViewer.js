import { Modal, View, Pressable, ScrollView, StyleSheet, useWindowDimensions } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Image } from 'expo-image'
import { StatusBar } from 'expo-status-bar'
import Icon from '../Icon'

// 유물 사진 크게 보기. iPhone에서는 두 손가락으로 확대할 수 있음
export default function ImageViewer({ source, visible, onClose, title }) {
  const { width, height } = useWindowDimensions()
  const insets = useSafeAreaInsets()
  return (
    <Modal visible={visible} animationType="fade" onRequestClose={onClose} supportedOrientations={['portrait']}>
      <StatusBar style="light" />
      <View style={styles.root}>
        <ScrollView
          style={StyleSheet.absoluteFill}
          contentContainerStyle={{ width, height, alignItems: 'center', justifyContent: 'center' }}
          maximumZoomScale={4}
          minimumZoomScale={1}
          centerContent
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          bouncesZoom
        >
          <Pressable onPress={onClose} accessibilityLabel={title ? `${title} 사진 닫기` : '사진 닫기'}>
            <Image source={source} style={{ width, height }} contentFit="contain" transition={150} />
          </Pressable>
        </ScrollView>
        <Pressable
          onPress={onClose}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="닫기"
          style={[styles.close, { top: insets.top + 10 }]}
        >
          <Icon name="close" size={26} color="#fff" />
        </Pressable>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  close: {
    position: 'absolute',
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
