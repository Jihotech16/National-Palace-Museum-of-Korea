import MaterialIcons from '@expo/vector-icons/MaterialIcons'

// 웹앱의 Material Symbols 이름(snake_case)을 그대로 쓸 수 있게 변환
const RENAMED = {
  avg_pace: 'speed',
  monitoring: 'insights',
  search_check: 'manage-search',
}

export default function Icon({ name, size = 24, color = '#fff', style }) {
  const glyph = RENAMED[name] || name.replace(/_/g, '-')
  return <MaterialIcons name={glyph} size={size} color={color} style={style} />
}
