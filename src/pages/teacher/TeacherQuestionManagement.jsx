import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../firebase/auth'
import { QUESTION_DATA } from '../../data/questions'
import { ANSWERS } from '../../utils/answerCheck'
import { EXHIBITION_HALL_ACTIVITIES } from '../../utils/activityOrder'
import { formatTeacherGroupLabel } from '../../utils/teacherGroupLabel'
import './TeacherQuestionManagement.css'
import './TeacherPage.css'

function TeacherQuestionManagement() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('questions')
  const [teacherData, setTeacherData] = useState(null)
  const [selectedMuseum, setSelectedMuseum] = useState('all') // 'all', 'palace', 'seoul'
  const [selectedHall, setSelectedHall] = useState(null)
  const [expandedQuestions, setExpandedQuestions] = useState({})
  const [showSidebar, setShowSidebar] = useState(false)

  useEffect(() => {
    loadTeacherData()
  }, [])

  const loadTeacherData = async () => {
    try {
      const savedTeacherData = localStorage.getItem('teacherData')
      if (savedTeacherData) {
        const data = JSON.parse(savedTeacherData)
        setTeacherData(data)
      } else {
        navigate('/teacher-login')
      }
    } catch (error) {
      console.error('교사 데이터 로드 오류:', error)
    }
  }

  const hallInfo = {
    '1_King_of_Joseon': { name: '1관: 조선의 국왕', color: 'orange', icon: 'crown', museum: 'palace' },
    '2_Royal_Life': { name: '2관: 왕실생활', color: 'blue', icon: 'home', museum: 'palace' },
    '3_Empire_of_Korea': { name: '3관: 대한제국', color: 'emerald', icon: 'flag', museum: 'palace' },
    '4_Palace_Painting': { name: '4관: 궁중서화', color: 'emerald', icon: 'palette', museum: 'palace' },
    '5_Royal_Ritual': { name: '5관: 왕실의례', color: 'orange', icon: 'celebration', museum: 'palace' },
    '6_Science_Culture': { name: '6관: 과학문화', color: 'blue', icon: 'science', museum: 'palace' },
    '1_Seoul_Joseon': { name: '1관: 조선의 서울', color: 'orange', icon: 'castle', museum: 'seoul' },
    '2_Seoul_Empire': { name: '2관: 대한제국의 서울', color: 'blue', icon: 'flag', museum: 'seoul' },
    '3_Seoul_Colonial': { name: '3관: 일제강점기의 서울', color: 'emerald', icon: 'history', museum: 'seoul' },
    '4_Seoul_Growth': { name: '4관: 성장하는 서울', color: 'orange', icon: 'trending_up', museum: 'seoul' }
  }

  // 박물관별 전시관 필터링
  const getFilteredHalls = () => {
    if (selectedMuseum === 'all') {
      return Object.entries(EXHIBITION_HALL_ACTIVITIES)
    } else {
      return Object.entries(EXHIBITION_HALL_ACTIVITIES).filter(([hallId]) => {
        return hallInfo[hallId]?.museum === selectedMuseum
      })
    }
  }

  // 박물관 선택 시 전시관 선택 초기화
  const handleMuseumSelect = (museum) => {
    setSelectedMuseum(museum)
    setSelectedHall(null)
  }

  const handleMenuClick = () => {
    setShowSidebar(true)
  }

  const handleCloseSidebar = () => {
    setShowSidebar(false)
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

  const handleEndActivity = () => {
    // 활동 종료 (추후 구현)
    console.log('활동 종료')
  }

  const handleQuestionManagement = () => {
    setActiveTab('questions')
    // 이미 문제 관리 페이지에 있으므로 아무 동작 안 함
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

  const toggleQuestion = (activityId) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [activityId]: !prev[activityId]
    }))
  }

  const getAnswerDisplay = (activityId, answerField) => {
    const answerData = ANSWERS[activityId]
    if (!answerData) return '정답 없음'
    
    const answer = answerData[answerField]
    if (Array.isArray(answer)) {
      return answer.join(', ')
    }
    return answer || '정답 없음'
  }

  const getAllAnswers = (activityId) => {
    const answerData = ANSWERS[activityId]
    if (!answerData) return []
    
    return Object.entries(answerData).map(([field, value]) => ({
      field,
      value: Array.isArray(value) ? value : [value]
    }))
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
          <h1 className="teacher-header-title">문제 및 정답 관리</h1>
          <button 
            className="teacher-header-btn teacher-header-btn-notification"
            onClick={() => navigate('/teacher/messages')}
            type="button"
          >
            <span className="material-symbols-outlined">mail</span>
          </button>
        </header>

        <main className="teacher-main">
          <div className="teacher-question-content">
            {/* 박물관 또는 전시관 선택 */}
            <section className="teacher-question-halls">
              <h2 className="teacher-question-section-title">
                {selectedMuseum === 'all' ? (
                  '박물관 선택'
                ) : selectedMuseum === 'palace' ? (
                  <>
                    국립고궁박물관 - 전시관 선택
                    <button
                      className="teacher-detail-museum-close-btn"
                      onClick={() => handleMuseumSelect('all')}
                      type="button"
                      style={{ marginLeft: '8px' }}
                    >
                      <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                  </>
                ) : (
                  <>
                    서울역사박물관 - 전시관 선택
                    <button
                      className="teacher-detail-museum-close-btn"
                      onClick={() => handleMuseumSelect('all')}
                      type="button"
                      style={{ marginLeft: '8px' }}
                    >
                      <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                  </>
                )}
              </h2>

              {selectedMuseum === 'all' ? (
                // 박물관 선택 화면
                <div className="teacher-question-halls-grid">
                  {/* 국립고궁박물관 */}
                  <button
                    className="teacher-question-hall-btn"
                    onClick={() => handleMuseumSelect('palace')}
                    type="button"
                  >
                    <div className="teacher-question-hall-icon teacher-question-hall-icon-orange">
                      <span className="material-symbols-outlined">museum</span>
                    </div>
                    <div className="teacher-question-hall-info">
                      <h3 className="teacher-question-hall-name">국립고궁박물관</h3>
                      <p className="teacher-question-hall-count">
                        {Object.entries(EXHIBITION_HALL_ACTIVITIES).filter(([hallId]) => hallInfo[hallId]?.museum === 'palace').length}개 전시관
                      </p>
                    </div>
                  </button>
                  
                  {/* 서울역사박물관 */}
                  <button
                    className="teacher-question-hall-btn"
                    onClick={() => handleMuseumSelect('seoul')}
                    type="button"
                  >
                    <div className="teacher-question-hall-icon teacher-question-hall-icon-blue">
                      <span className="material-symbols-outlined">location_city</span>
                    </div>
                    <div className="teacher-question-hall-info">
                      <h3 className="teacher-question-hall-name">서울역사박물관</h3>
                      <p className="teacher-question-hall-count">
                        {Object.entries(EXHIBITION_HALL_ACTIVITIES).filter(([hallId]) => hallInfo[hallId]?.museum === 'seoul').length}개 전시관
                      </p>
                    </div>
                  </button>
                </div>
              ) : (
                // 전시관 선택 화면
                <div className="teacher-question-halls-grid teacher-question-halls-grid-single">
                  {getFilteredHalls().map(([hallId, activities]) => {
                    const hall = hallInfo[hallId]
                    if (!hall) return null
                    return (
                      <button
                        key={hallId}
                        className={`teacher-question-hall-btn ${selectedHall === hallId ? 'teacher-question-hall-btn-active' : ''}`}
                        onClick={() => setSelectedHall(selectedHall === hallId ? null : hallId)}
                        type="button"
                      >
                        <div className={`teacher-question-hall-icon teacher-question-hall-icon-${hall.color || 'orange'}`}>
                          <span className="material-symbols-outlined">{hall.icon || 'crown'}</span>
                        </div>
                        <div className="teacher-question-hall-info">
                          <h3 className="teacher-question-hall-name">{hall.name || hallId}</h3>
                          <p className="teacher-question-hall-count">{activities.length}개 문제</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </section>

            {/* 선택된 전시관의 문제 목록 */}
            {selectedHall && (
              <section className="teacher-question-list">
                <h2 className="teacher-question-section-title">
                  {hallInfo[selectedHall]?.name || selectedHall} 문제 목록
                </h2>
                <div className="teacher-question-items">
                  {EXHIBITION_HALL_ACTIVITIES[selectedHall].map((activityId) => {
                    const question = QUESTION_DATA[activityId]
                    if (!question) return null
                    
                    const isExpanded = expandedQuestions[activityId]
                    const answers = getAllAnswers(activityId)
                    
                    return (
                      <div key={activityId} className="teacher-question-item">
                        <div 
                          className="teacher-question-item-header"
                          onClick={() => toggleQuestion(activityId)}
                        >
                          <div className="teacher-question-item-info">
                            <span className="teacher-question-item-number">{question.questionNumber}</span>
                            <h3 className="teacher-question-item-title">{question.title}</h3>
                          </div>
                          <span className={`material-symbols-outlined teacher-question-item-arrow ${isExpanded ? 'teacher-question-item-arrow-expanded' : ''}`}>
                            expand_more
                          </span>
                        </div>
                        
                        {isExpanded && (
                          <div className="teacher-question-item-content">
                            <div className="teacher-question-item-description">
                              <p>{question.description}</p>
                            </div>
                            
                            {question.image && (
                              <div className="teacher-question-item-image">
                                <img src={question.image} alt={question.title} />
                              </div>
                            )}
                            
                            <div className="teacher-question-item-answers">
                              <h4 className="teacher-question-answers-title">정답</h4>
                              <div className="teacher-question-answer-item">
                                <span className="teacher-question-answer-value">
                                  {answers.flatMap(answer => 
                                    Array.isArray(answer.value) ? answer.value : [answer.value]
                                  ).join(', ')}
                                </span>
                              </div>
                            </div>
                            
                            {question.explanation && (
                              <div className="teacher-question-item-explanation">
                                <h4 className="teacher-question-explanation-title">설명</h4>
                                <p>{question.explanation}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </section>
            )}
          </div>
        </main>

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
                    {formatTeacherGroupLabel(teacherData)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

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
    </div>
  )
}

export default TeacherQuestionManagement

