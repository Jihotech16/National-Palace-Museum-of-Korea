<!DOCTYPE html>
<html class="dark" lang="ko"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>학교 관리자 화면</title>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "primary": "#fbbf24","primary-content": "#451a03","background-light": "#fdfbf7",
                        "background-dark": "#1a0b2e","surface-dark": "#2f1c4e","surface-light": "#ffffff",
                        "border-dark": "#4a3b69",
                    },
                    fontFamily: {
                        "sans": ["Noto Sans KR", "sans-serif"],
                    },
                    borderRadius: {"DEFAULT": "0.5rem", "lg": "0.75rem", "xl": "1rem", "2xl": "1.5rem", "full": "9999px"},
                },
            },
        }
    </script>
<style>
        body {
            font-family: 'Noto Sans KR', sans-serif;
            -webkit-font-smoothing: antialiased;
        }
        ::-webkit-scrollbar {
            width: 4px;
        }
        ::-webkit-scrollbar-track {
            background: transparent;
        }
        ::-webkit-scrollbar-thumb {
            background-color: rgba(251, 191, 36, 0.3);
            border-radius: 20px;
        }
        .glass-panel {
            background: rgba(47, 28, 78, 0.7);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.08);
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
<body class="bg-background-light dark:bg-background-dark text-slate-900 dark:text-gray-100 min-h-screen flex justify-center selection:bg-primary selection:text-primary-content">
<div class="w-full max-w-md bg-background-light dark:bg-background-dark min-h-screen flex flex-col relative shadow-2xl overflow-hidden ring-1 ring-black/5">
<div class="flex flex-col h-full absolute inset-0 z-10 bg-background-light dark:bg-background-dark transition-transform duration-300" id="main-view">
<header class="flex items-center justify-between px-6 py-5 sticky top-0 z-20 bg-background-light/95 dark:bg-[#1a0b2e]/95 backdrop-blur-md border-b border-gray-200 dark:border-white/5">
<div>
<p class="text-xs font-medium text-primary mb-0.5">관리자 모드</p>
<h1 class="text-xl font-bold tracking-tight text-slate-900 dark:text-white">학교 관리</h1>
</div>
<button aria-label="프로필" class="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors active:scale-95">
<span class="material-symbols-outlined text-gray-600 dark:text-gray-300" style="font-size: 24px;">person</span>
</button>
</header>
<div class="px-6 pt-2 pb-2 mt-2">
<div class="relative group">
<div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
<span class="material-symbols-outlined text-gray-400 group-focus-within:text-primary transition-colors" style="font-size: 20px;">search</span>
</div>
<input class="block w-full pl-11 pr-4 py-3.5 rounded-2xl border-none bg-white dark:bg-surface-dark text-slate-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/70 transition-all shadow-sm shadow-black/5 text-sm" placeholder="학교 이름 또는 코드 검색" type="text"/>
</div>
</div>
<div class="px-6 py-4 flex items-end justify-between">
<h2 class="text-base font-bold text-slate-800 dark:text-gray-200">등록된 학교</h2>
<span class="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-md border border-primary/20">Total 3</span>
</div>
<div class="flex-1 overflow-y-auto px-6 pb-28 space-y-4">
<div class="group relative bg-white dark:bg-surface-dark rounded-2xl p-5 shadow-sm shadow-black/5 border border-gray-100 dark:border-white/5 transition-all hover:border-primary/40 active:scale-[0.98] cursor-pointer" onclick="document.getElementById('detail-view').style.transform = 'translateX(0)'; document.getElementById('main-view').style.transform = 'translateX(-20%)';">
<div class="flex justify-between items-start gap-4">
<div class="flex items-start gap-4 flex-1 min-w-0">
<div class="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-[#3e2c66] flex items-center justify-center shrink-0 text-indigo-600 dark:text-indigo-300 ring-1 ring-inset ring-indigo-500/10">
<span class="material-symbols-outlined filled" style="font-variation-settings: 'FILL' 1;">school</span>
</div>
<div class="flex flex-col min-w-0 pt-0.5">
<h3 class="text-base font-bold truncate pr-2 text-slate-900 dark:text-white group-hover:text-primary transition-colors">서울과학고등학교</h3>
<div class="flex items-center gap-2 mt-1.5">
<span class="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400 font-mono">CODE</span>
<span class="text-xs text-gray-500 dark:text-gray-400 font-mono tracking-wide">S-2023-01</span>
</div>
</div>
</div>
<button class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 dark:text-gray-500 transition-colors">
<span class="material-symbols-outlined">chevron_right</span>
</button>
</div>
<div class="mt-4 pt-3 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
<div class="flex items-center gap-2">
<div class="flex -space-x-2">
<div class="w-6 h-6 rounded-full bg-gray-200 dark:bg-white/10 border-2 border-white dark:border-surface-dark flex items-center justify-center text-[10px] overflow-hidden">
<img alt="User" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUhvQoT9w4JpQrLJme5Tqn8ExYtoqZVPhFx7MRtzAvm-bxodRmx_Ya90AFfTwfZ_apK2JiwMQkujomtidPfAHzd9nSQbBspaeP8GE-0o_Jh-eRSqr_Luvx11nUx5rcFjpyd_18s13RIvvzPQLyGfMG_nvk5W6bVObqR5Tj8hw8R_ez06emMgsvKf8SKy79oMCdEe3zSC3T7k5S3hnIJL6A9z7tyLcGS-wJ46d0iKdF86XFuHK0A9o_W7L3XZ2o9C3Jwj8wDHf7jkqO"/>
</div>
<div class="w-6 h-6 rounded-full bg-gray-200 dark:bg-white/10 border-2 border-white dark:border-surface-dark flex items-center justify-center text-[10px] overflow-hidden">
<img alt="User" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnWvM_XcWIhGpzMjOYqY7ZTWb8ot5hST-iiCoXUTXq5KpJR4rRdISSKK-sjEKuI2b7FWm2hap7AcouZysM78bZBul9sEyQIvU8YM7BvT7Wh7Enyy1eAi11FS3NQgjkVCZyNrranJrfUdJyTJX1mr_MlqqwGpRxu4a1xJhCZZi3NdVXR-MaOJrJMo4TiN42k2oysXE3L3ss5ty2-Vp-nNs_KclKeGyp8Fr6G2aTqTs1ds9yD3CBtMzO7qLWBeWpOFBZxGJj3ZOtp8lZ"/>
</div>
<div class="w-6 h-6 rounded-full bg-gray-200 dark:bg-white/10 border-2 border-white dark:border-surface-dark flex items-center justify-center text-[10px] text-xs font-medium text-gray-500">+</div>
</div>
<span class="text-xs font-medium text-gray-500 dark:text-gray-400 ml-1">학생 128명</span>
</div>
<span class="text-xs font-semibold text-primary/90 hover:text-primary transition-colors flex items-center gap-0.5">
                                상세정보 <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
</span>
</div>
</div>
<div class="group relative bg-white dark:bg-surface-dark rounded-2xl p-5 shadow-sm shadow-black/5 border border-gray-100 dark:border-white/5 transition-all hover:border-primary/40 active:scale-[0.98] cursor-pointer" onclick="document.getElementById('detail-view').style.transform = 'translateX(0)'; document.getElementById('main-view').style.transform = 'translateX(-20%)';">
<div class="flex justify-between items-start gap-4">
<div class="flex items-start gap-4 flex-1 min-w-0">
<div class="w-12 h-12 rounded-xl bg-purple-50 dark:bg-[#4c3175] flex items-center justify-center shrink-0 text-purple-600 dark:text-purple-300 ring-1 ring-inset ring-purple-500/10">
<span class="material-symbols-outlined filled" style="font-variation-settings: 'FILL' 1;">history_edu</span>
</div>
<div class="flex flex-col min-w-0 pt-0.5">
<h3 class="text-base font-bold truncate pr-2 text-slate-900 dark:text-white group-hover:text-primary transition-colors">경기고등학교</h3>
<div class="flex items-center gap-2 mt-1.5">
<span class="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400 font-mono">CODE</span>
<span class="text-xs text-gray-500 dark:text-gray-400 font-mono tracking-wide">K-2023-05</span>
</div>
</div>
</div>
<button class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 dark:text-gray-500 transition-colors">
<span class="material-symbols-outlined">chevron_right</span>
</button>
</div>
<div class="mt-4 pt-3 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
<div class="flex items-center gap-2">
<div class="flex -space-x-2">
<div class="w-6 h-6 rounded-full bg-gray-200 dark:bg-white/10 border-2 border-white dark:border-surface-dark flex items-center justify-center text-[10px] overflow-hidden">
<img alt="User" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGoNFy4DeoJqJPeswvYHJdULvt3_c54w4MdC3NTkJtmyropDsSC4ZPTV406xIQGNtoKdwi8nRT-PSJyKlkIcdvG-Lz8grhctagB_bq_6xLnIh9zXhqYSqzqd5jjURMa5SMu_cOuC-cgRuSpnpegnHID_HlKaZ3plr9TzsgqAGFOToMq9g9JvBivesTXJdDaLBDgV4vKBgBAIcA4v0NEokWwKnCKtLW-W4a9ONCJM2h6wE7XV3Elu7k_8HtM0pPHiX9AlnY27d-wg6f"/>
</div>
<div class="w-6 h-6 rounded-full bg-gray-200 dark:bg-white/10 border-2 border-white dark:border-surface-dark flex items-center justify-center text-[10px] text-xs font-medium text-gray-500">+</div>
</div>
<span class="text-xs font-medium text-gray-500 dark:text-gray-400 ml-1">학생 85명</span>
</div>
<span class="text-xs font-semibold text-primary/90 hover:text-primary transition-colors flex items-center gap-0.5">
                                상세정보 <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
</span>
</div>
</div>
<div class="group relative bg-white dark:bg-surface-dark rounded-2xl p-5 shadow-sm shadow-black/5 border border-gray-100 dark:border-white/5 transition-all hover:border-primary/40 active:scale-[0.98] cursor-pointer" onclick="document.getElementById('detail-view').style.transform = 'translateX(0)'; document.getElementById('main-view').style.transform = 'translateX(-20%)';">
<div class="flex justify-between items-start gap-4">
<div class="flex items-start gap-4 flex-1 min-w-0">
<div class="w-12 h-12 rounded-xl bg-amber-50 dark:bg-[#594026] flex items-center justify-center shrink-0 text-amber-600 dark:text-amber-300 ring-1 ring-inset ring-amber-500/10">
<span class="material-symbols-outlined filled" style="font-variation-settings: 'FILL' 1;">account_balance</span>
</div>
<div class="flex flex-col min-w-0 pt-0.5">
<h3 class="text-base font-bold truncate pr-2 text-slate-900 dark:text-white group-hover:text-primary transition-colors">국립전통예술고등학교</h3>
<div class="flex items-center gap-2 mt-1.5">
<span class="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400 font-mono">CODE</span>
<span class="text-xs text-gray-500 dark:text-gray-400 font-mono tracking-wide">A-2024-02</span>
</div>
</div>
</div>
<button class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 dark:text-gray-500 transition-colors">
<span class="material-symbols-outlined">chevron_right</span>
</button>
</div>
<div class="mt-4 pt-3 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
<div class="flex items-center gap-2">
<span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
<span class="text-xs font-medium text-red-500 dark:text-red-400">승인 대기 중</span>
</div>
<span class="text-xs font-semibold text-primary/90 hover:text-primary transition-colors flex items-center gap-0.5">
                                상세정보 <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
</span>
</div>
</div>
</div>
<button aria-label="새 학교 등록" class="absolute bottom-8 right-6 w-14 h-14 bg-primary hover:bg-primary/90 rounded-full shadow-lg shadow-black/30 flex items-center justify-center text-primary-content transition-transform active:scale-95 z-10 border border-white/10">
<span class="material-symbols-outlined text-[32px]">add</span>
</button>
</div>
<div class="flex flex-col h-full absolute inset-0 z-30 bg-background-light dark:bg-background-dark translate-x-full transition-transform duration-300 shadow-2xl" id="detail-view">
<header class="flex items-center gap-3 px-4 py-4 sticky top-0 z-20 bg-background-light/95 dark:bg-[#1a0b2e]/95 backdrop-blur-md border-b border-gray-200 dark:border-white/5">
<button class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-slate-900 dark:text-white transition-colors -ml-1" onclick="document.getElementById('detail-view').style.transform = 'translateX(100%)'; document.getElementById('main-view').style.transform = 'translateX(0)';">
<span class="material-symbols-outlined">arrow_back</span>
</button>
<div class="flex-1 min-w-0">
<h1 class="text-lg font-bold truncate text-slate-900 dark:text-white">학교 상세 정보</h1>
</div>
<button class="text-sm font-medium text-primary px-3 py-1.5 rounded-lg hover:bg-primary/10 transition-colors">
                    편집
                </button>
</header>
<div class="flex-1 overflow-y-auto pb-10">
<div class="bg-white dark:bg-surface-dark/50 px-6 py-8 flex flex-col items-center justify-center border-b border-gray-100 dark:border-white/5">
<div class="w-24 h-24 rounded-2xl bg-indigo-50 dark:bg-[#3e2c66] flex items-center justify-center mb-5 text-indigo-600 dark:text-indigo-300 ring-4 ring-white dark:ring-[#2f1c4e]">
<span class="material-symbols-outlined text-[48px] filled" style="font-variation-settings: 'FILL' 1;">school</span>
</div>
<h2 class="text-2xl font-bold text-center text-slate-900 dark:text-white mb-1.5">서울과학고등학교</h2>
<div class="flex items-center gap-2 mt-2">
<span class="px-3 py-1 rounded-full bg-gray-100 dark:bg-white/10 text-xs font-mono font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/5">CODE: S-2023-01</span>
</div>
</div>
<div class="grid grid-cols-2 gap-px bg-gray-200 dark:bg-white/5 border-b border-gray-200 dark:border-white/5">
<div class="bg-white dark:bg-surface-dark p-6 flex flex-col items-center text-center">
<span class="text-3xl font-bold text-slate-900 dark:text-white mb-1">128</span>
<span class="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">등록된 학생</span>
</div>
<div class="bg-white dark:bg-surface-dark p-6 flex flex-col items-center text-center">
<span class="text-3xl font-bold text-slate-900 dark:text-white mb-1">4</span>
<span class="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">진행 중인 반</span>
</div>
</div>
<div class="p-6 space-y-8">
<div class="space-y-4">
<h3 class="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
<span class="material-symbols-outlined text-primary text-lg">info</span>
                            기본 정보
                        </h3>
<div class="bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden">
<div class="flex items-center justify-between p-4 border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
<span class="text-sm text-gray-500 dark:text-gray-400">등록일</span>
<span class="text-sm font-medium text-slate-900 dark:text-white">2023. 03. 15</span>
</div>
<div class="flex items-center justify-between p-4 border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
<span class="text-sm text-gray-500 dark:text-gray-400">담당자</span>
<div class="flex items-center gap-2">
<div class="w-5 h-5 rounded-full bg-primary/20 text-primary-content text-[10px] flex items-center justify-center font-bold">김</div>
<span class="text-sm font-medium text-slate-900 dark:text-white">김철수 선생님</span>
</div>
</div>
<div class="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
<span class="text-sm text-gray-500 dark:text-gray-400">연락처</span>
<span class="text-sm font-medium text-slate-900 dark:text-white font-mono">02-123-4567</span>
</div>
</div>
</div>
<div class="space-y-4">
<h3 class="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
<span class="material-symbols-outlined text-primary text-lg">lock</span>
                            보안 설정
                        </h3>
<div class="bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-white/5 p-5">
<div class="flex items-center justify-between mb-4">
<span class="text-sm font-medium text-slate-900 dark:text-white">접속 비밀번호</span>
<button class="text-xs text-primary font-bold hover:underline">변경하기</button>
</div>
<div class="flex items-center justify-between bg-gray-50 dark:bg-black/20 p-4 rounded-xl border border-gray-100 dark:border-white/5">
<span class="text-lg tracking-[0.3em] text-slate-800 dark:text-gray-200 font-mono">••••••</span>
<span class="material-symbols-outlined text-gray-400 text-sm">visibility_off</span>
</div>
<p class="text-xs text-gray-500 dark:text-gray-400 mt-3 flex items-start gap-1.5">
<span class="material-symbols-outlined text-[14px] mt-0.5">info</span>
                                학교 코드로 접속 시 필요한 6자리 비밀번호입니다.
                            </p>
</div>
</div>
<div class="pt-4 pb-6 space-y-3">
<button class="w-full py-4 rounded-xl border border-gray-200 dark:border-white/10 text-slate-700 dark:text-gray-200 font-bold text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors flex items-center justify-center gap-2 group">
<span class="material-symbols-outlined text-lg text-gray-400 group-hover:text-primary transition-colors">download</span>
                            활동 데이터 내보내기 (Excel)
                        </button>
<button class="w-full py-4 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 font-bold text-sm hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2">
<span class="material-symbols-outlined text-lg">delete</span>
                            학교 삭제
                        </button>
</div>
</div>
</div>
</div>
<div class="absolute inset-0 z-50 pointer-events-none flex flex-col justify-end">
<div class="absolute inset-0 bg-black/60 opacity-0 pointer-events-auto transition-opacity" style="display: none;"></div>
<div class="bg-background-light dark:bg-surface-dark rounded-t-[2rem] p-8 shadow-2xl transform translate-y-full transition-transform duration-300 ease-out pointer-events-auto border-t border-white/10 w-full ring-1 ring-white/10">
<div class="w-12 h-1.5 bg-gray-300 dark:bg-white/10 rounded-full mx-auto mb-8"></div>
<h3 class="text-xl font-bold mb-8 text-slate-900 dark:text-white flex items-center gap-2">
<span class="material-symbols-outlined text-primary">add_circle</span>
                학교 추가
            </h3>
<div class="space-y-6">
<div class="space-y-2">
<label class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">학교 이름</label>
<input class="w-full px-4 py-4 rounded-xl bg-gray-100 dark:bg-black/20 border-none focus:ring-2 focus:ring-primary text-slate-900 dark:text-white placeholder-gray-400 transition-all" placeholder="예: 서울과학고등학교" type="text"/>
</div>
<div class="space-y-2">
<label class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">학교 코드</label>
<div class="flex gap-3">
<input class="w-full px-4 py-4 rounded-xl bg-gray-100 dark:bg-black/20 border-none focus:ring-2 focus:ring-primary text-slate-900 dark:text-white font-mono" readonly="" type="text" value="S-2024-X9"/>
<button class="px-5 rounded-xl bg-gray-200 dark:bg-white/5 hover:bg-gray-300 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition-colors">
<span class="material-symbols-outlined">refresh</span>
</button>
</div>
</div>
<div class="space-y-2">
<label class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">접속 비밀번호</label>
<div class="relative">
<input class="w-full px-4 py-4 rounded-xl bg-gray-100 dark:bg-black/20 border-none focus:ring-2 focus:ring-primary text-slate-900 dark:text-white font-mono" type="password" value="123456"/>
<button class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
<span class="material-symbols-outlined">visibility</span>
</button>
</div>
</div>
<div class="pt-6 flex gap-4">
<button class="flex-1 py-4 rounded-xl font-bold text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-white/5 hover:bg-gray-300 dark:hover:bg-white/10 transition-colors">취소</button>
<button class="flex-1 py-4 rounded-xl font-bold text-primary-content bg-primary hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">저장하기</button>
</div>
</div>
</div>
</div>
</div>

</body></html>