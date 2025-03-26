import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

function SubmitVerse() {
  const [formData, setFormData] = useState({
    text: '',
    name: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      await addDoc(collection(db, 'verses'), {
        text: formData.text,
        name: formData.name,
        approved: false,
        submittedAt: new Date().toISOString()
      });

      setMessage('Verse submitted successfully! It will be reviewed by our team.');
      setFormData({ text: '', name: '' });
    } catch (error) {
      console.error('Error submitting verse:', error);
      setMessage('Error submitting verse. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="submit-verse">
      <h2>Submit a Daily Verse</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="text">Bible Verse:</label>
          <textarea
            id="text"
            name="text"
            value={formData.text}
            onChange={handleChange}
            required
            placeholder="Enter the Bible verse..."
            rows="4"
          />
        </div>
        <div className="form-group">
          <label htmlFor="name">Your Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter your name..."
          />
        </div>
        <button type="submit" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Verse'}
        </button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default SubmitVerse; 