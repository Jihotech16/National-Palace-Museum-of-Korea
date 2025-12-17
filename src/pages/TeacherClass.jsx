import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { logout, onAuthChange } from '../firebase/auth'
import { getTeacherStudents, getStudentsProgress, getHallProgress, deleteAllSchoolData } from '../firebase/firestore'
import './TeacherClass.css'
import './TeacherPage.css'

function TeacherClass() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('progress')
  const [loading, setLoading] = useState(true)
  const [teacherData, setTeacherData] = useState(null)
  const [schoolInfo, setSchoolInfo] = useState('')
  const [averageProgress, setAverageProgress] = useState(0)
  const [totalStudents, setTotalStudents] = useState(0)
  const [completedStudents, setCompletedStudents] = useState(0)
  const [hallProgress, setHallProgress] = useState([])
  const [showEndActivityModal, setShowEndActivityModal] = useState(false)
  const [endActivityForm, setEndActivityForm] = useState({
    schoolCode: '',
    password: ''
  })
  const [endActivityError, setEndActivityError] = useState('')
  const [endActivityLoading, setEndActivityLoading] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)

  useEffect(() => {
    loadTeacherData()
  }, [])

  const loadTeacherData = async () => {
    try {
      // Firebase Auth에서 현재 사용자 확인 (항상 인증 상태 확인)
      onAuthChange(async (user) => {
        if (user) {
          // 이메일에서 교사 정보 추출
          const email = user.email
          console.log('현재 인증된 사용자:', { email, uid: user.uid })
          
          if (email && email.includes('@teacher.local')) {
            const parts = email.replace('@teacher.local', '').split('-')
            if (parts.length === 3) {
              const [schoolCode, grade, classNum] = parts
              const teacherInfo = {
                schoolCode,
                grade: parseInt(grade),
                classNum: parseInt(classNum)
              }
              setTeacherData(teacherInfo)
              setSchoolInfo(`${teacherInfo.grade}학년 ${teacherInfo.classNum}반`)
              localStorage.setItem('teacherData', JSON.stringify(teacherInfo))
              await loadClassData(schoolCode, parseInt(grade), parseInt(classNum))
            } else {
              console.error('교사 이메일 형식이 올바르지 않습니다:', email)
              navigate('/teacher-login')
            }
          } else {
            console.error('교사 계정이 아닙니다:', email)
            navigate('/teacher-login')
          }
        } else {
          // 로그인되지 않은 경우 로그인 페이지로 이동
          console.warn('Firebase Authentication에 로그인되어 있지 않습니다.')
          navigate('/teacher-login')
        }
      })
    } catch (error) {
      console.error('교사 데이터 로드 오류:', error)
      setLoading(false)
    }
  }

  const loadClassData = async (schoolCode, grade, classNum) => {
    try {
      setLoading(true)
      
      // 학생 진행률 가져오기
      const progressResult = await getStudentsProgress(schoolCode, grade, classNum)
      if (progressResult.success) {
        setTotalStudents(progressResult.totalStudents)
        setAverageProgress(progressResult.averageProgress)
        
        // 완료한 학생 수 계산 (진행률 100%인 학생)
        const completedCount = Object.values(progressResult.progress).filter(
          p => p.progress >= 100
        ).length
        setCompletedStudents(completedCount)
      }

      // 전시관별 진행률 가져오기
      const hallResult = await getHallProgress(schoolCode, grade, classNum)
      if (hallResult.success) {
        setHallProgress(hallResult.halls)
      } else {
        console.error('전시관별 진행률 로드 오류:', hallResult.error)
        // 오류 시 빈 배열로 설정
        setHallProgress([])
      }
      
      setLoading(false)
    } catch (error) {
      console.error('반 데이터 로드 오류:', error)
      setLoading(false)
    }
  }

  const handleMenuClick = () => {
    setShowSidebar(true)
  }

  const handleCloseSidebar = () => {
    setShowSidebar(false)
  }

  const handleRefresh = () => {
    if (teacherData) {
      loadClassData(teacherData.schoolCode, teacherData.grade, teacherData.classNum)
    }
  }

  const handleSendMessage = () => {
    // 전체 격려 메시지 보내기 (추후 구현)
    console.log('전체 격려 메시지 보내기')
  }

  const handleHome = () => {
    navigate('/teacher')
  }

  const handleStudentProgress = () => {
    navigate('/teacher/class')
  }

  const handleStudentManagement = () => {
    navigate('/teacher/students')
  }

  const handleQuestionManagement = () => {
    setActiveTab('questions')
    navigate('/teacher/questions')
  }

  const handleEndActivity = () => {
    // 현재 교사 정보로 학교 코드 자동 입력
    if (teacherData) {
      setEndActivityForm({
        schoolCode: teacherData.schoolCode || '',
        password: ''
      })
    }
    setShowEndActivityModal(true)
    setEndActivityError('')
  }

  const handleEndActivitySubmit = async (e) => {
    e.preventDefault()
    setEndActivityError('')
    
    if (!endActivityForm.schoolCode || !endActivityForm.password) {
      setEndActivityError('학교 코드와 비밀번호를 모두 입력해주세요.')
      return
    }
    
    // 확인 모달 표시
    setShowConfirmModal(true)
  }

  const handleConfirmEndActivity = async () => {
    setEndActivityLoading(true)
    setEndActivityError('')
    
    try {
      const result = await deleteAllSchoolData(endActivityForm.schoolCode, endActivityForm.password)
      
      if (result.success) {
        // 성공 시 로그아웃 및 로그인 페이지로 이동
        await logout()
        localStorage.removeItem('teacherData')
        localStorage.removeItem('teacherRemember')
        setShowEndActivityModal(false)
        setShowConfirmModal(false)
        navigate('/teacher-login')
        alert('활동이 종료되었습니다. 모든 데이터가 삭제되었습니다.')
      } else {
        setEndActivityError(result.error || '활동 종료에 실패했습니다.')
        setShowConfirmModal(false)
      }
    } catch (error) {
      console.error('활동 종료 오류:', error)
      setEndActivityError('활동 종료 중 오류가 발생했습니다.')
      setShowConfirmModal(false)
    } finally {
      setEndActivityLoading(false)
    }
  }

  const handleCancelEndActivity = () => {
    setShowEndActivityModal(false)
    setShowConfirmModal(false)
    setEndActivityForm({ schoolCode: '', password: '' })
    setEndActivityError('')
  }

  const handleLogout = async () => {
    try {
      await logout()
      localStorage.removeItem('teacherData')
      localStorage.removeItem('teacherRemember')
      navigate('/teacher-login')
    } catch (error) {
      console.error('로그아웃 오류:', error)
    }
  }

  const progressIncrease = 12 // 임시 데이터

  return (
    <div className="teacher-page">
      <div className="teacher-container">
        <header className="teacher-header">
          <button 
            className="teacher-header-btn"
            onClick={handleMenuClick}
            type="button"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <h1 className="teacher-header-title">{schoolInfo} 진도 현황</h1>
          <button 
            className="teacher-header-btn teacher-header-btn-notification"
            onClick={() => navigate('/teacher/messages')}
            type="button"
          >
            <span className="material-symbols-outlined">mail</span>
          </button>
        </header>

        <main className="teacher-main">
          {loading ? (
            <div className="teacher-loading">
              <p>데이터를 불러오는 중...</p>
            </div>
          ) : (
            <div className="teacher-class-content">
            <section className="teacher-class-summary">
              <div className="teacher-class-summary-bg-1"></div>
              <div className="teacher-class-summary-bg-2"></div>
              <div className="teacher-class-summary-content">
                <div className="teacher-class-summary-header">
                  <div>
                    <h2 className="teacher-class-summary-label">우리 반 평균 달성률</h2>
                    <div className="teacher-class-summary-value-group">
                      <span className="teacher-class-summary-value">{averageProgress}%</span>
                      <span className="teacher-class-summary-increase">
                        <span className="material-symbols-outlined">trending_up</span>
                        {progressIncrease}%
                      </span>
                    </div>
                  </div>
                  <div className="teacher-class-summary-icon">
                    <span className="material-symbols-outlined">groups</span>
                  </div>
                </div>
                <div className="teacher-class-summary-progress">
                  <div className="teacher-class-progress-bar">
                    <div 
                      className="teacher-class-progress-fill"
                      style={{ width: `${averageProgress}%` }}
                    ></div>
                  </div>
                  <div className="teacher-class-progress-stats">
                    <span>전체 학생 {totalStudents}명</span>
                    <span>탐험 완료 {completedStudents}명</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="teacher-class-halls">
              <div className="teacher-class-halls-header">
                <h3 className="teacher-class-halls-title">전시관별 완료 현황</h3>
                <span className="teacher-class-halls-badge">실시간 집계중</span>
              </div>
              <div className="teacher-class-halls-list">
                {hallProgress.length === 0 ? (
                  <div className="teacher-class-loading">
                    <p>전시관 데이터를 불러오는 중...</p>
                  </div>
                ) : (
                  hallProgress.map((hall) => (
                  <div key={hall.id} className="teacher-class-hall-card">
                    <div className="teacher-class-hall-header">
                      <div className="teacher-class-hall-info">
                        <div className={`teacher-class-hall-icon teacher-class-hall-icon-${hall.color}`}>
                          <span className="material-symbols-outlined">
                            {hall.icon || 'crown'}
                          </span>
                        </div>
                        <div>
                          <h4 className="teacher-class-hall-name">{hall.name}</h4>
                          <p className="teacher-class-hall-missions">미션 {hall.missions}개 포함</p>
                        </div>
                      </div>
                      <div className="teacher-class-hall-progress-value">{hall.progress}%</div>
                    </div>
                    <div className="teacher-class-hall-progress-bar">
                      <div 
                        className={`teacher-class-hall-progress-fill teacher-class-hall-progress-fill-${hall.color}`}
                        style={{ width: `${hall.progress}%` }}
                      ></div>
                    </div>
                    <div className="teacher-class-hall-stats">
                      <span>진행중 {hall.inProgress}명</span>
                      <span>완료 {hall.completed}명</span>
                    </div>
                  </div>
                  ))
                )}
              </div>
            </section>
            </div>
          )}
        </main>

        <nav className="teacher-nav">
          <div className="teacher-nav-content">
            <button
              className={`teacher-nav-item ${activeTab === 'home' ? 'teacher-nav-item-active' : ''}`}
              onClick={handleHome}
              type="button"
            >
              <span className={`material-symbols-outlined ${activeTab === 'home' ? 'filled' : ''}`}>dashboard</span>
              <span className="teacher-nav-label">홈</span>
            </button>
            <button
              className={`teacher-nav-item ${activeTab === 'progress' ? 'teacher-nav-item-active' : ''}`}
              onClick={() => {
                setActiveTab('progress')
                handleStudentProgress()
              }}
              type="button"
            >
              <span className={`material-symbols-outlined ${activeTab === 'progress' ? 'filled' : ''}`}>monitoring</span>
              <span className="teacher-nav-label">진도 관리</span>
            </button>
            <button
              className={`teacher-nav-item ${activeTab === 'students' ? 'teacher-nav-item-active' : ''}`}
              onClick={() => {
                setActiveTab('students')
                handleStudentManagement()
              }}
              type="button"
            >
              <span className="material-symbols-outlined">groups</span>
              <span className="teacher-nav-label">학생 관리</span>
            </button>
            <button
              className={`teacher-nav-item ${activeTab === 'questions' ? 'teacher-nav-item-active' : ''}`}
              onClick={() => {
                setActiveTab('questions')
                handleQuestionManagement()
              }}
              type="button"
            >
              <span className="material-symbols-outlined">quiz</span>
              <span className="teacher-nav-label">문제 보기</span>
            </button>
            <button
              className={`teacher-nav-item ${activeTab === 'end' ? 'teacher-nav-item-active' : ''}`}
              onClick={() => {
                setActiveTab('end')
                handleEndActivity()
              }}
              type="button"
            >
              <span className="material-symbols-outlined">stop_circle</span>
              <span className="teacher-nav-label">활동 종료</span>
            </button>
            <button
              className="teacher-nav-item teacher-nav-item-logout"
              onClick={handleLogout}
              type="button"
            >
              <span className="material-symbols-outlined">logout</span>
              <span className="teacher-nav-label">로그아웃</span>
            </button>
          </div>
          <div className="teacher-nav-spacer"></div>
        </nav>
      </div>

      {/* 사이드 메뉴 */}
      <div 
        className={`teacher-sidebar-overlay ${showSidebar ? 'active' : ''}`}
        onClick={handleCloseSidebar}
      >
      </div>
      <div className={`teacher-sidebar ${showSidebar ? 'active' : ''}`}>
        <div className="teacher-sidebar-header">
          <h2 className="teacher-sidebar-title">메뉴</h2>
          <button 
            className="teacher-sidebar-close"
            onClick={handleCloseSidebar}
            type="button"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <div className="teacher-sidebar-content">
          <div className="teacher-sidebar-section">
            <h3 className="teacher-sidebar-section-title">빠른 이동</h3>
            <button 
              className="teacher-sidebar-item"
              onClick={() => {
                handleCloseSidebar()
                handleHome()
              }}
              type="button"
            >
              <span className="material-symbols-outlined">dashboard</span>
              <span className="teacher-sidebar-item-label">홈</span>
            </button>
            <button 
              className="teacher-sidebar-item"
              onClick={() => {
                handleCloseSidebar()
                handleStudentProgress()
              }}
              type="button"
            >
              <span className="material-symbols-outlined">monitoring</span>
              <span className="teacher-sidebar-item-label">진도 관리</span>
            </button>
            <button 
              className="teacher-sidebar-item"
              onClick={() => {
                handleCloseSidebar()
                handleStudentManagement()
              }}
              type="button"
            >
              <span className="material-symbols-outlined">groups</span>
              <span className="teacher-sidebar-item-label">학생 관리</span>
            </button>
            <button 
              className="teacher-sidebar-item"
              onClick={() => {
                handleCloseSidebar()
                handleQuestionManagement()
              }}
              type="button"
            >
              <span className="material-symbols-outlined">quiz</span>
              <span className="teacher-sidebar-item-label">문제 보기</span>
            </button>
            <button 
              className="teacher-sidebar-item"
              onClick={() => {
                handleCloseSidebar()
                navigate('/teacher/messages')
              }}
              type="button"
            >
              <span className="material-symbols-outlined">mail</span>
              <span className="teacher-sidebar-item-label">메시지</span>
            </button>
          </div>
          
          <div className="teacher-sidebar-section">
            <h3 className="teacher-sidebar-section-title">설정</h3>
            <button 
              className="teacher-sidebar-item"
              onClick={() => {
                handleCloseSidebar()
                console.log('설정')
              }}
              type="button"
            >
              <span className="material-symbols-outlined">settings</span>
              <span className="teacher-sidebar-item-label">설정</span>
            </button>
            <button 
              className="teacher-sidebar-item"
              onClick={() => {
                handleCloseSidebar()
                handleEndActivity()
              }}
              type="button"
            >
              <span className="material-symbols-outlined">stop_circle</span>
              <span className="teacher-sidebar-item-label">활동 종료</span>
            </button>
            <button 
              className="teacher-sidebar-item"
              onClick={() => {
                handleCloseSidebar()
                handleLogout()
              }}
              type="button"
            >
              <span className="material-symbols-outlined">logout</span>
              <span className="teacher-sidebar-item-label">로그아웃</span>
            </button>
          </div>
        </div>
        
        <div className="teacher-sidebar-footer">
          {teacherData && (
            <div className="teacher-sidebar-profile">
              <div className="teacher-sidebar-profile-info">
                <p className="teacher-sidebar-profile-name">
                  {teacherData.schoolName || '선생님'}
                </p>
                <p className="teacher-sidebar-profile-class">
                  {teacherData.grade}학년 {teacherData.classNum}반
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 활동 종료 모달 */}
      {showEndActivityModal && (
        <div className="teacher-modal-overlay" onClick={handleCancelEndActivity}>
          <div className="teacher-modal" onClick={(e) => e.stopPropagation()}>
            <div className="teacher-modal-header">
              <h2 className="teacher-modal-title">활동 종료</h2>
              <button 
                className="teacher-modal-close"
                onClick={handleCancelEndActivity}
                type="button"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleEndActivitySubmit} className="teacher-modal-form">
              <div className="teacher-modal-field">
                <label className="teacher-modal-label">학교 코드</label>
                <input
                  type="text"
                  className="teacher-modal-input"
                  value={endActivityForm.schoolCode}
                  onChange={(e) => setEndActivityForm({ ...endActivityForm, schoolCode: e.target.value })}
                  placeholder="학교 코드를 입력하세요"
                  required
                />
              </div>
              
              <div className="teacher-modal-field">
                <label className="teacher-modal-label">비밀번호</label>
                <input
                  type="password"
                  className="teacher-modal-input"
                  value={endActivityForm.password}
                  onChange={(e) => setEndActivityForm({ ...endActivityForm, password: e.target.value })}
                  placeholder="비밀번호를 입력하세요"
                  required
                />
              </div>
              
              {endActivityError && (
                <div className="teacher-modal-error">
                  {endActivityError}
                </div>
              )}
              
              <div className="teacher-modal-actions">
                <button
                  type="button"
                  className="teacher-modal-btn teacher-modal-btn-cancel"
                  onClick={handleCancelEndActivity}
                  disabled={endActivityLoading}
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="teacher-modal-btn teacher-modal-btn-primary"
                  disabled={endActivityLoading}
                >
                  확인
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 확인 모달 */}
      {showConfirmModal && (
        <div className="teacher-modal-overlay" onClick={() => setShowConfirmModal(false)}>
          <div className="teacher-modal teacher-modal-confirm" onClick={(e) => e.stopPropagation()}>
            <div className="teacher-modal-header">
              <h2 className="teacher-modal-title">활동 종료 확인</h2>
            </div>
            
            <div className="teacher-modal-body">
              <p className="teacher-modal-message">
                학교의 모든 데이터가 삭제됩니다. 다른 반 데이터도 전부 삭제됩니다.
              </p>
              <p className="teacher-modal-question">
                활동을 종료하시겠습니까?
              </p>
            </div>
            
            <div className="teacher-modal-actions">
              <button
                type="button"
                className="teacher-modal-btn teacher-modal-btn-cancel"
                onClick={() => setShowConfirmModal(false)}
                disabled={endActivityLoading}
              >
                취소
              </button>
              <button
                type="button"
                className="teacher-modal-btn teacher-modal-btn-danger"
                onClick={handleConfirmEndActivity}
                disabled={endActivityLoading}
              >
                {endActivityLoading ? '처리 중...' : '확인'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TeacherClass

