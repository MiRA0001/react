import React, { useState } from 'react';
import { Button, TextareaAutosize  } from '@material-ui/core';
import firebase from "firebase";
import { db, storage } from './firebase';
import './ImageUpload.css';


function ImageUpload({username}) {

    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [progress, setProgress] = useState(0);

    const handleUpload = (event) => {
        //We create a new folder for images if it doesn't exist yet and upload the image
        const uploadTask = storage.ref(`images/${image.name}`).put(image);

        uploadTask.on(
            "stage_change",
            (snapshot) =>{
                //Progress bar function...
                const progress = Math.round(
                    (snapshot.bytesTransferred /snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) => {
                //Error function...
                console.log(error);
                alert(error.message);
            },
            () => {
                //Complete function
                //Here we convert the image to an url 
                storage.ref("images")
                .child(image.name)
                .getDownloadURL()
                .then( url => {
                    //Post image inside db
                    db.collection("posts").add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        description: description,
                        imageUrl: url,
                        username: username 
                    })

                    setProgress(0);
                    setDescription("");
                    setImage(null);

                })
            }
        )
    }

    const handleChange = (event) =>{
        if(event.target.files[0]){
            setImage(event.target.files[0]);
        }
    }

    return (
        <div className="app__newpost">
            <h4>Upload an image an then select publish to add a new post</h4>
            
            <label >Description</label>
            <TextareaAutosize
                placeholder="Describe your post"
                type="text"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
            />
            <progress max="100" value={progress}></progress>
            <input type="file" onChange={handleChange}/>
            <Button type="submit" onClick={handleUpload}>Publish</Button>

        </div>
    )
}

export default ImageUpload;