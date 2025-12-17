<!DOCTYPE html>
<html class="dark" lang="ko"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>선생님 시작 화면</title>
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
<span class="material-symbols-outlined text-gray-900 dark:text-white">menu</span>
</button>
<h1 class="text-lg font-bold leading-tight tracking-tight flex-1 text-center">선생님 대시보드</h1>
<button class="flex items-center justify-center size-10 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors relative">
<span class="material-symbols-outlined text-gray-900 dark:text-white">notifications</span>
<span class="absolute top-2 right-2 size-2.5 bg-red-500 rounded-full border-2 border-background-light dark:border-background-dark"></span>
</button>
</header>
<main class="flex-1 flex flex-col p-4 gap-6 overflow-y-auto pb-24">
<section class="flex flex-col gap-1 mt-2">
<h2 class="text-2xl font-bold leading-tight">안녕하세요,<br/><span class="text-primary">김민수 선생님!</span> 👋</h2>
<p class="text-gray-600 dark:text-text-secondary-dark text-sm">오늘도 학생들과 즐거운 박물관 탐험 되세요.</p>
</section>
<section class="relative w-full rounded-2xl overflow-hidden shadow-lg group bg-surface-dark">
<div class="absolute inset-0 bg-cover bg-center opacity-40" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuAHDtYMddOwwsqRqqLFxzCGQQIHAC6eg4J2KMAKqxAFlTR-DZcVtXY0T1WogqHhPptWOs3foll30x_CQukdVN-1msAIvDb_maz6vwo6dGpuu6Hp6j0kkgI8vdAeiKQhXytT2PIQ-7BnR2s7G-kvEUulPiTKAl_USzJtzM-soB9FI0WmKNLJpD_HWvTZ_bzQyuLS2bDFbAZOabkG7JyhudO0Xt6k3zpHafezkvAPWHWDi8mP1zQE6ObsBa2x4eio8RAWqxD56wQAwnTq");'></div>
<div class="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/40"></div>
<div class="relative p-5 text-white flex flex-col gap-4">
<div class="flex justify-between items-start">
<div>
<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-white/20 text-white mb-2 border border-white/10">
                                진행 중
                            </span>
<h3 class="text-xl font-bold">국립고궁박물관 탐험</h3>
<p class="text-white/80 text-sm mt-0.5">3학년 2반 • 역사 현장학습</p>
</div>
<div class="size-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
<span class="material-symbols-outlined text-white">museum</span>
</div>
</div>
<div class="h-px w-full bg-white/20"></div>
<div class="flex gap-6">
<div>
<p class="text-white/70 text-xs mb-1">참여 학생</p>
<p class="text-2xl font-bold leading-none">24<span class="text-sm font-normal text-white/70 ml-1">명</span></p>
</div>
<div>
<p class="text-white/70 text-xs mb-1">평균 진행률</p>
<p class="text-2xl font-bold leading-none">68<span class="text-sm font-normal text-white/70 ml-1">%</span></p>
</div>
</div>
</div>
</section>
<section class="grid grid-cols-2 gap-4">
<div class="rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-4 shadow-sm flex flex-col justify-between h-28">
<div class="flex items-center gap-2 text-gray-500 dark:text-text-secondary-dark">
<span class="material-symbols-outlined text-green-500">wifi</span>
<span class="text-xs font-bold">현재 접속 중</span>
</div>
<div class="flex items-end justify-between">
<p class="text-3xl font-bold text-gray-900 dark:text-white">18</p>
<span class="text-xs text-green-500 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full font-medium">+2명 증가</span>
</div>
</div>
<div class="rounded-xl border border-red-100 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 p-4 shadow-sm flex flex-col justify-between h-28 cursor-pointer hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors">
<div class="flex items-center gap-2 text-red-600 dark:text-red-400">
<span class="material-symbols-outlined animate-pulse">notifications_active</span>
<span class="text-xs font-bold">도움 요청</span>
</div>
<div class="flex items-end justify-between">
<p class="text-3xl font-bold text-red-600 dark:text-red-400">3<span class="text-lg font-normal ml-1">건</span></p>
<span class="material-symbols-outlined text-red-400 text-xl">arrow_forward</span>
</div>
</div>
</section>
<section class="flex flex-col gap-3">
<h3 class="text-sm font-bold text-gray-500 dark:text-text-secondary-dark px-1">주요 기능</h3>
<button class="group flex items-center p-4 rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark shadow-sm hover:shadow-md transition-all active:scale-[0.98]">
<div class="size-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mr-4 group-hover:bg-primary group-hover:text-white transition-colors">
<span class="material-symbols-outlined">monitoring</span>
</div>
<div class="flex-1 text-left">
<h4 class="font-bold text-gray-900 dark:text-white">학생 진도 상세 확인</h4>
<p class="text-xs text-gray-500 dark:text-text-secondary-dark mt-0.5">학생별 위치 및 문제 해결 현황</p>
</div>
<span class="material-symbols-outlined text-gray-400 group-hover:translate-x-1 transition-transform">chevron_right</span>
</button>
<button class="group flex items-center p-4 rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark shadow-sm hover:shadow-md transition-all active:scale-[0.98]">
<div class="size-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
<span class="material-symbols-outlined">quiz</span>
</div>
<div class="flex-1 text-left">
<h4 class="font-bold text-gray-900 dark:text-white">문제 및 정답 관리</h4>
<p class="text-xs text-gray-500 dark:text-text-secondary-dark mt-0.5">미스터리 문제 수정 및 힌트 설정</p>
</div>
<span class="material-symbols-outlined text-gray-400 group-hover:translate-x-1 transition-transform">chevron_right</span>
</button>
</section>
</main>
<nav class="fixed bottom-0 left-0 right-0 z-40 bg-surface-light dark:bg-surface-dark border-t border-border-light dark:border-border-dark/30 max-w-md mx-auto pb-safe">
<div class="flex items-center justify-around h-16 px-2">
<a class="flex flex-col items-center justify-center w-full h-full gap-1 text-primary" href="#">
<span class="material-symbols-outlined filled text-[26px]">dashboard</span>
<span class="text-[10px] font-medium">홈</span>
</a>
<a class="flex flex-col items-center justify-center w-full h-full gap-1 text-gray-400 dark:text-text-secondary-dark hover:text-gray-600 dark:hover:text-gray-300 transition-colors" href="#">
<span class="material-symbols-outlined text-[26px]">groups</span>
<span class="text-[10px] font-medium">학생 관리</span>
</a>
<a class="flex flex-col items-center justify-center w-full h-full gap-1 text-gray-400 dark:text-text-secondary-dark hover:text-gray-600 dark:hover:text-gray-300 transition-colors" href="#">
<span class="material-symbols-outlined text-[26px]">chat_bubble</span>
<span class="text-[10px] font-medium">메시지</span>
</a>
<a class="flex flex-col items-center justify-center w-full h-full gap-1 text-gray-400 dark:text-text-secondary-dark hover:text-gray-600 dark:hover:text-gray-300 transition-colors" href="#">
<span class="material-symbols-outlined text-[26px]">settings</span>
<span class="text-[10px] font-medium">설정</span>
</a>
</div>
<div class="h-4"></div>
</nav>
</div>

</body></html>