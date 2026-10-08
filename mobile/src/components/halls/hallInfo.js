// 전시관(고궁) / Zone(서울) 정보 모음
// 웹앱 ExhibitionHallList, SeoulHistoryMuseumHallList, 각 전시관 1_Start 화면에 흩어져 있던 글과 사진을 한곳에 모음
import 조선국왕실Image from '@shared/image/조선국왕실.jpg'
import 왕실생활실Image from '@shared/image/왕실생활실.jpg'
import 대한제국실Image from '@shared/image/대한제국실.jpg'
import 궁중서화실Image from '@shared/image/궁중서화실.jpg'
import 왕실의례실Image from '@shared/image/왕실의례실.jpg'
import 과학문화실Image from '@shared/image/과학문화실.jpg'
import zone1Image from '@shared/image/SeoulHistoryMuseum/zone1.jpeg'
import zone2Image from '@shared/image/SeoulHistoryMuseum/zone2.jpeg'
import zone3Image from '@shared/image/SeoulHistoryMuseum/zone3.jpeg'
import zone4Image from '@shared/image/SeoulHistoryMuseum/zone4.jpeg'
import seoulMuseumImage from '@shared/image/SeoulHistoryMuseum/서울역사박물관.jpeg'
import { PALACE_HALLS, SEOUL_ZONES, isSeoulHall } from '../../lib/routes'

// 박물관별 색 (웹 CSS 값 그대로)
export const HALL_THEMES = {
  palace: {
    accent: '#a855f7',
    accentLight: '#c084fc',
    titleAccent: '#b46cf9', // 웹 제목 그라데이션(#a855f7→#c084fc)의 가운데 색
    accentPress: '#7e22ce',
    soft: '#a78bfa', // 보조 글자색
    text: '#f3e8ff',
    pageBg: '#0f0716', // 전시관 안내 화면 바탕
    card: '#1d1226',
    cardAlt: '#2a1b36',
    line: '#362447',
    chipLine: '#362447',
    desc: '#a78bfa', // 전시관 안내 설명 글자
    accentRgb: '168,85,247',
    pageRgb: '15,7,22',
    panelRgb: '29,18,38',
    lineRgb: '54,36,71',
  },
  seoul: {
    accent: '#2563eb',
    accentLight: '#60a5fa',
    titleAccent: '#4384f2', // 웹 제목 그라데이션(#2563eb→#60a5fa)의 가운데 색
    accentPress: '#1d4ed8',
    soft: '#60a5fa',
    text: '#f3e8ff',
    pageBg: '#0f172a',
    card: '#1e293b',
    cardAlt: '#334155',
    line: '#334155',
    chipLine: '#1e293b',
    desc: '#94a3b8',
    accentRgb: '37,99,235',
    pageRgb: '15,23,42',
    panelRgb: '30,41,59',
    lineRgb: '51,65,85',
  },
}

// 설명 문단 안의 **굵은 글씨** 표시는 HallStart에서 굵게 바꿔 보여줌
export const HALL_INFO = {
  // ── 국립고궁박물관 ──
  '1_King_of_Joseon': {
    title: '조선국왕',
    floor: '2층',
    stars: '★★★',
    summary: '조선 국왕의 생애와 권위를 상징하는 어보, 어책 등 왕실 유물을 통해 조선 왕실의 역사를 탐험해보세요.',
    image: 조선국왕실Image,
    listPosition: { top: '20%' },
    startPosition: 'left top',
    location: '현위치: 2층',
    tag: '제 1전시실',
    subTag: '조선 왕조',
    headline: '왕실의 품격,',
    accentTitle: '조선국왕실',
    paragraphs: [
      '조선국왕실은 500년 역사를 지닌 조선 왕조의 역사와 문화를 한눈에 볼 수 있는 전시관입니다. 국왕의 권위를 상징하는 다양한 의례용품과 왕실의 생활상을 보여주는 유물들이 전시되어 있습니다.',
      '이곳에서 **어좌**와 **일월오봉도** 등 왕실의 상징적인 문화유산을 만나보고, 역사 속에 숨겨진 이야기를 찾아보세요.',
    ],
    level: 3,
  },
  '2_Royal_Life': {
    title: '왕실생활',
    floor: '2층',
    stars: '★★☆',
    summary: '500년 조선 왕조의 중심이었던 궁궐의 건축미와 생활 공간을 자세히 들여다보는 시간입니다.',
    image: 왕실생활실Image,
    listPosition: { top: '20%' },
    startPosition: 'center',
    location: '현위치: 2층',
    tag: '제 2전시실',
    subTag: '조선 왕조',
    headline: '궁궐의 아름다움,',
    accentTitle: '왕실생활',
    paragraphs: [
      '왕실생활 전시관은 500년 조선 왕조의 중심이었던 궁궐의 건축미와 생활 공간을 자세히 들여다보는 전시관입니다. 왕과 왕비의 일상생활과 궁궐 내 다양한 공간의 모습을 보여주는 유물들이 전시되어 있습니다.',
      '이곳에서 **궁궐 건축**과 **왕실 생활 공간**을 통해 조선 왕실의 일상을 만나보고, 역사 속에 숨겨진 이야기를 찾아보세요.',
    ],
    level: 2,
  },
  '3_Empire_of_Korea': {
    title: '대한제국',
    floor: '1층',
    stars: '★★☆',
    summary: '대한제국 시기의 역사와 문화를 통해 근대 전환기의 조선을 만나보세요.',
    image: 대한제국실Image,
    listPosition: { top: '20%' },
    startPosition: 'center',
    location: '현위치: 1층',
    tag: '제 3전시실',
    subTag: '대한제국',
    headline: '근대 전환기의',
    accentTitle: '대한제국',
    paragraphs: [
      '대한제국실은 1897년 고종이 대한제국을 선포한 이후 근대 전환기의 역사와 문화를 보여주는 전시관입니다. 제국 선포와 함께 변화한 왕실의 모습과 근대화의 흔적을 확인할 수 있습니다.',
      '이곳에서 **대한제국의 역사**와 **근대 전환기**를 통해 조선이 근대 국가로 변화하는 과정을 만나보고, 역사 속에 숨겨진 이야기를 찾아보세요.',
    ],
    level: 2,
  },
  '4_Palace_Painting': {
    title: '궁중서화',
    floor: '지하 1층',
    stars: '★★☆',
    summary: '조선 왕실의 품격을 담은 다양한 서화 작품들을 통해 궁중 문화의 예술성을 만나보세요.',
    image: 궁중서화실Image,
    listPosition: { top: '20%' },
    startPosition: 'center',
    location: '현위치: 지하 1층',
    tag: '제 4전시실',
    subTag: '궁중서화',
    headline: '조선 왕실의 품격,',
    accentTitle: '궁중서화',
    paragraphs: [
      '궁중서화실은 조선 왕실의 품격을 담은 다양한 서화 작품들을 통해 궁중 문화의 예술성을 만나보는 전시관입니다. 왕과 왕비, 그리고 궁중 화원들이 제작한 서화 작품들이 전시되어 있습니다.',
      '이곳에서 **궁중 서화**와 **예술 문화**를 통해 조선 왕실의 미학과 예술적 성취를 만나보고, 역사 속에 숨겨진 이야기를 찾아보세요.',
    ],
    level: 2,
  },
  '5_Royal_Ritual': {
    title: '왕실의례',
    floor: '지하 1층',
    stars: '★☆☆',
    summary: '조선 왕조의 위엄과 권위를 상징하는 다양한 의례용품을 통해 왕실의 의례 문화를 탐험해보세요.',
    image: 왕실의례실Image,
    listPosition: { top: '20%' },
    startPosition: 'center',
    location: '현위치: 지하 1층',
    tag: '제 5전시실',
    subTag: '왕실의례',
    headline: '조선 왕조의 위엄,',
    accentTitle: '왕실의례',
    paragraphs: [
      '왕실의례실은 조선 왕조의 위엄과 권위를 상징하는 다양한 의례용품을 통해 왕실의 의례 문화를 탐험해보는 전시관입니다. 국왕의 즉위식, 대례, 제례 등 중요한 의식에서 사용된 유물들이 전시되어 있습니다.',
      '이곳에서 **왕실 의례**와 **의례용품**을 통해 조선 왕조의 권위와 위엄을 만나보고, 역사 속에 숨겨진 이야기를 찾아보세요.',
    ],
    level: 1,
  },
  '6_Science_Culture': {
    title: '과학문화',
    floor: '지하 1층',
    stars: '★☆☆',
    summary: '자격루, 앙부일구 등 조선 시대의 뛰어난 과학 기술과 천문학적 성취를 확인하세요.',
    image: 과학문화실Image,
    listPosition: { top: '20%' },
    startPosition: 'center',
    location: '현위치: 지하 1층',
    tag: '제 6전시실',
    subTag: '과학문화',
    headline: '조선의 과학 기술,',
    accentTitle: '과학문화',
    paragraphs: [
      '과학문화실은 조선 시대의 뛰어난 과학 기술과 천문학적 성취를 보여주는 다양한 유물들을 통해 조선의 과학 문화를 탐험해보는 전시관입니다. 자격루, 앙부일구 등 과학 기구들이 전시되어 있습니다.',
      '이곳에서 **과학 기술**과 **천문학**을 통해 조선의 과학적 성취를 만나보고, 역사 속에 숨겨진 이야기를 찾아보세요.',
    ],
    level: 1,
  },

  // ── 서울역사박물관 ──
  '1_Seoul_Joseon': {
    title: '조선시대의 서울',
    floor: 'Zone 1',
    stars: '★★☆',
    summary:
      '1392년부터 1863년까지 약 500년간 지속된 조선시대 서울의 모습을 탐험해보세요. 경복궁과 한양도성 등 조선시대 서울의 역사를 만나보세요.',
    image: zone1Image,
    startImage: zone1Image,
    listPosition: 'top',
    startPosition: 'center',
    location: 'Zone 1',
    tag: 'Zone 1',
    subTag: '조선시대',
    headline: '조선시대의 서울,',
    accentTitle: '1392-1863',
    paragraphs: [
      '조선시대의 서울은 한양으로 불리며 조선 왕조의 수도였습니다. 1392년부터 1863년까지 약 500년간 지속된 이 시대는 유교 문화가 꽃피고, 한글 창제와 같은 문화적 성취가 이루어진 시기입니다.',
      '이곳에서 **경복궁**과 **한양도성** 등 조선시대 서울의 모습을 탐험하고, 역사 속에 숨겨진 이야기를 찾아보세요.',
    ],
    level: 2,
  },
  '2_Seoul_Empire': {
    title: '개항과 대한제국',
    floor: 'Zone 2',
    stars: '★★☆',
    summary:
      '1863년부터 1910년까지 개항과 대한제국 시기의 서울을 탐험해보세요. 근대화의 길을 걷기 시작한 조선의 변화를 만나보세요.',
    image: zone2Image,
    listPosition: 'center',
    startPosition: 'center',
    location: 'Zone 2',
    tag: 'Zone 2',
    subTag: '대한제국',
    headline: '개항과 대한제국,',
    accentTitle: '1863-1910',
    paragraphs: [
      '개항과 대한제국 시기는 조선이 서구 문명과 만나 근대화의 길을 걷기 시작한 시기입니다. 1863년부터 1910년까지 이 시기는 개항장의 형성, 근대적 제도 도입, 그리고 대한제국 선포 등 역사적 전환점들이 있었습니다.',
      '이곳에서 **경운궁**과 **덕수궁** 등 근대 궁궐의 모습을 탐험하고, 개항기 서울의 변화를 찾아보세요.',
    ],
    level: 2,
  },
  '3_Seoul_Colonial': {
    title: '일제강점기의 서울',
    floor: 'Zone 3',
    stars: '★★★',
    summary:
      '1910년부터 1945년까지 일제강점기 서울의 모습을 탐험해보세요. 식민지 지배와 민족의 저항이 공존했던 시기를 만나보세요.',
    image: zone3Image,
    listPosition: 'top',
    startPosition: 'center',
    location: 'Zone 3',
    tag: 'Zone 3',
    subTag: '일제강점기',
    headline: '일제강점기의 서울,',
    accentTitle: '1910-1945',
    paragraphs: [
      '일제강점기는 한국 근현대사에서 가장 어두운 시기 중 하나입니다. 1910년부터 1945년까지 35년간 지속된 이 시기는 식민지 지배와 민족의 저항이 공존했던 시기입니다.',
      '이곳에서 **경성부**의 변화와 **독립운동**의 흔적을 탐험하고, 그 시대 서울의 모습을 찾아보세요.',
    ],
    level: 3,
  },
  '4_Seoul_Growth': {
    title: '고도성장기 서울',
    floor: 'Zone 4',
    stars: '★☆☆',
    summary:
      '1945년부터 2002년까지 고도성장기 서울의 변화를 탐험해보세요. 산업화와 도시화가 동시에 진행된 현대 서울의 탄생을 만나보세요.',
    image: zone4Image,
    // 웹 Zone 4 안내 화면은 박물관 전경 사진을 씀
    startImage: seoulMuseumImage,
    listPosition: 'top',
    startPosition: 'center',
    location: 'Zone 4',
    tag: 'Zone 4',
    subTag: '고도성장기',
    headline: '고도성장기 서울,',
    accentTitle: '1945-2002',
    paragraphs: [
      '고도성장기는 한국이 전쟁의 폐허에서 일어나 세계적인 경제 강국으로 성장한 시기입니다. 1945년부터 2002년까지 이 시기는 산업화, 도시화, 그리고 민주화가 동시에 진행된 시기입니다.',
      '이곳에서 **한강의 기적**과 **올림픽** 등 현대 서울의 탄생을 탐험하고, 급속한 변화의 흔적을 찾아보세요.',
    ],
    level: 1,
  },
}

export const LEVEL_LABEL = { 1: 'Easy', 2: 'Medium', 3: 'Hard' }

// 목록 위쪽 필터 칩 (웹과 같은 순서, 같은 아이콘)
export const HALL_FILTERS = {
  palace: [
    { value: '전체', icon: 'grid_view' },
    { value: '1층', icon: 'looks_one' },
    { value: '2층', icon: 'looks_two' },
    { value: '지하 1층', icon: 'arrow_downward' },
  ],
  seoul: [
    { value: '전체', icon: 'grid_view' },
    { value: 'Zone 1', icon: 'looks_one' },
    { value: 'Zone 2', icon: 'looks_two' },
    { value: 'Zone 3', icon: 'looks_3' },
    { value: 'Zone 4', icon: 'looks_4' },
  ],
}

export const hallIdsOf = (museum) => (museum === 'seoul' ? SEOUL_ZONES : PALACE_HALLS)
export const museumOfHall = (hallId) => (isSeoulHall(hallId) ? 'seoul' : 'palace')
