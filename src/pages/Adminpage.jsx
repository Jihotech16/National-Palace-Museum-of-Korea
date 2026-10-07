import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { onAuthChange, ADMIN_EMAIL } from '../firebase/auth'
import { Timestamp, deleteField } from 'firebase/firestore'
import { 
  getAllSchools, 
  createSchool, 
  updateSchoolPassword, 
  updateSchool,
  deleteSchool,
  getSchoolInfo,
  verifySchoolPassword,
  migratePlaintextPasswords
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
  const [showPeriodModal, setShowPeriodModal] = useState(false)
  
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
  
  // 박물관 활동 기간 폼 상태
  const [periodForm, setPeriodForm] = useState({
    museum: 'palace', // 'palace' 또는 'seoul'
    startDate: '',
    startTime: '09:00', // 기본 시작 시간
    endDate: '',
    endTime: '18:00' // 기본 종료 시간
  })
  
  // 박물관 정보
  const museums = [
    { id: 'palace', name: '국립고궁박물관', icon: 'museum' },
    { id: 'seoul', name: '서울역사박물관', icon: 'location_city' }
  ]

  useEffect(() => {
    // 관리자 인증 확인
    onAuthChange(async (user) => {
      if (user) {
        const email = user.email
        console.log('현재 인증된 사용자:', { email, uid: user.uid })
        
        // 관리자 이메일 형식 확인
        if (email === ADMIN_EMAIL) {
          // 관리자로 인증됨: 예전 평문 비밀번호가 남아 있으면 해시로 옮긴 뒤 학교 목록 로드
          const migration = await migratePlaintextPasswords()
          if (!migration.success) {
            console.error('평문 비밀번호 이전 실패:', migration.error)
          }
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
      const verifyResult = await verifySchoolPassword(selectedSchool.schoolCode, passwordForm.currentPassword)
      if (!verifyResult.success) {
        setError(verifyResult.error || '학교 정보를 불러올 수 없습니다.')
        return
      }
      
      if (!verifyResult.match) {
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
    // 기존 기간 데이터를 폼에 설정 (palace 기본값)
    const museumId = 'palace'
    const museumPeriods = school.museumPeriods || {}
    const period = museumPeriods[museumId] || {}
    
    let startDate = ''
    let startTime = '09:00'
    let endDate = ''
    let endTime = '18:00'
    
    if (period.startDate?.toDate) {
      const start = new Date(period.startDate.toDate())
      // 한국 시간으로 변환
      const koreaStart = new Date(start.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }))
      startDate = koreaStart.toISOString().split('T')[0]
      startTime = `${String(koreaStart.getHours()).padStart(2, '0')}:${String(koreaStart.getMinutes()).padStart(2, '0')}`
    }
    
    if (period.endDate?.toDate) {
      const end = new Date(period.endDate.toDate())
      // 한국 시간으로 변환
      const koreaEnd = new Date(end.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }))
      endDate = koreaEnd.toISOString().split('T')[0]
      endTime = `${String(koreaEnd.getHours()).padStart(2, '0')}:${String(koreaEnd.getMinutes()).padStart(2, '0')}`
    }
    
    setPeriodForm({ museum: museumId, startDate, startTime, endDate, endTime })
  }
  
  const handleMuseumChange = (museumId) => {
    // 박물관 변경 시 해당 박물관의 기간 데이터를 폼에 로드
    if (!selectedSchool) return
    
    const museumPeriods = selectedSchool.museumPeriods || {}
    const period = museumPeriods[museumId] || {}
    
    let startDate = ''
    let startTime = '09:00'
    let endDate = ''
    let endTime = '18:00'
    
    if (period.startDate?.toDate) {
      const start = new Date(period.startDate.toDate())
      // 한국 시간으로 변환
      const koreaStart = new Date(start.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }))
      startDate = koreaStart.toISOString().split('T')[0]
      startTime = `${String(koreaStart.getHours()).padStart(2, '0')}:${String(koreaStart.getMinutes()).padStart(2, '0')}`
    }
    
    if (period.endDate?.toDate) {
      const end = new Date(period.endDate.toDate())
      // 한국 시간으로 변환
      const koreaEnd = new Date(end.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }))
      endDate = koreaEnd.toISOString().split('T')[0]
      endTime = `${String(koreaEnd.getHours()).padStart(2, '0')}:${String(koreaEnd.getMinutes()).padStart(2, '0')}`
    }
    
    setPeriodForm({ museum: museumId, startDate, startTime, endDate, endTime })
  }

  const handleUpdatePeriod = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!periodForm.startDate || !periodForm.startTime || !periodForm.endDate || !periodForm.endTime) {
      setError('시작일, 시작 시간, 종료일, 종료 시간을 모두 입력해주세요.')
      return
    }
    
    // 한국 시간으로 날짜와 시간 결합하여 비교
    const startDateTimeStr = `${periodForm.startDate}T${periodForm.startTime}:00+09:00`
    const endDateTimeStr = `${periodForm.endDate}T${periodForm.endTime}:00+09:00`
    const startDateTime = new Date(startDateTimeStr)
    const endDateTime = new Date(endDateTimeStr)
    
    if (startDateTime > endDateTime) {
      setError('종료일시는 시작일시 이후여야 합니다.')
      return
    }

    try {
      // 한국 시간 기준으로 날짜와 시간을 합쳐서 Date 객체 생성
      // 한국 시간대(UTC+9)의 날짜/시간 문자열을 만들고, 이를 UTC로 변환
      const [startHour, startMinute] = periodForm.startTime.split(':').map(Number)
      const [endHour, endMinute] = periodForm.endTime.split(':').map(Number)
      
      // ISO 8601 형식으로 한국 시간대 문자열 생성
      // "YYYY-MM-DDTHH:mm:ss+09:00" 형식
      const startDateTimeStr = `${periodForm.startDate}T${String(startHour).padStart(2, '0')}:${String(startMinute).padStart(2, '0')}:00+09:00`
      const endDateTimeStr = `${periodForm.endDate}T${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}:00+09:00`
      
      // ISO 8601 문자열을 Date 객체로 변환 (자동으로 UTC로 변환됨)
      const startUTC = new Date(startDateTimeStr)
      const endUTC = new Date(endDateTimeStr)
      
      // 유효성 검사
      if (isNaN(startUTC.getTime()) || isNaN(endUTC.getTime())) {
        setError('날짜와 시간 형식이 올바르지 않습니다.')
        return
      }
      
      // 화면의 selectedSchool은 오래된 값일 수 있으므로, 저장 직전 최신 문서를 읽어 병합 (다른 박물관 기간 유실 방지)
      const freshResult = await getSchoolInfo(selectedSchool.schoolCode)
      const schoolData = freshResult.success ? freshResult.data : selectedSchool

      let currentPeriods = schoolData.museumPeriods || {}

      // 기존 museumStartDate, museumEndDate가 있으면 palace로 마이그레이션
      if (schoolData.museumStartDate && schoolData.museumEndDate && !currentPeriods.palace) {
        currentPeriods = {
          palace: {
            startDate: schoolData.museumStartDate,
            endDate: schoolData.museumEndDate
          },
          ...currentPeriods
        }
      }

      // 선택한 박물관의 기간 업데이트
      const updates = {
        museumPeriods: {
          ...currentPeriods,
          [periodForm.museum]: {
            startDate: Timestamp.fromDate(startUTC),
            endDate: Timestamp.fromDate(endUTC)
          }
        }
      }

      // 기존 museumStartDate, museumEndDate 필드 제거 (마이그레이션 후)
      if (schoolData.museumStartDate || schoolData.museumEndDate) {
        updates.museumStartDate = deleteField()
        updates.museumEndDate = deleteField()
      }

      console.log('Firestore 업데이트:', { schoolCode: selectedSchool.schoolCode, updates })
      const result = await updateSchool(selectedSchool.schoolCode, updates)
      
      if (result.success) {
        setShowPeriodModal(false)
        await loadSchools()
        // 선택된 학교 정보도 업데이트
        const updatedResult = await getSchoolInfo(selectedSchool.schoolCode)
        if (updatedResult.success) {
          setSelectedSchool(updatedResult.data)
          // 업데이트된 기간 데이터를 폼에 다시 설정
          const updatedPeriods = updatedResult.data.museumPeriods || {}
          const updatedPeriod = updatedPeriods[periodForm.museum] || {}
          
          let startDate = ''
          let startTime = '09:00'
          let endDate = ''
          let endTime = '18:00'
          
          if (updatedPeriod.startDate?.toDate) {
            const start = new Date(updatedPeriod.startDate.toDate())
            const koreaStart = new Date(start.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }))
            startDate = koreaStart.toISOString().split('T')[0]
            startTime = `${String(koreaStart.getHours()).padStart(2, '0')}:${String(koreaStart.getMinutes()).padStart(2, '0')}`
          }
          
          if (updatedPeriod.endDate?.toDate) {
            const end = new Date(updatedPeriod.endDate.toDate())
            const koreaEnd = new Date(end.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }))
            endDate = koreaEnd.toISOString().split('T')[0]
            endTime = `${String(koreaEnd.getHours()).padStart(2, '0')}:${String(koreaEnd.getMinutes()).padStart(2, '0')}`
          }
          
          setPeriodForm({ ...periodForm, startDate, startTime, endDate, endTime })
        }
      } else {
        setError(result.error || '기간 설정에 실패했습니다.')
      }
    } catch (err) {
      console.error('기간 설정 오류:', err)
      setError('기간 설정 중 오류가 발생했습니다.')
    }
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

                  <div className="admin-detail-section">
                    <h3 className="admin-detail-section-title">
                      <span className="material-symbols-outlined">event</span>
                      박물관 활동 기간
                    </h3>
                    <div className="admin-detail-security-card">
                      <div className="admin-detail-security-header">
                        <span className="admin-detail-security-label">활동 기간</span>
                        <button
                          className="admin-detail-security-change-btn"
                          onClick={() => {
                            const defaultMuseumId = 'palace'
                            const museumPeriods = selectedSchool?.museumPeriods || {}
                            const period = museumPeriods[defaultMuseumId] || {}
                            let startDate = ''
                            let startTime = '09:00'
                            let endDate = ''
                            let endTime = '18:00'
                            if (period.startDate?.toDate) {
                              const start = new Date(period.startDate.toDate())
                              const koreaStart = new Date(start.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }))
                              startDate = koreaStart.toISOString().split('T')[0]
                              startTime = `${String(koreaStart.getHours()).padStart(2, '0')}:${String(koreaStart.getMinutes()).padStart(2, '0')}`
                            }
                            if (period.endDate?.toDate) {
                              const end = new Date(period.endDate.toDate())
                              const koreaEnd = new Date(end.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }))
                              endDate = koreaEnd.toISOString().split('T')[0]
                              endTime = `${String(koreaEnd.getHours()).padStart(2, '0')}:${String(koreaEnd.getMinutes()).padStart(2, '0')}`
                            }
                            setPeriodForm({ museum: defaultMuseumId, startDate, startTime, endDate, endTime })
                            setShowPeriodModal(true)
                          }}
                        >
                          설정하기
                        </button>
                      </div>
                      <div className="admin-detail-period-display">
                        {(() => {
                          const museumPeriods = selectedSchool.museumPeriods || {}
                          const hasAnyPeriod = Object.keys(museumPeriods).length > 0
                          
                          if (!hasAnyPeriod) {
                            return (
                              <div className="admin-detail-period-empty">
                                <span className="material-symbols-outlined">event_busy</span>
                                <span>활동 기간이 설정되지 않았습니다.</span>
                              </div>
                            )
                          }
                          
                          return (
                            <div className="admin-detail-period-list">
                              {museums.map((museum) => {
                                const period = museumPeriods[museum.id] || {}
                                const hasPeriod = period.startDate && period.endDate
                                
                                return (
                                  <div key={museum.id} className="admin-detail-period-item">
                                    <div className="admin-detail-period-museum-header">
                                      <span className="material-symbols-outlined">{museum.icon}</span>
                                      <span className="admin-detail-period-museum-name">{museum.name}</span>
                                    </div>
                                    {hasPeriod ? (
                                      <div className="admin-detail-period-dates">
                                        <div className="admin-detail-period-date">
                                          <span className="admin-detail-period-label">시작</span>
                                          <span className="admin-detail-period-value">
                                            {(() => {
                                              if (!period.startDate?.toDate) return '-'
                                              const start = new Date(period.startDate.toDate())
                                              const koreaStart = new Date(start.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }))
                                              return `${koreaStart.toLocaleDateString('ko-KR')} ${String(koreaStart.getHours()).padStart(2, '0')}:${String(koreaStart.getMinutes()).padStart(2, '0')}`
                                            })()}
                                          </span>
                                        </div>
                                        <div className="admin-detail-period-separator">
                                          <span className="material-symbols-outlined">arrow_forward</span>
                                        </div>
                                        <div className="admin-detail-period-date">
                                          <span className="admin-detail-period-label">종료</span>
                                          <span className="admin-detail-period-value">
                                            {(() => {
                                              if (!period.endDate?.toDate) return '-'
                                              const end = new Date(period.endDate.toDate())
                                              const koreaEnd = new Date(end.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }))
                                              return `${koreaEnd.toLocaleDateString('ko-KR')} ${String(koreaEnd.getHours()).padStart(2, '0')}:${String(koreaEnd.getMinutes()).padStart(2, '0')}`
                                            })()}
                                          </span>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="admin-detail-period-not-set">
                                        <span>기간 미설정</span>
                                      </div>
                                    )}
                                  </div>
                                )
                              })}
                            </div>
                          )
                        })()}
                      </div>
                      <p className="admin-detail-password-info">
                        <span className="material-symbols-outlined">info</span>
                        국립고궁박물관과 서울역사박물관은 각각 기간을 저장해야 합니다. 한쪽만 설정하면 다른 박물관은 기간 미설정으로 표시됩니다.
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

        {/* 박물관 활동 기간 설정 모달 */}
        {showPeriodModal && selectedSchool && (
          <div className="admin-modal-overlay" onClick={() => setShowPeriodModal(false)}>
            <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
              <div className="admin-modal-handle"></div>
              <h3 className="admin-modal-title">
                <span className="material-symbols-outlined">event</span>
                박물관 활동 기간 설정
              </h3>
              <form className="admin-modal-form" onSubmit={handleUpdatePeriod}>
                <div className="admin-modal-field">
                  <label className="admin-modal-label">박물관</label>
                  <div className="admin-modal-museum-select">
                    {museums.map((museum) => (
                      <button
                        key={museum.id}
                        type="button"
                        className={`admin-modal-museum-option ${
                          periodForm.museum === museum.id ? 'admin-modal-museum-option-active' : ''
                        }`}
                        onClick={() => handleMuseumChange(museum.id)}
                      >
                        <span className="material-symbols-outlined">{museum.icon}</span>
                        <span>{museum.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="admin-modal-field">
                  <label className="admin-modal-label">시작일 (한국시간)</label>
                  <input
                    className="admin-modal-input"
                    type="date"
                    value={periodForm.startDate}
                    onChange={(e) => setPeriodForm({ ...periodForm, startDate: e.target.value })}
                    required
                  />
                </div>
                <div className="admin-modal-field">
                  <label className="admin-modal-label">시작 시간</label>
                  <input
                    className="admin-modal-input"
                    type="time"
                    value={periodForm.startTime}
                    onChange={(e) => setPeriodForm({ ...periodForm, startTime: e.target.value })}
                    required
                  />
                </div>
                <div className="admin-modal-field">
                  <label className="admin-modal-label">종료일 (한국시간)</label>
                  <input
                    className="admin-modal-input"
                    type="date"
                    value={periodForm.endDate}
                    onChange={(e) => setPeriodForm({ ...periodForm, endDate: e.target.value })}
                    required
                  />
                </div>
                <div className="admin-modal-field">
                  <label className="admin-modal-label">종료 시간</label>
                  <input
                    className="admin-modal-input"
                    type="time"
                    value={periodForm.endTime}
                    onChange={(e) => setPeriodForm({ ...periodForm, endTime: e.target.value })}
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
                      setShowPeriodModal(false)
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
      </div>
    </div>
  )
}

export default Adminpage

