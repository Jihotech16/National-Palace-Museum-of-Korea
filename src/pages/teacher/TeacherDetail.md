<!DOCTYPE html>
<html class="dark" lang="ko"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>학생 관리 화면</title>
<link href="https://fonts.googleapis.com" rel="preconnect"/>
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
<link href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;500;600;700&amp;family=Noto+Sans+KR:wght@400;500;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class", 
            theme: {
                extend: {
                    colors: {
                        primary: "#a78bfa","primary-dark": "#7c3aed","background-light": "#f3f0ff", 
                        "background-dark": "#1e1b2e","card-dark": "#2d2a42","text-secondary": "#c4b5fd","border-dark": "#4c1d95","accent-green": "#34d399","accent-red": "#f87171"}, 
                    fontFamily: {
                        display: "Public Sans", 
                        body: ["Public Sans", "Noto Sans KR", "sans-serif"]
                    }, 
                    borderRadius: {
                        DEFAULT: "0.25rem", 
                        lg: "0.5rem", 
                        xl: "0.75rem", 
                        full: "9999px"
                    }
                }
            }
        };
    </script>
<style>
        body {
            min-height: max(884px, 100dvh);
        }.scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="bg-background-light dark:bg-background-dark min-h-screen font-display text-slate-900 dark:text-white overflow-x-hidden selection:bg-primary selection:text-white">
<div class="relative flex flex-col w-full max-w-md mx-auto min-h-screen bg-background-light dark:bg-background-dark shadow-2xl overflow-hidden">
<header class="flex items-center justify-between px-4 py-3 bg-background-light dark:bg-[#151226] sticky top-0 z-50 border-b border-black/5 dark:border-white/5">
<div class="flex items-center gap-3">
<button class="flex items-center justify-center w-10 h-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
<span class="material-symbols-outlined text-slate-900 dark:text-white" style="font-size: 24px;">arrow_back</span>
</button>
<div>
<h1 class="text-lg font-bold leading-tight text-slate-900 dark:text-white">2학년 3반 학습 현황</h1>
<p class="text-xs font-medium text-slate-500 dark:text-text-secondary">국립고궁박물관 탐험</p>
</div>
</div>
<button class="flex items-center justify-center w-10 h-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
<span class="material-symbols-outlined text-primary-dark dark:text-primary" style="font-size: 24px;">refresh</span>
</button>
</header>
<section class="px-4 pt-6 pb-2">
<div class="flex gap-3">
<div class="flex-1 flex flex-col items-center justify-center p-4 rounded-xl bg-white dark:bg-card-dark border border-slate-200 dark:border-white/10 shadow-sm">
<div class="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-2">
<span class="material-symbols-outlined text-slate-500 dark:text-text-secondary" style="font-size: 20px;">groups</span>
</div>
<p class="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">28<span class="text-base font-normal text-slate-500 dark:text-text-secondary ml-1">명</span></p>
<p class="text-xs font-medium text-slate-500 dark:text-text-secondary mt-1">전체 학생</p>
</div>
<div class="flex-1 flex flex-col items-center justify-center p-4 rounded-xl bg-white dark:bg-card-dark border border-slate-200 dark:border-primary/30 shadow-sm relative overflow-hidden group">
<div class="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-bl-full -mr-2 -mt-2"></div>
<div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
<span class="material-symbols-outlined text-primary-dark dark:text-primary" style="font-size: 20px;">avg_pace</span>
</div>
<p class="text-3xl font-bold tracking-tight text-primary-dark dark:text-primary">74<span class="text-base font-normal text-primary-dark/70 dark:text-primary/70 ml-1">%</span></p>
<p class="text-xs font-medium text-slate-500 dark:text-text-secondary mt-1">평균 진도율</p>
</div>
</div>
</section>
<section class="px-4 py-3">
<div class="flex items-center justify-between mb-3">
<h3 class="text-base font-bold text-slate-900 dark:text-white">학생별 진도율</h3>
<button class="text-xs font-bold text-primary-dark dark:text-primary flex items-center gap-1 hover:opacity-80 transition-opacity">
<span class="material-symbols-outlined" style="font-size: 16px;">sort</span>
                번호순
            </button>
</div>
<div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
<button class="flex h-8 shrink-0 items-center gap-1.5 rounded-full bg-slate-200 dark:bg-white/5 px-3 transition-colors hover:bg-primary hover:text-white group border border-transparent dark:border-white/10 dark:hover:border-primary">
<span class="material-symbols-outlined text-slate-600 dark:text-text-secondary group-hover:text-white" style="font-size: 18px;">warning</span>
<span class="text-xs font-bold text-slate-700 dark:text-text-secondary group-hover:text-white">진도율 낮은순</span>
</button>
<button class="flex h-8 shrink-0 items-center gap-1.5 rounded-full bg-slate-200 dark:bg-white/5 px-3 transition-colors hover:bg-primary hover:text-white group border border-transparent dark:border-white/10 dark:hover:border-primary">
<span class="material-symbols-outlined text-slate-600 dark:text-text-secondary group-hover:text-white" style="font-size: 18px;">check_circle</span>
<span class="text-xs font-bold text-slate-700 dark:text-text-secondary group-hover:text-white">완료됨 (5)</span>
</button>
<button class="flex h-8 shrink-0 items-center gap-1.5 rounded-full bg-slate-200 dark:bg-white/5 px-3 transition-colors hover:bg-primary hover:text-white group border border-transparent dark:border-white/10 dark:hover:border-primary">
<span class="material-symbols-outlined text-slate-600 dark:text-text-secondary group-hover:text-white" style="font-size: 18px;">hourglass_top</span>
<span class="text-xs font-bold text-slate-700 dark:text-text-secondary group-hover:text-white">진행중 (23)</span>
</button>
</div>
</section>
<main class="flex-1 px-4 pb-20">
<div class="grid grid-cols-4 gap-3 sm:grid-cols-5">
<div class="aspect-[4/5] flex flex-col items-center justify-center bg-white dark:bg-card-dark rounded-xl border border-slate-100 dark:border-white/5 shadow-sm relative overflow-hidden group hover:border-primary transition-colors">
<div class="relative w-14 h-14 rounded-full flex items-center justify-center mb-2" style="background: conic-gradient(#a78bfa 100%, #4c1d95 0);">
<div class="absolute inset-1 bg-white dark:bg-card-dark rounded-full flex items-center justify-center">
<span class="text-lg font-bold text-slate-800 dark:text-white">01</span>
</div>
</div>
<span class="text-xs font-bold text-primary-dark dark:text-primary">100%</span>
<div class="absolute top-1 right-1">
<span class="material-symbols-outlined text-primary-dark dark:text-primary" style="font-size: 16px;">check_circle</span>
</div>
</div>
<div class="aspect-[4/5] flex flex-col items-center justify-center bg-white dark:bg-card-dark rounded-xl border border-slate-100 dark:border-white/5 shadow-sm relative hover:border-primary transition-colors">
<div class="relative w-14 h-14 rounded-full flex items-center justify-center mb-2" style="background: conic-gradient(#a78bfa 75%, #4c1d95 0);">
<div class="absolute inset-1 bg-white dark:bg-card-dark rounded-full flex items-center justify-center">
<span class="text-lg font-bold text-slate-800 dark:text-white">02</span>
</div>
</div>
<span class="text-xs font-medium text-slate-400 dark:text-text-secondary">75%</span>
</div>
<div class="aspect-[4/5] flex flex-col items-center justify-center bg-white dark:bg-card-dark rounded-xl border border-red-200 dark:border-red-900/50 shadow-sm relative hover:border-red-500 transition-colors">
<div class="relative w-14 h-14 rounded-full flex items-center justify-center mb-2" style="background: conic-gradient(#ef4444 15%, #3f1818 0);">
<div class="absolute inset-1 bg-white dark:bg-card-dark rounded-full flex items-center justify-center">
<span class="text-lg font-bold text-red-500 dark:text-red-400">03</span>
</div>
</div>
<span class="text-xs font-bold text-red-500 dark:text-red-400">15%</span>
</div>
<div class="aspect-[4/5] flex flex-col items-center justify-center bg-white dark:bg-card-dark rounded-xl border border-slate-100 dark:border-white/5 shadow-sm hover:border-primary transition-colors">
<div class="relative w-14 h-14 rounded-full flex items-center justify-center mb-2" style="background: conic-gradient(#a78bfa 45%, #4c1d95 0);">
<div class="absolute inset-1 bg-white dark:bg-card-dark rounded-full flex items-center justify-center"><span class="text-lg font-bold text-slate-800 dark:text-white">04</span></div>
</div>
<span class="text-xs font-medium text-slate-400 dark:text-text-secondary">45%</span>
</div>
<div class="aspect-[4/5] flex flex-col items-center justify-center bg-white dark:bg-card-dark rounded-xl border border-slate-100 dark:border-white/5 shadow-sm hover:border-primary transition-colors">
<div class="relative w-14 h-14 rounded-full flex items-center justify-center mb-2" style="background: conic-gradient(#a78bfa 60%, #4c1d95 0);">
<div class="absolute inset-1 bg-white dark:bg-card-dark rounded-full flex items-center justify-center"><span class="text-lg font-bold text-slate-800 dark:text-white">05</span></div>
</div>
<span class="text-xs font-medium text-slate-400 dark:text-text-secondary">60%</span>
</div>
<div class="aspect-[4/5] flex flex-col items-center justify-center bg-white dark:bg-card-dark rounded-xl border border-slate-100 dark:border-white/5 shadow-sm relative overflow-hidden hover:border-primary transition-colors">
<div class="relative w-14 h-14 rounded-full flex items-center justify-center mb-2" style="background: conic-gradient(#a78bfa 100%, #4c1d95 0);">
<div class="absolute inset-1 bg-white dark:bg-card-dark rounded-full flex items-center justify-center"><span class="text-lg font-bold text-slate-800 dark:text-white">06</span></div>
</div>
<span class="text-xs font-bold text-primary-dark dark:text-primary">100%</span>
<div class="absolute top-1 right-1"><span class="material-symbols-outlined text-primary-dark dark:text-primary" style="font-size: 16px;">check_circle</span></div>
</div>
<div class="aspect-[4/5] flex flex-col items-center justify-center bg-white dark:bg-card-dark rounded-xl border border-slate-100 dark:border-white/5 shadow-sm hover:border-primary transition-colors">
<div class="relative w-14 h-14 rounded-full flex items-center justify-center mb-2" style="background: conic-gradient(#a78bfa 82%, #4c1d95 0);">
<div class="absolute inset-1 bg-white dark:bg-card-dark rounded-full flex items-center justify-center"><span class="text-lg font-bold text-slate-800 dark:text-white">07</span></div>
</div>
<span class="text-xs font-medium text-slate-400 dark:text-text-secondary">82%</span>
</div>
<div class="aspect-[4/5] flex flex-col items-center justify-center bg-white dark:bg-card-dark rounded-xl border border-slate-100 dark:border-white/5 shadow-sm hover:border-primary transition-colors">
<div class="relative w-14 h-14 rounded-full flex items-center justify-center mb-2" style="background: conic-gradient(#a78bfa 30%, #4c1d95 0);">
<div class="absolute inset-1 bg-white dark:bg-card-dark rounded-full flex items-center justify-center"><span class="text-lg font-bold text-slate-800 dark:text-white">08</span></div>
</div>
<span class="text-xs font-medium text-slate-400 dark:text-text-secondary">30%</span>
</div>
<div class="aspect-[4/5] flex flex-col items-center justify-center bg-white dark:bg-card-dark rounded-xl border border-slate-100 dark:border-white/5 shadow-sm hover:border-primary transition-colors">
<div class="relative w-14 h-14 rounded-full flex items-center justify-center mb-2" style="background: conic-gradient(#a78bfa 90%, #4c1d95 0);">
<div class="absolute inset-1 bg-white dark:bg-card-dark rounded-full flex items-center justify-center"><span class="text-lg font-bold text-slate-800 dark:text-white">09</span></div>
</div>
<span class="text-xs font-medium text-slate-400 dark:text-text-secondary">90%</span>
</div>
<div class="aspect-[4/5] flex flex-col items-center justify-center bg-white dark:bg-card-dark rounded-xl border border-slate-100 dark:border-white/5 shadow-sm relative overflow-hidden hover:border-primary transition-colors">
<div class="relative w-14 h-14 rounded-full flex items-center justify-center mb-2" style="background: conic-gradient(#a78bfa 100%, #4c1d95 0);">
<div class="absolute inset-1 bg-white dark:bg-card-dark rounded-full flex items-center justify-center"><span class="text-lg font-bold text-slate-800 dark:text-white">10</span></div>
</div>
<span class="text-xs font-bold text-primary-dark dark:text-primary">100%</span>
<div class="absolute top-1 right-1"><span class="material-symbols-outlined text-primary-dark dark:text-primary" style="font-size: 16px;">check_circle</span></div>
</div>
<div class="aspect-[4/5] flex flex-col items-center justify-center bg-white dark:bg-card-dark rounded-xl border border-red-200 dark:border-red-900/50 shadow-sm hover:border-red-500 transition-colors">
<div class="relative w-14 h-14 rounded-full flex items-center justify-center mb-2" style="background: conic-gradient(#ef4444 10%, #3f1818 0);">
<div class="absolute inset-1 bg-white dark:bg-card-dark rounded-full flex items-center justify-center"><span class="text-lg font-bold text-red-500 dark:text-red-400">11</span></div>
</div>
<span class="text-xs font-bold text-red-500 dark:text-red-400">10%</span>
</div>
<div class="aspect-[4/5] flex flex-col items-center justify-center bg-white dark:bg-card-dark rounded-xl border border-slate-100 dark:border-white/5 shadow-sm hover:border-primary transition-colors">
<div class="relative w-14 h-14 rounded-full flex items-center justify-center mb-2" style="background: conic-gradient(#a78bfa 55%, #4c1d95 0);">
<div class="absolute inset-1 bg-white dark:bg-card-dark rounded-full flex items-center justify-center"><span class="text-lg font-bold text-slate-800 dark:text-white">12</span></div>
</div>
<span class="text-xs font-medium text-slate-400 dark:text-text-secondary">55%</span>
</div>
<div class="aspect-[4/5] flex flex-col items-center justify-center bg-white dark:bg-card-dark rounded-xl border border-slate-100 dark:border-white/5 shadow-sm hover:border-primary transition-colors">
<div class="relative w-14 h-14 rounded-full flex items-center justify-center mb-2" style="background: conic-gradient(#a78bfa 68%, #4c1d95 0);">
<div class="absolute inset-1 bg-white dark:bg-card-dark rounded-full flex items-center justify-center"><span class="text-lg font-bold text-slate-800 dark:text-white">13</span></div>
</div>
<span class="text-xs font-medium text-slate-400 dark:text-text-secondary">68%</span>
</div>
<div class="aspect-[4/5] flex flex-col items-center justify-center bg-white dark:bg-card-dark rounded-xl border border-slate-100 dark:border-white/5 shadow-sm hover:border-primary transition-colors">
<div class="relative w-14 h-14 rounded-full flex items-center justify-center mb-2" style="background: conic-gradient(#a78bfa 40%, #4c1d95 0);">
<div class="absolute inset-1 bg-white dark:bg-card-dark rounded-full flex items-center justify-center"><span class="text-lg font-bold text-slate-800 dark:text-white">14</span></div>
</div>
<span class="text-xs font-medium text-slate-400 dark:text-text-secondary">40%</span>
</div>
<div class="aspect-[4/5] flex flex-col items-center justify-center bg-white dark:bg-card-dark rounded-xl border border-slate-100 dark:border-white/5 shadow-sm relative overflow-hidden hover:border-primary transition-colors">
<div class="relative w-14 h-14 rounded-full flex items-center justify-center mb-2" style="background: conic-gradient(#a78bfa 100%, #4c1d95 0);">
<div class="absolute inset-1 bg-white dark:bg-card-dark rounded-full flex items-center justify-center"><span class="text-lg font-bold text-slate-800 dark:text-white">15</span></div>
</div>
<span class="text-xs font-bold text-primary-dark dark:text-primary">100%</span>
<div class="absolute top-1 right-1"><span class="material-symbols-outlined text-primary-dark dark:text-primary" style="font-size: 16px;">check_circle</span></div>
</div>
<div class="aspect-[4/5] flex flex-col items-center justify-center bg-white dark:bg-card-dark rounded-xl border border-slate-100 dark:border-white/5 shadow-sm hover:border-primary transition-colors">
<div class="relative w-14 h-14 rounded-full flex items-center justify-center mb-2" style="background: conic-gradient(#a78bfa 92%, #4c1d95 0);">
<div class="absolute inset-1 bg-white dark:bg-card-dark rounded-full flex items-center justify-center"><span class="text-lg font-bold text-slate-800 dark:text-white">16</span></div>
</div>
<span class="text-xs font-medium text-slate-400 dark:text-text-secondary">92%</span>
</div>
<div class="aspect-[4/5] flex flex-col items-center justify-center bg-white dark:bg-card-dark rounded-xl border border-slate-100 dark:border-white/5 shadow-sm hover:border-primary transition-colors">
<div class="relative w-14 h-14 rounded-full flex items-center justify-center mb-2" style="background: conic-gradient(#a78bfa 70%, #4c1d95 0);">
<div class="absolute inset-1 bg-white dark:bg-card-dark rounded-full flex items-center justify-center"><span class="text-lg font-bold text-slate-800 dark:text-white">17</span></div>
</div>
<span class="text-xs font-medium text-slate-400 dark:text-text-secondary">70%</span>
</div>
<div class="aspect-[4/5] flex flex-col items-center justify-center bg-white dark:bg-card-dark rounded-xl border border-slate-100 dark:border-white/5 shadow-sm hover:border-primary transition-colors">
<div class="relative w-14 h-14 rounded-full flex items-center justify-center mb-2" style="background: conic-gradient(#a78bfa 25%, #4c1d95 0);">
<div class="absolute inset-1 bg-white dark:bg-card-dark rounded-full flex items-center justify-center"><span class="text-lg font-bold text-slate-800 dark:text-white">18</span></div>
</div>
<span class="text-xs font-medium text-slate-400 dark:text-text-secondary">25%</span>
</div>
<div class="aspect-[4/5] flex flex-col items-center justify-center bg-white dark:bg-card-dark rounded-xl border border-slate-100 dark:border-white/5 shadow-sm hover:border-primary transition-colors">
<div class="relative w-14 h-14 rounded-full flex items-center justify-center mb-2" style="background: conic-gradient(#a78bfa 50%, #4c1d95 0);">
<div class="absolute inset-1 bg-white dark:bg-card-dark rounded-full flex items-center justify-center"><span class="text-lg font-bold text-slate-800 dark:text-white">19</span></div>
</div>
<span class="text-xs font-medium text-slate-400 dark:text-text-secondary">50%</span>
</div>
<div class="aspect-[4/5] flex flex-col items-center justify-center bg-white dark:bg-card-dark rounded-xl border border-slate-100 dark:border-white/5 shadow-sm hover:border-primary transition-colors">
<div class="relative w-14 h-14 rounded-full flex items-center justify-center mb-2" style="background: conic-gradient(#a78bfa 100%, #4c1d95 0);">
<div class="absolute inset-1 bg-white dark:bg-card-dark rounded-full flex items-center justify-center"><span class="text-lg font-bold text-primary-dark dark:text-primary">20</span></div>
</div>
<span class="text-xs font-bold text-primary-dark dark:text-primary">100%</span>
</div>
<div class="aspect-[4/5] flex flex-col items-center justify-center bg-white dark:bg-card-dark rounded-xl border border-slate-100 dark:border-white/5 shadow-sm hover:border-primary transition-colors">
<div class="relative w-14 h-14 rounded-full flex items-center justify-center mb-2" style="background: conic-gradient(#a78bfa 45%, #4c1d95 0);">
<div class="absolute inset-1 bg-white dark:bg-card-dark rounded-full flex items-center justify-center"><span class="text-lg font-bold text-slate-800 dark:text-white">21</span></div>
</div>
<span class="text-xs font-medium text-slate-400 dark:text-text-secondary">45%</span>
</div>
<div class="aspect-[4/5] flex flex-col items-center justify-center bg-white dark:bg-card-dark rounded-xl border border-slate-100 dark:border-white/5 shadow-sm hover:border-primary transition-colors">
<div class="relative w-14 h-14 rounded-full flex items-center justify-center mb-2" style="background: conic-gradient(#a78bfa 88%, #4c1d95 0);">
<div class="absolute inset-1 bg-white dark:bg-card-dark rounded-full flex items-center justify-center"><span class="text-lg font-bold text-slate-800 dark:text-white">22</span></div>
</div>
<span class="text-xs font-medium text-slate-400 dark:text-text-secondary">88%</span>
</div>
<div class="aspect-[4/5] flex flex-col items-center justify-center bg-white dark:bg-card-dark rounded-xl border border-slate-100 dark:border-white/5 shadow-sm hover:border-primary transition-colors">
<div class="relative w-14 h-14 rounded-full flex items-center justify-center mb-2" style="background: conic-gradient(#a78bfa 60%, #4c1d95 0);">
<div class="absolute inset-1 bg-white dark:bg-card-dark rounded-full flex items-center justify-center"><span class="text-lg font-bold text-slate-800 dark:text-white">23</span></div>
</div>
<span class="text-xs font-medium text-slate-400 dark:text-text-secondary">60%</span>
</div>
<div class="aspect-[4/5] flex flex-col items-center justify-center bg-white dark:bg-card-dark rounded-xl border border-slate-100 dark:border-white/5 shadow-sm hover:border-primary transition-colors">
<div class="relative w-14 h-14 rounded-full flex items-center justify-center mb-2" style="background: conic-gradient(#a78bfa 35%, #4c1d95 0);">
<div class="absolute inset-1 bg-white dark:bg-card-dark rounded-full flex items-center justify-center"><span class="text-lg font-bold text-slate-800 dark:text-white">24</span></div>
</div>
<span class="text-xs font-medium text-slate-400 dark:text-text-secondary">35%</span>
</div>
</div>
</main>
<div class="absolute bottom-6 right-4">
<button class="bg-primary-dark dark:bg-primary text-white dark:text-background-dark font-bold py-3 px-5 rounded-full shadow-lg shadow-purple-900/50 flex items-center gap-2 hover:opacity-90 transition-opacity">
<span class="material-symbols-outlined" style="font-size: 20px;">send</span>
<span>전체 메시지</span>
</button>
</div>
</div>

</body></html>