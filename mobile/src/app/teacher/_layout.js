import { Stack } from 'expo-router'
import { TeacherProvider } from '../../components/teacher/TeacherContext'
import { t } from '../../components/teacher/theme'

// 교사 화면 묶음: 선생님 정보(학교/학년/반)를 모든 교사 화면에서 같이 씀
export default function TeacherLayout() {
  return (
    <TeacherProvider>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: t.bg }, animation: 'slide_from_right' }} />
    </TeacherProvider>
  )
}
