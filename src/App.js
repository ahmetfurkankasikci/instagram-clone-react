import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post';
import { db, auth } from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import validator from 'validator'
function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


function App() {
  const classes = useStyles()
  const [modalStyle] = useState(getModalStyle);

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);
  const [like,setLike]=useState(false)
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //user has logged in
        setUser(authUser)

      } else {
        //user has logged out
        setUser(null)
      }
    })
    return () => {
      //perform some cleanup actions
      unsubscribe();
    }
  }, [user, username])

  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })))
    })
  }, [])

  const signUp = (e) => {
    e.preventDefault();
    auth.createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username
        })
      })
      .catch((err) => alert(err.message))
    setOpen(false);
  }
  const signIn = (e) => {
    e.preventDefault();
    auth.signInWithEmailAndPassword(email, password)
      .catch((err) => alert(err.message))
    setOpenSignIn(false);
  }
  return (
    <div className="app">

      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="..." />
            </center>
            <Input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" />
            <Input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" />
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" />
            <Button type="submit" onClick={signUp}>Sign Up</Button>
          </form>

        </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img className="app__headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="..." />
            </center>
            <Input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" />
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" />
            <Button type="submit" onClick={signIn}>Sign In</Button>
          </form>

        </div>
      </Modal>


      <div className="app__header">
        <img className="app_headerImage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="..." />
        {
          user ? (
            <Button onClick={() => { auth.signOut() }}>Log Out</Button>
          ) : (
            <div className="app__loginContainer">
              <Button onClick={() => { setOpenSignIn(true) }}>Sign In</Button>
              <Button onClick={() => { setOpen(true) }}>Sign Up</Button>
            </div>
          )
        }
      </div>
      <div className="app__upload">
        {user?.displayName ? (<ImageUpload username={user.displayName} />) : (<h3>Login to Upload</h3>)}
      </div>
      <div className="app__posts">
        {
          user ?(
            posts.map(({ id, post }) => (
              <Post user={user} key={id} postId={id} username={post.username} imageUrl={post.imageUrl} caption={post.caption} likes={post.likes} like={post.likes.includes(user?.displayName)} />
            ))
          ):(
            posts.map(({ id, post }) => (
              <Post user={null} key={id} postId={id} username={post.username} imageUrl={post.imageUrl} caption={post.caption} likes={post.likes} like={post.likes.includes(user?.displayName)} />
            ))
          )
        }
      </div>




    </div>
  );
}

export default App;
