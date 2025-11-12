import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ProductCard from './productcard';
import { getAllGames, transformGamesArray } from '@/lib/api/games';

// Styled components - moved outside component to prevent hydration issues
const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.25rem;
  width: 95%;
  justify-content: center;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    column-gap: 0.5rem;
    row-gap: 5rem;
    justify-content: center;
  }

  margin:auto;
    
`;

const GridItem = styled.div`
  border-radius: 8px;
  overflow: hidden;
`;

const MainCard = styled.div`
  border-radius: 12px;
`;

// Filter out isDark prop to prevent it from being passed to DOM
const CardHeader = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isDark',
})`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem 0.5rem;
  margin-bottom: 1.5rem;
  border-bottom: ${props => props.isDark ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.08)'};
  color: ${props => props.isDark ? 'white' : 'black'};
  backdrop-filter: blur(10px);
  z-index: 100;
  width: 100%;
`;

const CardTitle = styled.h2.withConfig({
  shouldForwardProp: (prop) => prop !== 'isDark',
})`
  margin: 0;
  font-size: 1.6rem;
  font-weight: 800;
  font-family: 'Poppins', 'Segoe UI', sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background-clip: text;
  -webkit-background-clip: text;
  color: ${props => props.isDark ? '#FDE047' : '#1a1a1a'};
  text-shadow: ${props => props.isDark 
    ? '0 0 8px rgba(255, 107, 53, 0.4), 0 0 16px rgba(57, 255, 20, 0.3)'
    : '0 0 4px rgba(0, 0, 0, 0.2), 0 0 8px rgba(0, 0, 0, 0.1)'
  };
  
  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
`;

const ViewAllButton = styled.button`
  margin-top: 0.4rem;
  padding: 8px 24px;
  background: #6c5ce7;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: background-color 0.2s ease;

  &:hover {
    background: #5a4fcf;
  }

  &:disabled {
    background: #4a4a4a;
    cursor: not-allowed;
  }
`;

const LoadingSpinner = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isDark',
})`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid ${props => props.isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)'};
  border-radius: 50%;
  border-top-color: ${props => props.isDark ? '#fff' : '#000'};
  animation: spin 1s ease-in-out infinite;
  margin-right: 8px;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isDark',
})`
  color: ${props => props.isDark ? '#ff6b6b' : '#b91c1c'};
  text-align: center;
  padding: 2rem;
  background: ${props => props.isDark ? 'rgba(255, 107, 107, 0.1)' : 'rgba(220, 38, 38, 0.08)'};
  border-radius: 8px;
  margin: 1rem 0;
  border: 1px solid ${props => props.isDark ? 'rgba(255, 107, 107, 0.3)' : 'rgba(220, 38, 38, 0.25)'};
`;

const LoadingContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isDark',
})`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  color: ${props => props.isDark ? 'white' : '#111827'};
`;


const ProductGrid = ({ title = "Our Products", games = [], fetchFromApi = true }) => {
  const [showAll, setShowAll] = useState(false);
  const [visibleGames, setVisibleGames] = useState([]);
  const [apiGames, setApiGames] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDark, setIsDark] = useState(false);
  const cardsPerRow = 3;
  const rowsToShow = 3;
  const initialCardsToShow = cardsPerRow * rowsToShow;

  // Theme reactivity
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Initial theme check
    const checkTheme = () => {
      const root = document.documentElement;
      const isDarkTheme = root.classList.contains('dark');
      setIsDark(isDarkTheme);
    };
    
    // Check theme on mount
    checkTheme();
    
    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          checkTheme();
        }
      });
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    // Also listen for storage changes (in case theme is changed in another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'theme') {
        checkTheme();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      observer.disconnect();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Fetch games from API
  useEffect(() => {
    if (fetchFromApi) {
      fetchGames();
    }
  }, [fetchFromApi]);

  const fetchGames = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await getAllGames();
      console.log(result);
      
      
      if (result.success) {
        const transformedGames = transformGamesArray(result.games);
        setApiGames(transformedGames);
      } else {
        setError(result.error || 'Failed to load games');
      }
    } catch (err) {
      setError(err.message || 'Failed to load games');
    } finally {
      setIsLoading(false);
    }
  };

  // Determine which games to use (API or props)
  const currentGames = fetchFromApi ? apiGames : games;

  useEffect(() => {
    console.log('Games data:', currentGames);
    setVisibleGames(showAll ? currentGames : currentGames.slice(0, initialCardsToShow));
  }, [currentGames, showAll, initialCardsToShow]);

  // Show loading state
  if (isLoading) {
    return (
      <MainCard>
        <CardHeader isDark={isDark}>
          <CardTitle isDark={isDark}>{title}</CardTitle>
        </CardHeader>
        <LoadingContainer isDark={isDark}>
          <LoadingSpinner isDark={isDark} />
          Loading games...
        </LoadingContainer>
      </MainCard>
    );
  }

  // Show error state
  if (error) {
    return (
      <MainCard>
        <CardHeader isDark={isDark}>
          <CardTitle isDark={isDark}>{title}</CardTitle>
        </CardHeader>
        <ErrorMessage isDark={isDark}>
          <div>Failed to load games: {error}</div>
          <ViewAllButton 
            onClick={fetchGames} 
            style={{ marginTop: '1rem', background: '#ff6b6b' }}
          >
            Retry
          </ViewAllButton>
        </ErrorMessage>
      </MainCard>
    );
  }

  // Show empty state
  if (!currentGames || currentGames.length === 0) {
    return (
      <MainCard>
        <CardHeader isDark={isDark}>
          <CardTitle isDark={isDark}>{title}</CardTitle>
        </CardHeader>
        <div style={{ 
          color: isDark ? 'white' : 'black', 
          textAlign: 'center', 
          padding: '2rem' 
        }}>
          No products available at the moment.
          {fetchFromApi && (
            <ViewAllButton 
              onClick={fetchGames} 
              style={{ marginTop: '1rem', display: 'block', margin: '1rem auto 0' }}
            >
              Refresh
            </ViewAllButton>
          )}
        </div>
      </MainCard>
    );
  }

  return (
    <MainCard>
      <CardHeader isDark={isDark}>
        <CardTitle isDark={isDark}>{title}</CardTitle>
      </CardHeader>
      <div>
        <GridContainer>
          {visibleGames.map((game) => (
            <GridItem key={game.id}>
              <ProductCard game={game} />
            </GridItem>
          ))}
        </GridContainer>
        {currentGames.length > initialCardsToShow && (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <ViewAllButton onClick={() => setShowAll(!showAll)}>
              {showAll ? 'Show Less' : 'View All'}
            </ViewAllButton>
          </div>
        )}
      </div>
    </MainCard>
  );
};

export default ProductGrid;