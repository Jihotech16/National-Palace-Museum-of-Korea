import React from 'react';
import StepItem from '../components/StepItem';

interface GuideScreenProps {
  onStart: () => void;
}

const GuideScreen: React.FC<GuideScreenProps> = ({ onStart }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText('jihotech16@outlook.kr');
    alert('이메일 주소가 복사되었습니다.');
  };

  return (
    <div className="flex-1 overflow-y-auto pb-24 px-4 pt-2 no-scrollbar">
      {/* Hero */}
      <div className="relative w-full h-32 rounded-2xl overflow-hidden mb-6 mt-2 bg-gradient-to-r from-primary to-purple-900">
        <div 
          className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-40" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1545167622-3a6ac756afa4?q=80&w=1000&auto=format&fit=crop')" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4">
            <p className="text-white/80 text-xs font-medium mb-1 tracking-wider uppercase font-display">National Palace Museum</p>
            <h1 className="text-white text-2xl font-bold tracking-tight">박물관 탐험 가이드</h1>
          </div>
        </div>
      </div>

      {/* Notice */}
      <div className="mb-8 @container">
        <div className="relative flex flex-col gap-4 rounded-2xl border-l-4 border-l-amber-400 bg-white dark:bg-surface-dark shadow-lg p-5 overflow-hidden">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>
          <div className="flex items-start gap-3 relative z-10">
            <div className="flex-shrink-0 mt-0.5 text-amber-500 bg-amber-500/10 rounded-full p-1.5">
              <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>warning</span>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-slate-900 dark:text-white text-base font-bold leading-tight">학교 단체 관람 필수 공지</p>
              <p className="text-slate-500 dark:text-slate-300 text-sm font-normal leading-relaxed">
                학교에서 사용을 시작하기 전에 원활한 진행을 위해 반드시 아래 메일로 사전 문의해 주세요.
              </p>
            </div>
          </div>
          <div className="flex flex-col @[400px]:flex-row items-stretch @[400px]:items-center gap-3 bg-slate-50 dark:bg-black/20 p-3 rounded-xl border border-slate-100 dark:border-white/5 relative z-10">
            <span className="flex-1 text-slate-700 dark:text-slate-200 text-sm font-mono font-medium truncate pl-1">
              jihotech16@outlook.kr
            </span>
            <button 
              onClick={copyToClipboard}
              className="flex items-center justify-center gap-1.5 bg-primary hover:bg-primary/90 active:scale-95 transition-all text-white px-4 py-2 rounded-lg text-xs font-bold shadow-md shadow-primary/20"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>content_copy</span>
              <span>복사</span>
            </button>
          </div>
        </div>
      </div>

      {/* Section Title */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2 px-1">
          <span className="w-1 h-6 bg-primary rounded-full"></span>
          <h2 className="text-slate-900 dark:text-white text-xl font-bold leading-tight tracking-tight">탐험 방법</h2>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm px-1">박물관 곳곳에 숨겨진 단서를 찾아 미션을 완료하세요.</p>
      </div>

      {/* Timeline */}
      <div className="relative pl-2 pr-2">
        <div className="absolute left-[34px] top-4 bottom-4 w-[2px] bg-slate-200 dark:bg-white/10 z-0"></div>
        <StepItem 
          step={1}
          icon="museum"
          isActive={true}
          title="박물관 탐험"
          description="국립고궁박물관의 전시실을 돌아다니며 앱에서 지정한 유물을 찾아보세요."
        />
        <StepItem 
          step={2}
          icon="search"
          isActive={false}
          title="단서 찾기"
          description="유물 주변에 숨겨진 QR코드나 이미지 마커를 스캔하여 단서를 획득하세요."
        />
        <StepItem 
          step={3}
          icon="extension"
          isActive={false}
          isLast={true}
          title="문제 해결"
          description="획득한 단서를 조합하여 퀴즈를 풀고 다음 스테이지 잠금을 해제하세요."
        />
      </div>

      {/* Footer Sticky Button */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-gradient-to-t from-background-light via-background-light to-transparent dark:from-background-dark dark:via-background-dark pt-8 z-40">
        <button 
          onClick={onStart}
          className="w-full flex items-center justify-center gap-2 h-14 rounded-2xl bg-primary text-white text-base font-bold shadow-lg shadow-primary/30 active:scale-[0.98] transition-all hover:bg-primary/90"
        >
          <span>탐험 시작하기</span>
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_forward</span>
        </button>
      </div>
    </div>
  );
};

export default GuideScreen;
