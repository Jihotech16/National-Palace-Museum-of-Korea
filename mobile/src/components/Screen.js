import { View, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'

// 모든 화면의 바탕. edges로 위/아래 안전 영역 처리 여부를 정함
export default function Screen({ children, bg = '#221d10', edges = ['top', 'bottom'], style }) {
  return (
    <View style={[styles.root, { backgroundColor: bg }]}>
      <StatusBar style="light" />
      <SafeAreaView edges={edges} style={[styles.root, style]}>
        {children}
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
})
