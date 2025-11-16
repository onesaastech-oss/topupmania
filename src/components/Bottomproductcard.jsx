import React from 'react';
import styled from 'styled-components';
import { FaBolt, FaShieldAlt, FaTag, FaHeadset } from 'react-icons/fa';

const features = [
  {
    icon: <FaBolt className="icon" />,
    title: "Instant Recharge",
    description: "Top up your game balance in just seconds — no delays, no downtime."
  },
  {
    icon: <FaShieldAlt className="icon" />,
    title: "Secure Payments",
    description: "Every transaction is encrypted and protected for your peace of mind."
  },
  {
    icon: <FaTag className="icon" />,
    title: "Best Prices",
    description: "Get the most value for your money with our competitive rates."
  },
  {
    icon: <FaHeadset className="icon" />,
    title: "24/7 Support",
    description: "Get help whenever you need it, day or night."
  }
];

const WhyChooseUs = () => {
  return (
    <Container>
      <BlurCard>
        <Title>Why Gamers Choose Us</Title>
        <FeaturesGrid>
          {features.map((feature, index) => (
            <FeatureCard key={index}>
              <IconWrapper>{feature.icon}</IconWrapper>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </FeatureCard>
          ))}
        </FeaturesGrid>
      </BlurCard>
    </Container>
  );
};

const Container = styled.section`
  width: 100%;
  max-width: 100%;
  margin: 0.5rem auto 0;
  padding: 0 1rem 2rem;
  position: relative;
  z-index: 30;
  overflow-x: hidden;
  
  @media (max-width: 640px) {
    padding: 0 0.5rem 2rem;
  }
  
  @media (min-width: 768px) {
    max-width: 97%;
  }
  
  @media (min-width: 1024px) {
    max-width: 1500px;
  }
`;

const BlurCard = styled.div`
  background: var(--glass-surface);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 12px;
  padding: 1.5rem 1rem;
  border: 1px solid var(--glass-border);
  box-shadow: 0 8px 32px 0 var(--blur-shadow);
  position: relative;
  z-index: 10;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      to right,
      var(--shine-transparent) 0%,
      var(--shine-mid) 40%,
      var(--shine-strong) 50%,
      var(--shine-mid) 60%,
      var(--shine-transparent) 100%
    );
    transform: rotate(45deg);
    animation: shine 6s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    opacity: 0;
    will-change: opacity, left;
  }
  
  @keyframes shine {
    0% {
      left: -60%;
      opacity: 0;
    }
    50% {
      opacity: 0.35;
    }
    100% {
      left: 160%;
      opacity: 0;
    }
  }
  
  &:hover::before {
    animation: shine 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    &::before {
      animation: none;
    }
  }
`;

const Title = styled.h2`
  text-align: center;
  color: var(--text-primary);
  font-size: 1.5rem;
  margin: 0 0 1.5rem;
  font-weight: 800;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  position: relative;
  display: inline-block;
  padding-bottom: 0.5rem;
  width: 100%;
  
  &::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: 0;
    width: 60px;
    height: 3px;
    background: var(--accent);
    transform: translateX(-50%);
    border-radius: 3px;
  }
  
  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 1.2rem;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.8rem;
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
  }
  
  @media (min-width: 768px) and (max-width: 1023px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.9rem;
  }
  
  @media (max-width: 768px) {
    gap: 0.6rem;
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 480px) {
    gap: 0.4rem;
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 360px) {
    gap: 0.3rem;
  }
`;

const FeatureCard = styled.div`
  background: var(--glass-card);
  backdrop-filter: blur(5px);
  border-radius: 10px;
  padding: 1rem 0.6rem;
  transition: all 0.3s ease;
  border: 1px solid var(--glass-border);
  min-height: 140px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  justify-content: center;
  width: 100%;
  box-sizing: border-box;
  max-width: 100%;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 15px var(--blur-shadow);
    background: var(--glass-card-hover);
  }
  
  h3 {
    color: var(--text-primary);
    font-size: 0.9rem;
    margin: 0.5rem 0 0.4rem;
    font-weight: 600;
    white-space: normal;
    word-wrap: break-word;
    hyphens: auto;
    line-height: 1.2;
    max-width: 100%;
  }
  
  p {
    color: var(--text-secondary);
    font-size: 0.75rem;
    line-height: 1.4;
    margin: 0;
    padding: 0 0.3rem;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    min-height: 3.15rem; /* 3 lines * line-height 1.4 * font-size 0.75rem */
    max-width: 100%;
  }
  
  @media (min-width: 1024px) {
    min-height: 180px;
    padding: 1.2rem 0.8rem;
    
    h3 {
      font-size: 1rem;
      line-height: 1.3;
      margin: 0.6rem 0 0.5rem;
    }
    
    p {
      font-size: 0.85rem;
      line-height: 1.4;
      padding: 0 0.4rem;
      -webkit-line-clamp: 3;
      min-height: 3.57rem; /* 3 lines * line-height 1.4 * font-size 0.85rem */
    }
  }
  
  @media (min-width: 768px) and (max-width: 1023px) {
    min-height: 160px;
    padding: 1rem 0.6rem;
    
    h3 {
      font-size: 0.9rem;
      line-height: 1.25;
      margin: 0.5rem 0 0.4rem;
    }
    
    p {
      font-size: 0.75rem;
      line-height: 1.35;
      padding: 0 0.3rem;
      -webkit-line-clamp: 3;
      min-height: 3.04rem; /* 3 lines * line-height 1.35 * font-size 0.75rem */
    }
  }
  
  @media (max-width: 768px) {
    min-height: 150px;
    padding: 0.8rem 0.4rem;
    
    h3 {
      font-size: 0.8rem;
      line-height: 1.2;
      margin: 0.4rem 0 0.3rem;
    }
    
    p {
      font-size: 0.7rem;
      line-height: 1.3;
      padding: 0 0.2rem;
      -webkit-line-clamp: 3;
      min-height: 2.73rem; /* 3 lines * line-height 1.3 * font-size 0.7rem */
    }
  }
  
  @media (max-width: 480px) {
    min-height: 140px;
    padding: 0.7rem 0.3rem;
    
    h3 {
      font-size: 0.75rem;
      line-height: 1.1;
      margin: 0.3rem 0 0.2rem;
    }
    
    p {
      font-size: 0.65rem;
      line-height: 1.2;
      padding: 0 0.1rem;
      -webkit-line-clamp: 3;
      min-height: 2.34rem; /* 3 lines * line-height 1.2 * font-size 0.65rem */
    }
  }
  
  @media (max-width: 360px) {
    min-height: 130px;
    padding: 0.6rem 0.2rem;
    
    h3 {
      font-size: 0.7rem;
    }
    
    p {
      font-size: 0.6rem;
      min-height: 2.16rem; /* 3 lines * line-height 1.2 * font-size 0.6rem */
    }
  }
`;

const IconWrapper = styled.div`
  font-size: 1rem;
  color: #fff;
  background: linear-gradient(135deg, #AA424A 0%, #640D14 100%);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.8rem;
  flex-shrink: 0;
  
  .icon {
    filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.2));
  }
  
  @media (min-width: 1024px) {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
    margin-bottom: 1rem;
  }
  
  @media (min-width: 768px) and (max-width: 1023px) {
    width: 36px;
    height: 36px;
    font-size: 1.1rem;
    margin-bottom: 0.9rem;
  }
  
  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
    font-size: 0.9rem;
    margin-bottom: 0.6rem;
  }
  
  @media (max-width: 480px) {
    width: 24px;
    height: 24px;
    font-size: 0.8rem;
    margin-bottom: 0.5rem;
  }
  
  @media (max-width: 360px) {
    width: 22px;
    height: 22px;
    font-size: 0.7rem;
    margin-bottom: 0.4rem;
  }
`;

export default WhyChooseUs;