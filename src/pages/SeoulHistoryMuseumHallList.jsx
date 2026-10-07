import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import StudentLayout from '../components/StudentLayout'
import './SeoulHistoryMuseumHallList.css'
import zone1Image from '../image/SeoulHistoryMuseum/zone1.jpeg'
import zone2Image from '../image/SeoulHistoryMuseum/zone2.jpeg'
import zone3Image from '../image/SeoulHistoryMuseum/zone3.jpeg'
import zone4Image from '../image/SeoulHistoryMuseum/zone4.jpeg'
import { getAllActivityStatus } from '../firebase/firestore'

// 각 Zone별 문제 ID 목록
const ZONE_ACTIVITIES = {
  joseon: Array.from({ length: 24 }, (_, i) => `seoulJoseon${String(i + 1).padStart(2, '0')}`),
  empire: Array.from({ length: 10 }, (_, i) => `seoulEmpire${String(i + 1).padStart(2, '0')}`),
  colonial: Array.from({ length: 10 }, (_, i) => `seoulColonial${String(i + 1).padStart(2, '0')}`),
  growth: Array.from({ length: 15 }, (_, i) => `seoulGrowth${String(i + 1).padStart(2, '0')}`)
}

function SeoulHistoryMuseumHallList({ user }) {
  const navigate = useNavigate()
  const [selectedFilter, setSelectedFilter] = useState('전체')
  const [loading, setLoading] = useState(true)
  const [featuredExhibition, setFeaturedExhibition] = useState(null)
  const [zoneProgress, setZoneProgress] = useState({})

  const handleExhibitionClick = (exhibitionId, e) => {
    // 이벤트 전파 방지
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    
    // Zone 클릭 시 해당 Zone 시작 화면으로 이동
    if (exhibitionId === 'joseon') {
      navigate('/1_Seoul_Joseon/1_Start')
    } else if (exhibitionId === 'empire') {
      navigate('/2_Seoul_Empire/1_Start')
    } else if (exhibitionId === 'colonial') {
      navigate('/3_Seoul_Colonial/1_Start')
    } else if (exhibitionId === 'growth') {
      navigate('/4_Seoul_Growth/1_Start')
    }
  }

  const handleFilterClick = (filter) => {
    setSelectedFilter(filter)
  }

  // 사용자 진행률 가져오기
  useEffect(() => {
    const fetchProgress = async () => {
      if (!user?.uid && !user?.email) {
        setLoading(false)
        return
      }

      try {
        const result = await getAllActivityStatus(user.uid, user.email)
        if (result.success && result.status) {
          const progress = {}
          
          // 각 Zone별 진행률 계산
          Object.entries(ZONE_ACTIVITIES).forEach(([zoneId, activities]) => {
            const total = activities.length
            const completed = activities.filter(activityId => result.status[activityId] === true).length
            const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0
            
            progress[zoneId] = {
              completed,
              total,
              progress: progressPercent
            }
          })
          
          setZoneProgress(progress)
        }
      } catch (error) {
        console.error('진행률 가져오기 오류:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProgress()
  }, [user])

  // Zone 데이터 (전시관 형태로 변환)
  const getExhibitionStatus = (zoneId) => {
    const progress = zoneProgress[zoneId]
    if (!progress) return 'available'
    
    if (progress.progress === 100) return 'completed'
    if (progress.progress > 0) return 'progress'
    return 'available'
  }

  const exhibitions = useMemo(() => {
    const createExhibition = (id, title, floor, floorValue, difficulty, description, image, imagePosition, zoneId) => {
      const progress = zoneProgress[zoneId]?.progress || 0
      const status = getExhibitionStatus(zoneId)
      return {
        id,
        title,
        floor,
        floorValue,
        difficulty,
        description,
        image,
        imagePosition,
        status,
        progress,
        showProgress: progress > 0 && progress < 100,
        onClick: (e) => handleExhibitionClick(id, e)
      }
    }

    return [
      createExhibition('joseon', '조선시대의 서울', 'Zone 1', 'Zone 1', '★★☆', 
        '1392년부터 1863년까지 약 500년간 지속된 조선시대 서울의 모습을 탐험해보세요. 경복궁과 한양도성 등 조선시대 서울의 역사를 만나보세요.',
        zone1Image, 'top', 'joseon'),
      createExhibition('empire', '개항과 대한제국', 'Zone 2', 'Zone 2', '★★☆',
        '1863년부터 1910년까지 개항과 대한제국 시기의 서울을 탐험해보세요. 근대화의 길을 걷기 시작한 조선의 변화를 만나보세요.',
        zone2Image, 'center', 'empire'),
      createExhibition('colonial', '일제강점기의 서울', 'Zone 3', 'Zone 3', '★★★',
        '1910년부터 1945년까지 일제강점기 서울의 모습을 탐험해보세요. 식민지 지배와 민족의 저항이 공존했던 시기를 만나보세요.',
        zone3Image, 'top', 'colonial'),
      createExhibition('growth', '고도성장기 서울', 'Zone 4', 'Zone 4', '★☆☆',
        '1945년부터 2002년까지 고도성장기 서울의 변화를 탐험해보세요. 산업화와 도시화가 동시에 진행된 현대 서울의 탄생을 만나보세요.',
        zone4Image, 'top', 'growth')
    ]
  }, [zoneProgress])

  // 랜덤 추천 전시관 선택 (진행률이 업데이트된 후)
  useEffect(() => {
    if (exhibitions.length > 0 && !loading) {
      // 잠기지 않은 전시관 중에서 선택
      const availableExhibitions = exhibitions.filter(ex => ex.status !== 'locked')
      if (availableExhibitions.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableExhibitions.length)
        setFeaturedExhibition(availableExhibitions[randomIndex])
      } else {
        setFeaturedExhibition(exhibitions[0])
      }
    }
  }, [loading, exhibitions])

  // 필터링된 전시관 목록
  const filteredExhibitions = selectedFilter === '전체' 
    ? exhibitions 
    : exhibitions.filter(ex => ex.floorValue === selectedFilter)

  if (loading) {
    return (
      <StudentLayout title="전시관 탐험" backPath="/seoul-history-museum" activeNav="museum" museumType="seoul">
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p>로딩 중...</p>
        </div>
      </StudentLayout>
    )
  }

  return (
    <StudentLayout 
      title="전시관 탐험" 
      backPath="/seoul-history-museum"
      activeNav="museum"
      museumType="seoul"
    >
      <div className="seoul-hall-list-content">
        {/* 추천 전시관 카드 */}
        {featuredExhibition && (
          <div 
            className="seoul-hall-list-featured"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              if (featuredExhibition.onClick) featuredExhibition.onClick(e)
            }}
            style={{ cursor: featuredExhibition.onClick ? 'pointer' : 'default' }}
          >
            <div 
              className="seoul-hall-list-featured-image"
              style={{
                backgroundImage: typeof featuredExhibition.image === 'string' && featuredExhibition.image.startsWith('url(')
                  ? featuredExhibition.image 
                  : `url(${featuredExhibition.image})`,
                backgroundPosition: featuredExhibition.imagePosition || 'center'
              }}
            >
              <div className="seoul-hall-list-featured-overlay"></div>
              <div className="seoul-hall-list-featured-content">
                <span className="seoul-hall-list-featured-badge">이달의 추천</span>
                <h3 className="seoul-hall-list-featured-title">{featuredExhibition.title}</h3>
                <p className="seoul-hall-list-featured-subtitle">{featuredExhibition.description}</p>
              </div>
            </div>
          </div>
        )}

        {/* 필터 버튼 */}
        <div className="seoul-hall-list-filters">
          <button 
            className={`seoul-hall-list-filter ${selectedFilter === '전체' ? 'active' : ''}`}
            onClick={() => handleFilterClick('전체')}
          >
            <span className="material-symbols-outlined">grid_view</span>
            <span>전체</span>
          </button>
          <button 
            className={`seoul-hall-list-filter ${selectedFilter === 'Zone 1' ? 'active' : ''}`}
            onClick={() => handleFilterClick('Zone 1')}
          >
            <span className="material-symbols-outlined">looks_one</span>
            <span>Zone 1</span>
          </button>
          <button 
            className={`seoul-hall-list-filter ${selectedFilter === 'Zone 2' ? 'active' : ''}`}
            onClick={() => handleFilterClick('Zone 2')}
          >
            <span className="material-symbols-outlined">looks_two</span>
            <span>Zone 2</span>
          </button>
          <button 
            className={`seoul-hall-list-filter ${selectedFilter === 'Zone 3' ? 'active' : ''}`}
            onClick={() => handleFilterClick('Zone 3')}
          >
            <span className="material-symbols-outlined">looks_3</span>
            <span>Zone 3</span>
          </button>
          <button 
            className={`seoul-hall-list-filter ${selectedFilter === 'Zone 4' ? 'active' : ''}`}
            onClick={() => handleFilterClick('Zone 4')}
          >
            <span className="material-symbols-outlined">looks_4</span>
            <span>Zone 4</span>
          </button>
        </div>

        {/* 전시관 목록 헤더 */}
        <div className="seoul-hall-list-section-header">
          <h3 className="seoul-hall-list-section-title">
            <span className="seoul-hall-list-section-indicator"></span>
            전시관 목록
          </h3>
          <span className="seoul-hall-list-count">총 {filteredExhibitions.length}개</span>
        </div>

        {/* 전시관 목록 */}
        <div className="seoul-hall-list-items">
          {filteredExhibitions.map((exhibition) => (
            <div 
              key={exhibition.id} 
              className={`seoul-hall-list-item ${exhibition.status === 'locked' ? 'disabled' : ''}`}
              onClick={(e) => {
                if (exhibition.onClick) {
                  e.preventDefault()
                  e.stopPropagation()
                  exhibition.onClick(e)
                }
              }}
              style={{ cursor: exhibition.onClick ? 'pointer' : 'not-allowed' }}
            >
              <div className="seoul-hall-list-item-image">
                <div 
                  className="seoul-hall-list-item-bg"
                  style={{
                    backgroundImage: typeof exhibition.image === 'string' && exhibition.image.startsWith('url(')
                      ? exhibition.image 
                      : `url(${exhibition.image})`,
                    backgroundPosition: exhibition.imagePosition || 'center'
                  }}
                ></div>
                {exhibition.status !== 'locked' && (
                  <div className={`seoul-hall-list-item-status status-${exhibition.status}`}>
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
                )}
                {exhibition.status === 'locked' && (
                  <div className="seoul-hall-list-item-status status-locked">
                    <span className="material-symbols-outlined">lock</span>
                    <span>잠김</span>
                  </div>
                )}
              </div>
              <div className="seoul-hall-list-item-content">
                <div className="seoul-hall-list-item-header">
                  <h4 className="seoul-hall-list-item-title">{exhibition.title}</h4>
                  <p className="seoul-hall-list-item-meta">
                    {exhibition.floor} • 난이도 <span className="difficulty">{exhibition.difficulty}</span>
                  </p>
                </div>
                <p className="seoul-hall-list-item-description">
                  {exhibition.description}
                </p>
                <div className="seoul-hall-list-item-footer">
                  {exhibition.showProgress && (
                    <div className="seoul-hall-list-item-progress">
                      <span className="seoul-hall-list-item-progress-label">진행률</span>
                      <div className="seoul-hall-list-item-progress-bar">
                        <div 
                          className="seoul-hall-list-item-progress-fill" 
                          style={{ width: `${exhibition.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  {exhibition.status === 'progress' && (
                    <button 
                      className="seoul-hall-list-item-button primary"
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
                      className="seoul-hall-list-item-button secondary"
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
                      <span className="seoul-hall-list-item-badge">
                        <span className="material-symbols-outlined">emoji_events</span>
                        <span>뱃지 획득함</span>
                      </span>
                      <button 
                        className="seoul-hall-list-item-button tertiary"
                        onClick={(e) => {
                          e.stopPropagation()
                          if (exhibition.onClick) exhibition.onClick()
                        }}
                      >
                        <span>다시 보기</span>
                      </button>
                    </>
                  )}
                  {exhibition.status === 'locked' && (
                    <div className="seoul-hall-list-item-locked-message">
                      <span className="material-symbols-outlined">lock</span>
                      <span>이전 단계 완료 필요</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </StudentLayout>
  )
}

export default SeoulHistoryMuseumHallList


