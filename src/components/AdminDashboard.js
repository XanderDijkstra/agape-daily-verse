import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVerses = async () => {
      try {
        const versesRef = collection(db, 'verses');
        const q = query(versesRef);
        const querySnapshot = await getDocs(q);
        const versesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setVerses(versesData);
      } catch (err) {
        console.error('Error fetching verses:', err);
        setError('Failed to load verses');
      } finally {
        setLoading(false);
      }
    };

    fetchVerses();
  }, []);

  const handleApprove = async (verseId) => {
    try {
      const verseRef = doc(db, 'verses', verseId);
      await updateDoc(verseRef, {
        approved: true
      });
      setVerses(verses.map(verse => 
        verse.id === verseId ? { ...verse, approved: true } : verse
      ));
    } catch (err) {
      console.error('Error approving verse:', err);
      setError('Failed to approve verse');
    }
  };

  const handleDelete = async (verseId) => {
    try {
      await deleteDoc(doc(db, 'verses', verseId));
      setVerses(verses.filter(verse => verse.id !== verseId));
    } catch (err) {
      console.error('Error deleting verse:', err);
      setError('Failed to delete verse');
    }
  };

  if (loading) {
    return <div className="admin-dashboard">Loading...</div>;
  }

  if (error) {
    return <div className="admin-dashboard error">{error}</div>;
  }

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="verses-list">
        {verses.map(verse => (
          <div key={verse.id} className="verse-item">
            <div className="verse-content">
              <p className="verse-text">{verse.text}</p>
              <p className="verse-reference">{verse.reference}</p>
              <p className="verse-status">
                Status: {verse.approved ? 'Approved' : 'Pending'}
              </p>
            </div>
            <div className="verse-actions">
              {!verse.approved && (
                <button 
                  onClick={() => handleApprove(verse.id)}
                  className="approve-button"
                >
                  Approve
                </button>
              )}
              <button 
                onClick={() => handleDelete(verse.id)}
                className="delete-button"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard; 