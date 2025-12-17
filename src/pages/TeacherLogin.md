<!DOCTYPE html>
<html class="dark" lang="ko"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>선생님 로그인 페이지</title>
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
            min-height: max(600px, 100dvh);
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
<h1 class="text-lg font-bold leading-tight tracking-tight flex-1 text-center">선생님 로그인</h1>
<div class="size-10"></div> 
</header>
<main class="flex-1 flex flex-col items-center justify-center p-6 gap-8 pb-10">
<div class="flex flex-col items-center gap-6 text-center w-full mt-4">
<div class="relative group">
<div class="absolute -inset-1 bg-gradient-to-r from-primary to-purple-400 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
<div class="relative size-28 bg-surface-light dark:bg-surface-dark rounded-full flex items-center justify-center shadow-xl border border-border-light dark:border-border-dark ring-4 ring-background-light dark:ring-background-dark">
<span class="material-symbols-outlined text-primary text-5xl">supervisor_account</span>
<div class="absolute bottom-1 right-1 bg-primary text-white p-1.5 rounded-full border-4 border-background-light dark:border-background-dark">
<span class="material-symbols-outlined text-sm font-bold block">check</span>
</div>
</div>
</div>
<div class="space-y-2">
<h2 class="text-2xl font-bold tracking-tight">선생님, 환영합니다!</h2>
<p class="text-gray-500 dark:text-text-secondary-dark text-sm leading-relaxed max-w-[280px] mx-auto">
                        학교 관리자 계정으로 로그인하여<br/>학생들의 탐험 활동을 지도해보세요.
                    </p>
</div>
</div>
<form class="w-full flex flex-col gap-5" onsubmit="event.preventDefault();">
<div class="space-y-1.5">
<label class="block text-xs font-bold text-gray-500 dark:text-text-secondary-dark ml-4 uppercase tracking-wider" for="school-id">
                        학교 아이디
                    </label>
<div class="relative group">
<div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
<span class="material-symbols-outlined text-gray-400 dark:text-text-secondary-dark group-focus-within:text-primary transition-colors">domain</span>
</div>
<input autocomplete="username" class="block w-full h-14 pl-12 pr-4 rounded-xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all shadow-sm text-base" id="school-id" name="school-id" placeholder="학교 코드를 입력하세요" type="text"/>
</div>
</div>
<div class="space-y-1.5">
<label class="block text-xs font-bold text-gray-500 dark:text-text-secondary-dark ml-4 uppercase tracking-wider" for="password">
                        비밀번호
                    </label>
<div class="relative group">
<div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
<span class="material-symbols-outlined text-gray-400 dark:text-text-secondary-dark group-focus-within:text-primary transition-colors">lock</span>
</div>
<input autocomplete="current-password" class="block w-full h-14 pl-12 pr-4 rounded-xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all shadow-sm text-base" id="password" name="password" placeholder="비밀번호를 입력하세요" type="password"/>
<button class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" type="button">
<span class="material-symbols-outlined text-xl">visibility_off</span>
</button>
</div>
</div>
<div class="flex items-center justify-between px-1">
<label class="inline-flex items-center cursor-pointer group">
<input class="form-checkbox rounded border-gray-300 dark:border-border-dark text-primary focus:ring-primary dark:bg-surface-dark transition duration-150 ease-in-out h-4 w-4" type="checkbox"/>
<span class="ml-2 text-sm text-gray-600 dark:text-text-secondary-dark group-hover:text-primary transition-colors">자동 로그인</span>
</label>
<a class="text-sm font-medium text-gray-500 dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary transition-colors" href="#">
                        정보 찾기
                    </a>
</div>
<button class="w-full h-14 mt-2 bg-primary hover:bg-primary/90 active:bg-primary/95 text-white text-base font-bold rounded-xl shadow-lg shadow-primary/25 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98]" type="submit">
<span>로그인</span>
<span class="material-symbols-outlined text-xl">login</span>
</button>
</form>
</main>
<footer class="p-6 text-center border-t border-border-light dark:border-border-dark/30 bg-background-light dark:bg-background-dark">
<p class="text-sm text-gray-500 dark:text-text-secondary-dark mb-4">
                학생 계정으로 로그인하시겠습니까?
            </p>
<button class="inline-flex items-center justify-center px-6 py-2.5 rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-sm font-semibold text-gray-700 dark:text-gray-200">
<span class="material-symbols-outlined text-base mr-2 text-gray-400">backpack</span>
                학생 로그인으로 이동
            </button>
<div class="h-2"></div>
</footer>
</div>

</body></html>