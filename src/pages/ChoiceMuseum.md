<!DOCTYPE html>

<html class="dark" lang="ko"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Museum Selection Hub</title>
<!-- Google Fonts: Lexend -->
<link href="https://fonts.googleapis.com" rel="preconnect"/>
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
<link href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;700&amp;display=swap" rel="stylesheet"/>
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
              "primary": "#7f13ec",
              "background-light": "#f7f6f8",
              "background-dark": "#191022",
              "card-dark": "#261933",
              "seoul-blue": "#2563eb",
            },
            fontFamily: {
              "display": ["Lexend", "sans-serif"]
            },
            borderRadius: {"DEFAULT": "0.5rem", "lg": "1rem", "xl": "1.5rem", "full": "9999px"},
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
<body class="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display antialiased selection:bg-primary selection:text-white">
<div class="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto border-x border-white/5 shadow-2xl">
<!-- Top App Bar -->
<div class="flex items-center p-4 pb-2 justify-between bg-background-light dark:bg-background-dark sticky top-0 z-10">
<div class="flex items-center gap-2">
<div class="flex items-center justify-center size-10 rounded-full bg-primary/20 text-primary">
<span class="material-symbols-outlined text-[24px]">museum</span>
</div>
<h2 class="text-lg font-bold leading-tight tracking-[-0.015em]">박물관 탐험</h2>
</div>
<button class="flex items-center justify-center size-10 rounded-full hover:bg-white/5 transition-colors">
<span class="material-symbols-outlined text-[#ad92c9] text-[24px]">logout</span>
</button>
</div>
<!-- Student Info (MetaText) -->
<div class="px-4 pb-4 pt-1">
<div class="flex items-center justify-center gap-2 py-2 px-4 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
<span class="material-symbols-outlined text-[#ad92c9] text-[18px]">school</span>
<p class="text-[#ad92c9] text-sm font-medium leading-normal text-center truncate">
                    서울대부설초 6학년 2반 15번 김철수
                </p>
</div>
</div>
<!-- Main Headline -->
<div class="px-4 pb-4 pt-4">
<h1 class="text-[26px] font-bold leading-[1.2] tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
                오늘의 탐험 장소를<br/>선택해주세요.
            </h1>
</div>
<!-- Active Museum Cards -->
<div class="flex flex-col gap-6 px-4 pb-8">
<!-- Card 1: National Palace Museum (Purple Theme) -->
<div class="group relative flex flex-col items-stretch justify-start rounded-xl bg-card-dark shadow-[0_4px_20px_rgba(127,19,236,0.15)] border border-primary/20 hover:border-primary/50 transition-all duration-300 overflow-hidden">
<!-- Image Section -->
<div class="w-full h-48 bg-center bg-cover relative" data-alt="Gyeongbokgung Palace eaves with intricate colorful patterns against a dark sky" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuCPRiDyjF0nFvKAf4Z4TbYWKLr989KaLWrjZ5RCJfSYgsc3oLUVeGj-7vCAA7KgR8p0H3WN-6eh-IRjeJARUiPRJbFKnCVWMvQhCwCtVaQFMQo8xeEL9k2pIKzhHW8r3gok9GXSS9mjKwqnbCfyiLRnGNbsfLKkHBcXXrqufZtDixNWSLYPoM8Nz_s1f-ZhKhOq2SEBWb7Cm1ZnNsl0pN4HxNzAZpKvZKfMPNvl4ExwF8fyVK2PGw9_iUws1OkRwNEbqfTQxn5pJzNT");'>
<div class="absolute inset-0 bg-gradient-to-t from-card-dark to-transparent opacity-90"></div>
<div class="absolute top-3 left-3">
<span class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-primary text-white shadow-lg shadow-primary/40">
                            이용 가능
                        </span>
</div>
</div>
<!-- Content Section -->
<div class="flex flex-col gap-3 p-5 pt-2 relative -mt-4">
<div class="flex justify-between items-start">
<div>
<p class="text-primary text-xs font-bold tracking-wider uppercase mb-1">National Palace Museum</p>
<h3 class="text-xl font-bold leading-tight tracking-tight text-white">국립고궁박물관</h3>
</div>
<div class="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
<span class="material-symbols-outlined">explore</span>
</div>
</div>
<p class="text-slate-400 text-sm leading-relaxed line-clamp-2">
                        조선 왕실의 역사와 문화를 탐험해보세요. 왕의 생활부터 궁중 음악까지 다양한 미션이 기다립니다.
                    </p>
<button class="mt-2 w-full flex items-center justify-center gap-2 h-12 rounded-lg bg-primary hover:bg-[#6a10c4] text-white text-sm font-bold shadow-lg shadow-primary/25 transition-all active:scale-[0.98]">
<span>탐험 시작하기</span>
<span class="material-symbols-outlined text-lg">arrow_forward</span>
</button>
</div>
</div>
<!-- Card 2: Seoul Museum of History (Blue Theme) -->
<div class="group relative flex flex-col items-stretch justify-start rounded-xl bg-card-dark shadow-[0_4px_20px_rgba(37,99,235,0.15)] border border-seoul-blue/20 hover:border-seoul-blue/50 transition-all duration-300 overflow-hidden">
<!-- Image Section -->
<div class="w-full h-48 bg-center bg-cover relative" data-alt="Modern architecture of Seoul mixed with historical walls and blue sky" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuBLO4_ufq45NyA-YaHra9xlVR1roVugUy-LbRg8QniHxFsrAJW4QfpdnvN6OYvtlkoEEC84Rh0GB672p5kvaAkO2AD4ONAHe6_k-dYkPzauI1kcjT2wJo2H34warwmPdF4tiyOY_Sv9NmjqpOlFrWlYYyA80a_rNihBPT7M6sjxCzcnzLYjqfkyQx8NqQtYWZnzGLvzvWoSqGBVMgFY9r4zv4nRVPqnM6rOFqj_pvaeV82jSeVNOWy0HwhS-fy8iquA1KW_I_3D-ZO6");'>
<div class="absolute inset-0 bg-gradient-to-t from-card-dark to-transparent opacity-90"></div>
<div class="absolute top-3 left-3">
<span class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-seoul-blue text-white shadow-lg shadow-seoul-blue/40">
                            이용 가능
                        </span>
</div>
</div>
<!-- Content Section -->
<div class="flex flex-col gap-3 p-5 pt-2 relative -mt-4">
<div class="flex justify-between items-start">
<div>
<p class="text-seoul-blue text-xs font-bold tracking-wider uppercase mb-1">Seoul Museum of History</p>
<h3 class="text-xl font-bold leading-tight tracking-tight text-white">서울역사박물관</h3>
</div>
<div class="size-10 rounded-full bg-seoul-blue/10 flex items-center justify-center text-seoul-blue group-hover:bg-seoul-blue group-hover:text-white transition-colors">
<span class="material-symbols-outlined">history_edu</span>
</div>
</div>
<p class="text-slate-400 text-sm leading-relaxed line-clamp-2">
                        서울의 유구한 역사와 도시의 변화를 느껴보세요. 과거와 현재가 공존하는 특별한 공간입니다.
                    </p>
<button class="mt-2 w-full flex items-center justify-center gap-2 h-12 rounded-lg bg-seoul-blue hover:bg-blue-700 text-white text-sm font-bold shadow-lg shadow-seoul-blue/25 transition-all active:scale-[0.98]">
<span>탐험 시작하기</span>
<span class="material-symbols-outlined text-lg">arrow_forward</span>
</button>
</div>
</div>
</div>
<!-- Coming Soon Section -->
<div class="flex flex-col gap-3 px-4 pb-12">
<div class="flex items-center justify-between">
<h3 class="text-white text-lg font-bold">곧 추가될 박물관</h3>
<span class="material-symbols-outlined text-white/30">more_horiz</span>
</div>
<div class="flex gap-4 overflow-x-auto pb-4 snap-x scrollbar-hide">
<!-- Coming Soon Card 1 -->
<div class="relative flex-none w-40 snap-start">
<div class="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-[#2a2a2a] border border-white/5">
<div class="absolute inset-0 bg-cover bg-center grayscale opacity-30" data-alt="Abstract silhouette of a large modern museum building" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuCTLQfE9xD4mlN8A_HcquDgaXIS1VtkQ_T76D95eM6jsEOTsso5oMifQLCozCRPT4GYzYobjJxhWSS81UwfsoyA3GxQz69oR60xG9MXmK5JsSnDYQyrTFrHjeU14Xxneu8O3goqNKiqkk9uZmircLOQ-DJCq5ggDWZw7O1Np_kdSMBqLQCWJBRAp7FXUmSj3P9ur3ENcFCcYDdmy17uMZKUVBtOZO9-fM29ukdjSJjGYp9kd_l49JPKpeLDd5y37WPzZZ0yseG2tTVu");'></div>
<div class="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[1px]">
<div class="size-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md mb-2">
<span class="material-symbols-outlined text-white/60">lock</span>
</div>
<p class="text-white/60 text-xs font-bold">오픈 예정</p>
</div>
</div>
<p class="mt-2 text-sm font-medium text-white/80">국립중앙박물관</p>
</div>
<!-- Coming Soon Card 2 -->
<div class="relative flex-none w-40 snap-start">
<div class="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-[#2a2a2a] border border-white/5">
<div class="absolute inset-0 bg-cover bg-center grayscale opacity-30" data-alt="War memorial statue silhouette" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuCyv1jIobAtLc84nsXNRs2O6Y1A6fGkekzsfgagKiYQGlk_PFe5ge1GVZyezAz5mHXSjTW_gytPvfgXIS33xgWl-ERJqrX8ZN3KFNwCUM-kztWZ2u7EOAvbnsMDuPrzDNtgk2N7ZyVAK4oMDDbeBBgelZlxOzn9B4CeNWk6_rLjqv5_CQ6LJx8iJf7BlUaGEhnjOfR6b0KalQApK9yzgOETL7tSnPFHGGKDwNYuE7QwJAwzEqD306ZWUigUkVUa9FRSYDVaGh5k0nNH");'></div>
<div class="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[1px]">
<div class="size-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md mb-2">
<span class="material-symbols-outlined text-white/60">lock</span>
</div>
<p class="text-white/60 text-xs font-bold">오픈 예정</p>
</div>
</div>
<p class="mt-2 text-sm font-medium text-white/80">전쟁기념관</p>
</div>
<!-- Coming Soon Card 3 -->
<div class="relative flex-none w-40 snap-start">
<div class="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-[#2a2a2a] border border-white/5">
<div class="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0"></div>
<div class="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[1px]">
<span class="material-symbols-outlined text-white/20 text-4xl">add_circle</span>
</div>
</div>
<p class="mt-2 text-sm font-medium text-white/40">Coming Soon</p>
</div>
</div>
</div>
<!-- Optional: Bottom Nav Placeholder for Mobile Context -->
<div class="sticky bottom-0 w-full bg-[#1a1122]/90 backdrop-blur-lg border-t border-white/5 pb-6 pt-2 px-6 flex justify-between items-center z-20">
<div class="flex flex-col items-center gap-1 text-primary cursor-pointer">
<span class="material-symbols-outlined fill-1">home</span>
<span class="text-[10px] font-medium">홈</span>
</div>
<div class="flex flex-col items-center gap-1 text-white/40 cursor-pointer hover:text-white/70">
<span class="material-symbols-outlined">map</span>
<span class="text-[10px] font-medium">지도</span>
</div>
<div class="flex flex-col items-center gap-1 text-white/40 cursor-pointer hover:text-white/70">
<span class="material-symbols-outlined">person</span>
<span class="text-[10px] font-medium">내 정보</span>
</div>
</div>
</div>
</body></html>