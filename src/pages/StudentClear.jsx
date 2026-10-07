import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { getAllActivityStatus } from '../firebase/firestore'
import { EXHIBITION_HALL_ACTIVITIES } from '../utils/activityOrder'
import html2canvas from 'html2canvas'
import StudentLayout from '../components/StudentLayout'
import './StudentClear.css'
import 국립고궁박물관Image from '../image/NationalPalaceMuseum/국립고궁박물관.jpg'
import 서울역사박물관Image from '../image/SeoulHistoryMuseum/서울역사박물관.jpeg'

function StudentClear({ user }) {
  const navigate = useNavigate()
  const certificateRef = useRef(null)
  const [studentInfo, setStudentInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAllCompleted, setIsAllCompleted] = useState(false)
  const [activityStatus, setActivityStatus] = useState({})
  const [completedMuseums, setCompletedMuseums] = useState({
    palace: false,
    seoul: false
  })
  const [activeTab, setActiveTab] = useState('palace') // 'palace' or 'seoul'
  const [showCelebration, setShowCelebration] = useState(false) // 축하 메시지 표시 여부
  const [showCertificate, setShowCertificate] = useState(false) // 수료증 표시 여부
  const [showTabSelection, setShowTabSelection] = useState(true) // 탭 선택 화면 표시 여부

  useEffect(() => {
    if (user && user.uid) {
      loadStudentInfo()
      checkAllCompleted()
    } else {
      navigate('/login')
    }
  }, [user])

  const loadStudentInfo = async () => {
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
        setStudentInfo({
          name: data.name || user.displayName || '학생',
          schoolName: data.schoolName || '',
          grade: data.grade || 0,
          classNum: data.classNum || 0,
          number: data.number || 0
        })
      } else {
        // 기본 정보 설정
        setStudentInfo({
          name: user.displayName || '학생',
          schoolName: '',
          grade: 0,
          classNum: 0,
          number: 0
        })
      }
    } catch (error) {
      console.error('학생 정보 로드 오류:', error)
      setStudentInfo({
        name: user.displayName || '학생',
        schoolName: '',
        grade: 0,
        classNum: 0,
        number: 0
      })
    } finally {
      setLoading(false)
    }
  }

  const checkAllCompleted = async () => {
    try {
      if (!user || !user.uid) return
      
      // user.email에서 학번 추출하여 전달
      const result = await getAllActivityStatus(user.uid, user.email)
      if (result.success) {
        const status = result.status || {}
        setActivityStatus(status)
        
        // 디버깅: 완료 상태 확인
        console.log('수료증 확인 - 활동지 상태:', status)
        console.log('수료증 확인 - 전시관별 활동지:', EXHIBITION_HALL_ACTIVITIES)
        
        // 고궁박물관 전시관 목록
        const palaceHalls = ['1_King_of_Joseon', '2_Royal_Life', '3_Empire_of_Korea', '4_Palace_Painting', '5_Royal_Ritual', '6_Science_Culture']
        // 서울역사박물관 전시관 목록
        const seoulHalls = ['1_Seoul_Joseon', '2_Seoul_Empire', '3_Seoul_Colonial', '4_Seoul_Growth']
        
        // 고궁박물관 완료 여부 확인
        let palaceCompleted = true
        for (const hallId of palaceHalls) {
          const activities = EXHIBITION_HALL_ACTIVITIES[hallId] || []
          if (activities.length === 0) continue
          
          const completedCount = activities.filter(activityId => status[activityId]).length
          console.log(`[고궁] ${hallId}: ${completedCount}/${activities.length} 완료`)
          
          if (completedCount < activities.length) {
            palaceCompleted = false
            break
          }
        }
        
        // 서울역사박물관 완료 여부 확인
        let seoulCompleted = true
        for (const hallId of seoulHalls) {
          const activities = EXHIBITION_HALL_ACTIVITIES[hallId] || []
          if (activities.length === 0) continue
          
          const completedCount = activities.filter(activityId => status[activityId]).length
          console.log(`[서울] ${hallId}: ${completedCount}/${activities.length} 완료`)
          
          if (completedCount < activities.length) {
            seoulCompleted = false
            break
          }
        }
        
        setCompletedMuseums({
          palace: palaceCompleted,
          seoul: seoulCompleted
        })
        
        // 둘 중 하나라도 완료되었으면 완료 상태로 표시
        const allCompleted = palaceCompleted || seoulCompleted
        console.log('고궁박물관 완료:', palaceCompleted)
        console.log('서울역사박물관 완료:', seoulCompleted)
        console.log('전체 완료 여부:', allCompleted)
        setIsAllCompleted(allCompleted)
        
        // 완료된 박물관이 있으면 그 박물관을 먼저 보여주기 (하지만 자동으로 표시하지는 않음)
        if (allCompleted) {
          if (seoulCompleted && !palaceCompleted) {
            setActiveTab('seoul')
          } else if (palaceCompleted) {
            setActiveTab('palace')
          }
        }
        
        // 초기 상태: 축하 메시지와 수료증은 숨김, 탭 선택 화면 표시
        setShowCelebration(false)
        setShowCertificate(false)
        setShowTabSelection(true)
      } else {
        console.error('활동지 상태 가져오기 실패:', result.error)
        setIsAllCompleted(false)
        setCompletedMuseums({ palace: false, seoul: false })
      }
    } catch (error) {
      console.error('완료 상태 확인 오류:', error)
      setIsAllCompleted(false)
      setCompletedMuseums({ palace: false, seoul: false })
    }
  }


  const getMuseumName = (museum) => {
    return museum === 'palace' ? '고궁' : '서울'
  }

  const getCertificateTitle = (museum) => {
    return museum === 'palace' ? '궁궐 탐험 수료증' : '서울 역사 탐험 수료증'
  }

  const getCertificateDescription = (museum) => {
    if (museum === 'palace') {
      return '위 학생은 국립고궁박물관의 역사와 문화를 탐구하는 모든 과정을 성실히 마치고, 주어진 문제를 훌륭하게 해결하였기에 이 증서를 수여합니다.'
    } else {
      return '위 학생은 서울역사박물관의 역사와 문화를 탐구하는 모든 과정을 성실히 마치고, 주어진 문제를 훌륭하게 해결하였기에 이 증서를 수여합니다.'
    }
  }

  const isMuseumCompleted = (museum) => {
    return museum === 'palace' ? completedMuseums.palace : completedMuseums.seoul
  }

  const handleShare = () => {
    // 공유 기능 (추후 구현)
    const museumName = activeTab === 'palace' ? '국립고궁박물관' : '서울역사박물관'
    const title = getCertificateTitle(activeTab)
    if (navigator.share) {
      navigator.share({
        title: title,
        text: `${museumName} 탐험을 완료했습니다!`,
        url: window.location.href
      }).catch(err => console.log('공유 오류:', err))
    } else {
      // 공유 API가 없으면 클립보드에 복사
      navigator.clipboard.writeText(window.location.href)
      alert('링크가 클립보드에 복사되었습니다.')
    }
  }

  const handleSaveImage = () => {
    if (!certificateRef.current) return

    const museumName = activeTab === 'palace' ? '고궁' : '서울'
    // html2canvas 라이브러리를 사용하여 이미지로 변환
    html2canvas(certificateRef.current, {
      backgroundColor: '#fffdf5',
      scale: 2,
      useCORS: true
    }).then(canvas => {
      const link = document.createElement('a')
      link.download = `${museumName}박물관_수료증_${studentInfo?.name || '학생'}_${new Date().toISOString().split('T')[0]}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    }).catch(err => {
      console.error('이미지 저장 오류:', err)
      alert('이미지 저장 중 오류가 발생했습니다.')
    })
  }

  const handleConfirm = () => {
    // 역사박물관일 때는 서울역사박물관 전시관 목록으로, 고궁박물관일 때는 고궁박물관 전시관 목록으로
    if (activeTab === 'seoul') {
      navigate('/seoul-history-museum-hall-list')
    } else {
      navigate('/exhibition-hall-list')
    }
  }

  const handleViewProgress = () => {
    navigate('/exhibition-hall-list')
  }

  const handleContinueExploration = () => {
    navigate('/exhibition-hall-list')
  }

  const getCurrentDate = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    return `${year}. ${month}. ${day}`
  }

  const getSchoolInfo = () => {
    if (!studentInfo) return ''
    if (studentInfo.schoolName && studentInfo.grade && studentInfo.classNum && studentInfo.number) {
      return `${studentInfo.schoolName} ${studentInfo.grade}학년 ${studentInfo.classNum}반 ${studentInfo.number}번`
    } else if (studentInfo.schoolName && studentInfo.grade && studentInfo.classNum) {
      return `${studentInfo.schoolName} ${studentInfo.grade}학년 ${studentInfo.classNum}반`
    } else if (studentInfo.grade && studentInfo.classNum && studentInfo.number) {
      return `${studentInfo.grade}학년 ${studentInfo.classNum}반 ${studentInfo.number}번`
    } else if (studentInfo.grade && studentInfo.classNum) {
      return `${studentInfo.grade}학년 ${studentInfo.classNum}반`
    }
    return ''
  }

  const getTeacherSignature = () => {
    if (!studentInfo) return '담임 일동'
    if (studentInfo.schoolName && studentInfo.grade) {
      return `${studentInfo.schoolName} ${studentInfo.grade}학년 담임 일동`
    } else if (studentInfo.schoolName) {
      return `${studentInfo.schoolName} 담임 일동`
    } else if (studentInfo.grade) {
      return `${studentInfo.grade}학년 담임 일동`
    }
    return '담임 일동'
  }

  if (loading) {
    return (
      <StudentLayout title="탐험 수료증" activeNav="certificate" museumType={activeTab}>
        <div className="student-clear-loading">
          <p>로딩 중...</p>
        </div>
      </StudentLayout>
    )
  }

  // 완료되지 않았을 때 렌더링
  if (!isAllCompleted) {
    const renderLockedCertificate = (museum) => {
      const isActive = activeTab === museum
      // 탭 선택 화면이 보이는 경우 수료증 숨기기
      if (showTabSelection || !isActive) return null
      
      return (
        <div key={museum}>
          <div className="student-clear-locked">
            <div className="student-clear-locked-icon">
              <div className="student-clear-locked-icon-glow"></div>
              <span className="material-symbols-outlined">lock</span>
            </div>
            <h1 className="student-clear-locked-title">수료증이 잠겨있습니다</h1>
            <p className="student-clear-locked-subtitle">
              {museum === 'palace' ? '국립고궁박물관' : '서울역사박물관'}의 모든 전시관 미션을 완료하고<br/>나만의 멋진 수료증을 획득하세요!
            </p>
          </div>

          <div className={`student-clear-certificate student-clear-certificate-locked ${museum === 'seoul' ? 'student-clear-certificate-seoul' : ''}`} ref={isActive ? certificateRef : null}>
          <div className="student-clear-certificate-corner student-clear-corner-tl"></div>
          <div className="student-clear-certificate-corner student-clear-corner-tr"></div>
          <div className="student-clear-certificate-corner student-clear-corner-bl"></div>
          <div className="student-clear-certificate-corner student-clear-corner-br"></div>
          
            <div className="student-clear-certificate-overlay">
              <div className="student-clear-overlay-icon">
                <span className="material-symbols-outlined">lock_clock</span>
              </div>
              <span className="student-clear-overlay-text">미션 완료 후 공개</span>
            </div>
            
            <div className="student-clear-certificate-content student-clear-certificate-blurred">
              <div className="student-clear-certificate-bg-pattern"></div>
              <div className="student-clear-certificate-seal-bg">
                <div 
                  className="student-clear-certificate-seal-image"
                  style={{
                    backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC_AxzfzRa4MEJBINdVI6Fexf7R2tVBZiqYxGK0pM9rq8oy4gg1CSYTA-SMyphTpuKxaaqKASqOK8TFCeLyYnv2mDMibZ5p8Qn3gehplqa2aCofFnhARWgV__y0YtouJjWDGJqZxjA5VtkkgAjxqkF4skavFTcbXxom8SK07DMna2fBpm_egy_0fSnQmujizls5p-1UHjrRm4BI5e99qstX3NFQM6VcSo4nfUMqpbOsMZfGnujM1CaXwS-9V_Tkb-fIy-9GhhsY2E9v")'
                  }}
                ></div>
              </div>

            <div className="student-clear-certificate-header">
              <p className="student-clear-certificate-label student-clear-certificate-label-locked">CERTIFICATE</p>
              <h2 className="student-clear-certificate-title-text student-clear-certificate-title-text-locked">{getCertificateTitle(museum)}</h2>
            </div>

            <div className="student-clear-certificate-info">
              {getSchoolInfo() && (
                <div className="student-clear-info-item">
                  <span className="student-clear-info-label">소속</span>
                  <span className="student-clear-info-value">{getSchoolInfo()}</span>
                </div>
              )}
            </div>

            <p className="student-clear-certificate-description" style={{ opacity: 0 }}>
              {getCertificateDescription(museum)}
            </p>

            <div className="student-clear-certificate-footer">
              <p className="student-clear-certificate-date">YYYY. MM. DD</p>
              <div className="student-clear-certificate-signature">
                <p className="student-clear-signature-text">{getTeacherSignature()}</p>
                <div className="student-clear-signature-seal student-clear-signature-seal-locked">
                  <span>인</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {isActive && (
          <div className="student-clear-actions">
            <button 
              className={`student-clear-button student-clear-button-primary ${museum === 'seoul' ? 'student-clear-button-seoul' : ''}`}
              onClick={handleContinueExploration}
            >
              탐험 계속하기
            </button>
          </div>
        )}
        </div>
      )
    }
    
    return (
      <StudentLayout 
        title={showTabSelection ? "탐험 수료증" : (activeTab === 'palace' ? '궁궐 탐험 수료증' : '서울 역사 탐험 수료증')} 
        activeNav="certificate" 
        museumType={activeTab}
        onBack={showTabSelection ? null : handleBackToTabSelection}
      >
        <main className={`student-clear-main ${activeTab === 'seoul' ? 'student-clear-main-seoul' : ''}`}>
          {/* 박물관별 탭 선택 화면 */}
          {showTabSelection && (
            <div className="student-clear-tabs">
              <button
                className={`student-clear-tab ${activeTab === 'palace' ? 'student-clear-tab-active' : ''}`}
                onClick={() => handleTabChange('palace')}
              >
                <div 
                  className="student-clear-tab-image"
                  style={{
                    backgroundImage: `url(${국립고궁박물관Image})`,
                    backgroundPosition: 'center'
                  }}
                >
                  <div className="student-clear-tab-overlay"></div>
                </div>
                <div className="student-clear-tab-content">
                  <span className="material-symbols-outlined">museum</span>
                  <span>고궁박물관</span>
                  {completedMuseums.palace && (
                    <span className="student-clear-tab-badge">
                      <span className="material-symbols-outlined">check_circle</span>
                    </span>
                  )}
                </div>
              </button>
              <button
                className={`student-clear-tab ${activeTab === 'seoul' ? 'student-clear-tab-active' : ''} ${activeTab === 'seoul' ? 'student-clear-tab-seoul' : ''}`}
                onClick={() => handleTabChange('seoul')}
              >
                <div 
                  className="student-clear-tab-image"
                  style={{
                    backgroundImage: `url(${서울역사박물관Image})`,
                    backgroundPosition: 'center'
                  }}
                >
                  <div className="student-clear-tab-overlay"></div>
                </div>
                <div className="student-clear-tab-content">
                  <span className="material-symbols-outlined">location_city</span>
                  <span>서울역사박물관</span>
                  {completedMuseums.seoul && (
                    <span className="student-clear-tab-badge">
                      <span className="material-symbols-outlined">check_circle</span>
                    </span>
                  )}
                </div>
              </button>
            </div>
          )}

          {/* 박물관별 잠긴 수료증 렌더링 */}
          {!showTabSelection && (
            <>
              {renderLockedCertificate('palace')}
              {renderLockedCertificate('seoul')}
            </>
          )}
        </main>
      </StudentLayout>
    )
  }

  // 탭 변경 핸들러
  const handleTabChange = (museum) => {
    const isCompleted = isMuseumCompleted(museum)
    
    // 탭 변경
    setActiveTab(museum)
    
    // 탭 선택 화면 숨기기
    setShowTabSelection(false)
    
    // 완료된 박물관인 경우에만 애니메이션 시퀀스 시작
    if (isCompleted) {
      // 축하 메시지 먼저 표시
      setShowCelebration(true)
      setShowCertificate(false)
      
      // 2초 후 축하 메시지 숨기고 수료증 표시
      setTimeout(() => {
        setShowCelebration(false)
        setShowCertificate(true)
      }, 2000)
    } else {
      // 완료되지 않은 경우 축하 메시지와 수료증 숨김
      setShowCelebration(false)
      setShowCertificate(false)
    }
  }

  // 탭 선택 화면으로 돌아가기
  const handleBackToTabSelection = () => {
    setShowTabSelection(true)
    setShowCelebration(false)
    setShowCertificate(false)
  }

  // 완료되었을 때 렌더링
  const renderCertificate = (museum) => {
    const isCompleted = isMuseumCompleted(museum)
    const isActive = activeTab === museum
    
    // 탭 선택 화면이 보이거나 활성 탭이 아니면 숨기기
    if (showTabSelection || !isActive) return null
    
    return (
      <div key={museum}>
        {isCompleted ? (
          <>
            {showCelebration && (
              <div className="student-clear-celebration">
                <div className="student-clear-celebration-icon">
                  <div className="student-clear-icon-glow"></div>
                  <span className="material-symbols-outlined">emoji_events</span>
                </div>
                <h1 className="student-clear-celebration-title">축하합니다!</h1>
                <p className="student-clear-celebration-subtitle">
                  {museum === 'palace' ? '국립고궁박물관' : '서울역사박물관'}의 모든 전시관 미션을 성공적으로 마쳤습니다.
                </p>
              </div>
            )}

            {showCertificate && (
              <div className={`student-clear-certificate ${museum === 'seoul' ? 'student-clear-certificate-seoul' : ''} student-clear-certificate-enter`} ref={museum === activeTab ? certificateRef : null}>
          <div className="student-clear-certificate-corner student-clear-corner-tl"></div>
          <div className="student-clear-certificate-corner student-clear-corner-tr"></div>
          <div className="student-clear-certificate-corner student-clear-corner-bl"></div>
          <div className="student-clear-certificate-corner student-clear-corner-br"></div>
          
          <div className="student-clear-certificate-content">
            <div className="student-clear-certificate-bg-pattern"></div>
            <div className="student-clear-certificate-seal-bg">
              <div 
                className="student-clear-certificate-seal-image"
                style={{
                  backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC_AxzfzRa4MEJBINdVI6Fexf7R2tVBZiqYxGK0pM9rq8oy4gg1CSYTA-SMyphTpuKxaaqKASqOK8TFCeLyYnv2mDMibZ5p8Qn3gehplqa2aCofFnhARWgV__y0YtouJjWDGJqZxjA5VtkkgAjxqkF4skavFTcbXxom8SK07DMna2fBpm_egy_0fSnQmujizls5p-1UHjrRm4BI5e99qstX3NFQM6VcSo4nfUMqpbOsMZfGnujM1CaXwS-9V_Tkb-fIy-9GhhsY2E9v")'
                }}
              ></div>
            </div>

              <div className="student-clear-certificate-header">
                <p className="student-clear-certificate-label">CERTIFICATE</p>
                <h2 className="student-clear-certificate-title-text">{getCertificateTitle(museum)}</h2>
              </div>

              <div className="student-clear-certificate-info">
                {getSchoolInfo() && (
                  <div className="student-clear-info-item">
                    <span className="student-clear-info-label">소속</span>
                    <span className="student-clear-info-value">{getSchoolInfo()}</span>
                  </div>
                )}
              </div>

              <p className="student-clear-certificate-description">
                {getCertificateDescription(museum)}
              </p>

              <div className="student-clear-certificate-footer">
                <p className="student-clear-certificate-date">{getCurrentDate()}</p>
                <div className="student-clear-certificate-signature">
                  <p className="student-clear-signature-text">{getTeacherSignature()}</p>
                  <div className="student-clear-signature-seal">
                    <span>인</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
            )}

            {showCertificate && isActive && (
              <div className="student-clear-actions">
                <button 
                  className="student-clear-button student-clear-button-secondary"
                  onClick={handleSaveImage}
                >
                  이미지 저장
                </button>
                <button 
                  className="student-clear-button student-clear-button-secondary"
                  onClick={handleShare}
                >
                  공유
                </button>
                <button 
                  className={`student-clear-button student-clear-button-primary ${museum === 'seoul' ? 'student-clear-button-seoul' : ''}`}
                  onClick={handleConfirm}
                >
                  확인
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="student-clear-locked">
            <div className="student-clear-locked-icon">
              <div className="student-clear-locked-icon-glow"></div>
              <span className="material-symbols-outlined">lock</span>
            </div>
            <h1 className="student-clear-locked-title">수료증이 잠겨있습니다</h1>
            <p className="student-clear-locked-subtitle">
              {museum === 'palace' ? '국립고궁박물관' : '서울역사박물관'}의 모든 전시관 미션을 완료하고<br/>나만의 멋진 수료증을 획득하세요!
            </p>
          </div>
        )}
      </div>
    )
  }

  return (
    <StudentLayout 
      title={showTabSelection ? "탐험 수료증" : (activeTab === 'palace' ? '궁궐 탐험 수료증' : '서울 역사 탐험 수료증')} 
      activeNav="certificate" 
      museumType={activeTab}
      onBack={showTabSelection ? null : handleBackToTabSelection}
    >
      <main className={`student-clear-main ${activeTab === 'seoul' ? 'student-clear-main-seoul' : ''}`}>
        {/* 박물관별 탭 선택 화면 */}
        {showTabSelection && (
          <div className="student-clear-tabs">
            <button
              className={`student-clear-tab ${activeTab === 'palace' ? 'student-clear-tab-active' : ''}`}
              onClick={() => handleTabChange('palace')}
            >
              <div 
                className="student-clear-tab-image"
                style={{
                  backgroundImage: `url(${국립고궁박물관Image})`,
                  backgroundPosition: 'center'
                }}
              >
                <div className="student-clear-tab-overlay"></div>
              </div>
              <div className="student-clear-tab-content">
                <span className="material-symbols-outlined">museum</span>
                <span>고궁박물관</span>
                {completedMuseums.palace && (
                  <span className="student-clear-tab-badge">
                    <span className="material-symbols-outlined">check_circle</span>
                  </span>
                )}
              </div>
            </button>
            <button
              className={`student-clear-tab ${activeTab === 'seoul' ? 'student-clear-tab-active' : ''} ${activeTab === 'seoul' ? 'student-clear-tab-seoul' : ''}`}
              onClick={() => handleTabChange('seoul')}
            >
              <div 
                className="student-clear-tab-image"
                style={{
                  backgroundImage: `url(${서울역사박물관Image})`,
                  backgroundPosition: 'center'
                }}
              >
                <div className="student-clear-tab-overlay"></div>
              </div>
              <div className="student-clear-tab-content">
                <span className="material-symbols-outlined">location_city</span>
                <span>서울역사박물관</span>
                {completedMuseums.seoul && (
                  <span className="student-clear-tab-badge">
                    <span className="material-symbols-outlined">check_circle</span>
                  </span>
                )}
              </div>
            </button>
          </div>
        )}

        {/* 박물관별 수료증 렌더링 */}
        {!showTabSelection && (
          <>
            {renderCertificate('palace')}
            {renderCertificate('seoul')}
          </>
        )}
      </main>
    </StudentLayout>
  )
}

export default StudentClear


