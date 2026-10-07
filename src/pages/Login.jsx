import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithStudentId } from '../firebase/auth'
import { getAllSchools } from '../firebase/firestore'
import './Login.css'

function Login() {
  useEffect(() => {
    // Login 페이지는 dark 모드 사용
    document.documentElement.classList.add('dark')
    return () => {
      // 필요시 언마운트 시 제거
    }
  }, [])
  const [schools, setSchools] = useState([])
  const [selectedSchool, setSelectedSchool] = useState('')
  const [schoolSearchQuery, setSchoolSearchQuery] = useState('')
  const [grade, setGrade] = useState('')
  const [classNum, setClassNum] = useState('')
  const [number, setNumber] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingSchools, setLoadingSchools] = useState(true)
  const [schoolError, setSchoolError] = useState('')
  const navigate = useNavigate()

  // 학교 목록 로드
  useEffect(() => {
    const loadSchools = async () => {
      setLoadingSchools(true)
      setSchoolError('')
      const result = await getAllSchools()
      if (result.success) {
        setSchools(result.schools || [])
        if (result.schools && result.schools.length === 0) {
          setSchoolError('등록된 학교가 없습니다.')
        }
      } else {
        setSchoolError('학교 목록을 불러오는데 실패했습니다.')
      }
      setLoadingSchools(false)
    }
    loadSchools()
  }, [])

  // 필터링된 학교 목록
  const filteredSchools = schools.filter(school => 
    school.schoolName?.toLowerCase().includes(schoolSearchQuery.toLowerCase()) ||
    school.id?.toLowerCase().includes(schoolSearchQuery.toLowerCase())
  )

  // 학교 선택 핸들러
  const handleSchoolSelect = (schoolId) => {
    setSelectedSchool(schoolId)
    const selected = schools.find(s => s.id === schoolId)
    if (selected) {
      setSchoolSearchQuery(selected.schoolName || selected.id)
    }
  }

  // 선택된 값들로부터 학번 생성 (학교 + 학년 + 반 + 번호)
  const generateStudentId = () => {
    if (!selectedSchool || !grade || !classNum || !number) {
      return ''
    }
    // 선택된 학교의 schoolCode 사용
    const selectedSchoolData = schools.find(s => s.id === selectedSchool)
    const schoolCode = selectedSchoolData?.schoolCode || '1'
    
    // 형식: 학교(1자리) + 학년(1자리) + 반(2자리) + 번호(2자리) = 6자리
    const formattedClass = String(classNum).padStart(2, '0')
    const formattedNumber = String(number).padStart(2, '0')
    return `${schoolCode}${grade}${formattedClass}${formattedNumber}`
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!selectedSchool || !grade || !classNum || !number) {
      setError('학교, 학년, 반, 번호를 모두 입력해주세요.')
      setLoading(false)
      return
    }

    const studentId = generateStudentId()
    const selectedSchoolData = schools.find(s => s.id === selectedSchool)
    const schoolName = selectedSchoolData?.schoolName || null
    const schoolCode = selectedSchoolData?.schoolCode || '1'

    // 숫자로 변환하여 전달 (빈 문자열 체크)
    const gradeNum = grade && grade.trim() !== '' ? Number(grade) : null
    const classNumNum = classNum && classNum.trim() !== '' ? Number(classNum) : null
    const numberNum = number && number.trim() !== '' ? Number(number) : null

    // 유효성 검사
    if (isNaN(gradeNum) || isNaN(classNumNum) || isNaN(numberNum)) {
      setError('학년, 반, 번호는 올바른 숫자여야 합니다.')
      setLoading(false)
      return
    }

    const result = await signInWithStudentId(
      studentId, 
      schoolName,
      schoolCode,
      gradeNum,
      classNumNum,
      numberNum
    )

    setLoading(false)

    if (result.success) {
      navigate('/choice-museum')
    } else {
      // 에러 메시지 처리
      let errorMessage = result.error || '로그인에 실패했습니다.'
      
      // 줄바꿈을 <br>로 변환하여 표시
      const errorLines = errorMessage.split('\n')
      
      setError(
        <div>
          {errorLines.map((line, index) => (
            <div key={index}>{line}</div>
          ))}
        </div>
      )
    }
  }

  return (
    <div className="login-page-new dark">
      {/* Top App Bar */}
      <div className="login-app-bar">
        <button 
          className="login-app-bar-back"
          onClick={() => navigate('/')}
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="login-app-bar-title">로그인</h2>
        <div className="login-app-bar-spacer"></div>
      </div>

      {/* Main Content */}
      <main className="login-main-content">
        {/* Headline Section */}
        <div className="login-headline">
          <div className="login-headline-icon">
            <img 
              alt="Abstract colorful gradient shapes" 
              className="login-headline-icon-bg"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIy-Lo3ObhMAZQKAC33irvclvEXTXrzuItiYjvaoRSCOEHzBGogh9OekN1h50G-Bu0YjhO78dIxmr0-QSjpKAVDLro09d-GW2qHvQms7RiiYM6KN6x6msgCDWCGDTkr36pcxBAOTwcgjCxhxqdfrlVqgmukTdx2xKCnKbCnHTwSnjmdfJh6fo_0p-3D_qcIzHP6f2MYUhLMKVS_z2LD55qkGfwS5Uzio4VPMysncSlnqySSBclMVTOwqd8dICkCyehDMa5PkmFSfgc"
            />
            <span className="material-symbols-outlined login-headline-icon-symbol">explore</span>
          </div>
          <h3 className="login-headline-title">
            탐험을 시작해볼까요?
          </h3>
          <p className="login-headline-subtitle">
            반가워요! 학생 정보를 입력하고<br/>나만의 박물관 미션을 시작하세요.
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="login-form-new">
          {/* School Input */}
          <label className="login-form-field-new">
            <span className="login-form-label-new">학교</span>
            <div className="login-school-input-wrapper">
              <input 
                className="login-school-input"
                type="text"
                value={schoolSearchQuery}
                onChange={(e) => {
                  setSchoolSearchQuery(e.target.value)
                  if (selectedSchool) {
                    const currentSchool = schools.find(s => s.id === selectedSchool)
                    if (!e.target.value || e.target.value !== (currentSchool?.schoolName || currentSchool?.id)) {
                      setSelectedSchool('')
                    }
                  }
                }}
                onFocus={() => {
                  // 포커스 시 드롭다운 표시를 위한 처리
                }}
                placeholder="학교 이름을 검색하세요"
                disabled={loadingSchools}
              />
              <div className="login-school-input-icon">
                <span className="material-symbols-outlined">search</span>
              </div>
              {/* School Dropdown */}
              {schoolSearchQuery && filteredSchools.length > 0 && !selectedSchool && (
                <div className="login-school-dropdown">
                  {filteredSchools.map(school => (
                    <div
                      key={school.id}
                      className="login-school-dropdown-item"
                      onClick={() => handleSchoolSelect(school.id)}
                    >
                      {school.schoolName || school.id}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </label>

          {/* Grade & Class Row */}
          <div className="login-form-row">
            <label className="login-form-field-new login-form-field-flex">
              <span className="login-form-label-new">학년</span>
              <div className="login-input-wrapper-new">
                <input 
                  className="login-input-new"
                  type="number"
                  inputMode="numeric"
                  pattern="\d*"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  placeholder="1"
                  min="1"
                  max="6"
                  autoComplete="off"
                />
                <span className="login-input-suffix">학년</span>
              </div>
            </label>
            <label className="login-form-field-new login-form-field-flex">
              <span className="login-form-label-new">반</span>
              <div className="login-input-wrapper-new">
                <input 
                  className="login-input-new"
                  type="number"
                  inputMode="numeric"
                  pattern="\d*"
                  value={classNum}
                  onChange={(e) => setClassNum(e.target.value)}
                  placeholder="1"
                  min="1"
                  max="20"
                  autoComplete="off"
                />
                <span className="login-input-suffix">반</span>
              </div>
            </label>
          </div>

          {/* Number Row */}
          <label className="login-form-field-new">
            <span className="login-form-label-new">번호</span>
            <div className="login-input-wrapper-new">
              <input 
                className="login-input-new"
                type="number"
                inputMode="numeric"
                pattern="\d*"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="1"
                min="1"
                max="50"
                autoComplete="off"
              />
              <span className="login-input-suffix">번</span>
            </div>
          </label>

          {schoolError && <div className="login-error-message">{schoolError}</div>}
          {error && <div className="login-error-message">{error}</div>}
        </form>
      </main>

      {/* Bottom Action Bar */}
      <div className="login-bottom-bar">
        <div className="login-bottom-bar-content">
          <button 
            type="button"
            onClick={handleSubmit}
            className="login-submit-button-new"
            disabled={loading}
          >
            <span>{loading ? '처리 중...' : '로그인 및 박물관 선택하기'}</span>
            <span className="material-symbols-outlined login-submit-icon-new">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
