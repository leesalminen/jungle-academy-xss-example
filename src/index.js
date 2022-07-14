import 'babel-polyfill'
import { initializeApp } from "firebase/app"
import { getFirestore, collection, getDocs, query, where, onSnapshot, addDoc } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDKlGhb8voPdKxCfEI-7KC6zj9PoU7itUo",
  authDomain: "bitcoin-jungle-maps.firebaseapp.com",
  projectId: "bitcoin-jungle-maps",
  storageBucket: "bitcoin-jungle-maps.appspot.com",
  messagingSenderId: "962016469889",
  appId: "1:962016469889:web:f331a8687c201f86f4fe80"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const listEl = document.getElementById('list')
const formEl = document.getElementById('addForm')

formEl.addEventListener('submit', (e) => {
    e.preventDefault()

    addComment()
})

const addListener = async () => {
    const commentsCol = collection(db, 'comments');
    const q = query(commentsCol)

    const observer = onSnapshot(q, (querySnapshot => {
        listEl.innerHTML = ''

        const commentsList = querySnapshot.docs.map(doc => {
            const comment = doc.data()

            const itemEl = document.createElement('li')
            itemEl.classList.add("p-3");
            console.log(comment.comment)
            itemEl.innerHTML = comment.comment

            listEl.append(itemEl)
        })
    }))
}

const addComment = async () => {
    const comment = document.getElementById('add').value
    const docRef = await addDoc(collection(db, "comments"), {comment: comment})

    comment.value = ''
}

addListener()