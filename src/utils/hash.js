// 비밀번호를 SHA-256 hex 문자열로 변환 (평문 대신 저장/비교용)
export async function sha256Hex(text) {
  const data = new TextEncoder().encode(String(text))
  const digest = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}
