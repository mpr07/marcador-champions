// Substitueix amb les teves credencials de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyANZeXPg470XnjLpbmgA8CgFNaBrO3vP5w",
    authDomain: "marcador-champions.firebaseapp.com",
    databaseURL: "https://marcador-champions-default-rtdb.firebaseio.com",
    projectId: "marcador-champions",
    storageBucket: "marcador-champions.firebasestorage.app",
    messagingSenderId: "405698178117",
    appId: "1:405698178117:web:046e78abb0a0c4fef3472c",
    measurementId: "G-SPE2RFEK1F"
  };

firebase.initializeApp(firebaseConfig);
const db = firebase.database();