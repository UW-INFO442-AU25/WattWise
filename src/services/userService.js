import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs 
} from 'firebase/firestore'
import { db } from '../firebase'

/**
 * Save or update user profile data
 * @param {string} userId - The user's Firebase Auth UID
 * @param {Object} userData - User data to save
 * @param {string} userData.name - User's display name
 * @param {string} userData.email - User's email
 * @param {string} userData.photoURL - User's profile photo URL (optional)
 */
export async function saveUserProfile(userId, userData) {
  try {
    const userRef = doc(db, 'users', userId)
    await setDoc(userRef, {
      ...userData,
      updatedAt: new Date().toISOString()
    }, { merge: true }) // merge: true allows partial updates
    console.log('User profile saved successfully')
  } catch (error) {
    console.error('Error saving user profile:', error)
    throw error
  }
}

/**
 * Get user profile data
 * @param {string} userId - The user's Firebase Auth UID
 * @returns {Object|null} User data or null if not found
 */
export async function getUserProfile(userId) {
  try {
    const userRef = doc(db, 'users', userId)
    const userSnap = await getDoc(userRef)
    
    if (userSnap.exists()) {
      return userSnap.data()
    } else {
      console.log('No user profile found')
      return null
    }
  } catch (error) {
    console.error('Error getting user profile:', error)
    throw error
  }
}

/**
 * Save quiz results for a user
 * @param {string} userId - The user's Firebase Auth UID
 * @param {Array} results - Array of quiz recommendations
 * @param {Object} quizAnswers - The original quiz answers (optional)
 */
export async function saveQuizResults(userId, results, quizAnswers = {}) {
  try {
    const userRef = doc(db, 'users', userId)
    const quizResult = {
      results: results,
      quizAnswers: quizAnswers,
      completedAt: new Date().toISOString()
    }
    
    // Get existing user data
    const userSnap = await getDoc(userRef)
    const existingData = userSnap.exists() ? userSnap.data() : {}
    
    // Add quiz result to history (array of quiz results)
    const quizHistory = existingData.quizHistory || []
    quizHistory.push(quizResult)
    
    // Update user document
    await updateDoc(userRef, {
      quizHistory: quizHistory,
      lastQuizCompleted: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
    
    console.log('Quiz results saved successfully')
  } catch (error) {
    console.error('Error saving quiz results:', error)
    throw error
  }
}

/**
 * Get user's quiz history
 * @param {string} userId - The user's Firebase Auth UID
 * @returns {Array} Array of quiz results
 */
export async function getUserQuizHistory(userId) {
  try {
    const userRef = doc(db, 'users', userId)
    const userSnap = await getDoc(userRef)
    
    if (userSnap.exists()) {
      const userData = userSnap.data()
      return userData.quizHistory || []
    } else {
      return []
    }
  } catch (error) {
    console.error('Error getting quiz history:', error)
    throw error
  }
}

/**
 * Get the most recent quiz results for a user
 * @param {string} userId - The user's Firebase Auth UID
 * @returns {Object|null} Most recent quiz result or null
 */
export async function getLatestQuizResults(userId) {
  try {
    const quizHistory = await getUserQuizHistory(userId)
    if (quizHistory.length > 0) {
      // Return the most recent quiz (last in array)
      return quizHistory[quizHistory.length - 1]
    }
    return null
  } catch (error) {
    console.error('Error getting latest quiz results:', error)
    throw error
  }
}

/**
 * Save checklist progress for a user
 * @param {string} userId - The user's Firebase Auth UID
 * @param {Object} checkedItems - Object mapping item indices to checked state
 */
export async function saveChecklistProgress(userId, checkedItems) {
  try {
    const userRef = doc(db, 'users', userId)
    await updateDoc(userRef, {
      checklistProgress: checkedItems,
      checklistUpdatedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
    console.log('Checklist progress saved successfully')
  } catch (error) {
    console.error('Error saving checklist progress:', error)
    throw error
  }
}

/**
 * Get checklist progress for a user
 * @param {string} userId - The user's Firebase Auth UID
 * @returns {Object|null} Checklist progress object or null
 */
export async function getChecklistProgress(userId) {
  try {
    const userRef = doc(db, 'users', userId)
    const userSnap = await getDoc(userRef)
    
    if (userSnap.exists()) {
      const userData = userSnap.data()
      return userData.checklistProgress || null
    }
    return null
  } catch (error) {
    console.error('Error getting checklist progress:', error)
    throw error
  }
}

