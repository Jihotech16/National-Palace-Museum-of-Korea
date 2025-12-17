import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './ExhibitionHallList.css'
import 조선국왕실Image from '../image/조선국왕실.jpg'
import 왕실생활실Image from '../image/왕실생활실.jpg'
import 대한제국실Image from '../image/대한제국실.jpg'
import 궁중서화실Image from '../image/궁중서화실.jpg'
import 왕실의례실Image from '../image/왕실의례실.jpg'
import 과학문화실Image from '../image/과학문화실.jpg'
import { getAllActivityStatus } from '../firebase/firestore'
import { EXHIBITION_HALL_ACTIVITIES } from '../utils/activityOrder'
import { logout } from '../firebase/auth'

function ExhibitionHallList({ user }) {
  const navigate = useNavigate()
  const [selectedFilter, setSelectedFilter] = useState('전체')
  const [activityStatus, setActivityStatus] = useState({})
  const [loading, setLoading] = useState(true)
  const [featuredExhibition, setFeaturedExhibition] = useState(null)

  const handleBack = () => {
    navigate('/')
  }

  const handleExhibitionClick = (exhibitionId) => {
    // 전시관 클릭 시 해당 전시관 시작 화면으로 이동
    if (exhibitionId === 'king') {
      navigate('/1_King_of_Joseon/1_Start')
    } else if (exhibitionId === 'royal-life') {
      navigate('/2_Royal_Life/1_Start')
    } else if (exhibitionId === 'empire') {
      navigate('/3_Empire_of_Korea/1_Start')
    } else if (exhibitionId === 'painting') {
      navigate('/4_Palace_Painting/1_Start')
    } else if (exhibitionId === 'ritual') {
      navigate('/5_Royal_Ritual/1_Start')
    } else if (exhibitionId === 'science') {
      navigate('/6_Science_Culture/1_Start')
    }
    // 다른 전시관들도 추가 가능
  }

  const handleFilterClick = (filter) => {
    setSelectedFilter(filter)
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  // Firebase에서 활동지 완료 상태 가져오기
  useEffect(() => {
    const loadActivityStatus = async () => {
      if (user && user.uid) {
        // user.email에서 학번 추출하여 전달
        const result = await getAllActivityStatus(user.uid, user.email)
        if (result.success) {
          setActivityStatus(result.status || {})
        }
        setLoading(false)
      } else {
        setLoading(false)
      }
    }
    loadActivityStatus()
  }, [user])


  // 전시관별 진행률 계산 함수
  const calculateProgress = (exhibitionHallId) => {
    const activities = EXHIBITION_HALL_ACTIVITIES[exhibitionHallId] || []
    if (activities.length === 0) return 0
    
    const completedCount = activities.filter(activityId => activityStatus[activityId]).length
    
    // 디버깅: 콘솔에 진행률 정보 출력
    if (exhibitionHallId === '1_King_of_Joseon') {
      console.log('조선국왕실 진행률 계산:')
      console.log('전체 활동지:', activities)
      console.log('완료된 활동지:', activities.filter(id => activityStatus[id]))
      console.log('완료되지 않은 활동지:', activities.filter(id => !activityStatus[id]))
      console.log(`완료 수: ${completedCount} / 전체: ${activities.length}`)
      console.log('activityStatus:', activityStatus)
    }
    
    // 정확한 퍼센트 계산 (소수점 처리)
    const progress = Math.floor((completedCount / activities.length) * 100)
    // 모든 활동지가 완료되면 100%로 설정
    if (completedCount === activities.length) {
      return 100
    }
    return progress
  }

  // 진행률에 따라 상태 결정
  const getStatusFromProgress = (progress) => {
    if (progress === 0) return 'available'
    if (progress === 100) return 'completed'
    return 'progress'
  }

  // 전시관 데이터
  const exhibitions = [
    {
      id: 'king',
      title: '조선국왕',
      floor: '2층',
      floorValue: '2층',
      difficulty: '★★★',
      description: '조선 국왕의 생애와 권위를 상징하는 어보, 어책 등 왕실 유물을 통해 조선 왕실의 역사를 탐험해보세요.',
      image: 조선국왕실Image,
      imagePosition: 'center 20%',
      exhibitionHallId: '1_King_of_Joseon',
      onClick: () => handleExhibitionClick('king')
    },
    {
      id: 'royal-life',
      title: '왕실생활',
      floor: '2층',
      floorValue: '2층',
      difficulty: '★★☆',
      description: '500년 조선 왕조의 중심이었던 궁궐의 건축미와 생활 공간을 자세히 들여다보는 시간입니다.',
      image: 왕실생활실Image,
      imagePosition: 'center 20%',
      exhibitionHallId: '2_Royal_Life',
      onClick: () => handleExhibitionClick('royal-life')
    },
    {
      id: 'empire',
      title: '대한제국',
      floor: '1층',
      floorValue: '1층',
      difficulty: '★★☆',
      description: '대한제국 시기의 역사와 문화를 통해 근대 전환기의 조선을 만나보세요.',
      image: 대한제국실Image,
      imagePosition: 'center 20%',
      exhibitionHallId: '3_Empire_of_Korea',
      onClick: () => handleExhibitionClick('empire')
    },
    {
      id: 'painting',
      title: '궁중서화',
      floor: '지하 1층',
      floorValue: '지하 1층',
      difficulty: '★★☆',
      description: '조선 왕실의 품격을 담은 다양한 서화 작품들을 통해 궁중 문화의 예술성을 만나보세요.',
      image: 궁중서화실Image,
      imagePosition: 'center 20%',
      exhibitionHallId: '4_Palace_Painting',
      onClick: () => handleExhibitionClick('painting')
    },
    {
      id: 'ritual',
      title: '왕실의례',
      floor: '지하 1층',
      floorValue: '지하 1층',
      difficulty: '★☆☆',
      description: '조선 왕조의 위엄과 권위를 상징하는 다양한 의례용품을 통해 왕실의 의례 문화를 탐험해보세요.',
      image: 왕실의례실Image,
      imagePosition: 'center 20%',
      exhibitionHallId: '5_Royal_Ritual',
      onClick: () => handleExhibitionClick('ritual')
    },
    {
      id: 'science',
      title: '과학문화',
      floor: '지하 1층',
      floorValue: '지하 1층',
      difficulty: '★☆☆',
      description: '자격루, 앙부일구 등 조선 시대의 뛰어난 과학 기술과 천문학적 성취를 확인하세요.',
      image: 과학문화실Image,
      imagePosition: 'center 20%',
      exhibitionHallId: '6_Science_Culture',
      onClick: () => handleExhibitionClick('science')
    }
  ]

  // 전시관 데이터에 진행률과 상태 동기화
  const exhibitionsWithProgress = exhibitions.map(exhibition => {
    if (exhibition.exhibitionHallId) {
      const progress = calculateProgress(exhibition.exhibitionHallId)
      const status = getStatusFromProgress(progress)
      return {
        ...exhibition,
        progress,
        status,
        showProgress: progress > 0 && progress < 100
      }
    }
    return exhibition
  })

  // 랜덤 추천 전시관 선택 (컴포넌트 마운트 시 한 번만)
  useEffect(() => {
    if (exhibitions.length > 0 && !featuredExhibition) {
      const randomIndex = Math.floor(Math.random() * exhibitions.length)
      setFeaturedExhibition(exhibitions[randomIndex])
    }
  }, []) // 컴포넌트 마운트 시 한 번만 실행

  // 추천 전시관 정보 업데이트 (진행률 반영)
  useEffect(() => {
    if (featuredExhibition && exhibitionsWithProgress.length > 0) {
      const updated = exhibitionsWithProgress.find(ex => ex.id === featuredExhibition.id)
      if (updated) {
        setFeaturedExhibition(prev => ({
          ...updated,
          // onClick은 유지
          onClick: prev?.onClick || updated.onClick
        }))
      }
    }
  }, [activityStatus]) // activityStatus가 변경되면 진행률 업데이트

  // 필터링된 전시관 목록
  const filteredExhibitions = selectedFilter === '전체' 
    ? exhibitionsWithProgress 
    : exhibitionsWithProgress.filter(ex => ex.floorValue === selectedFilter)

  return (
    <div className="exhibition-hall-list-container">
      {/* 헤더 */}
      <div className="exhibition-hall-list-header">
        <button 
          className="exhibition-hall-list-back-button"
          onClick={handleBack}
        >
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h2 className="exhibition-hall-list-title">전시관 탐험</h2>
        <button 
          className="exhibition-hall-list-search-button" 
          style={{ position: 'relative' }}
          onClick={() => navigate('/student/messages')}
        >
          <span className="material-symbols-outlined">mail</span>
          <span style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            width: '10px',
            height: '10px',
            backgroundColor: '#ef4444',
            borderRadius: '50%',
            border: '2px solid white'
          }}></span>
        </button>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="exhibition-hall-list-content">
        {/* 추천 전시관 카드 */}
        {featuredExhibition && (
          <div 
            className="exhibition-hall-list-featured"
            onClick={() => featuredExhibition.onClick && featuredExhibition.onClick()}
            style={{ cursor: 'pointer' }}
          >
            <div 
              className="exhibition-hall-list-featured-image"
              style={{
                backgroundImage: typeof featuredExhibition.image === 'string' && featuredExhibition.image.startsWith('url(')
                  ? featuredExhibition.image 
                  : `url(${featuredExhibition.image})`,
                backgroundPosition: featuredExhibition.imagePosition || 'center'
              }}
            >
              <div className="exhibition-hall-list-featured-overlay"></div>
              <div className="exhibition-hall-list-featured-content">
                <span className="exhibition-hall-list-featured-badge">이달의 추천</span>
                <h3 className="exhibition-hall-list-featured-title">{featuredExhibition.title}</h3>
                <p className="exhibition-hall-list-featured-subtitle">{featuredExhibition.description}</p>
              </div>
            </div>
          </div>
        )}

        {/* 필터 버튼 */}
        <div className="exhibition-hall-list-filters">
          <button 
            className={`exhibition-hall-list-filter ${selectedFilter === '전체' ? 'active' : ''}`}
            onClick={() => handleFilterClick('전체')}
          >
            <span className="material-symbols-outlined">grid_view</span>
            <span>전체</span>
          </button>
          <button 
            className={`exhibition-hall-list-filter ${selectedFilter === '1층' ? 'active' : ''}`}
            onClick={() => handleFilterClick('1층')}
          >
            <span className="material-symbols-outlined">looks_one</span>
            <span>1층</span>
          </button>
          <button 
            className={`exhibition-hall-list-filter ${selectedFilter === '2층' ? 'active' : ''}`}
            onClick={() => handleFilterClick('2층')}
          >
            <span className="material-symbols-outlined">looks_two</span>
            <span>2층</span>
          </button>
          <button 
            className={`exhibition-hall-list-filter ${selectedFilter === '지하 1층' ? 'active' : ''}`}
            onClick={() => handleFilterClick('지하 1층')}
          >
            <span className="material-symbols-outlined">arrow_downward</span>
            <span>지하 1층</span>
          </button>
        </div>

        {/* 전시관 목록 헤더 */}
        <div className="exhibition-hall-list-section-header">
          <h3 className="exhibition-hall-list-section-title">
            <span className="exhibition-hall-list-section-indicator"></span>
            전시관 목록
          </h3>
          <span className="exhibition-hall-list-count">총 {filteredExhibitions.length}개</span>
        </div>

        {/* 전시관 목록 */}
        <div className="exhibition-hall-list-items">
          {filteredExhibitions.map((exhibition) => (
            <div 
              key={exhibition.id} 
              className="exhibition-hall-list-item"
            >
              <div className="exhibition-hall-list-item-image">
                <div 
                  className="exhibition-hall-list-item-bg"
                  style={{
                    backgroundImage: typeof exhibition.image === 'string' && exhibition.image.startsWith('url(')
                      ? exhibition.image 
                      : `url(${exhibition.image})`,
                    backgroundPosition: exhibition.imagePosition || 'center'
                  }}
                ></div>
                <div className={`exhibition-hall-list-item-status status-${exhibition.status}`}>
                  {exhibition.status === 'progress' && (
                    <>
                      <span className="material-symbols-outlined">timelapse</span>
                      <span>진행중</span>
                    </>
                  )}
                  {exhibition.status === 'available' && (
                    <>
                      <span className="material-symbols-outlined">lock_open</span>
                      <span>탐험 가능</span>
                    </>
                  )}
                  {exhibition.status === 'completed' && (
                    <>
                      <span className="material-symbols-outlined">check_circle</span>
                      <span>완료됨</span>
                    </>
                  )}
                </div>
              </div>
              <div className="exhibition-hall-list-item-content">
                <div className="exhibition-hall-list-item-header">
                  <h4 className="exhibition-hall-list-item-title">{exhibition.title}</h4>
                  <p className="exhibition-hall-list-item-meta">
                    {exhibition.floor} • 난이도 <span className="difficulty">{exhibition.difficulty}</span>
                  </p>
                </div>
                <p className="exhibition-hall-list-item-description">
                  {exhibition.description}
                </p>
                <div className="exhibition-hall-list-item-footer">
                  {exhibition.showProgress && (
                    <div className="exhibition-hall-list-item-progress">
                      <span className="exhibition-hall-list-item-progress-label">진행률</span>
                      <div className="exhibition-hall-list-item-progress-bar">
                        <div 
                          className="exhibition-hall-list-item-progress-fill" 
                          style={{ width: `${exhibition.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  {exhibition.status === 'progress' && (
                    <button 
                      className="exhibition-hall-list-item-button primary"
                      onClick={(e) => {
                        e.stopPropagation()
                        if (exhibition.onClick) exhibition.onClick()
                      }}
                    >
                      <span>계속하기</span>
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                  )}
                  {exhibition.status === 'available' && (
                    <button 
                      className="exhibition-hall-list-item-button secondary"
                      onClick={(e) => {
                        e.stopPropagation()
                        if (exhibition.onClick) exhibition.onClick()
                      }}
                    >
                      <span>탐험 시작</span>
                      <span className="material-symbols-outlined">play_arrow</span>
                    </button>
                  )}
                  {exhibition.status === 'completed' && (
                    <>
                      <span className="exhibition-hall-list-item-badge">
                        <span className="material-symbols-outlined">emoji_events</span>
                        <span>뱃지 획득함</span>
                      </span>
                      <button 
                        className="exhibition-hall-list-item-button tertiary"
                        onClick={(e) => {
                          e.stopPropagation()
                          if (exhibition.onClick) exhibition.onClick()
                        }}
                      >
                        <span>다시 보기</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 하단 네비게이션 바 */}
      <div className="exhibition-hall-list-navbar">
        <button className="exhibition-hall-list-nav-item active">
          <span className="material-symbols-outlined">museum</span>
          <span>전시관</span>
        </button>
        <button 
          className="exhibition-hall-list-nav-item"
          onClick={() => navigate('/student-clear')}
        >
          <span className="material-symbols-outlined">verified</span>
          <span>수료증 확인</span>
        </button>
        <button className="exhibition-hall-list-nav-item" onClick={handleLogout}>
          <span className="material-symbols-outlined">logout</span>
          <span>로그아웃</span>
        </button>
      </div>
    </div>
  )
}

export default ExhibitionHallList

