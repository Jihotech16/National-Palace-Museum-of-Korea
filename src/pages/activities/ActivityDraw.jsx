import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { saveActivityData, getActivityData } from '../../firebase/firestore'
import { getNextActivityPath } from '../../utils/activityOrder'
import ActivityLayout from '../../components/ActivityLayout'
import './ActivityCommon.css'

function ActivityDraw({ user }) {
  const navigate = useNavigate()
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [saved, setSaved] = useState(false)

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

    // 흰색 배경
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // 그리기 설정
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
    <ActivityLayout title="유물 그리기">
      <div className="activity-section">
        <h2>친구들에게 소개해주고 싶은 국립고궁박물관 유물을 그려보세요.</h2>
        
        <div className="drawing-area">
          <canvas
            ref={canvasRef}
            className="drawing-canvas"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
        </div>

        <div className="canvas-controls">
          <button onClick={clearCanvas} className="clear-button">
            지우기
          </button>
          <button onClick={handleSave} className="save-button">
            {saved ? '✓ 저장됨' : '저장하기'}
          </button>
        </div>
      </div>
    </ActivityLayout>
  )
}

export default ActivityDraw

