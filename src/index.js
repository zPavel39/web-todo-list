import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {  AppContext } from './context/context'
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import './index.css';


firebase.initializeApp({
  apiKey: "AIzaSyB8enjjYTmKLIVehpQk8Gz4-_Wxk9GW0AI",
  authDomain: "web-todo-project.firebaseapp.com",
  databaseURL: "https://web-todo-project-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "web-todo-project",
  storageBucket: "web-todo-project.appspot.com",
  messagingSenderId: "690404954659",
  appId: "1:690404954659:web:484b713721e80933c89796"
});



const ref = firebase.firestore().collection('tasks')
console.log('ref', ref)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppContext.Provider value={{
      firebase,
      ref,
    }}>
      <App />
    </AppContext.Provider>
  </React.StrictMode>
);