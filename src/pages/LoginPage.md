<!DOCTYPE html>

<html class="dark" lang="ko"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>서비스 통합 로그인 화면</title>
<!-- Fonts -->
<link href="https://fonts.googleapis.com" rel="preconnect"/>
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
<link href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@300;400;500;600;700&amp;family=Noto+Sans+KR:wght@300;400;500;700&amp;display=swap" rel="stylesheet"/>
<!-- Material Symbols -->
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<!-- Tailwind CSS -->
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<!-- Theme Config -->
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "primary": "#7f13ec",
                        "primary-hover": "#6a0fc6",
                        "background-light": "#f7f6f8",
                        "background-dark": "#191022",
                        "surface-dark": "#261933",
                        "border-dark": "#4d3267",
                        "text-muted": "#ad92c9",
                    },
                    fontFamily: {
                        "display": ["Public Sans", "Noto Sans KR", "sans-serif"],
                        "body": ["Noto Sans KR", "sans-serif"],
                    },
                    borderRadius: {"DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px"},
                },
            },
        }
    </script>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="bg-background-light dark:bg-background-dark font-display antialiased text-slate-900 dark:text-white transition-colors duration-200">
<div class="relative flex min-h-screen w-full flex-col overflow-hidden max-w-md mx-auto shadow-2xl">
<!-- Top App Bar -->
<div class="flex items-center px-4 py-3 justify-between sticky top-0 z-10 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md">
<button class="flex size-10 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
<span class="material-symbols-outlined text-2xl">arrow_back</span>
</button>
<h2 class="text-lg font-bold leading-tight tracking-[-0.015em]">로그인</h2>
<div class="size-10"></div> <!-- Spacer for centering title -->
</div>
<!-- Main Content -->
<main class="flex-1 flex flex-col px-6 pt-4 pb-24">
<!-- Headline Section -->
<div class="flex flex-col items-center text-center mb-8">
<div class="mb-6 relative size-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center ring-1 ring-primary/30 shadow-[0_0_15px_rgba(127,19,236,0.15)]">
<img alt="Abstract colorful gradient shapes representing exploration and creativity" class="w-full h-full object-cover rounded-full opacity-80 mix-blend-overlay absolute inset-0" data-alt="Abstract colorful gradient shapes representing exploration and creativity" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIy-Lo3ObhMAZQKAC33irvclvEXTXrzuItiYjvaoRSCOEHzBGogh9OekN1h50G-Bu0YjhO78dIxmr0-QSjpKAVDLro09d-GW2qHvQms7RiiYM6KN6x6msgCDWCGDTkr36pcxBAOTwcgjCxhxqdfrlVqgmukTdx2xKCnKbCnHTwSnjmdfJh6fo_0p-3D_qcIzHP6f2MYUhLMKVS_z2LD55qkGfwS5Uzio4VPMysncSlnqySSBclMVTOwqd8dICkCyehDMa5PkmFSfgc"/>
<span class="material-symbols-outlined text-4xl text-primary z-10">explore</span>
</div>
<h3 class="text-2xl font-bold leading-tight tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-gray-300">
                    탐험을 시작해볼까요?
                </h3>
<p class="text-slate-500 dark:text-text-muted text-sm font-normal">
                    반가워요! 학생 정보를 입력하고<br/>나만의 박물관 미션을 시작하세요.
                </p>
</div>
<!-- Form Section -->
<div class="flex flex-col gap-5 w-full">
<!-- School Input -->
<label class="flex flex-col gap-2">
<span class="text-sm font-semibold text-slate-700 dark:text-gray-200 ml-1">학교</span>
<div class="relative group">
<input class="w-full rounded-xl h-14 pl-4 pr-12 text-base bg-white dark:bg-surface-dark border border-gray-200 dark:border-border-dark focus:border-primary dark:focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-text-muted/60" placeholder="학교 이름을 검색하세요" type="text"/>
<div class="absolute right-0 top-0 h-full w-12 flex items-center justify-center text-slate-400 dark:text-text-muted pointer-events-none group-focus-within:text-primary transition-colors">
<span class="material-symbols-outlined">search</span>
</div>
</div>
</label>
<!-- Grade & Class Row -->
<div class="flex gap-4">
<label class="flex flex-col gap-2 flex-1">
<span class="text-sm font-semibold text-slate-700 dark:text-gray-200 ml-1">학년</span>
<div class="relative">
<input class="w-full rounded-xl h-14 px-4 text-base bg-white dark:bg-surface-dark border border-gray-200 dark:border-border-dark focus:border-primary dark:focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-text-muted/60" inputmode="numeric" pattern="\d*" placeholder="1" type="number"/>
<span class="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400 dark:text-text-muted pointer-events-none">학년</span>
</div>
</label>
<label class="flex flex-col gap-2 flex-1">
<span class="text-sm font-semibold text-slate-700 dark:text-gray-200 ml-1">반</span>
<div class="relative">
<input class="w-full rounded-xl h-14 px-4 text-base bg-white dark:bg-surface-dark border border-gray-200 dark:border-border-dark focus:border-primary dark:focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-text-muted/60" inputmode="numeric" pattern="\d*" placeholder="1" type="number"/>
<span class="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400 dark:text-text-muted pointer-events-none">반</span>
</div>
</label>
</div>
<!-- Number & Name Row -->
<div class="flex gap-4">
<label class="flex flex-col gap-2 flex-[0.8]">
<span class="text-sm font-semibold text-slate-700 dark:text-gray-200 ml-1">번호</span>
<div class="relative">
<input class="w-full rounded-xl h-14 px-4 text-base bg-white dark:bg-surface-dark border border-gray-200 dark:border-border-dark focus:border-primary dark:focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-text-muted/60" inputmode="numeric" pattern="\d*" placeholder="1" type="number"/>
<span class="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400 dark:text-text-muted pointer-events-none">번</span>
</div>
</label>
<label class="flex flex-col gap-2 flex-[1.2]">
<span class="text-sm font-semibold text-slate-700 dark:text-gray-200 ml-1">이름</span>
<input class="w-full rounded-xl h-14 px-4 text-base bg-white dark:bg-surface-dark border border-gray-200 dark:border-border-dark focus:border-primary dark:focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-text-muted/60" placeholder="이름을 입력하세요" type="text"/>
</label>
</div>
</div>
</main>
<!-- Bottom Action Bar -->
<div class="fixed bottom-0 left-0 right-0 p-4 bg-background-light dark:bg-background-dark border-t border-gray-200 dark:border-white/5 backdrop-blur-xl z-20 flex justify-center w-full">
<div class="w-full max-w-md flex flex-col gap-3">
<button class="w-full bg-primary hover:bg-primary-hover active:scale-[0.98] text-white font-bold h-14 rounded-xl shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2 group">
<span>로그인 및 박물관 선택하기</span>
<span class="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
</button>
<button class="text-xs text-slate-500 dark:text-text-muted hover:text-primary dark:hover:text-white transition-colors text-center pb-2">
                    정보를 잊으셨나요? 선생님께 문의하기
                </button>
</div>
</div>
</div>
</body></html>