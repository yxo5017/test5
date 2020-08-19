import * as firebase from 'firebase/app';
import 'firebase/firestore';

var firebaseConfig = {
  apiKey: "AIzaSyBiQ3O0kdfaXuSZQCn4RGESQjvJDhIuy9s",
  authDomain: "to-do-list-850d9.firebaseapp.com",
  databaseURL: "https://to-do-list-850d9.firebaseio.com",
  projectId: "to-do-list-850d9",
  storageBucket: "to-do-list-850d9.appspot.com",
  messagingSenderId: "372203357015",
  appId: "1:372203357015:web:ca6fb4f37d3b8cf9e6f412",
  measurementId: "G-JZNHLQSN8Y"
};
// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);


//export firestore database
export default firebaseApp.firestore();
