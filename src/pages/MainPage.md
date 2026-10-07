<!DOCTYPE html>

<html class="dark" lang="ko"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>박물관 미션 클리어 - 시작하기</title>
<!-- Google Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@300;400;600;700;800&amp;family=Noto+Sans+KR:wght@300;400;500;700&amp;display=swap" rel="stylesheet"/>
<!-- Material Symbols -->
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<!-- Tailwind CSS -->
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<!-- Theme Configuration -->
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "primary": "#ecb613",
                        "background-light": "#f8f8f6",
                        "background-dark": "#221d10",
                    },
                    fontFamily: {
                        "display": ["Public Sans", "Noto Sans KR", "sans-serif"]
                    },
                    borderRadius: {"DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px"},
                    backgroundImage: {
                        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                    }
                },
            },
        }
    </script>
<style>
        .text-shadow-sm {
            text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="bg-background-light dark:bg-background-dark font-display antialiased selection:bg-primary selection:text-background-dark">
<div class="relative flex min-h-screen w-full flex-col overflow-hidden">
<!-- Background Layer -->
<div class="absolute inset-0 z-0">
<!-- Background Image -->
<div class="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay" data-alt="Abstract dark history museum background with subtle digital nodes and map contour lines" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuCeKL7GVeWFNZ-0yW2qPmb0c8A6-OV-H9orDwzzdzHKc1SL7qgFKXCQXGWeT2-OfXPp53Imi_ri-ack8ujemxYI3Huhcu5cbC3SJ6vrrCRBAVUJixvpblC1tezerzi8Dr0i4Vg3nEm_Zu0Qq0ylwZ5sClAlew3pXRm-_bLXs40Xm7HlyOpinv-y9Z04A5RgzR-oKO_yVHzFSwtjxkzTQzQNYw3QxgUxsD2KrkSmIMeTqtuq3IbH34cV3yHCAscdPqDkzfYqLC3BWEIq");'>
</div>
<!-- Gradient Overlay for Depth and Readability -->
<div class="absolute inset-0 bg-gradient-to-b from-background-dark/80 via-background-dark/60 to-background-dark/95"></div>
<!-- Decorative Elements -->
<div class="absolute top-[-10%] right-[-20%] h-[300px] w-[300px] rounded-full bg-primary/10 blur-[100px]"></div>
<div class="absolute bottom-[10%] left-[-10%] h-[200px] w-[200px] rounded-full bg-blue-500/10 blur-[80px]"></div>
</div>
<!-- Content Layer -->
<div class="relative z-10 flex flex-1 flex-col justify-between px-6 py-12">
<!-- Top Section: Branding -->
<div class="mt-12 flex flex-col items-center justify-center space-y-6 text-center">
<!-- Logo Icon -->
<div class="relative mb-4 flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-transparent shadow-[0_0_15px_rgba(236,182,19,0.2)] backdrop-blur-sm border border-primary/30">
<span class="material-symbols-outlined text-[48px] text-primary drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                        explore
                    </span>
<!-- Decorative small icon -->
<div class="absolute -right-2 -top-2 rounded-full bg-background-dark p-1">
<span class="material-symbols-outlined text-[20px] text-white">
                            history_edu
                        </span>
</div>
</div>
<!-- Titles -->
<div class="flex flex-col gap-2">
<h2 class="text-primary/90 text-sm font-bold uppercase tracking-[0.15em]">Digital Heritage</h2>
<h1 class="text-white text-shadow-sm text-4xl font-extrabold leading-tight tracking-tight">
                        박물관<br/>미션 클리어
                    </h1>
<div class="mx-auto mt-4 h-1 w-12 rounded-full bg-primary"></div>
<p class="mt-4 max-w-[280px] text-gray-300 text-lg font-medium leading-snug tracking-[-0.015em]">
                        과거와 현재를 잇는<br/>디지털 탐험
                    </p>
</div>
</div>
<!-- Bottom Section: Actions -->
<div class="mb-4 flex flex-col gap-4 w-full max-w-md mx-auto">
<!-- Primary Button -->
<button class="group relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-primary h-14 px-5 text-background-dark text-lg font-bold leading-normal tracking-[0.015em] transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20">
<div class="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100"></div>
<span class="material-symbols-outlined mr-2 text-[22px]">play_arrow</span>
<span class="truncate">탐험 시작하기</span>
</button>
<!-- Secondary Button -->
<button class="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-4 border border-white/20 bg-white/5 backdrop-blur-sm text-gray-200 text-sm font-semibold leading-normal tracking-[0.015em] transition-colors hover:bg-white/10 hover:text-white">
<span class="material-symbols-outlined mr-2 text-[18px]">badge</span>
<span class="truncate">교사 / 관리자 로그인</span>
</button>
<!-- Footer Text -->
<p class="mt-4 text-center text-xs text-white/30 font-light tracking-wide">
                    v2.1.0 • Museum Mission Service
                </p>
</div>
</div>
</div>
</body></html>