import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pendingVerses, setPendingVerses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setIsAuthenticated(!!user);
      if (user) {
        fetchPendingVerses();
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchPendingVerses = async () => {
    try {
      const versesRef = collection(db, 'verses');
      const q = query(versesRef, where('approved', '==', false));
      const querySnapshot = await getDocs(q);
      setPendingVerses(querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })));
    } catch (error) {
      console.error('Error fetching pending verses:', error);
      setError('Error fetching pending verses');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, loginData.email, loginData.password);
      setError('');
    } catch (error) {
      setError('Invalid email or password');
    }
  };

  const handleApprove = async (verseId, date) => {
    try {
      await updateDoc(doc(db, 'verses', verseId), {
        approved: true,
        date: date
      });
      setPendingVerses(prev => prev.filter(verse => verse.id !== verseId));
    } catch (error) {
      console.error('Error approving verse:', error);
      setError('Error approving verse');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login">
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={loginData.email}
              onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={loginData.password}
              onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
        {error && <p className="error">{error}</p>}
      </div>
    );
  }

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="admin-dashboard">
      <h2>Pending Verses</h2>
      {error && <p className="error">{error}</p>}
      {pendingVerses.length === 0 ? (
        <p>No pending verses to review.</p>
      ) : (
        <div className="pending-verses">
          {pendingVerses.map(verse => (
            <div key={verse.id} className="verse-card">
              <p className="verse-text">{verse.text}</p>
              <p className="verse-submitter">Submitted by: {verse.name}</p>
              <div className="approval-controls">
                <input
                  type="date"
                  id={`date-${verse.id}`}
                  min={new Date().toISOString().split('T')[0]}
                />
                <button
                  onClick={() => handleApprove(
                    verse.id,
                    document.getElementById(`date-${verse.id}`).value
                  )}
                >
                  Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Admin; 