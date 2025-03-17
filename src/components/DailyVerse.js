import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { FaInstagram } from 'react-icons/fa';

function DailyVerse() {
  const [verse, setVerse] = useState({ text: '', reference: '' });
  const [loading, setLoading] = useState(true);
  const [backgroundImage, setBackgroundImage] = useState('');

  // Array of beautiful, aesthetic background images
  const backgroundImages = [
    'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg', // Nature landscape
    'https://images.pexels.com/photos/1287075/pexels-photo-1287075.jpeg', // Mountain lake
    'https://images.pexels.com/photos/1287075/pexels-photo-1287075.jpeg', // Forest stream
    'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg', // Mountain landscape
    'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg', // Misty valley
    'https://images.pexels.com/photos/1287075/pexels-photo-1287075.jpeg', // Lake view
  ];

  // Set a random background image on component mount
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * backgroundImages.length);
    const selectedImage = backgroundImages[randomIndex];
    console.log('Setting background image:', selectedImage);
    setBackgroundImage(selectedImage);
  }, [backgroundImages]);

  useEffect(() => {
    const fetchDailyVerse = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const versesRef = collection(db, 'verses');
        
        // First try to get today's verse
        let q = query(
          versesRef,
          where('date', '==', today),
          where('approved', '==', true)
        );
        
        let querySnapshot = await getDocs(q);
        
        // If no verse for today, get a random approved verse
        if (querySnapshot.empty) {
          q = query(
            versesRef,
            where('approved', '==', true),
            orderBy('submittedAt')
          );
          querySnapshot = await getDocs(q);
          
          if (!querySnapshot.empty) {
            // Get a random verse from the approved verses
            const verses = querySnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            const randomIndex = Math.floor(Math.random() * verses.length);
            const randomVerse = verses[randomIndex];
            
            // Update the verse's date to today
            const verseRef = doc(db, 'verses', randomVerse.id);
            await updateDoc(verseRef, {
              date: today
            });
            
            setVerse({
              text: randomVerse.text,
              reference: randomVerse.reference
            });
          } else {
            // Fallback verse if no approved verses exist
            setVerse({ 
              text: 'For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.', 
              reference: 'John 3:16' 
            });
          }
        } else {
          // Use today's verse
          const data = querySnapshot.docs[0].data();
          setVerse({
            text: data.text,
            reference: data.reference
          });
        }
      } catch (error) {
        console.error('Error in fetchDailyVerse:', error);
        setVerse({ 
          text: 'For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.', 
          reference: 'John 3:16' 
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDailyVerse();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <>
      <div 
        className="background-image" 
        style={{ 
          backgroundImage: `url(${backgroundImage})`,
          opacity: 1
        }}
      />
      <div className="background-overlay" />
      <div className="daily-verse">
        <div className="verse-container">
          <p className="verse-text">{verse.text}</p>
          <p className="verse-reference">{verse.reference}</p>
        </div>
      </div>
      <div className="bottom-bar">
        <a href="https://agape-wear.com" target="_blank" rel="noopener noreferrer" className="brand-name">
          AGAPE
        </a>
        <a href="https://instagram.com/agapewear" target="_blank" rel="noopener noreferrer" className="social-icon">
          <FaInstagram />
        </a>
      </div>
    </>
  );
}

export default DailyVerse; 