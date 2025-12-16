import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './ExhibitionHallList.css'
import 어좌Image from '../image/eojwa.jpg'

function ExhibitionHallList() {
  const navigate = useNavigate()
  const [selectedFilter, setSelectedFilter] = useState('전체')

  const handleBack = () => {
    navigate(-1)
  }

  const handleExhibitionClick = (exhibitionId) => {
    // 전시관 클릭 시 해당 전시관 시작 화면으로 이동
    if (exhibitionId === 'king') {
      navigate('/1_King_of_Joseon/1_Start')
    }
    // 다른 전시관들도 추가 가능
  }

  const handleFilterClick = (filter) => {
    setSelectedFilter(filter)
  }

  // 전시관 데이터
  const exhibitions = [
    {
      id: 'king',
      title: '조선국왕',
      floor: '2층',
      floorValue: '2층',
      difficulty: '★★☆',
      description: '조선 국왕의 생애와 권위를 상징하는 어보, 어책 등 왕실 유물을 통해 조선 왕실의 역사를 탐험해보세요.',
      image: 어좌Image,
      imagePosition: 'center 20%',
      status: 'progress',
      progress: 45,
      onClick: () => handleExhibitionClick('king')
    },
    {
      id: 'royal-life',
      title: '왕실생활',
      floor: '2층',
      floorValue: '2층',
      difficulty: '★☆☆',
      description: '500년 조선 왕조의 중심이었던 궁궐의 건축미와 생활 공간을 자세히 들여다보는 시간입니다.',
      image: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA6TGeoSso7ZW7GJOvrHbhCzUwXtpvtN36jotZVjYUA5YM2IQ_ZtWM9pYIdCC1XL5k9_RTWfDS6H3ellt6DpO8j-8uwGG7KUOzLDiyye-UHSDd-E_MZ5_AsWj2mZh869hsK1pSKl1vjZH1bUvmveSyabrpZHnG8ZnL9FdOqeUfMoX_t2b9RFCI3UEMVJ8dNea1l87exJ0cX2vbvmhScFRFk1rcTbOuGWjeJ0jQz_pBK_pY6sY0yGKy324VdVi0eKclTPeyNtG2apHX")',
      status: 'available'
    },
    {
      id: 'empire',
      title: '대한제국',
      floor: '1층',
      floorValue: '1층',
      difficulty: '★★☆',
      description: '대한제국 시기의 역사와 문화를 통해 근대 전환기의 조선을 만나보세요.',
      image: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBLkT6yhVYSJSWFWwth09wQLkyd9XCuzxfiH9xFQltQPZFSfeVCPjV2f-NhY01lrMh941ngMoInubapDxIoP-6pbxma_6aVMHVnRov9Dj22DM583lBNNPRLCkrRkuyTiybiJzNLJOdmVjUnjukOPLtwZDMUAewf5B6r-t1VriHsOf2voT26oiZot942boqBBEPFMn7n1UNUoPwpsPe1xIS3inJu7EGx3S0ondpxpBENZaHbUEUj2uc-dYHkcYU5rD7o1Tp8tfntQyQX")',
      status: 'available'
    },
    {
      id: 'eocha',
      title: '어차',
      floor: '1층',
      floorValue: '1층',
      difficulty: '★☆☆',
      description: '조선 왕실의 의례와 행차에 사용된 어차를 통해 왕실의 위엄을 느껴보세요.',
      image: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBLkT6yhVYSJSWFWwth09wQLkyd9XCuzxfiH9xFQltQPZFSfeVCPjV2f-NhY01lrMh941ngMoInubapDxIoP-6pbxma_6aVMHVnRov9Dj22DM583lBNNPRLCkrRkuyTiybiJzNLJOdmVjUnjukOPLtwZDMUAewf5B6r-t1VriHsOf2voT26oiZot942boqBBEPFMn7n1UNUoPwpsPe1xIS3inJu7EGx3S0ondpxpBENZaHbUEUj2uc-dYHkcYU5rD7o1Tp8tfntQyQX")',
      status: 'available'
    },
    {
      id: 'painting',
      title: '궁중서화',
      floor: '지하 1층',
      floorValue: '지하 1층',
      difficulty: '★★☆',
      description: '조선 왕실의 품격을 담은 다양한 서화 작품들을 통해 궁중 문화의 예술성을 만나보세요.',
      image: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC_UfAp2iZWvwxBDEiKEzeZOK3yXpo4ra0CX508KZVEemVqyyCn7bj5B-zwmCVEahsBs9hu6Xor47Aa6iffE5p4mBUEfg1vcI376i23TBUieIxRuUXvi1NjRxFn4YykdozxUAYpIwnRQZjTyI9LzvyC_EjzHzQU4wc7qzMetzTk27-QahC77SVEEHrcmNhAgWc9MD1b4VyXIMYRkdeWeUrMCt9iSDXJYg48VPhzNrJwVTanmwyeqYFAsW2ADVvsWhfSiFZPb5czVph5")',
      status: 'available'
    },
    {
      id: 'ritual',
      title: '왕실의례',
      floor: '지하 1층',
      floorValue: '지하 1층',
      difficulty: '★★☆',
      description: '조선 왕조의 위엄과 권위를 상징하는 다양한 의례용품을 통해 왕실의 의례 문화를 탐험해보세요.',
      image: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBLkT6yhVYSJSWFWwth09wQLkyd9XCuzxfiH9xFQltQPZFSfeVCPjV2f-NhY01lrMh941ngMoInubapDxIoP-6pbxma_6aVMHVnRov9Dj22DM583lBNNPRLCkrRkuyTiybiJzNLJOdmVjUnjukOPLtwZDMUAewf5B6r-t1VriHsOf2voT26oiZot942boqBBEPFMn7n1UNUoPwpsPe1xIS3inJu7EGx3S0ondpxpBENZaHbUEUj2uc-dYHkcYU5rD7o1Tp8tfntQyQX")',
      status: 'available'
    },
    {
      id: 'science',
      title: '과학문화',
      floor: '지하 1층',
      floorValue: '지하 1층',
      difficulty: '★★★',
      description: '자격루, 앙부일구 등 조선 시대의 뛰어난 과학 기술과 천문학적 성취를 확인하세요.',
      image: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAUvCY10LdypDXyN1tdZCsYyKk1UOIRXqn7wN_vg0hUlYQSlSt-fvVLmHAOIBc2keoqJbS7l7i3njNdYiodWU98TRm8T-P8U_j7qrsjr11X9dlUlsoU1OONItefRw6HsjDAUxsyLlWRJN-FHWjTAVBAT6e9yVBYj3lTCdZFW5sTFacYqiYgRZKF1jS-myxbWppuJGJPS4Pk0iPD98nwDcAZhTXryx3RpbEADnuRE9j0hfouDxUu0RjiwAFtk7THjr6nBG_X-sVUe50s")',
      status: 'completed'
    }
  ]

  // 필터링된 전시관 목록
  const filteredExhibitions = selectedFilter === '전체' 
    ? exhibitions 
    : exhibitions.filter(ex => ex.floorValue === selectedFilter)

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
        <button className="exhibition-hall-list-search-button">
          <span className="material-symbols-outlined">search</span>
        </button>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="exhibition-hall-list-content">
        {/* 추천 전시관 카드 */}
        <div className="exhibition-hall-list-featured">
          <div 
            className="exhibition-hall-list-featured-image"
            style={{
              backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBLkT6yhVYSJSWFWwth09wQLkyd9XCuzxfiH9xFQltQPZFSfeVCPjV2f-NhY01lrMh941ngMoInubapDxIoP-6pbxma_6aVMHVnRov9Dj22DM583lBNNPRLCkrRkuyTiybiJzNLJOdmVjUnjukOPLtwZDMUAewf5B6r-t1VriHsOf2voT26oiZot942boqBBEPFMn7n1UNUoPwpsPe1xIS3inJu7EGx3S0ondpxpBENZaHbUEUj2uc-dYHkcYU5rD7o1Tp8tfntQyQX")'
            }}
          >
            <div className="exhibition-hall-list-featured-overlay"></div>
            <div className="exhibition-hall-list-featured-content">
              <span className="exhibition-hall-list-featured-badge">이달의 추천</span>
              <h3 className="exhibition-hall-list-featured-title">왕실의 의례</h3>
              <p className="exhibition-hall-list-featured-subtitle">조선 왕조의 위엄과 권위를 느껴보세요</p>
            </div>
          </div>
        </div>

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
              onClick={exhibition.onClick}
            >
              <div className="exhibition-hall-list-item-image">
                <div 
                  className="exhibition-hall-list-item-bg"
                  style={{
                    backgroundImage: typeof exhibition.image === 'string' ? exhibition.image : `url(${exhibition.image})`,
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
                  {exhibition.progress !== undefined && (
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
                    <button className="exhibition-hall-list-item-button primary">
                      <span>계속하기</span>
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                  )}
                  {exhibition.status === 'available' && (
                    <button className="exhibition-hall-list-item-button secondary">
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
                      <button className="exhibition-hall-list-item-button tertiary">
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
        <button className="exhibition-hall-list-nav-item">
          <span className="material-symbols-outlined">map</span>
          <span>지도</span>
        </button>
        <button className="exhibition-hall-list-nav-item">
          <span className="material-symbols-outlined">person</span>
          <span>마이</span>
        </button>
      </div>
    </div>
  )
}

export default ExhibitionHallList
