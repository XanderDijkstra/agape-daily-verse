import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, updateDoc, doc, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

function Admin() {
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'agape2024') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  const submitTestVerses = async () => {
    try {
      setError('');
      const versesRef = collection(db, 'verses');
      
      // First verse
      const verse1 = {
        text: "But they who wait for the Lord shall renew their strength; they shall mount up with wings like eagles; they shall run and not be weary; they shall walk and not faint.",
        reference: "Isaiah 40:31",
        name: "Admin",
        approved: false,
        submittedAt: new Date().toISOString()
      };
      
      // Second verse
      const verse2 = {
        text: "Trust in the Lord with all your heart, and lean not on your own understanding; in all your ways acknowledge Him, and He shall direct your paths.",
        reference: "Proverbs 3:5-6",
        name: "Admin",
        approved: false,
        submittedAt: new Date().toISOString()
      };

      // Submit verses one at a time
      await addDoc(versesRef, verse1);
      await addDoc(versesRef, verse2);

      // Refresh the verses list
      const q = query(versesRef, where('approved', '==', false));
      const querySnapshot = await getDocs(q);
      const versesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setVerses(versesData);

      setError('Test verses submitted successfully!');
    } catch (error) {
      console.error('Error submitting test verses:', error);
      setError(`Error submitting test verses: ${error.message}`);
    }
  };

  useEffect(() => {
    const fetchVerses = async () => {
      try {
        setLoading(true);
        setError('');
        const versesRef = collection(db, 'verses');
        const q = query(versesRef, where('approved', '==', false));
        const querySnapshot = await getDocs(q);
        const versesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setVerses(versesData);
      } catch (error) {
        console.error('Error fetching verses:', error);
        setError(`Error loading verses: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchVerses();
    }
  }, [isAuthenticated]);

  const handleApprove = async (verseId) => {
    try {
      setError('');
      const verseRef = doc(db, 'verses', verseId);
      await updateDoc(verseRef, {
        approved: true
      });
      setVerses(verses.filter(verse => verse.id !== verseId));
    } catch (error) {
      console.error('Error approving verse:', error);
      setError(`Error approving verse: ${error.message}`);
    }
  };

  const handleReject = async (verseId) => {
    try {
      setError('');
      const verseRef = doc(db, 'verses', verseId);
      await updateDoc(verseRef, {
        approved: false,
        rejected: true
      });
      setVerses(verses.filter(verse => verse.id !== verseId));
    } catch (error) {
      console.error('Error rejecting verse:', error);
      setError(`Error rejecting verse: ${error.message}`);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login">
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="error">{error}</div>}
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      {error && <div className="error">{error}</div>}
      {loading ? (
        <div className="loading">Loading verses...</div>
      ) : (
        <>
          <button onClick={submitTestVerses} className="test-button">Submit Test Verses</button>
          <p>Pending Verses: {verses.length}</p>
          {verses.map(verse => (
            <div key={verse.id} className="verse-card">
              <p className="verse-text">{verse.text}</p>
              <p className="verse-reference">{verse.reference}</p>
              <p className="verse-submitter">Submitted by: {verse.name}</p>
              <div className="approval-controls">
                <button onClick={() => handleApprove(verse.id)}>Approve</button>
                <button onClick={() => handleReject(verse.id)}>Reject</button>
              </div>
            </div>
          ))}
          {verses.length === 0 && <p>No pending verses to review.</p>}
        </>
      )}
    </div>
  );
}

export default Admin; 