import { useLocalSearchParams } from 'expo-router'
import RequireAuth from '../../../components/RequireAuth'
import HallStart from '../../../components/halls/HallStart'

// 서울역사박물관 Zone 안내 (웹 SeoulHistoryMuseum/<zone>/1_Start)
export default function SeoulZoneScreen() {
  const { zoneId } = useLocalSearchParams()
  return (
    <RequireAuth bg="#0f172a">
      <HallStart hallId={String(zoneId)} />
    </RequireAuth>
  )
}
