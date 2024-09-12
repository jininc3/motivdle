// Testing.js
import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';  // Assuming Firebase config is in this file

function Testing() {
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const docName = 'David Goggins';  // The document name you want to query in Firestore

  useEffect(() => {
    const fetchImage = async () => {
      try {
        // Fetch the Firestore document from the "quotes" collection
        const docRef = doc(db, "quotes", docName);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // Get the icon field value (e.g., "denzel.png")
          const { icon } = docSnap.data();

          // Construct the public URL for the image in the "motivdle-images" bucket
          const bucketUrl = `https://storage.googleapis.com/motivdle-images/${icon}`;
          setImageUrl(bucketUrl);  // Update the state with the image URL
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document: ", error);
      } finally {
        setLoading(false);  // Set loading to false after fetch completes
      }
    };

    fetchImage();
  }, [docName]);

  return (
    <div>
      <h1>Welcome to the Testing Page</h1>
      <p>This is the content of the testing page.</p>

      {/* Display the image if available, otherwise show a loading message */}
      {loading ? (
        <p>Loading image...</p>
      ) : imageUrl ? (
        <img 
          src={imageUrl} 
          alt={docName} 
          style={{ width: '300px', height: 'auto' }} 
        />
      ) : (
        <p>No image available</p>
      )}

      {/* Display the document name (e.g., "denzel washington") */}
      <p style={{ textAlign: 'center', marginTop: '10px' }}>{docName}</p>
    </div>
  );
}

export default Testing;
