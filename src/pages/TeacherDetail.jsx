import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { logout, onAuthChange } from '../firebase/auth'
import { getTeacherStudents, getStudentsProgress } from '../firebase/firestore'
import './TeacherDetail.css'
import './TeacherPage.css'

function TeacherDetail() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('students')
  const [loading, setLoading] = useState(true)
  const [teacherData, setTeacherData] = useState(null)
  const [schoolInfo, setSchoolInfo] = useState('')
  const [totalStudents, setTotalStudents] = useState(0)
  const [averageProgress, setAverageProgress] = useState(0)
  const [students, setStudents] = useState([])
  const [sortOrder, setSortOrder] = useState('number') // 'number', 'low', 'completed', 'inProgress'
  const [filter, setFilter] = useState('all') // 'all', 'low', 'completed', 'inProgress'
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
              await loadStudentData(schoolCode, parseInt(grade), parseInt(classNum))
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

  const loadStudentData = async (schoolCode, grade, classNum) => {
    try {
      setLoading(true)
      
      // 학생 목록 가져오기
      const studentsResult = await getTeacherStudents(schoolCode, grade, classNum)
      if (!studentsResult.success) {
        setLoading(false)
        return
      }

      // 학생 진행률 가져오기
      const progressResult = await getStudentsProgress(schoolCode, grade, classNum)
      if (progressResult.success) {
        setTotalStudents(progressResult.totalStudents)
        setAverageProgress(progressResult.averageProgress)
        
        // 학생 목록과 진행률 결합
        const studentsWithProgress = studentsResult.students.map(student => {
          const progress = progressResult.progress[student.studentId] || {
            completed: 0,
            total: 50,
            progress: 0
          }
          
          return {
            ...student,
            progress: progress.progress,
            completed: progress.completed,
            total: progress.total
          }
        })
        
        setStudents(studentsWithProgress)
      } else {
        // 진행률 없으면 학생 목록만 표시
        setStudents(studentsResult.students.map(s => ({ ...s, progress: 0, completed: 0, total: 50 })))
      }
      
      setLoading(false)
    } catch (error) {
      console.error('학생 데이터 로드 오류:', error)
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
      loadStudentData(teacherData.schoolCode, teacherData.grade, teacherData.classNum)
    }
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

  const handleSort = (order) => {
    setSortOrder(order)
  }

  const handleFilter = (filterType) => {
    setFilter(filterType)
  }

  const handleSendMessage = () => {
    // 전체 메시지 보내기 (추후 구현)
    console.log('전체 메시지 보내기')
  }

  const handleStudentClick = (student) => {
    // 학생 상세 정보 (추후 구현)
    console.log('학생 클릭:', student)
  }

  // 필터링 및 정렬된 학생 목록
  const getFilteredAndSortedStudents = () => {
    let filtered = [...students]
    
    // 필터 적용
    if (filter === 'low') {
      filtered = filtered.filter(s => s.progress < 50)
    } else if (filter === 'completed') {
      filtered = filtered.filter(s => s.progress >= 100)
    } else if (filter === 'inProgress') {
      filtered = filtered.filter(s => s.progress > 0 && s.progress < 100)
    }
    
    // 정렬
    if (sortOrder === 'number') {
      filtered.sort((a, b) => a.number - b.number)
    } else if (sortOrder === 'low') {
      filtered.sort((a, b) => a.progress - b.progress)
    } else if (sortOrder === 'completed') {
      filtered.sort((a, b) => b.progress - a.progress)
    }
    
    return filtered
  }

  const filteredStudents = getFilteredAndSortedStudents()
  const completedCount = students.filter(s => s.progress >= 100).length
  const inProgressCount = students.filter(s => s.progress > 0 && s.progress < 100).length

  // 진행률에 따른 색상 결정
  const getProgressColor = (progress) => {
    if (progress >= 100) return '#7f13ec' // primary
    if (progress < 30) return '#ef4444' // red
    return '#7f13ec' // primary
  }

  // 진행률에 따른 배경 색상 결정
  const getProgressBgColor = (progress) => {
    if (progress >= 100) return '#4c1d95' // primary-dark
    if (progress < 30) return '#3f1818' // dark red
    return '#4c1d95' // primary-dark
  }

  // 진행률에 따른 텍스트 색상
  const getProgressTextColor = (progress) => {
    if (progress >= 100) return 'primary'
    if (progress < 30) return 'red'
    return 'secondary'
  }

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
          <h1 className="teacher-header-title">{schoolInfo} 학습 현황</h1>
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
            <div className="teacher-detail-content">
            <section className="teacher-detail-stats">
              <div className="teacher-detail-stat-card">
                <div className="teacher-detail-stat-icon">
                  <span className="material-symbols-outlined">groups</span>
                </div>
                <p className="teacher-detail-stat-value">
                  {totalStudents}
                  <span className="teacher-detail-stat-unit">명</span>
                </p>
                <p className="teacher-detail-stat-label">전체 학생</p>
              </div>
              <div className="teacher-detail-stat-card teacher-detail-stat-card-primary">
                <div className="teacher-detail-stat-card-bg"></div>
                <div className="teacher-detail-stat-icon teacher-detail-stat-icon-primary">
                  <span className="material-symbols-outlined">avg_pace</span>
                </div>
                <p className="teacher-detail-stat-value teacher-detail-stat-value-primary">
                  {averageProgress}
                  <span className="teacher-detail-stat-unit teacher-detail-stat-unit-primary">%</span>
                </p>
                <p className="teacher-detail-stat-label">평균 진도율</p>
              </div>
            </section>

            <section className="teacher-detail-filters">
              <div className="teacher-detail-filters-header">
                <h3 className="teacher-detail-filters-title">학생별 진도율</h3>
                <button 
                  className="teacher-detail-sort-btn"
                  onClick={() => handleSort('number')}
                  type="button"
                >
                  <span className="material-symbols-outlined">sort</span>
                  번호순
                </button>
              </div>
              <div className="teacher-detail-filter-buttons">
                <button
                  className={`teacher-detail-filter-btn ${filter === 'low' ? 'teacher-detail-filter-btn-active' : ''}`}
                  onClick={() => handleFilter('low')}
                  type="button"
                >
                  <span className="material-symbols-outlined">warning</span>
                  진도율 낮은순
                </button>
                <button
                  className={`teacher-detail-filter-btn ${filter === 'completed' ? 'teacher-detail-filter-btn-active' : ''}`}
                  onClick={() => handleFilter('completed')}
                  type="button"
                >
                  <span className="material-symbols-outlined">check_circle</span>
                  완료됨 ({completedCount})
                </button>
                <button
                  className={`teacher-detail-filter-btn ${filter === 'inProgress' ? 'teacher-detail-filter-btn-active' : ''}`}
                  onClick={() => handleFilter('inProgress')}
                  type="button"
                >
                  <span className="material-symbols-outlined">hourglass_top</span>
                  진행중 ({inProgressCount})
                </button>
              </div>
            </section>

            <main className="teacher-detail-main">
              <div className="teacher-detail-grid">
                {filteredStudents.map((student) => {
                  const progress = student.progress || 0
                  const progressColor = getProgressColor(progress)
                  const progressBgColor = getProgressBgColor(progress)
                  const textColor = getProgressTextColor(progress)
                  const isCompleted = progress >= 100
                  
                  return (
                    <div
                      key={student.studentId}
                      className={`teacher-detail-student-card ${progress < 30 ? 'teacher-detail-student-card-low' : ''} ${isCompleted ? 'teacher-detail-student-card-completed' : ''}`}
                      onClick={() => handleStudentClick(student)}
                    >
                      <div 
                        className="teacher-detail-student-progress-circle"
                        style={{
                          background: `conic-gradient(${progressColor} ${progress}%, ${progressBgColor} 0)`
                        }}
                      >
                        <div className="teacher-detail-student-progress-inner">
                          <span className={`teacher-detail-student-number teacher-detail-student-number-${textColor}`}>
                            {String(student.number).padStart(2, '0')}
                          </span>
                        </div>
                      </div>
                      <span className={`teacher-detail-student-progress-text teacher-detail-student-progress-text-${textColor}`}>
                        {progress}%
                      </span>
                      {isCompleted && (
                        <div className="teacher-detail-student-check">
                          <span className="material-symbols-outlined">check_circle</span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </main>
            </div>
          )}
        </main>

        {/* 메시지 보내기 버튼 - teacher-main 밖으로 이동 */}
        {!loading && (
          <div className="teacher-detail-fab">
            <button 
              className="teacher-detail-fab-btn"
              onClick={handleSendMessage}
              type="button"
            >
              <span className="material-symbols-outlined">send</span>
              <span>전체 메시지</span>
            </button>
          </div>
        )}

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

export default TeacherDetail


