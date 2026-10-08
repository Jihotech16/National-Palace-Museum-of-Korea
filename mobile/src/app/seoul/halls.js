import RequireAuth from '../../components/RequireAuth'
import HallList from '../../components/halls/HallList'

// 서울역사박물관 전시관 목록 (웹 SeoulHistoryMuseumHallList)
export default function SeoulHallsScreen() {
  return <RequireAuth>{(user) => <HallList user={user} museum="seoul" />}</RequireAuth>
}
