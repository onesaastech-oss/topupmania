"use client";

import { useState } from "react";

const games = [
  {
    id: 1,
    title: "PUBG Mobile",
    genre: "Battle Royale",
    thumbnail: "https://4kwallpapers.com/images/walls/thumbs_3t/7843.jpg",
    fullImage: "https://4kwallpapers.com/images/walls/thumbs_3t/7843.jpg",
    description: "Purchase UC (Unknown Cash)",
    currency: "UC",
    startingPrice: "$0.99",
    popular: true,
    discount: "20% OFF"
  },
  {
    id: 2,
    title: "Free Fire",
    genre: "Battle Royale",
    thumbnail: "https://4kwallpapers.com/images/walls/thumbs_3t/7843.jpg",
    fullImage: "https://4kwallpapers.com/images/walls/thumbs_3t/7843.jpg",
    description: "Buy Diamonds",
    currency: "Diamonds",
    startingPrice: "$1.99",
    popular: true,
    discount: "15% OFF"
  },
  {
    id: 3,
    title: "Mobile Legends",
    genre: "MOBA",
    thumbnail: "https://4kwallpapers.com/images/walls/thumbs_3t/7843.jpg",
    fullImage: "https://4kwallpapers.com/images/walls/thumbs_3t/7843.jpg",
    description: "Purchase Diamonds",
    currency: "Diamonds",
    startingPrice: "$2.49",
    popular: true,
    discount: null
  },
  {
    id: 4,
    title: "Call of Duty Mobile",
    genre: "FPS",
    thumbnail: "https://4kwallpapers.com/images/walls/thumbs_3t/7843.jpg",
    fullImage: "https://4kwallpapers.com/images/walls/thumbs_3t/7843.jpg",
    description: "Buy CP (COD Points)",
    currency: "CP",
    startingPrice: "$4.99",
    popular: false,
    discount: null
  },
  {
    id: 5,
    title: "Clash of Clans",
    genre: "Strategy",
    thumbnail: "https://4kwallpapers.com/images/walls/thumbs_3t/7843.jpg",
    fullImage: "https://4kwallpapers.com/images/walls/thumbs_3t/7843.jpg",
    description: "Purchase Gems",
    currency: "Gems",
    startingPrice: "$2.99",
    popular: false,
    discount: "10% OFF"
  },
  {
    id: 6,
    title: "Clash Royale",
    genre: "Strategy",
    thumbnail: "https://4kwallpapers.com/images/walls/thumbs_3t/7843.jpg",
    fullImage: "https://4kwallpapers.com/images/walls/thumbs_3t/7843.jpg",
    description: "Buy Gems",
    currency: "Gems",
    startingPrice: "$2.99",
    popular: false,
    discount: null
  },
  {
    id: 7,
    title: "Genshin Impact",
    genre: "RPG",
    thumbnail: "https://4kwallpapers.com/images/walls/thumbs_3t/7843.jpg",
    fullImage: "https://4kwallpapers.com/images/walls/thumbs_3t/7843.jpg",
    description: "Purchase Genesis Crystals",
    currency: "Crystals",
    startingPrice: "$4.99",
    popular: false,
    discount: null
  },
  {
    id: 8,
    title: "Roblox",
    genre: "Sandbox",
    thumbnail: "https://4kwallpapers.com/images/walls/thumbs_3t/7843.jpg",
    fullImage: "https://4kwallpapers.com/images/walls/thumbs_3t/7843.jpg",
    description: "Buy Robux",
    currency: "Robux",
    startingPrice: "$4.99",
    popular: false,
    discount: null
  },
  {
    id: 9,
    title: "Minecraft",
    genre: "Sandbox",
    thumbnail: "https://4kwallpapers.com/images/walls/thumbs_3t/7843.jpg",
    fullImage: "https://4kwallpapers.com/images/walls/thumbs_3t/7843.jpg",
    description: "Purchase Minecoins",
    currency: "Minecoins",
    startingPrice: "$1.99",
    popular: false,
    discount: null
  }
];

export default function FeaturedProjects() {
  const [selectedGame, setSelectedGame] = useState(null);

  const openGameDetails = (game) => {
    setSelectedGame(game);
  };

  const closeGameDetails = () => {
    setSelectedGame(null);
  };

    return (
        <>
            <div className="w-full px-4 mt-8">
                        <div className="bg-white rounded-3xl shadow-lg overflow-hidden mx-auto max-w-4xl">
          <div className="px-6 py-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                All Games
              </h2>
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                Buy UC, Diamonds, Gold & more for your favorite games. Fast & secure delivery!
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {games.map((game) => (
                <div key={game.id} className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
                  <button
                    onClick={() => openGameDetails(game)}
                    className="w-full text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  >
                    {/* Game Image */}
                    <div className="relative h-24 md:h-32 overflow-hidden">
                      <img
                        src={game.thumbnail}
                        alt={game.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "/images/empty.png";
                        }}
                      />
                      {game.discount && (
                        <div className="absolute top-2 left-2">
                          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            {game.discount}
                          </span>
                        </div>
                      )}
                      {game.popular && (
                        <div className="absolute top-2 right-2">
                          <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            🔥 HOT
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Game Info */}
                    <div className="p-3">
                      <h3 className="font-bold text-gray-900 text-xs md:text-sm mb-1 truncate">
                        {game.title}
                      </h3>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                        {game.description}
                      </p>
                      
                      {/* Price */}
                      <div className="flex items-center justify-end mb-3">
                        <div className="text-right">
                          <span className="text-xs md:text-sm font-bold text-green-600">
                            From {game.startingPrice}
                          </span>
                        </div>
                      </div>
                      
                      {/* Buy Button */}
                      <div className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold py-2 px-2 md:px-3 rounded-lg transition-colors duration-200 text-center">
                        Buy {game.currency}
                      </div>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
            </div>

                  {/* Game Details Modal */}
      {selectedGame && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={closeGameDetails}
        >
          <div className="relative max-w-md w-full bg-white rounded-2xl overflow-hidden">
            <button
              onClick={closeGameDetails}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white bg-opacity-80 text-xl font-bold"
            >
              ×
            </button>
            
            <div className="relative h-48 overflow-hidden">
              <img
                src={selectedGame.fullImage}
                alt={selectedGame.title}
                className="w-full h-full object-cover"
                onClick={(e) => e.stopPropagation()}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <span className="inline-block px-2 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full mb-2">
                  {selectedGame.genre}
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {selectedGame.title}
              </h3>
              <p className="text-gray-600 text-sm mb-2">
                {selectedGame.description}
              </p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-500">Currency:</span>
                <span className="text-sm font-bold text-blue-600">{selectedGame.currency}</span>
              </div>
              {selectedGame.popular && (
                <div className="mb-4">
                  <span className="inline-block px-2 py-1 bg-orange-100 text-orange-800 text-xs font-semibold rounded-full">
                    🔥 Popular Choice
                  </span>
                </div>
              )}
              <button
                onClick={closeGameDetails}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200"
              >
                Buy {selectedGame.currency}
              </button>
            </div>
          </div>
        </div>
      )}
        </>
    );
}
