import { View, ActivityIndicator } from 'react-native'
import { Redirect } from 'expo-router'
import { useAuth } from '../lib/AuthContext'

// 로그인한 사람만 볼 수 있는 화면을 감쌉니다. 로그인 안 했으면 로그인 화면으로 보냄
export default function RequireAuth({ children, redirectTo = '/login', bg = '#221d10' }) {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: bg }}>
        <ActivityIndicator color="#ecb613" />
      </View>
    )
  }
  if (!user) return <Redirect href={redirectTo} />
  return typeof children === 'function' ? children(user) : children
}
