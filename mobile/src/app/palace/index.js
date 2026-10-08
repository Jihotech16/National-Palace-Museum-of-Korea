import RequireAuth from '../../components/RequireAuth'
import MuseumLanding from '../../components/halls/MuseumLanding'

// 국립고궁박물관 첫 화면 (웹 PalaceLandingPage)
export default function PalaceLandingScreen() {
  return (
    <RequireAuth bg="#191022">
      <MuseumLanding museum="palace" />
    </RequireAuth>
  )
}
