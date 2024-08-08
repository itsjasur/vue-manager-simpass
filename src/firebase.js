import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'

const app = initializeApp({
  apiKey: 'AIzaSyAZK-CRaELVLTzRgWT7ESpUCHuGhtbM8w4',
  authDomain: 'simpassplatform.firebaseapp.com',
  projectId: 'simpassplatform',
  storageBucket: 'simpassplatform.appspot.com',
  messagingSenderId: '815804342158',
  appId: '1:815804342158:web:6fee3a1573be5005290edf',
  measurementId: 'G-0N60MS076C',
})

const messaging = getMessaging(app)

export { messaging, getToken, onMessage }
