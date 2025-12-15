import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs,
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore'
import { db } from './config'

// 사용자 활동지 데이터 저장
export const saveActivityData = async (userId, activityId, data) => {
  try {
    if (!db) {
      return { success: false, error: 'Firestore가 초기화되지 않았습니다. Firebase Console에서 Firestore를 활성화해주세요.' }
    }
    
    if (!userId) {
      return { success: false, error: '사용자 ID가 없습니다.' }
    }
    
    const activityRef = doc(db, 'users', userId, 'activities', activityId)
    
    await setDoc(activityRef, {
      ...data,
      completed: true, // 완료 상태 표시
      updatedAt: serverTimestamp()
    }, { merge: true })
    
    return { success: true }
  } catch (error) {
    console.error('Firestore 저장 오류:', error)
    return { success: false, error: error.message || '저장 중 오류가 발생했습니다.' }
  }
}

// 활동지 완료 상태 확인
export const checkActivityCompleted = async (userId, activityId) => {
  try {
    const activityRef = doc(db, 'users', userId, 'activities', activityId)
    const docSnap = await getDoc(activityRef)
    
    if (docSnap.exists()) {
      const data = docSnap.data()
      return { success: true, completed: data.completed || false }
    } else {
      return { success: true, completed: false }
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// 사용자 활동지 데이터 불러오기
export const getActivityData = async (userId, activityId) => {
  try {
    const activityRef = doc(db, 'users', userId, 'activities', activityId)
    const docSnap = await getDoc(activityRef)
    
    if (docSnap.exists()) {
      return { success: true, data: docSnap.data() }
    } else {
      return { success: true, data: null }
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// 모든 활동지 완료 상태 한 번에 가져오기
export const getAllActivityStatus = async (userId) => {
  try {
    if (!db) {
      return { success: false, error: 'Firestore가 초기화되지 않았습니다.', status: {} }
    }
    const activitiesRef = collection(db, 'users', userId, 'activities')
    const querySnapshot = await getDocs(activitiesRef)
    
    const status = {}
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      status[doc.id] = data.completed || false
    })
    
    return { success: true, status }
  } catch (error) {
    return { success: false, error: error.message, status: {} }
  }
}

// 모든 활동지 데이터 불러오기
export const getAllActivityData = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId)
    const userDoc = await getDoc(userRef)
    
    if (userDoc.exists()) {
      return { success: true, data: userDoc.data() }
    } else {
      return { success: true, data: null }
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

