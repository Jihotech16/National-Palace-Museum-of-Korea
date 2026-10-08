// 웹앱의 src 폴더(문제 데이터, 채점, Firebase 함수, 유물 사진)를 앱에서도 그대로 함께 씁니다.
const fs = require('fs')
const path = require('path')
const { getDefaultConfig } = require('expo/metro-config')

const projectRoot = __dirname
const sharedRoot = path.resolve(projectRoot, '..', 'src')
const appOrigin = path.join(projectRoot, 'src', 'index.js')

const config = getDefaultConfig(projectRoot)
config.watchFolders = [...(config.watchFolders || []), sharedRoot]

// 개발 서버: 한글 이름 사진은 iOS가 주소를 한 번 더 인코딩해서(%2F -> %252F) ../src 사진을 못 찾음. 되돌려 줌
const rewriteRequestUrl = config.server.rewriteRequestUrl
config.server.rewriteRequestUrl = (url) => {
  if (url.includes('unstable_path=') && url.includes('%25')) url = url.replace(/%25([0-9A-Fa-f]{2})/g, '%$1')
  return rewriteRequestUrl ? rewriteRequestUrl(url) : url
}

// 웹 전용 파일 대신 앱용 파일로 바꿔 끼우는 목록
const swaps = {
  [path.join(sharedRoot, 'firebase', 'config.js')]: path.join(projectRoot, 'src', 'lib', 'firebase.js'),
  [path.join(sharedRoot, 'utils', 'hash.js')]: path.join(projectRoot, 'src', 'lib', 'hash.js'),
}

// 개발용: MUSEUM_MOCK_DIR을 주면 Firebase 대신 가짜 데이터로 화면만 확인
const mockDir = process.env.MUSEUM_MOCK_DIR
if (mockDir) {
  config.watchFolders.push(mockDir)
  for (const [from, file] of [
    [path.join(sharedRoot, 'firebase', 'auth.js'), 'auth.js'],
    [path.join(sharedRoot, 'firebase', 'firestore.js'), 'firestore.js'],
    [path.join(projectRoot, 'src', 'lib', 'data.js'), 'data.js'],
  ]) {
    if (fs.existsSync(path.join(mockDir, file))) swaps[from] = path.join(mockDir, file)
  }
}

config.resolver.resolveRequest = (context, moduleName, platform) => {
  const origin = context.originModulePath
  let ctx = context
  let name = moduleName
  if (name.startsWith('@shared/')) {
    name = path.join(sharedRoot, name.slice('@shared/'.length))
  } else if (origin.startsWith(sharedRoot + path.sep) && !name.startsWith('.')) {
    // 웹앱 폴더의 node_modules(웹용 firebase 등)가 아니라 앱의 node_modules에서 찾게 함
    ctx = { ...context, originModulePath: appOrigin }
  }
  const result = context.resolveRequest(ctx, name, platform)
  if (result.type === 'sourceFile' && swaps[result.filePath] && swaps[result.filePath] !== origin) {
    return { type: 'sourceFile', filePath: swaps[result.filePath] }
  }
  return result
}

module.exports = config
