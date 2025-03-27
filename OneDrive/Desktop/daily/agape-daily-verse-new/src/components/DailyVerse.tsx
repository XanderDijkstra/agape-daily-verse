import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { FaInstagram as InstagramIcon } from 'react-icons/fa';
import styled from 'styled-components';
import { Verse } from '../types';

const backgroundImages = [
  'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg',
  'https://images.pexels.com/photos/1287075/pexels-photo-1287075.jpeg',
  'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg',
  'https://images.pexels.com/photos/1287075/pexels-photo-1287075.jpeg',
  'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg',
  'https://images.pexels.com/photos/1287075/pexels-photo-1287075.jpeg',
];

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  color: white;
  text-align: center;
`;

const BackgroundImage = styled.div<{ imageUrl: string }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url(${props => props.imageUrl});
  background-size: cover;
  background-position: center;
  z-index: -2;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: -1;
`;

const VerseContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const VerseText = styled.p`
  font-size: 1.5rem;
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const VerseReference = styled.p`
  font-size: 1.2rem;
  font-style: italic;
`;

const BottomBar = styled.div`
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0, 0, 0, 0.7);
`;

const BrandName = styled.a`
  color: white;
  text-decoration: none;
  font-size: 1.2rem;
  font-weight: bold;
`;

const SocialIcon = styled.a`
  color: white;
  font-size: 1.5rem;
  text-decoration: none;
`;

const Loading = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-size: 1.2rem;
  color: white;
`;

const Error = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-size: 1.2rem;
  color: white;
  background: rgba(255, 0, 0, 0.1);
`;

const DailyVerse: React.FC = () => {
  const [verse, setVerse] = useState<Verse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [backgroundImage, setBackgroundImage] = useState(backgroundImages[0]);

  // Function to get time until next midnight
  const getTimeUntilMidnight = () => {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    return midnight.getTime() - now.getTime();
  };

  // Function to fetch verse
  const fetchVerse = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // First try to get a verse approved for today
      const todayQuery = query(
        collection(db, 'verses'),
        where('approved', '==', true),
        where('date', '==', today)
      );
      
      const todaySnapshot = await getDocs(todayQuery);
      
      if (!todaySnapshot.empty) {
        const verseData = todaySnapshot.docs[0].data() as Verse;
        setVerse({ ...verseData, id: todaySnapshot.docs[0].id });
        setLoading(false);
        return;
      }
      
      // If no verse for today, get a random approved verse
      const randomQuery = query(
        collection(db, 'verses'),
        where('approved', '==', true),
        orderBy('date')
      );
      
      const randomSnapshot = await getDocs(randomQuery);
      
      if (!randomSnapshot.empty) {
        const randomIndex = Math.floor(Math.random() * randomSnapshot.docs.length);
        const selectedVerse = randomSnapshot.docs[randomIndex];
        const verseData = selectedVerse.data() as Verse;
        
        // Update the verse's date to today
        await updateDoc(doc(db, 'verses', selectedVerse.id), {
          date: today
        });
        
        setVerse({ ...verseData, id: selectedVerse.id });
      } else {
        setVerse({
          id: 'fallback',
          text: "For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.",
          reference: "John 3:16",
          approved: true,
          date: today
        });
      }
    } catch (err) {
      console.error('Error fetching verse:', err);
      setError('Failed to load verse. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and background image setup
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * backgroundImages.length);
    setBackgroundImage(backgroundImages[randomIndex]);
    fetchVerse();
  }, []);

  // Set up automatic refresh at midnight
  useEffect(() => {
    const timeUntilMidnight = getTimeUntilMidnight();
    
    // Set initial timeout for midnight
    const timeoutId = setTimeout(() => {
      fetchVerse();
      // After midnight, set up interval for every 24 hours
      setInterval(fetchVerse, 24 * 60 * 60 * 1000);
    }, timeUntilMidnight);

    return () => clearTimeout(timeoutId);
  }, []);

  if (loading) {
    return <Loading>Loading...</Loading>;
  }

  if (error) {
    return <Error>{error}</Error>;
  }

  if (!verse) {
    return <Error>No verse available</Error>;
  }

  return (
    <Container>
      <BackgroundImage imageUrl={backgroundImage} />
      <Overlay />
      <VerseContainer>
        <VerseText>{verse.text}</VerseText>
        <VerseReference>{verse.reference}</VerseReference>
      </VerseContainer>
      <BottomBar>
        <BrandName href="https://agape-wear.com" target="_blank" rel="noopener noreferrer">
          AGAPE
        </BrandName>
        <SocialIcon href="https://www.instagram.com/agape.streetwear/" target="_blank" rel="noopener noreferrer">
          <InstagramIcon />
        </SocialIcon>
      </BottomBar>
    </Container>
  );
};

export default DailyVerse; 