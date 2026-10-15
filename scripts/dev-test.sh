#!/bin/sh
# 테스트 모드 실행: 로컬 Firebase 에뮬레이터 + 테스트 데이터 + 개발 서버
# 실제 Firebase 프로젝트에는 접근하지 않습니다 (demo-palace 프로젝트).
set -e

# Java가 PATH에 없으면 Homebrew로 설치된 OpenJDK 사용 (Firestore 에뮬레이터에 필요)
if ! java -version >/dev/null 2>&1; then
  if command -v brew >/dev/null 2>&1; then
    for formula in openjdk@21 openjdk; do
      JDK_BIN="$(brew --prefix "$formula" 2>/dev/null)/bin"
      if [ -x "$JDK_BIN/java" ]; then
        PATH="$JDK_BIN:$PATH"
        export PATH
        break
      fi
    done
  fi
fi

if ! java -version >/dev/null 2>&1; then
  echo "Java가 필요합니다. 'brew install openjdk@21'로 설치한 뒤 다시 실행해주세요."
  exit 1
fi

exec firebase emulators:exec --only auth,firestore --project demo-palace --ui \
  "node scripts/seed-emulator.mjs && vite --mode emulator"
