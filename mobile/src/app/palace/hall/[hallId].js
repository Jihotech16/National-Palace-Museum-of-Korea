import { useLocalSearchParams } from 'expo-router'
import RequireAuth from '../../../components/RequireAuth'
import HallStart from '../../../components/halls/HallStart'

// 국립고궁박물관 전시관 안내 (웹 <전시관>/1_Start)
export default function PalaceHallScreen() {
  const { hallId } = useLocalSearchParams()
  return (
    <RequireAuth bg="#0f0716">
      <HallStart hallId={String(hallId)} />
    </RequireAuth>
  )
}
