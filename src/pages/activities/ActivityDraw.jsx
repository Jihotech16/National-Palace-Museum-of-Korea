import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { saveActivityData } from '../../firebase/firestore'
import { getNextActivityPath, getPreviousActivityPath, getActivityIdFromPath } from '../../utils/activityOrder'
import './ActivityCommon.css'

const DRAWING_STORAGE_KEY = 'activityDrawing'

function ActivityDraw({ user }) {
  const navigate = useNavigate()
  const location = useLocation()
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [saved, setSaved] = useState(false)

  const currentActivityId = getActivityIdFromPath(location.pathname)
  const previousPath = currentActivityId ? getPreviousActivityPath(currentActivityId) : null

  useEffect(() => {
    loadCanvas()
    setupCanvas()
  }, [])

  const setupCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.strokeStyle = '#333'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
  }

  // 그림은 개인정보가 담길 수 있어 서버에 올리지 않고 이 기기에만 저장
  const loadCanvas = async () => {
    let savedDrawing = null
    try {
      savedDrawing = localStorage.getItem(DRAWING_STORAGE_KEY)
    } catch {
      savedDrawing = null
    }
    if (savedDrawing) {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      const img = new Image()
      img.onload = () => {
        ctx.drawImage(img, 0, 0)
      }
      img.src = savedDrawing
    } else {
      setupCanvas()
    }
  }

  const handleBack = () => {
    if (previousPath) {
      navigate(previousPath)
    } else {
      navigate('/')
    }
  }

  const startDrawing = (e) => {
    setIsDrawing(true)
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const rect = canvas.getBoundingClientRect()
    const x = e.touches ? e.touches[0].clientX - rect.left : e.clientX - rect.left
    const y = e.touches ? e.touches[0].clientY - rect.top : e.clientY - rect.top
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const rect = canvas.getBoundingClientRect()
    const x = e.touches ? e.touches[0].clientX - rect.left : e.clientX - rect.left
    const y = e.touches ? e.touches[0].clientY - rect.top : e.clientY - rect.top
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  const handleSave = async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    try {
      localStorage.setItem(DRAWING_STORAGE_KEY, canvas.toDataURL('image/png'))
    } catch {
      // 저장 공간이 부족해도 완료 처리는 계속 진행
    }
    // 서버에는 완료 여부만 기록
    const result = await saveActivityData(user.uid, 'draw', {
      drawingCompleted: true
    })
    if (result.success) {
      setSaved(true)
      setTimeout(() => {
        const nextPath = getNextActivityPath('draw')
        navigate(nextPath)
      }, 1000)
    }
  }

  return (
    <div className="activity-container">
      <header className="activity-header">
        <button className="activity-back-btn" onClick={handleBack}>
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="activity-title">유물 그리기</h1>
        <div style={{ width: '44px' }}></div>
      </header>

      <main className="activity-main">
        <article className="activity-problem-card">
          <div className="activity-content">
            <h2 className="activity-problem-title">친구들에게 소개해주고 싶은 국립고궁박물관 유물을 그려보세요.</h2>
            <div className="activity-divider"></div>
          </div>
        </article>

        <div className="activity-drawing-area">
          <canvas
            ref={canvasRef}
            className="activity-drawing-canvas"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
        </div>
      </main>

      <footer className="activity-footer">
        <form 
          className="activity-form"
          onSubmit={(e) => {
            e.preventDefault()
            handleSave()
          }}
        >
          <div className="activity-canvas-controls">
            <button 
              type="button"
              onClick={clearCanvas} 
              className="activity-clear-btn"
            >
              지우기
            </button>
            <button 
              type="submit"
              className={`activity-submit-btn ${saved ? 'saved' : ''}`}
            >
              <span>{saved ? '✓ 저장됨' : '정답 제출'}</span>
              <span className="material-symbols-outlined">send</span>
            </button>
          </div>
        </form>
        <div className="activity-safe-area"></div>
      </footer>
    </div>
  )
}

export default ActivityDraw

