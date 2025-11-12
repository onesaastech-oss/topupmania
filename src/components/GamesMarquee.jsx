"use client";

import { Bebas_Neue } from 'next/font/google';

const bebas = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
});

export default function CompanyLogoMarquee() {
  const companies = [

    {
      name: "Free Fire", 
      logo: "https://wallpapers.com/images/featured/free-fire-logo-neggg4nr4exfv0yh.jpg"
    },
    {
      name: "Mobile Legends",
      logo: "https://images.seeklogo.com/logo-png/39/1/mobile-legends-logo-png_seeklogo-390519.png"
    },
    {
      name: "BGMI",
      logo: "https://play-lh.googleusercontent.com/KieTROLwzhE25mwyHBAvH9MrxynZm3DIeGwuZKBarh4kVLoiRakxr2v7yZ0TwUmdulKN3eopWKThrdos2JaEoQ"
    },
    {
      name: "Call of Duty",
      logo: "https://profile.callofduty.com/resources/cod/images/COD-Badge_Meta.png"
    },
    {
      name: "Apex Legends",
      logo: "https://profile.callofduty.com/resources/cod/images/COD-Badge_Meta.png"
    }
  ];
  // Repeat the companies array to make the scroll seamless
  const marqueeLogos = [...companies, ...companies];

  return (
    <div className="overflow-hidden whitespace-nowrap bg-gray-50 dark:bg-black py-4 border-y border-gray-200 dark:border-gray-700">
      <div className="animate-marquee inline-block">
        {marqueeLogos.map((company, idx) => (
          <img
            key={idx}
            src={company.logo}
            alt={company.name}
            className="inline-block mx-8 h-12 w-auto object-contain"
          />
        ))}
      </div>
      
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
      `}</style>
    </div>
  );
}