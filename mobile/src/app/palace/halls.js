import RequireAuth from '../../components/RequireAuth'
import HallList from '../../components/halls/HallList'

// 국립고궁박물관 전시관 목록 (웹 ExhibitionHallList)
export default function PalaceHallsScreen() {
  return <RequireAuth>{(user) => <HallList user={user} museum="palace" />}</RequireAuth>
}
