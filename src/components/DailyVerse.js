import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { FaInstagram } from 'react-icons/fa';
import './DailyVerse.css';

// Array of beautiful, aesthetic background images
const backgroundImages = [
  'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg', // Nature landscape
  'https://images.pexels.com/photos/1287075/pexels-photo-1287075.jpeg', // Mountain lake
  'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg', // Forest stream
  'https://images.pexels.com/photos/1287075/pexels-photo-1287075.jpeg', // Mountain landscape
  'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg', // Misty valley
  'https://images.pexels.com/photos/1287075/pexels-photo-1287075.jpeg', // Lake view
];

const DailyVerse = () => {
  const [verse, setVerse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState('');

  // Set a random background image on component mount
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * backgroundImages.length);
    const selectedImage = backgroundImages[randomIndex];
    console.log('Setting background image:', selectedImage);
    setBackgroundImage(selectedImage);
  }, []); // Empty dependency array since backgroundImages is now constant

  useEffect(() => {
    const fetchVerse = async () => {
      try {
        console.log('Fetching verse...');
        const today = new Date().toISOString().split('T')[0];
        
        // First try to get a verse approved for today
        const todayQuery = query(
          collection(db, 'verses'),
          where('approved', '==', true),
          where('date', '==', today)
        );
        
        console.log('Executing today query...');
        const todaySnapshot = await getDocs(todayQuery);
        
        if (!todaySnapshot.empty) {
          console.log('Found verse for today');
          setVerse(todaySnapshot.docs[0].data());
          setLoading(false);
          return;
        }
        
        // If no verse for today, get a random approved verse
        console.log('No verse for today, getting random verse');
        const randomQuery = query(
          collection(db, 'verses'),
          where('approved', '==', true),
          orderBy('date')
        );
        
        console.log('Executing random query...');
        const randomSnapshot = await getDocs(randomQuery);
        
        if (!randomSnapshot.empty) {
          const randomIndex = Math.floor(Math.random() * randomSnapshot.docs.length);
          const selectedVerse = randomSnapshot.docs[randomIndex];
          
          // Update the verse's date to today
          await updateDoc(doc(db, 'verses', selectedVerse.id), {
            date: today
          });
          
          setVerse(selectedVerse.data());
        } else {
          console.log('No approved verses found, using fallback');
          setVerse({
            text: "For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.",
            reference: "John 3:16"
          });
        }
      } catch (err) {
        console.error('Error fetching verse:', err);
        console.error('Error details:', {
          message: err.message,
          code: err.code,
          stack: err.stack
        });
        setError('Failed to load verse. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchVerse();
  }, []);

  if (loading) {
    return (
      <div className="daily-verse">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="daily-verse">
        <div className="error">{error}</div>
      </div>
    );
  }

  if (!verse) {
    return (
      <div className="daily-verse">
        <div className="error">No verse available</div>
      </div>
    );
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
};

export default DailyVerse; 