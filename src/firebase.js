// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from 'firebase';

const firebaseApp =firebase.initializeApp( {
    apiKey: "AIzaSyBTmcY2H7rtS2VGzEk2WJSEce12QlNrYbc",
    authDomain: "instagram-clone-react-66914.firebaseapp.com",
    projectId: "instagram-clone-react-66914",
    storageBucket: "instagram-clone-react-66914.appspot.com",
    messagingSenderId: "924766152842",
    appId: "1:924766152842:web:d9fa979e9c2e47bcd82573",
    measurementId: "G-TCRSYRQ0TB"
  });
  const db=firebaseApp.firestore();
  const auth=firebase.auth();
  const storage=firebase.storage();

  export {db,auth,storage};
  //export default db;