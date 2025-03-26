import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

function DailyVerse() {
  const [verse, setVerse] = useState({ text: '', name: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDailyVerse = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const versesRef = collection(db, 'verses');
        const q = query(
          versesRef,
          where('date', '==', today),
          where('approved', '==', true)
        );
        
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const data = querySnapshot.docs[0].data();
          setVerse({ text: data.text, name: data.name });
        } else {
          setVerse({ 
            text: 'For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.', 
            name: 'John 3:16' 
          });
        }
      } catch (error) {
        console.error('Error fetching verse:', error);
        setVerse({ 
          text: 'For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.', 
          name: 'John 3:16' 
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
    <div className="daily-verse">
      <div className="verse-container">
        <p className="verse-text">{verse.text}</p>
        <p className="verse-submitter">Submitted by: {verse.name}</p>
      </div>
      <a href="/submit" className="submit-link">Submit a Verse</a>
    </div>
  );
}

export default DailyVerse; 