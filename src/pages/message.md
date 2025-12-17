<!DOCTYPE html>

<html class="dark" lang="ko"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>수신 메시지함</title>
<!-- Fonts -->
<link href="https://fonts.googleapis.com" rel="preconnect"/>
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
<link href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&amp;family=Noto+Sans+KR:wght@300;400;500;700&amp;display=swap" rel="stylesheet"/>
<!-- Material Symbols -->
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<!-- Tailwind CSS -->
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
        }
        /* Custom scrollbar for better mobile feel if needed */
        ::-webkit-scrollbar {
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
  </head>
<body class="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display antialiased overflow-hidden selection:bg-primary selection:text-white">
<div class="relative flex flex-col h-screen w-full max-w-md mx-auto bg-background-light dark:bg-background-dark shadow-2xl overflow-hidden">
<!-- Header -->
<header class="flex items-center justify-between px-4 py-3 bg-background-light dark:bg-background-dark shrink-0 z-20">
<button class="flex items-center justify-center size-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
<span class="material-symbols-outlined text-slate-900 dark:text-white" style="font-size: 24px;">arrow_back</span>
</button>
<h1 class="text-lg font-bold leading-tight tracking-tight text-center flex-1">수신 메시지함</h1>
<button class="flex items-center justify-center size-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
<span class="material-symbols-outlined text-slate-900 dark:text-white" style="font-size: 24px;">filter_list</span>
</button>
</header>
<!-- Main Content (Scrollable List) -->
<main class="flex-1 overflow-y-auto px-4 pb-20 pt-2 space-y-4">
<!-- Date Divider -->
<div class="flex items-center justify-center py-2">
<span class="px-3 py-1 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-white/5 rounded-full">오늘</span>
</div>
<!-- Message Item 1 (Unread) -->
<article class="relative flex gap-4 p-4 rounded-xl bg-white dark:bg-surface-dark shadow-sm border border-slate-100 dark:border-white/5 active:scale-[0.98] transition-transform cursor-pointer group">
<!-- Unread Indicator -->
<div class="absolute top-4 right-4 size-2.5 bg-primary rounded-full shadow-[0_0_8px_rgba(127,19,236,0.6)]"></div>
<!-- Avatar -->
<div class="relative shrink-0">
<div class="size-12 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden ring-2 ring-white dark:ring-white/10">
<div class="w-full h-full bg-cover bg-center" data-alt="Teacher profile picture showing a friendly face" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuDdMahZwk3CKqk_U4LTnQjEW9g0Ny_C3zbIMZrpZRtM7EMABGf6afEQ8hz3VkX7fgE8Qs66kgjFLw9bpl0PQzmFnSPU92YWkkspsGPFbrdFKAXct2oHc_ZSX8uhc24-3Yepj525DdT3HSI8A7k9nUiN01COPM24tbkv4XuOE90smcjTh2LS1LU7RXQfDb5HwB-d6b4uCS8-a1BHj0k1dTYW_m3wb3vncRdnczH7UTKMd5IbEdpdZmvkmfQLDQXXwISCRv_rhdrFzeJX");'>
</div>
</div>
<div class="absolute -bottom-1 -right-1 bg-background-light dark:bg-background-dark p-0.5 rounded-full">
<div class="bg-primary size-4 rounded-full flex items-center justify-center">
<span class="material-symbols-outlined text-white" style="font-size: 10px;">school</span>
</div>
</div>
</div>
<!-- Content -->
<div class="flex flex-1 flex-col min-w-0">
<div class="flex justify-between items-start mb-1">
<h3 class="text-base font-bold text-slate-900 dark:text-white truncate pr-4">담임 선생님</h3>
<time class="text-xs font-medium text-primary whitespace-nowrap pt-0.5">14:05</time>
</div>
<p class="text-sm font-medium text-slate-800 dark:text-slate-200 truncate mb-0.5">근정전 미션 힌트 도착! 🕵️</p>
<p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        근정전의 월대에는 사방신이 조각되어 있습니다. 남쪽을 지키는 동물은 무엇일까요? 힌트를 확인하고 정답을 입력하세요.
                    </p>
</div>
</article>
<!-- Message Item 2 -->
<article class="relative flex gap-4 p-4 rounded-xl bg-white dark:bg-surface-dark shadow-sm border border-slate-100 dark:border-white/5 active:scale-[0.98] transition-transform cursor-pointer">
<!-- Avatar -->
<div class="relative shrink-0">
<div class="size-12 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden ring-2 ring-white dark:ring-white/10">
<div class="w-full h-full bg-cover bg-center" data-alt="Teacher profile picture showing a friendly face" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuDSsAS4NS_-0_uAO-qADVvhJNjvN5goq1zPVdNjDHolS25A7CR6-aREWy2lxGiAmydzTRpYNUMcfwKbGg86mwVCxQs8imneHp_7PvS8SflYe8nvOmcAMRrDwV5fKCaYe4ufFP3UL7Nrv4ous3m2J9bbVgRWWq608vLfHve54bpASmc1cqL8vhzpiR50riHo5j5LklrH1ExAGd2-Bt3JWAkS8qN2zHBd3TCbRS5Hrv-UUXjXZjQ9VD1GdrIwClDajnw8egX_ufHjrW4C");'>
</div>
</div>
</div>
<!-- Content -->
<div class="flex flex-1 flex-col min-w-0">
<div class="flex justify-between items-start mb-1">
<h3 class="text-base font-bold text-slate-900 dark:text-white truncate">담임 선생님</h3>
<time class="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap pt-0.5">13:30</time>
</div>
<p class="text-sm font-medium text-slate-800 dark:text-slate-200 truncate mb-0.5">📢 모임 장소 변경 안내</p>
<p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        현재 근정전 앞이 매우 혼잡합니다. 3조 학생들은 1층 로비가 아닌 경회루 앞 벤치로 14:30까지 모여주세요.
                    </p>
</div>
</article>
<!-- Message Item 3 -->
<article class="relative flex gap-4 p-4 rounded-xl bg-white dark:bg-surface-dark shadow-sm border border-slate-100 dark:border-white/5 active:scale-[0.98] transition-transform cursor-pointer opacity-80">
<!-- Avatar -->
<div class="relative shrink-0">
<div class="size-12 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden ring-2 ring-white dark:ring-white/10">
<div class="w-full h-full bg-cover bg-center" data-alt="Teacher profile picture showing a friendly face" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuCc_e2Y6VXcKfAlB_G96NC5N_y_9APaO8iA6H5AwxLNIMOTp4WivcsvKy7TOFCOHdAchsjGfQcaVCgK_L7hxMvemUSQsCf-4gIOp_UTyBrY1wpH8to5CojlqnucGku_hWXbpWTLtIbcjKQXY7l3XMz8MsYtD860FXM8ly1hA2nk6c1DrSg1pku7gRIaJBybNzhs1lpPCrs5BeotU3Y_k_3OKowNajSPOfCanQPO0gYokvejx0NsNVqZwymD6uzjnAAXwMHSHs0R7yYj");'>
</div>
</div>
</div>
<!-- Content -->
<div class="flex flex-1 flex-col min-w-0">
<div class="flex justify-between items-start mb-1">
<h3 class="text-base font-bold text-slate-900 dark:text-white truncate">담임 선생님</h3>
<time class="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap pt-0.5">09:00</time>
</div>
<p class="text-sm font-medium text-slate-800 dark:text-slate-200 truncate mb-0.5">박물관 관람 에티켓 🤫</p>
<p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        박물관 내에서는 뛰지 않고 조용히 관람해주세요. 사진 촬영 시 플래시는 꺼주시기 바랍니다. 즐거운 관람 되세요!
                    </p>
</div>
</article>
<!-- Date Divider -->
<div class="flex items-center justify-center py-2 pt-4">
<span class="px-3 py-1 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-white/5 rounded-full">어제</span>
</div>
<!-- Message Item 4 (Yesterday) -->
<article class="relative flex gap-4 p-4 rounded-xl bg-white dark:bg-surface-dark shadow-sm border border-slate-100 dark:border-white/5 active:scale-[0.98] transition-transform cursor-pointer opacity-70">
<!-- Avatar -->
<div class="relative shrink-0">
<div class="size-12 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden ring-2 ring-white dark:ring-white/10">
<div class="w-full h-full bg-cover bg-center" data-alt="Generic system notification icon with abstract shapes" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuBo92I3DGyOBFmvMQGRc8eNC6M15bIPzGjpJ9B_qzc4_QI-IM8C7iOW6jC4pveM-qhHfhzTBmSHTd1-OynulEKfxG0BfQUdc6CODet4f8iiumR-93Vnf7vgInPKSlkNoHMPBhJccY_ceRfFHAvoT2R2wM7CN7o5AwAGuqVeTG0ORvSDa96FOiOl87MOSIXCWOAZc7JDlA-c8ZedQCey_2at12kZGO5zQXLIPScueAoPAYpQsyiSG1P3Wt6Ocq5q5wHpMi5jbQQ4PIS3");'>
</div>
</div>
<div class="absolute -bottom-1 -right-1 bg-background-light dark:bg-background-dark p-0.5 rounded-full">
<div class="bg-gray-500 size-4 rounded-full flex items-center justify-center">
<span class="material-symbols-outlined text-white" style="font-size: 10px;">settings</span>
</div>
</div>
</div>
<!-- Content -->
<div class="flex flex-1 flex-col min-w-0">
<div class="flex justify-between items-start mb-1">
<h3 class="text-base font-bold text-slate-900 dark:text-white truncate">시스템 알림</h3>
<time class="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap pt-0.5">18:00</time>
</div>
<p class="text-sm font-medium text-slate-800 dark:text-slate-200 truncate mb-0.5">앱 업데이트 안내</p>
<p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        원활한 미션 수행을 위해 최신 버전으로 업데이트 해주세요.
                    </p>
</div>
</article>
</main>
<!-- Bottom Navigation -->
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
<!-- Notification Dot on Nav -->
<span class="absolute top-0 right-3 flex h-2.5 w-2.5">
<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
<span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
</span>
<span class="material-symbols-outlined fill text-primary text-[28px]">mail</span>
<span class="text-[10px] font-bold text-primary">메시지</span>
</a>
<a class="flex flex-col items-center gap-1 group w-16" href="#">
<div class="size-7 rounded-full overflow-hidden border border-slate-200 dark:border-white/10">
<img alt="User profile" class="w-full h-full object-cover" data-alt="User avatar thumbnail of a student" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAiMLgNddM7sHz23oi0DRDErZnjGpkOJF3aX2rHnQtqj0q24AdOx_zqoe8jQxizSJ1NBEGF0rXj3_U810OCvaJFIS_BWZ-Y4xxdu6p7rEwx8eI2lgvcgy_9k7dVYKWXse7_WQyh81FG2LeWz1Nla_VetxoricOSLYjC40-XRs2MsDfJIkAkiVxS08r644GnyL_xR8vDZDKDziYUk1ItxaJvFOFOoaoo7JMQtLI_y5c-9kDIdAPLF1IrJKahq2GT-5PBKjcRbFR-oDGW"/>
</div>
<span class="text-[10px] font-medium text-slate-400 group-hover:text-primary transition-colors">마이</span>
</a>
</nav>
<!-- Safe Area for Notch devices (Bottom spacing visual fix if needed) -->
<div class="absolute bottom-0 w-full h-1 bg-transparent pointer-events-none"></div>
</div>
</body></html>