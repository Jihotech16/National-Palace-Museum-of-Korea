import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import AppHeader, { HeaderIconButton } from '../AppHeader'
import { gold } from '../../theme/colors'

// 학생 화면 위쪽 제목 줄 (웹 StudentLayout 헤더: 금색 뒤로가기, 가운데 제목, 메시지함 버튼)
export default function StudentHeader({ title, onBack, showMessageButton = true, museum = 'palace' }) {
  return (
    <SafeAreaView edges={['top']} style={{ backgroundColor: 'rgba(34,29,16,0.95)' }}>
      <AppHeader
        title={title}
        onBack={onBack}
        color={gold.accent}
        borderColor="rgba(255,255,255,0.05)"
        right={
          showMessageButton ? (
            <HeaderIconButton
              icon="mail_outline"
              color={gold.accent}
              badge
              label="메시지함"
              onPress={() => router.push({ pathname: '/messages', params: { museum } })}
            />
          ) : null
        }
      />
    </SafeAreaView>
  )
}
