import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { onAuthChange } from '../firebase/auth'
import { 
  getAllSchools, 
  createSchool, 
  updateSchoolPassword, 
  deleteSchool,
  getSchoolInfo 
} from '../firebase/firestore'
import './Adminpage.css'

function Adminpage() {
  const navigate = useNavigate()
  const [schools, setSchools] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDetailView, setShowDetailView] = useState(false)
  const [selectedSchool, setSelectedSchool] = useState(null)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  
  // 새 학교 등록 폼 상태
  const [newSchool, setNewSchool] = useState({
    schoolName: '',
    schoolCode: '',
    password: ''
  })
  
  // 비밀번호 변경 폼 상태
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    // 관리자 인증 확인
    onAuthChange(async (user) => {
      if (user) {
        const email = user.email
        console.log('현재 인증된 사용자:', { email, uid: user.uid })
        
        // 관리자 이메일 형식 확인
        if (email && email.includes('@admin.local')) {
          // 관리자로 인증됨, 학교 목록 로드
          await loadSchools()
        } else {
          // 관리자가 아니면 로그인 페이지로 리다이렉트
          console.warn('관리자 권한이 없습니다. 로그인 페이지로 이동합니다.')
          navigate('/teacher-login')
        }
      } else {
        // 로그인되지 않음
        console.warn('Firebase Authentication에 로그인되어 있지 않습니다. 로그인 페이지로 이동합니다.')
        navigate('/teacher-login')
      }
    })
  }, [navigate])

  const loadSchools = async () => {
    setLoading(true)
    setError('')
    try {
      const result = await getAllSchools()
      if (result.success) {
        setSchools(result.schools)
      } else {
        setError(result.error || '학교 목록을 불러오는데 실패했습니다.')
      }
    } catch (err) {
      console.error('학교 목록 로드 오류:', err)
      setError('학교 목록을 불러오는 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleAddSchool = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!newSchool.schoolName || !newSchool.schoolCode || !newSchool.password) {
      setError('모든 필드를 입력해주세요.')
      return
    }
    
    if (newSchool.password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.')
      return
    }

    try {
      const result = await createSchool(
        newSchool.schoolName,
        newSchool.schoolCode,
        newSchool.password
      )
      
      if (result.success) {
        setShowAddModal(false)
        setNewSchool({ schoolName: '', schoolCode: '', password: '' })
        await loadSchools()
      } else {
        setError(result.error || '학교 등록에 실패했습니다.')
      }
    } catch (err) {
      console.error('학교 등록 오류:', err)
      setError('학교 등록 중 오류가 발생했습니다.')
    }
  }

  const handleDeleteSchool = async (schoolCode) => {
    if (!window.confirm('정말로 이 학교를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      return
    }

    try {
      const result = await deleteSchool(schoolCode)
      if (result.success) {
        await loadSchools()
        if (selectedSchool?.schoolCode === schoolCode) {
          setShowDetailView(false)
          setSelectedSchool(null)
        }
      } else {
        setError(result.error || '학교 삭제에 실패했습니다.')
      }
    } catch (err) {
      console.error('학교 삭제 오류:', err)
      setError('학교 삭제 중 오류가 발생했습니다.')
    }
  }

  const handleUpdatePassword = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!passwordForm.newPassword || !passwordForm.confirmPassword) {
      setError('새 비밀번호를 입력해주세요.')
      return
    }
    
    if (passwordForm.newPassword.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.')
      return
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('새 비밀번호가 일치하지 않습니다.')
      return
    }

    try {
      // 현재 비밀번호 확인
      const schoolResult = await getSchoolInfo(selectedSchool.schoolCode)
      if (!schoolResult.success) {
        setError('학교 정보를 불러올 수 없습니다.')
        return
      }
      
      if (schoolResult.data.password !== passwordForm.currentPassword) {
        setError('현재 비밀번호가 일치하지 않습니다.')
        return
      }

      const result = await updateSchoolPassword(selectedSchool.schoolCode, passwordForm.newPassword)
      
      if (result.success) {
        setShowPasswordModal(false)
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
        await loadSchools()
        // 선택된 학교 정보도 업데이트
        const updatedResult = await getSchoolInfo(selectedSchool.schoolCode)
        if (updatedResult.success) {
          setSelectedSchool(updatedResult.data)
        }
      } else {
        setError(result.error || '비밀번호 변경에 실패했습니다.')
      }
    } catch (err) {
      console.error('비밀번호 변경 오류:', err)
      setError('비밀번호 변경 중 오류가 발생했습니다.')
    }
  }

  const handleSchoolClick = async (school) => {
    setSelectedSchool(school)
    setShowDetailView(true)
  }

  const generateSchoolCode = () => {
    const prefix = newSchool.schoolName.substring(0, 1).toUpperCase()
    const year = new Date().getFullYear()
    const random = Math.floor(Math.random() * 100).toString().padStart(2, '0')
    return `${prefix}-${year}-${random}`
  }

  const filteredSchools = schools.filter(school => {
    const query = searchQuery.toLowerCase()
    return (
      school.schoolName?.toLowerCase().includes(query) ||
      school.schoolCode?.toLowerCase().includes(query)
    )
  })

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-loading-spinner"></div>
        <p>로딩 중...</p>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <div className="admin-container">
        {/* 메인 뷰 */}
        <div 
          className={`admin-main-view ${showDetailView ? 'admin-main-view-slide' : ''}`}
          id="main-view"
        >
          <header className="admin-header">
            <div>
              <p className="admin-header-subtitle">관리자 모드</p>
              <h1 className="admin-header-title">학교 관리</h1>
            </div>
            <button 
              className="admin-header-exit-btn"
              aria-label="나가기"
              onClick={() => navigate('/')}
            >
              <span className="material-symbols-outlined">logout</span>
            </button>
          </header>

          <div className="admin-search-container">
            <div className="admin-search-wrapper">
              <div className="admin-search-icon">
                <span className="material-symbols-outlined">search</span>
              </div>
              <input
                className="admin-search-input"
                type="text"
                placeholder="학교 이름 또는 코드 검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="admin-schools-header">
            <h2 className="admin-schools-title">등록된 학교</h2>
            <span className="admin-schools-count">Total {filteredSchools.length}</span>
          </div>

          <div className="admin-schools-list">
            {error && (
              <div className="admin-error-message">{error}</div>
            )}
            {filteredSchools.length === 0 ? (
              <div className="admin-empty-state">
                <span className="material-symbols-outlined">school</span>
                <p>등록된 학교가 없습니다.</p>
              </div>
            ) : (
              filteredSchools.map((school) => (
                <div
                  key={school.id}
                  className="admin-school-card"
                  onClick={() => handleSchoolClick(school)}
                >
                  <div className="admin-school-card-content">
                    <div className="admin-school-icon">
                      <span className="material-symbols-outlined filled">school</span>
                    </div>
                    <div className="admin-school-info">
                      <h3 className="admin-school-name">{school.schoolName || '이름 없음'}</h3>
                      <div className="admin-school-code-wrapper">
                        <span className="admin-school-code-label">CODE</span>
                        <span className="admin-school-code">{school.schoolCode}</span>
                      </div>
                    </div>
                  </div>
                  <button className="admin-school-chevron">
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </div>
              ))
            )}
          </div>

          <button
            className="admin-add-button"
            aria-label="새 학교 등록"
            onClick={() => setShowAddModal(true)}
          >
            <span className="material-symbols-outlined">add</span>
          </button>
        </div>

        {/* 상세 뷰 */}
        <div 
          className={`admin-detail-view ${showDetailView ? 'admin-detail-view-visible' : ''}`}
          id="detail-view"
        >
          {selectedSchool && (
            <>
              <header className="admin-detail-header">
                <button
                  className="admin-detail-back-btn"
                  onClick={() => {
                    setShowDetailView(false)
                    setSelectedSchool(null)
                  }}
                >
                  <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <div className="admin-detail-header-title">
                  <h1>학교 상세 정보</h1>
                </div>
                <button className="admin-detail-edit-btn">
                  편집
                </button>
              </header>

              <div className="admin-detail-content">
                <div className="admin-detail-hero">
                  <div className="admin-detail-icon-large">
                    <span className="material-symbols-outlined filled">school</span>
                  </div>
                  <h2 className="admin-detail-school-name">{selectedSchool.schoolName}</h2>
                  <div className="admin-detail-code-badge">
                    CODE: {selectedSchool.schoolCode}
                  </div>
                </div>

                <div className="admin-detail-stats">
                  <div className="admin-detail-stat">
                    <span className="admin-detail-stat-number">-</span>
                    <span className="admin-detail-stat-label">등록된 학생</span>
                  </div>
                  <div className="admin-detail-stat">
                    <span className="admin-detail-stat-number">-</span>
                    <span className="admin-detail-stat-label">진행 중인 반</span>
                  </div>
                </div>

                <div className="admin-detail-sections">
                  <div className="admin-detail-section">
                    <h3 className="admin-detail-section-title">
                      <span className="material-symbols-outlined">info</span>
                      기본 정보
                    </h3>
                    <div className="admin-detail-info-card">
                      <div className="admin-detail-info-row">
                        <span className="admin-detail-info-label">등록일</span>
                        <span className="admin-detail-info-value">
                          {selectedSchool.createdAt?.toDate?.() 
                            ? new Date(selectedSchool.createdAt.toDate()).toLocaleDateString('ko-KR')
                            : '-'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="admin-detail-section">
                    <h3 className="admin-detail-section-title">
                      <span className="material-symbols-outlined">lock</span>
                      보안 설정
                    </h3>
                    <div className="admin-detail-security-card">
                      <div className="admin-detail-security-header">
                        <span className="admin-detail-security-label">접속 비밀번호</span>
                        <button
                          className="admin-detail-security-change-btn"
                          onClick={() => setShowPasswordModal(true)}
                        >
                          변경하기
                        </button>
                      </div>
                      <div className="admin-detail-password-display">
                        <span className="admin-detail-password-dots">••••••</span>
                        <span className="material-symbols-outlined">visibility_off</span>
                      </div>
                      <p className="admin-detail-password-info">
                        <span className="material-symbols-outlined">info</span>
                        학교 코드로 접속 시 필요한 6자리 비밀번호입니다.
                      </p>
                    </div>
                  </div>

                  <div className="admin-detail-actions">
                    <button
                      className="admin-detail-delete-btn"
                      onClick={() => handleDeleteSchool(selectedSchool.schoolCode)}
                    >
                      <span className="material-symbols-outlined">delete</span>
                      학교 삭제
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* 추가 모달 */}
        {showAddModal && (
          <div className="admin-modal-overlay" onClick={() => setShowAddModal(false)}>
            <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
              <div className="admin-modal-handle"></div>
              <h3 className="admin-modal-title">
                <span className="material-symbols-outlined">add_circle</span>
                학교 추가
              </h3>
              <form className="admin-modal-form" onSubmit={handleAddSchool}>
                <div className="admin-modal-field">
                  <label className="admin-modal-label">학교 이름</label>
                  <input
                    className="admin-modal-input"
                    type="text"
                    placeholder="예: 서울과학고등학교"
                    value={newSchool.schoolName}
                    onChange={(e) => setNewSchool({ ...newSchool, schoolName: e.target.value })}
                    required
                  />
                </div>
                <div className="admin-modal-field">
                  <label className="admin-modal-label">학교 코드</label>
                  <div className="admin-modal-code-wrapper">
                    <input
                      className="admin-modal-input admin-modal-code-input"
                      type="text"
                      value={newSchool.schoolCode}
                      onChange={(e) => setNewSchool({ ...newSchool, schoolCode: e.target.value })}
                      placeholder="자동 생성 또는 직접 입력"
                      required
                    />
                    <button
                      type="button"
                      className="admin-modal-code-generate-btn"
                      onClick={() => setNewSchool({ ...newSchool, schoolCode: generateSchoolCode() })}
                    >
                      <span className="material-symbols-outlined">refresh</span>
                    </button>
                  </div>
                </div>
                <div className="admin-modal-field">
                  <label className="admin-modal-label">접속 비밀번호</label>
                  <input
                    className="admin-modal-input"
                    type="password"
                    value={newSchool.password}
                    onChange={(e) => setNewSchool({ ...newSchool, password: e.target.value })}
                    placeholder="최소 6자 이상"
                    minLength={6}
                    required
                  />
                </div>
                {error && (
                  <div className="admin-error-message">{error}</div>
                )}
                <div className="admin-modal-actions">
                  <button
                    type="button"
                    className="admin-modal-cancel-btn"
                    onClick={() => {
                      setShowAddModal(false)
                      setNewSchool({ schoolName: '', schoolCode: '', password: '' })
                      setError('')
                    }}
                  >
                    취소
                  </button>
                  <button type="submit" className="admin-modal-submit-btn">
                    저장하기
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 비밀번호 변경 모달 */}
        {showPasswordModal && selectedSchool && (
          <div className="admin-modal-overlay" onClick={() => setShowPasswordModal(false)}>
            <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
              <div className="admin-modal-handle"></div>
              <h3 className="admin-modal-title">
                <span className="material-symbols-outlined">lock</span>
                비밀번호 변경
              </h3>
              <form className="admin-modal-form" onSubmit={handleUpdatePassword}>
                <div className="admin-modal-field">
                  <label className="admin-modal-label">현재 비밀번호</label>
                  <input
                    className="admin-modal-input"
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    required
                  />
                </div>
                <div className="admin-modal-field">
                  <label className="admin-modal-label">새 비밀번호</label>
                  <input
                    className="admin-modal-input"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    minLength={6}
                    required
                  />
                </div>
                <div className="admin-modal-field">
                  <label className="admin-modal-label">새 비밀번호 확인</label>
                  <input
                    className="admin-modal-input"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    minLength={6}
                    required
                  />
                </div>
                {error && (
                  <div className="admin-error-message">{error}</div>
                )}
                <div className="admin-modal-actions">
                  <button
                    type="button"
                    className="admin-modal-cancel-btn"
                    onClick={() => {
                      setShowPasswordModal(false)
                      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
                      setError('')
                    }}
                  >
                    취소
                  </button>
                  <button type="submit" className="admin-modal-submit-btn">
                    변경하기
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Adminpage

