// 웹앱 src/utils/hash.js의 앱 버전 (휴대폰에는 crypto.subtle이 없어서 expo-crypto 사용)
import * as Crypto from 'expo-crypto'

export async function sha256Hex(text) {
  const hex = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, String(text), {
    encoding: Crypto.CryptoEncoding.HEX,
  })
  return hex.toLowerCase()
}
