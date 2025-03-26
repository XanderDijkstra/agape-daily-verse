import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { FaTwitter, FaFacebook, FaInstagram } from 'react-icons/fa';
import './DailyVerse.css';

const DailyVerse = () => {
  const [verse, setVerse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    <div className="daily-verse">
      <div className="brand-name">AGAPE</div>
      <div className="verse-content">
        <p className="verse-text">{verse.text}</p>
        <p className="verse-reference">{verse.reference}</p>
      </div>
      <div className="social-icons">
        <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`"${verse.text}" - ${verse.reference}`)}`} target="_blank" rel="noopener noreferrer">
          <FaTwitter />
        </a>
        <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer">
          <FaFacebook />
        </a>
        <a href={`https://www.instagram.com/share?url=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer">
          <FaInstagram />
        </a>
      </div>
    </div>
  );
};

export default DailyVerse; 