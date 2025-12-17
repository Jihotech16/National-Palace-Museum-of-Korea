import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

function UserGuide() {
  const navigate = useNavigate()

  useEffect(() => {
    // 페이지 로드 시 dark 클래스 추가
    document.documentElement.classList.add('dark')
    return () => {
      // 컴포넌트 언마운트 시 dark 클래스 제거 (선택사항)
      // document.documentElement.classList.remove('dark')
    }
  }, [])

  const handleBack = () => {
    navigate(-1)
  }

  const handleClose = () => {
    navigate('/')
  }

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('jihotech16@outlook.kr')
    alert('이메일이 복사되었습니다.')
  }

  const handleStart = () => {
    navigate('/login')
  }

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto shadow-2xl bg-background-dark" style={{ backgroundColor: '#191022' }}>
      {/* TopAppBar */}
      <header className="sticky top-0 flex items-center justify-between backdrop-blur-md" style={{ 
        zIndex: 100,
        padding: '1rem 1rem 0.5rem',
        backgroundColor: 'rgba(15, 7, 22, 0.95)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid #362447',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
      }}>
        <button 
          onClick={handleBack}
          className="flex items-center justify-center rounded-full transition-colors"
          style={{ 
            width: '48px',
            height: '48px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            color: '#f3e8ff',
            padding: 0
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#a855f7'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#f3e8ff'}
        >
          <span className="material-symbols-outlined" style={{fontSize: '24px'}}>arrow_back_ios_new</span>
        </button>
        <h2 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center" style={{ color: '#f3e8ff' }}>이용안내</h2>
        <button 
          onClick={handleClose}
          className="flex items-center justify-center rounded-full transition-colors"
          style={{ 
            width: '48px',
            height: '48px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            color: '#f3e8ff',
            padding: 0
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#a855f7'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#f3e8ff'}
        >
          <span className="material-symbols-outlined" style={{fontSize: '24px'}}>close</span>
        </button>
      </header>
      
      {/* Main Content Scroll Area */}
      <main className="flex-1 overflow-y-auto" style={{ padding: '7px 14px 84px 14px' }}>
        {/* Hero / Decorative Element (Abstract) */}
        <div className="relative w-full h-32 rounded-2xl overflow-hidden mt-2" style={{ background: 'linear-gradient(to right, #7f13ec, #581c87)', marginBottom: '32px' }}>
          <div 
            className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-40" 
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1545167622-3a6ac756afa4?q=80&w=1000&auto=format&fit=crop")'
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-4">
              <p className="text-white/80 text-sm font-medium mb-1 tracking-wider uppercase">National Palace Museum</p>
              <h1 className="text-white text-2xl font-bold tracking-tight">박물관 탐험 가이드</h1>
            </div>
          </div>
        </div>
        
        {/* ActionPanel: Critical School Notice */}
        <div className="@container" style={{ marginBottom: '64px' }}>
          <div className="relative flex flex-col gap-4 rounded-2xl border-l-4 border-l-amber-400 shadow-lg overflow-hidden" style={{ backgroundColor: '#2d1f3f', padding: '17.5px' }}>
            {/* Glow effect */}
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 rounded-full blur-2xl" style={{ backgroundColor: 'rgba(127, 19, 236, 0.1)' }}></div>
            <div className="flex items-start gap-3 relative z-10">
              <div className="flex-shrink-0 mt-0.5 text-amber-500 bg-amber-500/10 rounded-full p-1.5">
                <span className="material-symbols-outlined" style={{fontSize: '24px'}}>warning</span>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-base font-bold leading-tight" style={{ color: '#ffffff' }}>학교 단체 관람 필수 공지</p>
                <p className="text-sm font-normal leading-relaxed" style={{ color: '#cbd5e1' }}>
                  학교에서 사용을 시작하기 전에 원활한 진행을 위해 반드시 아래 메일로 사전 문의해 주세요.
                </p>
              </div>
            </div>
            <div className="flex flex-col @[400px]:flex-row items-stretch @[400px]:items-center gap-3 bg-slate-50 dark:bg-black/20 p-3 rounded-xl border border-slate-100 dark:border-white/5 relative z-10">
              <span className="flex-1 text-slate-700 dark:text-slate-200 text-sm font-mono font-medium truncate pl-1">
                jihotech16@outlook.kr
              </span>
              <button 
                onClick={handleCopyEmail}
                className="flex items-center justify-center gap-1.5 bg-primary hover:bg-primary/90 active:scale-95 transition-all text-white px-4 py-2 rounded-lg text-xs font-bold shadow-md shadow-primary/20"
              >
                <span className="material-symbols-outlined" style={{fontSize: '16px'}}>content_copy</span>
                <span>복사</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* HeadlineText: Exploration Method */}
        <div style={{ marginTop: '64px', marginBottom: '16px' }}>
          <div className="flex items-center gap-2 mb-2 px-1">
            <span className="w-1 h-6 rounded-full" style={{ backgroundColor: '#7f13ec' }}></span>
            <h2 className="text-xl font-bold leading-tight tracking-tight" style={{ color: '#ffffff' }}>탐험 방법</h2>
          </div>
          <p className="text-sm px-1" style={{ color: '#94a3b8' }}>박물관 곳곳에 숨겨진 단서를 찾아 미션을 완료하세요.</p>
        </div>
        
        {/* Timeline: Steps */}
        <div className="relative pl-2 pr-2">
          {/* Vertical Line */}
          <div className="absolute left-[34px] top-4 bottom-4 w-[2px] bg-slate-200 dark:bg-white/10 z-0"></div>
          
          {/* Step 1 */}
          <div className="relative grid grid-cols-[48px_1fr] gap-x-4 z-10" style={{ marginBottom: '32px' }}>
            <div className="flex flex-col items-center pt-1">
              <div className="flex items-center justify-center size-10 rounded-full border-2 shadow-sm" style={{ backgroundColor: '#2d1f3f', borderColor: '#7f13ec', color: '#7f13ec' }}>
                <span className="material-symbols-outlined" style={{fontSize: '20px'}}>museum</span>
              </div>
            </div>
            <div className="flex flex-col p-4 rounded-xl shadow-sm border" style={{ backgroundColor: '#2d1f3f', borderColor: 'rgba(255, 255, 255, 0.05)' }}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider" style={{ color: '#7f13ec', backgroundColor: 'rgba(127, 19, 236, 0.1)' }}>Step 1</span>
              </div>
              <p className="text-base font-bold mb-1" style={{ color: '#ffffff' }}>박물관 탐험</p>
              <p className="text-sm leading-relaxed" style={{ color: '#94a3b8' }}>
                국립고궁박물관의 전시실을 돌아다니며 앱에서 지정한 유물을 찾아보세요.
              </p>
            </div>
          </div>
          
          {/* Step 2 */}
          <div className="relative grid grid-cols-[48px_1fr] gap-x-4 z-10" style={{ marginBottom: '32px' }}>
            <div className="flex flex-col items-center pt-1">
              <div className="flex items-center justify-center size-10 rounded-full border-2" style={{ backgroundColor: '#2d1f3f', borderColor: '#475569', color: '#94a3b8' }}>
                <span className="material-symbols-outlined" style={{fontSize: '20px'}}>search</span>
              </div>
            </div>
            <div className="flex flex-col p-4 rounded-xl shadow-sm border" style={{ backgroundColor: '#2d1f3f', borderColor: 'rgba(255, 255, 255, 0.05)' }}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider" style={{ color: '#94a3b8', backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>Step 2</span>
              </div>
              <p className="text-slate-900 dark:text-white text-base font-bold mb-1">단서 찾기</p>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                유물 주변에 숨겨진 QR코드나 이미지 마커를 스캔하여 단서를 획득하세요.
              </p>
            </div>
          </div>
          
          {/* Step 3 */}
          <div className="relative grid grid-cols-[48px_1fr] gap-x-4 z-10" style={{ marginBottom: '32px' }}>
            <div className="flex flex-col items-center pt-1">
              <div className="flex items-center justify-center size-10 rounded-full border-2" style={{ backgroundColor: '#2d1f3f', borderColor: '#475569', color: '#94a3b8' }}>
                <span className="material-symbols-outlined" style={{fontSize: '20px'}}>extension</span>
              </div>
            </div>
            <div className="flex flex-col p-4 rounded-xl shadow-sm border" style={{ backgroundColor: '#2d1f3f', borderColor: 'rgba(255, 255, 255, 0.05)' }}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider" style={{ color: '#94a3b8', backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>Step 3</span>
              </div>
              <p className="text-slate-900 dark:text-white text-base font-bold mb-1">문제 해결</p>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                획득한 단서를 조합하여 퀴즈를 풀고 다음 스테이지 잠금을 해제하세요.
              </p>
            </div>
          </div>
        </div>
        
        {/* Bottom Spacer */}
        <div className="h-8"></div>
      </main>
      
      {/* Sticky Footer Button */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-40" style={{ 
        background: 'linear-gradient(to top, #191022, rgba(25, 16, 34, 0))',
        padding: '28px 14px 14px 14px'
      }}>
        <button 
          onClick={handleStart}
          className="w-full flex items-center justify-center gap-2 h-14 rounded-2xl text-white text-base font-bold shadow-lg active:scale-[0.98] transition-all hover:opacity-90"
          style={{ backgroundColor: '#7f13ec', boxShadow: '0 10px 15px -3px rgba(127, 19, 236, 0.3)' }}
        >
          <span>탐험 시작하기</span>
          <span className="material-symbols-outlined" style={{fontSize: '20px'}}>arrow_forward</span>
        </button>
      </div>
    </div>
  )
}

export default UserGuide

