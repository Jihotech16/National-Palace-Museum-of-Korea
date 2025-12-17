<!DOCTYPE html>
<html class="dark" lang="ko"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>메시지 보내기</title>
<link href="https://fonts.googleapis.com" rel="preconnect"/>
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
<link href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&amp;family=Noto+Sans+KR:wght@300;400;500;700&amp;display=swap" rel="stylesheet"/>
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
                    },
                    fontFamily: {
                        "display": ["Lexend", "Noto Sans KR", "sans-serif"],
                        "body": ["Noto Sans KR", "sans-serif"]
                    },
                    borderRadius: { "DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "2xl": "1rem", "full": "9999px" },
                },
            },
        }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .material-symbols-outlined.fill {
            font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }::-webkit-scrollbar {
            width: 4px;
        }
        ::-webkit-scrollbar-track {
            background: transparent;
        }
        ::-webkit-scrollbar-thumb {
            background: rgba(127, 19, 236, 0.3);
            border-radius: 4px;
        }
    </style>
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
<body class="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display antialiased overflow-hidden selection:bg-primary selection:text-white">
<div class="relative flex flex-col h-screen w-full max-w-md mx-auto bg-background-light dark:bg-background-dark shadow-2xl overflow-hidden">
<header class="flex items-center justify-between px-4 py-3 bg-background-light dark:bg-background-dark shrink-0 z-20">
<button class="flex items-center justify-center size-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors group">
<span class="material-symbols-outlined text-slate-900 dark:text-white group-hover:-translate-x-0.5 transition-transform" style="font-size: 24px;">arrow_back</span>
</button>
<h1 class="text-lg font-bold leading-tight tracking-tight text-center flex-1">메시지 보내기</h1>
<div class="size-10"></div>
</header>
<main class="flex-1 overflow-y-auto px-4 pb-24 pt-2">
<form class="flex flex-col gap-5 h-full" onsubmit="event.preventDefault();">
<div class="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-slate-100 dark:border-white/5 p-5">
<label class="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider" for="recipient">받는 사람</label>
<div class="relative">
<select class="w-full appearance-none bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-base font-medium rounded-xl py-3.5 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all cursor-pointer" id="recipient">
<option value="class_all">3학년 2반 전체 (24명)</option>
<option value="group_1">1조 (탐험대)</option>
<option value="group_2">2조 (역사반)</option>
<option value="student_kim">김철수</option>
<option value="student_lee">이영희</option>
</select>
<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500 dark:text-slate-400">
<span class="material-symbols-outlined" style="font-size: 24px;">arrow_drop_down</span>
</div>
</div>
<p class="mt-2 text-xs text-slate-400 dark:text-slate-500">
<span class="material-symbols-outlined align-middle mr-1" style="font-size: 14px;">info</span>
                선택한 대상에게 푸시 알림이 함께 전송됩니다.
            </p>
</div>
<div class="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-slate-100 dark:border-white/5 flex flex-col flex-1 overflow-hidden">
<div class="p-5 border-b border-slate-100 dark:border-white/5">
<label class="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider" for="title">제목</label>
<input class="w-full bg-transparent border-none p-0 text-lg font-bold text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:ring-0 leading-tight" id="title" placeholder="제목을 입력하세요" type="text"/>
</div>
<div class="p-5 flex-1 flex flex-col min-h-[240px]">
<label class="sr-only" for="content">내용</label>
<textarea class="w-full flex-1 bg-transparent border-none p-0 text-base text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:ring-0 resize-none leading-relaxed font-body" id="content" placeholder="학생들에게 전달할 메시지 내용을 입력하세요.
예: 힌트 제공, 집합 장소 안내, 격려의 말 등"></textarea>
<div class="pt-4 mt-4 flex items-center gap-3 border-t border-slate-100 dark:border-white/5">
<button class="group p-2 -ml-2 rounded-full hover:bg-slate-50 dark:hover:bg-white/5 transition-colors" type="button">
<span class="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors" style="font-size: 22px;">image</span>
</button>
<button class="group p-2 rounded-full hover:bg-slate-50 dark:hover:bg-white/5 transition-colors" type="button">
<span class="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors" style="font-size: 22px;">add_link</span>
</button>
<button class="group p-2 rounded-full hover:bg-slate-50 dark:hover:bg-white/5 transition-colors" type="button">
<span class="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors" style="font-size: 22px;">sentiment_satisfied</span>
</button>
<div class="flex-1"></div>
<span class="text-xs font-medium text-slate-400">0/500</span>
</div>
</div>
</div>
<div class="pt-2 pb-6">
<button class="w-full py-4 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold text-base shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2" type="submit">
<span>메시지 전송하기</span>
<span class="material-symbols-outlined" style="font-size: 20px;">send</span>
</button>
</div>
</form>
</main>
<nav class="absolute bottom-0 w-full bg-white dark:bg-surface-dark border-t border-slate-200 dark:border-white/5 px-6 pb-6 pt-3 z-30 flex justify-between items-end">
<a class="flex flex-col items-center gap-1 group w-16" href="#">
<span class="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors text-[28px]">home</span>
<span class="text-[10px] font-medium text-slate-400 group-hover:text-primary transition-colors">홈</span>
</a>
<a class="flex flex-col items-center gap-1 group w-16" href="#">
<span class="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors text-[28px]">map</span>
<span class="text-[10px] font-medium text-slate-400 group-hover:text-primary transition-colors">지도</span>
</a>
<a class="flex flex-col items-center gap-1 group w-16 relative" href="#">
<span class="material-symbols-outlined fill text-primary text-[28px]">mail</span>
<span class="text-[10px] font-bold text-primary">메시지</span>
</a>
<a class="flex flex-col items-center gap-1 group w-16" href="#">
<div class="size-7 rounded-full overflow-hidden border border-slate-200 dark:border-white/10 ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
<img alt="Teacher profile" class="w-full h-full object-cover" data-alt="Teacher avatar thumbnail" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdMahZwk3CKqk_U4LTnQjEW9g0Ny_C3zbIMZrpZRtM7EMABGf6afEQ8hz3VkX7fgE8Qs66kgjFLw9bpl0PQzmFnSPU92YWkkspsGPFbrdFKAXct2oHc_ZSX8uhc24-3Yepj525DdT3HSI8A7k9nUiN01COPM24tbkv4XuOE90smcjTh2LS1LU7RXQfDb5HwB-d6b4uCS8-a1BHj0k1dTYW_m3wb3vncRdnczH7UTKMd5IbEdpdZmvkmfQLDQXXwISCRv_rhdrFzeJX"/>
</div>
<span class="text-[10px] font-medium text-slate-400 group-hover:text-primary transition-colors">마이</span>
</a>
</nav>
<div class="absolute bottom-0 w-full h-1 bg-transparent pointer-events-none"></div>
</div>
</body></html>
