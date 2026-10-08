import { useMemo, useState } from 'react'
import { View, Text, Pressable, FlatList, StyleSheet } from 'react-native'
import { Image } from 'expo-image'
import Icon from '../../components/Icon'
import TeacherShell from '../../components/teacher/TeacherShell'
import { t, hallColors } from '../../components/teacher/theme'
import { HALL_INFO, MUSEUM_NAMES, hallIcon } from '../../components/teacher/halls'
import { EXHIBITION_HALL_ACTIVITIES, QUESTIONS_BY_ACTIVITY } from '../../lib/routes'
import { ANSWERS } from '@shared/utils/answerCheck'

// 문제 및 정답 보기 (웹 TeacherQuestionManagement.jsx)
export default function TeacherQuestionsScreen() {
  return (
    <TeacherShell title="문제 및 정답 관리" active="questions">
      <Questions />
    </TeacherShell>
  )
}

const hallsOf = (museum) => Object.keys(EXHIBITION_HALL_ACTIVITIES).filter((id) => HALL_INFO[id]?.museum === museum)

// 정답 필드 값을 한 줄로 (배열은 펼침)
const answerText = (activityId) => {
  const data = ANSWERS[activityId]
  if (!data) return '정답 없음'
  return Object.values(data)
    .flatMap((v) => (Array.isArray(v) ? v : [v]))
    .join(', ')
}

function Questions() {
  const [museum, setMuseum] = useState('all') // 'all', 'palace', 'seoul'
  const [hall, setHall] = useState(null)
  const [expanded, setExpanded] = useState({})

  const selectMuseum = (m) => {
    setMuseum(m)
    setHall(null)
  }

  const questions = useMemo(
    () => (hall ? (EXHIBITION_HALL_ACTIVITIES[hall] || []).map((id) => QUESTIONS_BY_ACTIVITY[id]).filter(Boolean) : []),
    [hall]
  )

  const header = (
    <View style={{ gap: 16, marginBottom: hall ? 32 : 0 }}>
      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>{museum === 'all' ? '박물관 선택' : `${MUSEUM_NAMES[museum]} - 전시관 선택`}</Text>
        {museum !== 'all' && (
          <Pressable onPress={() => selectMuseum('all')} hitSlop={8} accessibilityLabel="박물관 선택으로">
            <Icon name="arrow_back" size={20} color={t.muted} />
          </Pressable>
        )}
      </View>

      {museum === 'all' ? (
        <View style={{ gap: 12 }}>
          <HallButton icon="museum" color="orange" name="국립고궁박물관" count={`${hallsOf('palace').length}개 전시관`} onPress={() => selectMuseum('palace')} />
          <HallButton icon="location_city" color="blue" name="서울역사박물관" count={`${hallsOf('seoul').length}개 전시관`} onPress={() => selectMuseum('seoul')} />
        </View>
      ) : (
        <View style={{ gap: 12 }}>
          {hallsOf(museum).map((id) => {
            const info = HALL_INFO[id]
            return (
              <HallButton
                key={id}
                icon={hallIcon(info.icon)}
                color={info.color}
                name={info.name}
                count={`${EXHIBITION_HALL_ACTIVITIES[id].length}개 문제`}
                active={hall === id}
                onPress={() => setHall(hall === id ? null : id)}
              />
            )
          })}
        </View>
      )}

      {hall && <Text style={[styles.sectionTitle, { marginTop: 16 }]}>{HALL_INFO[hall]?.name || hall} 문제 목록</Text>}
    </View>
  )

  return (
    <FlatList
      data={questions}
      keyExtractor={(q) => q.activityId}
      ListHeaderComponent={header}
      contentContainerStyle={styles.main}
      ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      renderItem={({ item }) => (
        <QuestionItem
          question={item}
          open={!!expanded[item.activityId]}
          onToggle={() => setExpanded((prev) => ({ ...prev, [item.activityId]: !prev[item.activityId] }))}
        />
      )}
    />
  )
}

function HallButton({ icon, color, name, count, active, onPress }) {
  const c = hallColors[color] || hallColors.orange
  return (
    <Pressable
      style={({ pressed }) => [
        styles.hallBtn,
        (active || pressed) && { borderColor: t.primary, backgroundColor: active ? 'rgba(127,19,236,0.1)' : 'rgba(127,19,236,0.05)' },
      ]}
      onPress={onPress}
    >
      <View style={[styles.hallIcon, { backgroundColor: c.bg }]}>
        <Icon name={icon} size={24} color={c.fg} />
      </View>
      <View style={{ flex: 1, gap: 4 }}>
        <Text style={styles.hallName}>{name}</Text>
        <Text style={styles.hallCount}>{count}</Text>
      </View>
    </Pressable>
  )
}

function QuestionItem({ question, open, onToggle }) {
  return (
    <View style={styles.item}>
      <Pressable style={styles.itemHeader} onPress={onToggle} accessibilityState={{ expanded: open }}>
        <View style={styles.itemInfo}>
          <View style={styles.number}>
            <Text style={styles.numberText}>{question.questionNumber}</Text>
          </View>
          <Text style={styles.itemTitle}>{question.title}</Text>
        </View>
        <Icon name="expand_more" size={24} color={t.muted} style={open && { transform: [{ rotate: '180deg' }] }} />
      </Pressable>
      {open && (
        <View style={styles.itemContent}>
          <Text style={styles.description}>{question.description}</Text>
          {!!question.image && (
            <View style={styles.imageBox}>
              <Image source={question.image} style={styles.image} contentFit="contain" />
            </View>
          )}
          <View style={styles.answers}>
            <Text style={styles.answersTitle}>정답</Text>
            <Text style={styles.answerValue}>{answerText(question.activityId)}</Text>
          </View>
          {!!question.explanation && (
            <View style={styles.explanation}>
              <Text style={styles.explanationTitle}>설명</Text>
              <Text style={styles.description}>{question.explanation}</Text>
            </View>
          )}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  main: { padding: 16, paddingBottom: 32 },
  sectionRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionTitle: { color: '#fff', fontSize: 20, fontWeight: '700', flexShrink: 1 },
  hallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: t.surface,
    borderWidth: 1,
    borderColor: t.border,
    borderRadius: 12,
  },
  hallIcon: { width: 40, height: 40, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  hallName: { color: '#fff', fontSize: 16, fontWeight: '700' },
  hallCount: { color: t.muted, fontSize: 12 },
  item: { backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, borderRadius: 12, overflow: 'hidden' },
  itemHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  itemInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  number: { width: 32, height: 32, borderRadius: 6, backgroundColor: t.primary, alignItems: 'center', justifyContent: 'center' },
  numberText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  itemTitle: { flex: 1, color: '#fff', fontSize: 16, fontWeight: '700' },
  itemContent: { padding: 16, gap: 16, borderTopWidth: 1, borderTopColor: t.border },
  description: { color: t.slateLight, fontSize: 14, lineHeight: 22 },
  imageBox: { borderRadius: 8, overflow: 'hidden', backgroundColor: t.dark },
  image: { width: '100%', height: 220 },
  answers: {
    backgroundColor: 'rgba(127,19,236,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(127,19,236,0.2)',
    borderRadius: 8,
    padding: 16,
    gap: 12,
  },
  answersTitle: { color: t.primary, fontSize: 14, fontWeight: '700' },
  answerValue: { color: '#fff', fontSize: 14, fontWeight: '700' },
  explanation: { backgroundColor: t.dark, borderRadius: 8, padding: 16, gap: 8 },
  explanationTitle: { color: t.muted, fontSize: 14, fontWeight: '700' },
})
