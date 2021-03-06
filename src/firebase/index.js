import firebase from 'firebase'
// --- Helpers ---
import _forEach from 'lodash/forEach'
import _debounce from 'lodash/debounce'

// Firebase configuration
const productionConfig = {
  apiKey: 'AIzaSyBbVjhaPDhEuPlsLyUaZkZ6c7_wDPcdEo8',
  authDomain: 'magic-collection-8b310.firebaseapp.com',
  databaseURL: 'https://magic-collection-8b310.firebaseio.com',
  projectId: 'magic-collection-8b310',
  storageBucket: 'magic-collection-8b310.appspot.com',
  messagingSenderId: '2571027304'
}

const developmentConfig = {
  apiKey: 'AIzaSyBi1hsBdyJgM9w2UW2pOOC-W9oUwOe7nRc',
  authDomain: 'magic-collection-dev.firebaseapp.com',
  databaseURL: 'https://magic-collection-dev.firebaseio.com',
  projectId: 'magic-collection-dev',
  storageBucket: 'magic-collection-dev.appspot.com',
  messagingSenderId: '1073001376184'
}

const config = process.env.NODE_ENV === 'production' ? productionConfig : developmentConfig

export const app = firebase.initializeApp(config)
export const auth = firebase.auth()
export const database = firebase.database()

// List of available authentication providers
const providers = {
  google: new firebase.auth.GoogleAuthProvider(),
  facebook: new firebase.auth.FacebookAuthProvider(),
  twitter: new firebase.auth.TwitterAuthProvider(),
  github: new firebase.auth.GithubAuthProvider()
}

// ---------- GENERIC STUFF ----------

// Generic 'get' function
export const firebaseGetData = (table, id) =>
  database.ref(table).child(id).once('value').then(snapshot => {
    const data = snapshot.val()
    return data ? { success: true, data } : { error: 'No data found' }
  })

// Generic 'set' function
export const firebaseSetData = (table, id, data) =>
  database
    .ref(table)
    .child(id)
    .set(data)
    .then(() => ({ success: true }))
    .catch(response => ({ error: response.message }))

// Generic 'push' function
export const firebasePushData = (table, data) =>
  database
    .ref(table)
    .push()
    .set(data)
    .then(() => ({ success: true }))
    .catch(response => ({ error: response.message }))

// Generic 'update' function
export const firebaseUpdateData = (table, id, data) =>
  database
    .ref(table)
    .child(id)
    .update(data)
    .then(() => ({ success: true }))
    .catch(response => ({ error: response.message }))

// ---------- AUTHENTICATION ----------

// Generic email and password sign in
export const firebaseSignIn = (email, password) =>
  auth
    .signInWithEmailAndPassword(email, password)
    .then(response => ({ success: true, id: response.uid, response }))
    .catch(response => ({ error: response.message, response }))

// Generic email and password sign up
export const firebaseSignUp = (email, password) =>
  auth
    .createUserWithEmailAndPassword(email, password)
    .then(response => ({ success: true, id: response.uid }))
    .catch(response => ({ error: response.message }))

// Sign out
export const firebaseSignOut = () =>
  auth.signOut().then(() => ({ success: true })).catch(response => ({ error: response.message }))

// Provider sign in
export const firebaseProviderSignIn = providerName =>
  auth
    .signInWithPopup(providers[providerName])
    .then(response => ({ success: true, user: response.user }))
    .catch(response => ({ error: response.message }))

// ---------- PROFILE ----------

export const updateProfile = userProfile =>
  auth.currentUser
    .updateProfile({
      displayName: userProfile.displayName,
      photoURL: userProfile.photoURL
    })
    .then(
      () => {
        console.log('Success')
      },
      error => {
        console.log('Error', error)
      }
    )

export const updateEmail = email =>
  auth.currentUser.updateEmail(email).then(
    () => {
      console.log('Success')
    },
    error => {
      console.log('Error', error)
    }
  )

// ---------- USER DATA UPDATING ----------

export const updateUserData = user => {
  if (!user.uid) return
  firebaseUpdateData('Users', user.uid, user)
}

export const updateAndReturnUserSettings = settings => {
  firebaseUpdateData('Users', auth.currentUser.uid, { settings })
  return settings
}

// TODO: this is not used at the moment
export const saveCollection = collection => {
  const reducedCollection = {}
  _forEach(collection, singleCard => {
    reducedCollection[singleCard.id] = singleCard.formatForFirebase()
  })
  return firebaseUpdateData('Collections', auth.currentUser.uid, reducedCollection)
}

export const updateCardInDatabase = _debounce(card => {
  // Update the card if total number is more than 0
  if (card.cardsInCollection > 0) {
    return firebaseUpdateData(
      'Collections',
      `${auth.currentUser.uid}/${card.name}`,
      card.formatForFirebase()
    )
  }
  // In other case, remove the card completelly
  return firebaseSetData('Collections', `${auth.currentUser.uid}/${card.name}`, null)
}, 1000)

export const loadCollection = () => {
  return firebaseGetData('Collections', auth.currentUser.uid)
}
