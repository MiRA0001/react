import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post';
import ImageUpload from './ImageUpload';
import { db, auth } from './firebase';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Input } from '@material-ui/core';
import HeaderImage from "../src/resources/images/header.jpg";
import ProfilePic from "../src/resources/images/icon.png";
import Avatar from "@material-ui/core/Avatar";

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


//We use the setPosts atribute to change the value of the posts collection
function App() {
  const [posts, setPosts] = useState([
    /* Here we can add somo values manually if necessary
    { 
      username: "Emilia Fried",
      description: "I love flowers",
      imageUrl: "https://i.pinimg.com/originals/4b/a7/12/4ba71236899e6b8151ada5b7b9368be1.jpg"
    },
    {
      username: "Fermando Carmino",
      description: "See some bears",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKVd12roMUXbwq6UgMi3sbopi0vmnPPaYhGA&usqp=CAU"
    }, {
      username: "Antonio Figura",
      description: "Here is a new picture!!",
      imageUrl: "https://cdn.betterttv.net/emote/5e2bac6ebca2995f13fc1379/3x"
    }*/
  ]);

  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  //useEffect Runs a piece of code based on a specific condition
  useEffect(() => {
    //lisen for any authentication changes
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //user has logged in...
        console.log(authUser);
        setUser(authUser);
        //This line give us the username if we are already logged in and then refresh the page
        setUsername(authUser.displayName);
      } else {
        //user has logged out...
        setUser(null);
      }
    })

    return () => {
      //perform some cleanup actions, detaches the listener so we don't have duplicates
      unsubscribe();
    }

  }, [user, username])

  useEffect(() => {
    //Arrow function
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      //Every time a post change we take a snapshot
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })))
    })
  }, [])//We put the conditions here

  const signUp = (event) => {
    event.preventDefault();

    auth.createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username
        })
      })
      .catch((error) => alert(error.message));

    setOpen(false);
  }

  const signIn = (event) => {
    event.preventDefault();

    auth.signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

    setOpenSignIn(false);
  }



  return (
    <div className="app">

      {/* Title to the accion  */}
      {/* Description Input  */}
      {/* File picker */}
      {/* Post button */}

      <Modal
        open={open}
        onClose={() => setOpen(false)}>

        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img className="app__headerImage"
                src={HeaderImage}
                alt="" />
            </center>

            <Input
              required id="standard-required"
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signUp}>Sign Up</Button>
          </form>
        </div>
      </Modal>


      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}>

        <div style={modalStyle} className={classes.paper}>

          <form className="app__signup">
            <center>
              <img className="app__headerImage"
                src={HeaderImage}
                alt="" />
            </center>

            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" onClick={signIn}>Sign In</Button>
          </form>
        </div>
      </Modal>


      <div className="app__header">

        <img className="app__headerImage"
          src={HeaderImage}
          alt="" />
        <h1 className="app__headerTitle">My Social Web App</h1>

        <div className="app__headerButtons">
          {user ? (
            <Button onClick={() => auth.signOut()}>Logout</Button>
          ) : (
              <div>
                <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
                <Button onClick={() => setOpen(true)}>Sign Up</Button>
              </div>
            )}
        </div>

        <div className="app__headerUser">
          <Avatar className="post__avatar"
            alt={username}
            src={ProfilePic}
          />
          {user ? (
            <h3>{username}</h3>
          ) : (
              <h3>...</h3>
            )}
        </div>

      </div>

       {user ? (
         <ImageUpload username={user.displayName} />
       ):(
         <h3 className="app__addpostAlternative">Login now to publish your posts</h3>
       )}
      

      {//With the key value React will only refresh the updated posts
        posts.map(({ id, post }) => (
          <Post key={id} postId={id} user={user} username={post.username} description={post.description} imageUrl={post.imageUrl} />
        ))
      }

    </div>
  );
}

export default App;
