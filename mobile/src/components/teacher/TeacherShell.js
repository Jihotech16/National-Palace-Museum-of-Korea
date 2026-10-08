import { useState } from 'react'
import { View, Text, ActivityIndicator, StyleSheet, Alert } from 'react-native'
import { router, Redirect } from 'expo-router'
import Screen from '../Screen'
import AppHeader, { HeaderIconButton } from '../AppHeader'
import TeacherTabBar from './TeacherTabBar'
import TeacherSidebar from './TeacherSidebar'
import EndActivityModal from './EndActivityModal'
import { useTeacher, teacherLogout } from './TeacherContext'
import { t } from './theme'

const TAB_ROUTES = {
  home: '/teacher',
  progress: '/teacher/class',
  students: '/teacher/students',
  questions: '/teacher/questions',
}

// 교사 화면 공통 틀: 위 제목 줄 + 왼쪽 메뉴 + 아래 탭 + 활동 종료 창
// children은 함수로 주면 teacher 정보를 받아서 그림
export default function TeacherShell({ title, active, onBack, showMail = true, showTabBar = true, children, overlay }) {
  const { teacher, ready } = useTeacher()
  const [menuOpen, setMenuOpen] = useState(false)
  const [endOpen, setEndOpen] = useState(false)

  if (!ready) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={t.primary} />
      </View>
    )
  }
  // 로그인 안 했거나 교사 계정이 아니면 로그인 화면으로
  if (!teacher) return <Redirect href="/teacher/login" />

  const go = async (key) => {
    if (key === 'end') return setEndOpen(true)
    if (key === 'logout') {
      await teacherLogout()
      router.replace('/teacher/login')
      return
    }
    if (key === 'messages') return active === 'messages' ? null : router.push('/teacher/messages')
    if (key === active) return
    if (key === 'home') return router.dismissTo('/teacher')
    // 홈에서는 쌓고, 다른 탭끼리는 바꿔치기 (뒤로 가면 홈으로)
    if (active === 'home' || !TAB_ROUTES[active]) router.push(TAB_ROUTES[key])
    else router.replace(TAB_ROUTES[key])
  }

  const handleEnded = async () => {
    setEndOpen(false)
    await teacherLogout()
    router.replace('/teacher/login')
    Alert.alert('활동 종료', '활동이 종료되었습니다. 모든 데이터가 삭제되었습니다.')
  }

  return (
    <Screen bg={t.bg} edges={showTabBar ? ['top'] : ['top', 'bottom']}>
      <AppHeader
        title={title}
        onBack={onBack || (() => setMenuOpen(true))}
        backIcon={onBack ? 'arrow_back' : 'menu'}
        color={t.headerText}
        titleColor={t.headerText}
        bg={t.headerBg}
        borderColor={t.headerBorder}
        right={showMail ? <HeaderIconButton icon="mail" color={t.headerText} label="메시지" onPress={() => go('messages')} /> : null}
      />
      <View style={{ flex: 1 }}>
        {typeof children === 'function' ? children(teacher) : children}
        {overlay}
      </View>
      {showTabBar && <TeacherTabBar active={active} onSelect={go} />}

      <TeacherSidebar visible={menuOpen} onClose={() => setMenuOpen(false)} onSelect={go} teacher={teacher} />
      <EndActivityModal
        visible={endOpen}
        defaultSchoolCode={teacher.schoolCode}
        onClose={() => setEndOpen(false)}
        onEnded={handleEnded}
      />
    </Screen>
  )
}

// 불러오는 중 안내 (웹 .teacher-loading)
export function TeacherLoading({ text = '데이터를 불러오는 중...' }) {
  return (
    <View style={styles.loading}>
      <ActivityIndicator color={t.muted} />
      <Text style={styles.loadingText}>{text}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: t.bg },
  loading: { alignItems: 'center', justifyContent: 'center', paddingVertical: 48, paddingHorizontal: 16, gap: 10 },
  loadingText: { color: t.muted, fontSize: 14 },
})
