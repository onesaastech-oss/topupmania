import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ProductCard from './productcard';

const ProductGrid = ({ title = "Our Products", games = [] }) => {
  const [showAll, setShowAll] = useState(false);
  const [visibleGames, setVisibleGames] = useState([]);
  const cardsPerRow = 3;
  const rowsToShow = 3;
  const initialCardsToShow = cardsPerRow * rowsToShow;

  useEffect(() => {
    console.log('Games data received:', games);
    setVisibleGames(showAll ? games : games.slice(0, initialCardsToShow));
  }, [games, showAll, initialCardsToShow]);

  if (!games || games.length === 0) {
    return (
      <div style={{ color: 'white', textAlign: 'center', padding: '2rem' }}>
        No products available. Games data: {JSON.stringify(games)}
      </div>
    );
  }

  // Styled components
  const GridContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
    width: 100%;

    @media (min-width: 768px) {
      grid-template-columns: repeat(3, 1fr);
      column-gap: 0.5rem;
      row-gap: 5rem;
    }
  `;

  const GridItem = styled.div`
    border-radius: 8px;
    overflow: hidden;
    aspect-ratio: 2/3;
  `;

  const MainCard = styled.div`
    background: #1a1a1a;
    border-radius: 12px;
    margin: 0.5rem 0;
    padding: 0.5rem;
    color: white;
  `;

  const CardHeader = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 1rem;
    margin-bottom: 1.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  `;

  const CardTitle = styled.h2`
    margin: 0;
    font-size: 1.5rem;
    font-weight: 800;
    font-family: 'Poppins', 'Segoe UI', sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: yelow;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
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
  `;

  return (
    <MainCard>
      <CardHeader>
        <span className='text-xl text-green-300'>{title}</span>
      </CardHeader>
      <div>
        <GridContainer>
          {visibleGames.map((game) => (
            <GridItem key={game.id}>
              <ProductCard game={game} />
            </GridItem>
          ))}
        </GridContainer>
        {games.length > initialCardsToShow && (
          <div style={{ textAlign: 'center' }}>
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
