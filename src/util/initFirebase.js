const firebaseConfig = require('../../firebase.json');
const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');

initializeApp(firebaseConfig);
const db = getFirestore();

exports.db = db;