<!DOCTYPE html>
<html class="dark" lang="ko"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>학생 진도 현황 화면</title>
<link href="https://fonts.googleapis.com" rel="preconnect"/>
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
<link href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@300;400;500;600;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "primary": "#7f13ec",
                        "background-light": "#f7f6f8",
                        "background-dark": "#191022",
                        "surface-dark": "#261933",
                        "surface-light": "#ffffff",
                        "border-dark": "#4d3267",
                        "border-light": "#e5e7eb",
                        "text-secondary-dark": "#ad92c9",
                        "text-secondary-light": "#6b7280",
                    },
                    fontFamily: {
                        "display": ["Public Sans", "Noto Sans", "sans-serif"]
                    },
                    borderRadius: {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "2xl": "1rem",
                        "full": "9999px"
                    },
                },
            },
        }
    </script>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="bg-background-light dark:bg-background-dark font-display antialiased text-gray-900 dark:text-white transition-colors duration-200">
<div class="relative flex min-h-screen flex-col mx-auto max-w-md shadow-2xl overflow-hidden bg-background-light dark:bg-background-dark">
<header class="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-border-light dark:border-border-dark/30">
<button class="flex items-center justify-center size-10 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
<span class="material-symbols-outlined text-gray-900 dark:text-white" style="font-size: 24px;">arrow_back</span>
</button>
<h1 class="text-lg font-bold leading-tight tracking-tight flex-1 text-center">3학년 2반 진도 현황</h1>
<button class="flex items-center justify-center h-10 px-2 text-primary font-bold text-sm tracking-wide hover:text-primary/80 transition-colors">
<span class="material-symbols-outlined text-primary" style="font-size: 24px;">refresh</span>
</button>
</header>
<main class="flex-1 flex flex-col p-4 gap-6 overflow-y-auto pb-32">
<section class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-[#5b0ea8] p-6 shadow-xl text-white">
<div class="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"></div>
<div class="absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
<div class="relative z-10 flex flex-col gap-4">
<div class="flex justify-between items-start">
<div>
<h2 class="text-sm font-medium text-white/80 mb-1">우리 반 평균 달성률</h2>
<div class="flex items-end gap-2">
<span class="text-5xl font-bold tracking-tight">68%</span>
<span class="text-sm font-medium text-green-300 mb-1.5 flex items-center gap-0.5">
<span class="material-symbols-outlined text-sm">trending_up</span>
                                12%
                            </span>
</div>
</div>
<div class="bg-white/20 backdrop-blur-md rounded-lg p-2">
<span class="material-symbols-outlined text-white">groups</span>
</div>
</div>
<div class="flex flex-col gap-2">
<div class="h-2 w-full rounded-full bg-black/20 overflow-hidden">
<div class="h-full rounded-full bg-white transition-all duration-1000 ease-out" style="width: 68%"></div>
</div>
<div class="flex justify-between text-xs font-medium text-white/70">
<span>전체 학생 28명</span>
<span>탐험 완료 12명</span>
</div>
</div>
</div>
</section>
<section class="grid grid-cols-2 gap-3">
<div class="bg-surface-light dark:bg-surface-dark p-4 rounded-xl border border-border-light dark:border-border-dark shadow-sm">
<div class="flex items-center gap-2 mb-2 text-text-secondary-light dark:text-text-secondary-dark">
<span class="material-symbols-outlined text-lg">timer</span>
<span class="text-xs font-bold uppercase tracking-wider">평균 소요 시간</span>
</div>
<p class="text-xl font-bold">45분</p>
</div>
<div class="bg-surface-light dark:bg-surface-dark p-4 rounded-xl border border-border-light dark:border-border-dark shadow-sm">
<div class="flex items-center gap-2 mb-2 text-text-secondary-light dark:text-text-secondary-dark">
<span class="material-symbols-outlined text-lg">star</span>
<span class="text-xs font-bold uppercase tracking-wider">최고 인기 미션</span>
</div>
<p class="text-xl font-bold truncate">자격루의 비밀</p>
</div>
</section>
<section class="flex flex-col gap-4">
<div class="flex items-center justify-between px-1">
<h3 class="text-lg font-bold text-gray-900 dark:text-white">전시관별 완료 현황</h3>
<span class="text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark bg-gray-100 dark:bg-surface-dark px-2 py-1 rounded-md">실시간 집계중</span>
</div>
<div class="flex flex-col gap-3">
<div class="group bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-4 shadow-sm hover:border-primary/50 transition-colors">
<div class="flex justify-between items-start mb-3">
<div class="flex items-center gap-3">
<div class="flex items-center justify-center size-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
<span class="material-symbols-outlined">crown</span>
</div>
<div>
<h4 class="font-bold text-gray-900 dark:text-white">1관: 조선의 국왕</h4>
<p class="text-xs text-text-secondary-light dark:text-text-secondary-dark">미션 5개 포함</p>
</div>
</div>
<div class="text-right">
<span class="text-lg font-bold text-gray-900 dark:text-white">85%</span>
</div>
</div>
<div class="relative h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
<div class="absolute top-0 left-0 h-full rounded-full bg-orange-500" style="width: 85%"></div>
</div>
<div class="flex justify-between mt-2 text-xs text-gray-500 dark:text-text-secondary-dark">
<span>진행중 4명</span>
<span>완료 24명</span>
</div>
</div>
<div class="group bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-4 shadow-sm hover:border-primary/50 transition-colors">
<div class="flex justify-between items-start mb-3">
<div class="flex items-center gap-3">
<div class="flex items-center justify-center size-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
<span class="material-symbols-outlined">science</span>
</div>
<div>
<h4 class="font-bold text-gray-900 dark:text-white">2관: 조선의 과학</h4>
<p class="text-xs text-text-secondary-light dark:text-text-secondary-dark">미션 4개 포함</p>
</div>
</div>
<div class="text-right">
<span class="text-lg font-bold text-gray-900 dark:text-white">60%</span>
</div>
</div>
<div class="relative h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
<div class="absolute top-0 left-0 h-full rounded-full bg-blue-500" style="width: 60%"></div>
</div>
<div class="flex justify-between mt-2 text-xs text-gray-500 dark:text-text-secondary-dark">
<span>진행중 11명</span>
<span>완료 17명</span>
</div>
</div>
<div class="group bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-4 shadow-sm hover:border-primary/50 transition-colors">
<div class="flex justify-between items-start mb-3">
<div class="flex items-center gap-3">
<div class="flex items-center justify-center size-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
<span class="material-symbols-outlined">palette</span>
</div>
<div>
<h4 class="font-bold text-gray-900 dark:text-white">3관: 왕실의 예법</h4>
<p class="text-xs text-text-secondary-light dark:text-text-secondary-dark">미션 6개 포함</p>
</div>
</div>
<div class="text-right">
<span class="text-lg font-bold text-gray-900 dark:text-white">32%</span>
</div>
</div>
<div class="relative h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
<div class="absolute top-0 left-0 h-full rounded-full bg-emerald-500" style="width: 32%"></div>
</div>
<div class="flex justify-between mt-2 text-xs text-gray-500 dark:text-text-secondary-dark">
<span>진행중 19명</span>
<span>완료 9명</span>
</div>
</div>
</div>
</section>
</main>
<footer class="fixed bottom-0 left-0 right-0 z-40 p-4 bg-background-light dark:bg-background-dark border-t border-border-light dark:border-border-dark/30 max-w-md mx-auto">
<div class="flex flex-col gap-3">
<button class="w-full h-14 bg-surface-light dark:bg-surface-dark border-2 border-primary text-primary hover:bg-primary/5 active:bg-primary/10 text-base font-bold rounded-xl flex items-center justify-center gap-2 transition-all transform active:scale-[0.98]">
<span>전체 격려 메시지 보내기</span>
<span class="material-symbols-outlined text-xl">campaign</span>
</button>
</div>
<div class="h-4"></div>
</footer>
</div>

</body></html>