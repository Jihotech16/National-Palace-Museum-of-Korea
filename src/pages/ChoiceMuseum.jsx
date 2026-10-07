import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { logout } from '../firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { getSchoolInfo } from '../firebase/firestore'
import seoulMuseumImage from '../image/SeoulHistoryMuseum/서울역사박물관.jpeg'
import './ChoiceMuseum.css'

function ChoiceMuseum({ user }) {
  const navigate = useNavigate()
  const [studentInfo, setStudentInfo] = useState(null)
  const [schoolPeriods, setSchoolPeriods] = useState(null)
  const [loading, setLoading] = useState(false)
  const [headerHeight, setHeaderHeight] = useState(64)
  const headerRef = useRef(null)

  useEffect(() => {
    // dark 모드 사용
    document.documentElement.classList.add('dark')
    if (user) {
      loadStudentInfo()
    }
    return () => {
      // 필요시 언마운트 시 제거
    }
  }, [user])

  useEffect(() => {
    // 헤더 높이 계산
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight)
      }
    }
    
    updateHeaderHeight()
    window.addEventListener('resize', updateHeaderHeight)
    
    return () => {
      window.removeEventListener('resize', updateHeaderHeight)
    }
  }, [studentInfo]) // studentInfo가 변경되면 헤더 높이 재계산

  const loadStudentInfo = async () => {
    if (!user) {
      setLoading(false)
      return
    }
    
    try {
      setLoading(true)
      
      // user.uid가 Firebase Auth UID인 경우, user.email에서 학번 추출
      let studentId = user.uid
      const isFirebaseUID = user.uid && user.uid.length > 20 && !/^\d+$/.test(user.uid)
      
      if (isFirebaseUID) {
        if (user.email && typeof user.email === 'string' && user.email.includes('@student.local')) {
          // userEmail에서 학번 추출
          studentId = user.email.replace('@student.local', '')
        } else {
          // userEmail이 없으면 users/{user.uid} 문서에서 studentId 찾기 시도
          const userRef = doc(db, 'users', user.uid)
          const userDoc = await getDoc(userRef)
          
          if (userDoc.exists()) {
            const userData = userDoc.data()
            studentId = userData.studentId || user.uid
          }
        }
      }
      
      // 학번으로 users 문서 읽기
      const userRef = doc(db, 'users', studentId)
      const userDoc = await getDoc(userRef)
      
      if (userDoc.exists()) {
        const data = userDoc.data()
        const schoolCode = data.schoolCode || null
        setStudentInfo({
          schoolCode,
          schoolName: data.schoolName || '',
          grade: data.grade || 0,
          classNum: data.classNum || 0,
          number: data.number || 0
        })
        
        // 학교 정보에서 박물관 기간 정보 가져오기
        if (schoolCode) {
          const schoolResult = await getSchoolInfo(schoolCode)
          if (schoolResult.success && schoolResult.data) {
            const data = schoolResult.data
            let periods = data.museumPeriods || null
            // 구버전 단일 필드(museumStartDate/End)만 있는 학교: 고궁 기간으로 간주 (학생 화면에서도 인식)
            const legacyStart = data.museumStartDate
            const legacyEnd = data.museumEndDate
            if (
              (!periods || Object.keys(periods).length === 0) &&
              legacyStart &&
              legacyEnd
            ) {
              periods = {
                palace: { startDate: legacyStart, endDate: legacyEnd }
              }
            }
            setSchoolPeriods(periods)
          }
        }
      } else {
        setStudentInfo({
          schoolCode: null,
          schoolName: '',
          grade: 0,
          classNum: 0,
          number: 0
        })
      }
    } catch (error) {
      console.error('학생 정보 로드 오류:', error)
      setStudentInfo({
        schoolName: '',
        grade: 0,
        classNum: 0,
        number: 0
      })
    } finally {
      setLoading(false)
    }
  }

  const getStudentInfoText = () => {
    if (!studentInfo) return ''
    const parts = []
    if (studentInfo.schoolName) parts.push(studentInfo.schoolName)
    if (studentInfo.grade) parts.push(`${studentInfo.grade}학년`)
    if (studentInfo.classNum) parts.push(`${studentInfo.classNum}반`)
    if (studentInfo.number) parts.push(`${studentInfo.number}번`)
    return parts.join(' ')
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  // 한국 시간으로 현재 날짜/시간 가져오기
  const getKoreaDateTime = () => {
    const now = new Date()
    // 한국 시간(KST, UTC+9)으로 변환
    const koreaTimeStr = now.toLocaleString('en-US', { 
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    })
    // "MM/DD/YYYY, HH:MM:SS" 형식을 Date 객체로 변환
    const [datePart, timePart] = koreaTimeStr.split(', ')
    const [month, day, year] = datePart.split('/')
    const [hours, minutes, seconds] = timePart.split(':')
    return new Date(year, month - 1, day, hours, minutes, seconds)
  }

  // 박물관 기간 체크 함수
  const isMuseumAvailable = (museumId) => {
    // 기간 정보가 없으면 이용 불가
    if (!schoolPeriods) return false
    
    const period = schoolPeriods[museumId]
    if (!period || !period.startDate || !period.endDate) {
      // 기간이 설정되지 않았으면 이용 불가
      return false
    }
    
    // 한국 시간으로 현재 날짜/시간 가져오기
    const now = getKoreaDateTime()
    
    // Timestamp 객체인 경우 toDate() 호출, 이미 Date 객체면 그대로 사용
    const startDateTime = period.startDate?.toDate ? period.startDate.toDate() : new Date(period.startDate)
    // 한국 시간대로 변환
    const koreaStartStr = startDateTime.toLocaleString('en-US', { 
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    })
    const [startDatePart, startTimePart] = koreaStartStr.split(', ')
    const [startMonth, startDay, startYear] = startDatePart.split('/')
    const [startHours, startMinutes] = startTimePart.split(':')
    const koreaStartDateTime = new Date(startYear, startMonth - 1, startDay, startHours, startMinutes)
    
    const endDateTime = period.endDate?.toDate ? period.endDate.toDate() : new Date(period.endDate)
    // 한국 시간대로 변환
    const koreaEndStr = endDateTime.toLocaleString('en-US', { 
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    })
    const [endDatePart, endTimePart] = koreaEndStr.split(', ')
    const [endMonth, endDay, endYear] = endDatePart.split('/')
    const [endHours, endMinutes] = endTimePart.split(':')
    const koreaEndDateTime = new Date(endYear, endMonth - 1, endDay, endHours, endMinutes)
    
    return now >= koreaStartDateTime && now <= koreaEndDateTime
  }
  
  // 박물관 기간 정보 가져오기 (한국 시간으로 변환)
  const getMuseumPeriod = (museumId) => {
    if (!schoolPeriods) return null
    const period = schoolPeriods[museumId]
    if (!period || !period.startDate || !period.endDate) return null
    
    // Timestamp 객체인 경우 toDate() 호출, 이미 Date 객체면 그대로 사용
    const startDateTime = period.startDate?.toDate ? period.startDate.toDate() : new Date(period.startDate)
    const endDateTime = period.endDate?.toDate ? period.endDate.toDate() : new Date(period.endDate)
    
    // 한국 시간으로 변환
    const koreaStartStr = startDateTime.toLocaleString('en-US', { 
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    })
    const [startDatePart, startTimePart] = koreaStartStr.split(', ')
    const [startMonth, startDay, startYear] = startDatePart.split('/')
    const [startHours, startMinutes] = startTimePart.split(':')
    const koreaStart = new Date(startYear, startMonth - 1, startDay, startHours, startMinutes)
    
    const koreaEndStr = endDateTime.toLocaleString('en-US', { 
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    })
    const [endDatePart, endTimePart] = koreaEndStr.split(', ')
    const [endMonth, endDay, endYear] = endDatePart.split('/')
    const [endHours, endMinutes] = endTimePart.split(':')
    const koreaEnd = new Date(endYear, endMonth - 1, endDay, endHours, endMinutes)
    
    return {
      startDate: koreaStart,
      endDate: koreaEnd
    }
  }

  const handleMuseumSelect = (museumId) => {
    // 기간 체크
    if (!isMuseumAvailable(museumId)) {
      return
    }
    
    if (museumId === 'palace') {
      // 국립고궁박물관 선택 시 LandingPage로 이동
      navigate('/landing')
    } else if (museumId === 'seoul') {
      // 서울역사박물관 선택 시 SeoulHistoryMuseum으로 이동
      navigate('/seoul-history-museum')
    }
  }

  return (
    <div className="choice-museum-container">
      {loading && (
        <div className="choice-museum-loading">로딩 중...</div>
      )}
      {!loading && (
        <>
          {/* Top App Bar */}
          <div className="choice-museum-header" ref={headerRef}>
            <div className="choice-museum-header-inner">
              <div className="choice-museum-header-left">
                <div className="choice-museum-header-icon">
                  <span className="material-symbols-outlined">museum</span>
                </div>
                <h2 className="choice-museum-header-title">박물관 탐험</h2>
              </div>
              <button 
                className="choice-museum-logout-btn"
                onClick={handleLogout}
              >
                <span className="material-symbols-outlined">logout</span>
              </button>
            </div>

            {/* Student Info */}
            {getStudentInfoText() && (
              <div className="choice-museum-student-info">
                <div className="choice-museum-student-info-badge">
                  <span className="material-symbols-outlined">school</span>
                  <p className="choice-museum-student-info-text">{getStudentInfoText()}</p>
                </div>
              </div>
            )}
          </div>

          {/* Spacer for fixed header */}
          <div className="choice-museum-header-spacer" style={{ height: `${headerHeight}px` }}></div>

          {/* Main Headline */}
          <div className="choice-museum-headline">
            <h1 className="choice-museum-headline-title">
              오늘의 탐험 장소를<br/>선택해주세요.
            </h1>
          </div>

          {/* Active Museum Cards */}
          <div className="choice-museum-cards">
        {/* Card 1: National Palace Museum */}
        {(() => {
          const isAvailable = isMuseumAvailable('palace')
          const period = getMuseumPeriod('palace')
          const isDisabled = !isAvailable
          
          return (
            <div className={`choice-museum-card choice-museum-card-palace ${isDisabled ? 'choice-museum-card-disabled' : ''}`}>
              <div 
                className="choice-museum-card-image"
                style={{
                  backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCPRiDyjF0nFvKAf4Z4TbYWKLr989KaLWrjZ5RCJfSYgsc3oLUVeGj-7vCAA7KgR8p0H3WN-6eh-IRjeJARUiPRJbFKnCVWMvQhCwCtVaQFMQo8xeEL9k2pIKzhHW8r3gok9GXSS9mjKwqnbCfyiLRnGNbsfLKkHBcXXrqufZtDixNWSLYPoM8Nz_s1f-ZhKhOq2SEBWb7Cm1ZnNsl0pN4HxNzAZpKvZKfMPNvl4ExwF8fyVK2PGw9_iUws1OkRwNEbqfTQxn5pJzNT")'
                }}
              >
                <div className="choice-museum-card-overlay"></div>
                <div className={`choice-museum-card-badge ${isAvailable ? 'choice-museum-card-badge-available' : 'choice-museum-card-badge-unavailable'}`}>
                  {isAvailable ? '이용 가능' : '이용 불가'}
                </div>
              </div>
              <div className="choice-museum-card-content">
                <div className="choice-museum-card-header">
                  <div>
                    <p className="choice-museum-card-label choice-museum-card-label-palace">National Palace Museum</p>
                    <h3 className="choice-museum-card-title">국립고궁박물관</h3>
                  </div>
                  <div className="choice-museum-card-icon choice-museum-card-icon-palace">
                    <span className="material-symbols-outlined">explore</span>
                  </div>
                </div>
                <p className="choice-museum-card-description">
                  조선 왕실의 역사와 문화를 탐험해보세요. 왕의 생활부터 궁중 음악까지 다양한 미션이 기다립니다.
                </p>
                {period && (
                  <div className="choice-museum-card-period-info">
                    <p className="choice-museum-card-period-start">
                      <span className="material-symbols-outlined">play_circle</span>
                      <span>
                        <strong>{period.startDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })} {String(period.startDate.getHours()).padStart(2, '0')}:{String(period.startDate.getMinutes()).padStart(2, '0')}</strong>부터 시작
                      </span>
                    </p>
                    <p className="choice-museum-card-period-end">
                      <span className="material-symbols-outlined">stop_circle</span>
                      <span>
                        {period.endDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })} {String(period.endDate.getHours()).padStart(2, '0')}:{String(period.endDate.getMinutes()).padStart(2, '0')}까지
                      </span>
                    </p>
                  </div>
                )}
                {!isAvailable && period && (
                  <p className="choice-museum-card-period-error">
                    <span className="material-symbols-outlined">error</span>
                    현재 설정된 활동 기간이 아닙니다.
                  </p>
                )}
                <button 
                  className={`choice-museum-card-button choice-museum-card-button-palace ${isDisabled ? 'choice-museum-card-button-disabled' : ''}`}
                  onClick={() => handleMuseumSelect('palace')}
                  disabled={isDisabled}
                >
                  <span>{isDisabled ? '활동 기간이 아닙니다' : '탐험 시작하기'}</span>
                  <span className="material-symbols-outlined">{isDisabled ? 'lock' : 'arrow_forward'}</span>
                </button>
              </div>
            </div>
          )
        })()}

        {/* Card 2: Seoul Museum of History */}
        {(() => {
          const isAvailable = isMuseumAvailable('seoul')
          const period = getMuseumPeriod('seoul')
          const isDisabled = !isAvailable
          const seoulRaw = schoolPeriods?.seoul
          const hasSeoulStored = !!(seoulRaw?.startDate && seoulRaw?.endDate)
          const palaceRaw = schoolPeriods?.palace
          const hasPalaceStored = !!(palaceRaw?.startDate && palaceRaw?.endDate)
          
          return (
            <div className={`choice-museum-card choice-museum-card-seoul ${isDisabled ? 'choice-museum-card-disabled' : ''}`}>
              <div 
                className="choice-museum-card-image"
                style={{
                  backgroundImage: `url(${seoulMuseumImage})`
                }}
              >
                <div className="choice-museum-card-overlay"></div>
                <div className={`choice-museum-card-badge ${isAvailable ? 'choice-museum-card-badge-available choice-museum-card-badge-seoul' : 'choice-museum-card-badge-unavailable'}`}>
                  {isAvailable ? '이용 가능' : '이용 불가'}
                </div>
              </div>
              <div className="choice-museum-card-content">
                <div className="choice-museum-card-header">
                  <div>
                    <p className="choice-museum-card-label choice-museum-card-label-seoul">Seoul Museum of History</p>
                    <h3 className="choice-museum-card-title">서울역사박물관</h3>
                  </div>
                  <div className="choice-museum-card-icon choice-museum-card-icon-seoul">
                    <span className="material-symbols-outlined">history_edu</span>
                  </div>
                </div>
                <p className="choice-museum-card-description">
                  서울의 유구한 역사와 도시의 변화를 느껴보세요. 과거와 현재가 공존하는 특별한 공간입니다.
                </p>
                {period && (
                  <div className="choice-museum-card-period-info">
                    <p className="choice-museum-card-period-start">
                      <span className="material-symbols-outlined">play_circle</span>
                      <span>
                        <strong>{period.startDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })} {String(period.startDate.getHours()).padStart(2, '0')}:{String(period.startDate.getMinutes()).padStart(2, '0')}</strong>부터 시작
                      </span>
                    </p>
                    <p className="choice-museum-card-period-end">
                      <span className="material-symbols-outlined">stop_circle</span>
                      <span>
                        {period.endDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })} {String(period.endDate.getHours()).padStart(2, '0')}:{String(period.endDate.getMinutes()).padStart(2, '0')}까지
                      </span>
                    </p>
                  </div>
                )}
                {!isAvailable && (
                  <p className="choice-museum-card-period-error">
                    <span className="material-symbols-outlined">error</span>
                    {period
                      ? '현재 설정된 활동 기간이 아닙니다.'
                      : hasPalaceStored && !hasSeoulStored
                        ? '서울역사박물관은 관리자에서 고궁과 별도로 활동 기간을 저장해야 합니다.'
                        : '활동 기간이 설정되지 않았습니다.'}
                  </p>
                )}
                <button 
                  className={`choice-museum-card-button choice-museum-card-button-seoul ${isDisabled ? 'choice-museum-card-button-disabled' : ''}`}
                  onClick={() => handleMuseumSelect('seoul')}
                  disabled={isDisabled}
                >
                  <span>{isDisabled ? '활동 기간이 아닙니다' : '탐험 시작하기'}</span>
                  <span className="material-symbols-outlined">{isDisabled ? 'lock' : 'arrow_forward'}</span>
                </button>
              </div>
            </div>
          )
        })()}
      </div>

      {/* Coming Soon Section */}
      <div className="choice-museum-coming-soon">
        <div className="choice-museum-coming-soon-header">
          <h3 className="choice-museum-coming-soon-title">곧 추가될 박물관</h3>
          <span className="material-symbols-outlined choice-museum-coming-soon-more">more_horiz</span>
        </div>
        <div className="choice-museum-coming-soon-cards">
          <div className="choice-museum-coming-soon-card">
            <div className="choice-museum-coming-soon-card-image">
              <div 
                className="choice-museum-coming-soon-card-bg"
                style={{
                  backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCTLQfE9xD4mlN8A_HcquDgaXIS1VtkQ_T76D95eM6jsEOTsso5oMifQLCozCRPT4GYzYobjJxhWSS81UwfsoyA3GxQz69oR60xG9MXmK5JsSnDYQyrTFrHjeU14Xxneu8O3goqNKiqkk9uZmircLOQ-DJCq5ggDWZw7O1Np_kdSMBqLQCWJBRAp7FXUmSj3P9ur3ENcFCcYDdmy17uMZKUVBtOZO9-fM29ukdjSJjGYp9kd_l49JPKpeLDd5y37WPzZZ0yseG2tTVu")'
                }}
              ></div>
              <div className="choice-museum-coming-soon-card-overlay">
                <div className="choice-museum-coming-soon-card-lock">
                  <span className="material-symbols-outlined">lock</span>
                </div>
                <p className="choice-museum-coming-soon-card-text">오픈 예정</p>
              </div>
            </div>
            <p className="choice-museum-coming-soon-card-name">국립중앙박물관</p>
          </div>
          <div className="choice-museum-coming-soon-card">
            <div className="choice-museum-coming-soon-card-image">
              <div 
                className="choice-museum-coming-soon-card-bg"
                style={{
                  backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCyv1jIobAtLc84nsXNRs2O6Y1A6fGkekzsfgagKiYQGlk_PFe5ge1GVZyezAz5mHXSjTW_gytPvfgXIS33xgWl-ERJqrX8ZN3KFNwCUM-kztWZ2u7EOAvbnsMDuPrzDNtgk2N7ZyVAK4oMDDbeBBgelZlxOzn9B4CeNWk6_rLjqv5_CQ6LJx8iJf7BlUaGEhnjOfR6b0KalQApK9yzgOETL7tSnPFHGGKDwNYuE7QwJAwzEqD306ZWUigUkVUa9FRSYDVaGh5k0nNH")'
                }}
              ></div>
              <div className="choice-museum-coming-soon-card-overlay">
                <div className="choice-museum-coming-soon-card-lock">
                  <span className="material-symbols-outlined">lock</span>
                </div>
                <p className="choice-museum-coming-soon-card-text">오픈 예정</p>
              </div>
            </div>
            <p className="choice-museum-coming-soon-card-name">전쟁기념관</p>
          </div>
          <div className="choice-museum-coming-soon-card">
            <div className="choice-museum-coming-soon-card-image">
              <div className="choice-museum-coming-soon-card-placeholder">
                <span className="material-symbols-outlined">add_circle</span>
              </div>
            </div>
            <p className="choice-museum-coming-soon-card-name-placeholder">Coming Soon</p>
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  )
}

export default ChoiceMuseum


