import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { getAllActivityStatus } from '../firebase/firestore'
import { EXHIBITION_HALL_ACTIVITIES } from '../utils/activityOrder'
import html2canvas from 'html2canvas'
import './StudentClear.css'

function StudentClear({ user }) {
  const navigate = useNavigate()
  const certificateRef = useRef(null)
  const [studentInfo, setStudentInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAllCompleted, setIsAllCompleted] = useState(false)
  const [activityStatus, setActivityStatus] = useState({})

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
        
        // 모든 전시관의 활동지가 완료되었는지 확인
        let allCompleted = true
        
        for (const [exhibitionHallId, activities] of Object.entries(EXHIBITION_HALL_ACTIVITIES)) {
          if (activities.length === 0) continue
          
          const completedCount = activities.filter(activityId => status[activityId]).length
          console.log(`${exhibitionHallId}: ${completedCount}/${activities.length} 완료`)
          
          if (completedCount < activities.length) {
            allCompleted = false
            console.log(`${exhibitionHallId}에서 미완료 활동지 발견`)
            break
          }
        }
        
        console.log('모든 전시관 완료 여부:', allCompleted)
        setIsAllCompleted(allCompleted)
      } else {
        console.error('활동지 상태 가져오기 실패:', result.error)
        setIsAllCompleted(false)
      }
    } catch (error) {
      console.error('완료 상태 확인 오류:', error)
      setIsAllCompleted(false)
    }
  }

  const handleBack = () => {
    navigate('/exhibition-hall-list')
  }

  const handleShare = () => {
    // 공유 기능 (추후 구현)
    if (navigator.share) {
      navigator.share({
        title: '궁궐 탐험 수료증',
        text: '국립고궁박물관 탐험을 완료했습니다!',
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

    // html2canvas 라이브러리를 사용하여 이미지로 변환
    html2canvas(certificateRef.current, {
      backgroundColor: '#fffdf5',
      scale: 2,
      useCORS: true
    }).then(canvas => {
      const link = document.createElement('a')
      link.download = `수료증_${studentInfo?.name || '학생'}_${new Date().toISOString().split('T')[0]}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    }).catch(err => {
      console.error('이미지 저장 오류:', err)
      alert('이미지 저장 중 오류가 발생했습니다.')
    })
  }

  const handleConfirm = () => {
    navigate('/exhibition-hall-list')
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
      <div className="student-clear-container">
        <div className="student-clear-loading">
          <p>로딩 중...</p>
        </div>
      </div>
    )
  }

  // 완료되지 않았을 때 렌더링
  if (!isAllCompleted) {
    return (
      <div className="student-clear-container">
        <header className="student-clear-header">
          <button 
            className="student-clear-back-button"
            onClick={handleBack}
          >
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </button>
          <h2 className="student-clear-title">탐험 수료증</h2>
          <button 
            className="student-clear-share-button"
            onClick={() => navigate('/student/messages')}
          >
            <span className="material-symbols-outlined">mail</span>
          </button>
        </header>

        <main className="student-clear-main">
          <div className="student-clear-locked">
            <div className="student-clear-locked-icon">
              <div className="student-clear-locked-icon-glow"></div>
              <span className="material-symbols-outlined">lock</span>
            </div>
            <h1 className="student-clear-locked-title">수료증이 잠겨있습니다</h1>
            <p className="student-clear-locked-subtitle">
              모든 전시관의 미션을 완료하고<br/>나만의 멋진 수료증을 획득하세요!
            </p>
          </div>

          <div className="student-clear-certificate student-clear-certificate-locked" ref={certificateRef}>
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
                <h2 className="student-clear-certificate-title-text student-clear-certificate-title-text-locked">궁궐 탐험 수료증</h2>
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
                위 학생은 국립고궁박물관의 역사와 문화를 탐구하는 모든 과정을 성실히 마치고, 주어진 문제를 훌륭하게 해결하였기에 이 증서를 수여합니다.
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

          <div className="student-clear-actions">
            <button 
              className="student-clear-button student-clear-button-primary"
              onClick={handleContinueExploration}
            >
              탐험 계속하기
            </button>
          </div>
        </main>

        <nav className="student-clear-navbar">
          <button 
            className="student-clear-nav-item"
            onClick={() => navigate('/exhibition-hall-list')}
          >
            <span className="material-symbols-outlined">museum</span>
            <span>전시관</span>
          </button>
          <button className="student-clear-nav-item student-clear-nav-item-active">
            <div className="student-clear-nav-icon-wrapper">
              <span className="material-symbols-outlined fill">verified</span>
              {!isAllCompleted && <span className="student-clear-nav-notification"></span>}
            </div>
            <span>수료증 확인</span>
          </button>
          <button 
            className="student-clear-nav-item"
            onClick={async () => {
              const { logout } = await import('../firebase/auth')
              await logout()
              navigate('/login')
            }}
          >
            <span className="material-symbols-outlined">logout</span>
            <span>로그아웃</span>
          </button>
        </nav>
      </div>
    )
  }

  // 완료되었을 때 렌더링
  return (
    <div className="student-clear-container">
      <header className="student-clear-header">
        <button 
          className="student-clear-back-button"
          onClick={handleBack}
        >
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h2 className="student-clear-title">탐험 수료증</h2>
        <button 
          className="student-clear-share-button"
          onClick={() => navigate('/student/messages')}
        >
          <span className="material-symbols-outlined">mail</span>
        </button>
      </header>

      <main className="student-clear-main">
        <div className="student-clear-celebration">
          <div className="student-clear-celebration-icon">
            <div className="student-clear-icon-glow"></div>
            <span className="material-symbols-outlined">emoji_events</span>
          </div>
          <h1 className="student-clear-celebration-title">축하합니다!</h1>
          <p className="student-clear-celebration-subtitle">
            모든 전시관의 미션을 성공적으로 마쳤습니다.
          </p>
        </div>

        <div className="student-clear-certificate" ref={certificateRef}>
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
              <h2 className="student-clear-certificate-title-text">궁궐 탐험 수료증</h2>
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
              위 학생은 국립고궁박물관의 역사와 문화를 탐구하는 모든 과정을 성실히 마치고, 주어진 문제를 훌륭하게 해결하였기에 이 증서를 수여합니다.
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
            className="student-clear-button student-clear-button-primary"
            onClick={handleConfirm}
          >
            확인
          </button>
        </div>
      </main>

      <nav className="student-clear-navbar">
        <button 
          className="student-clear-nav-item"
          onClick={() => navigate('/exhibition-hall-list')}
        >
          <span className="material-symbols-outlined">museum</span>
          <span>전시관</span>
        </button>
        <button className="student-clear-nav-item student-clear-nav-item-active">
          <div className="student-clear-nav-icon-wrapper">
            <span className="material-symbols-outlined fill">verified</span>
          </div>
          <span>수료증 확인</span>
        </button>
        <button 
          className="student-clear-nav-item"
          onClick={async () => {
            const { logout } = await import('../firebase/auth')
            await logout()
            navigate('/login')
          }}
        >
          <span className="material-symbols-outlined">logout</span>
          <span>로그아웃</span>
        </button>
      </nav>
    </div>
  )
}

export default StudentClear

