import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import { storage, db } from './firebase';
import firebase from 'firebase';
import './ImageUpload.css';
function ImageUpload({username}) {
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState(null);
 
    const [progress, setProgress] = useState(0);

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0])
        }
    }
    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                )
                setProgress(progress)
            },
            (error) => { console.log(error.message) },
            () => {
                storage.ref('images')
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        //post image inside db
                            db.collection("posts").add({
                                timestamp:firebase.firestore.FieldValue.serverTimestamp(),
                                caption:caption,
                                imageUrl:url,
                                username:username,
                                likes:[]
                            });
                            setProgress(0);
                            setCaption("");
                            setImage(null)
                        
                    })
            }
        )

    }
    return (
        <div className="imageupload">
            <progress className="imageupload_progress" value={progress} max="100"></progress>
            <input type="text" placeholder="Enter a Caption" onChange={(e) => setCaption(e.target.value)} value={caption} />
            <input type="file" onChange={handleChange} />
            <Button type="submit" className="imageupload__button" onClick={handleUpload}>Upload</Button>


        </div>
    )
}

export default ImageUpload
