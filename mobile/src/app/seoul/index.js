import RequireAuth from '../../components/RequireAuth'
import MuseumLanding from '../../components/halls/MuseumLanding'

// 서울역사박물관 첫 화면 (웹 SeoulHistoryMuseum)
export default function SeoulLandingScreen() {
  return (
    <RequireAuth bg="#0f172a">
      <MuseumLanding museum="seoul" />
    </RequireAuth>
  )
}
