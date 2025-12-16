import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { saveActivityData, getActivityData } from '../../firebase/firestore'
import { getNextActivityPath, getPreviousActivityPath, getActivityIdFromPath } from '../../utils/activityOrder'
import './ActivityCommon.css'

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

  const loadCanvas = async () => {
    const result = await getActivityData(user.uid, 'draw')
    if (result.success && result.data && result.data.canvasData) {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      const img = new Image()
      img.onload = () => {
        ctx.drawImage(img, 0, 0)
      }
      img.src = result.data.canvasData
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

    const canvasData = canvas.toDataURL('image/png')
    const result = await saveActivityData(user.uid, 'draw', {
      canvasData: canvasData
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
    <div className="activity-container dark">
      <header className="activity-header">
        <button className="activity-back-btn" onClick={handleBack}>
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="activity-title">유물 그리기</h1>
        <div style={{ width: '40px' }}></div>
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

