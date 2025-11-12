"use client";

export default function LeaderboardBadge({ imageUrl, name, amount, position = 1 }) {
  // Determine badge style based on position
  const getBadgeStyle = () => {
    switch(position) {
      case 1: return {
        bg: 'bg-gradient-to-b from-amber-300 to-amber-500',
        border: 'border-amber-400',
        ribbonTail: 'bg-amber-600',
        text: 'text-black'
      };
      case 2: return {
        bg: 'bg-gradient-to-b from-gray-200 to-gray-400',
        border: 'border-gray-300',
        ribbonTail: 'bg-gray-500',
        text: 'text-black'
      };
      case 3: return {
        bg: 'bg-gradient-to-b from-amber-600 to-amber-800',
        border: 'border-amber-500',
        ribbonTail: 'bg-amber-700',
        text: 'text-black'
      };
      default: return {
        bg: 'bg-indigo-600',
        border: 'border-indigo-500',
        ribbonTail: 'bg-indigo-700',
        text: 'text-black'
      };
    }
  };

  const { bg, border, ribbonTail, text } = getBadgeStyle();
  const isTopThree = position <= 3;
  // Responsive sizes for different screen sizes
  const avatarSize = isTopThree ? 'w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24' : 'w-12 h-12 md:w-14 md:h-14';
  const ribbonPadding = isTopThree ? 'pt-12 pb-2 md:pt-14 md:pb-3' : 'pt-6 pb-1 md:pt-8 md:pb-2';
  const ribbonTextSize = isTopThree ? 'text-xs md:text-sm font-bold' : 'text-xs font-bold';
  const amountTextSize = isTopThree ? 'text-[10px] md:text-xs font-semibold' : 'text-[9px] font-semibold';

  return (
    <div className={`relative ${position === 1 ? 'z-10' : 'z-0'} ${position === 1 ? '-translate-y-4' : ''} ${position === 3 ? 'translate-y-2' : ''}`}>
      {/* Position Circle */}
      <div className="relative z-10 mx-auto">
        <div className={`${avatarSize} rounded-full ${border} border-4 bg-white shadow-lg mx-auto flex items-center justify-center overflow-hidden`}>
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={`${name}'s trophy`} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center ${position === 1 ? 'bg-yellow-100' : position === 2 ? 'bg-gray-100' : 'bg-amber-50'}`}>
              <span className={`text-3xl font-bold ${position === 1 ? 'text-yellow-600' : position === 2 ? 'text-gray-600' : 'text-amber-700'}`}>
                {position}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Ribbon */}
      <div className={`relative ${bg} ${text} shadow-lg ${ribbonPadding} px-4 md:px-6 mt-[-25px] min-w-[100px] md:min-w-[120px]`} style={{
        clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), 50% 100%, 0 calc(100% - 12px))',
        paddingBottom: '1rem',
        borderRadius: '6px 6px 0 0'
      }}>
        {/* Ribbon tails */}
        <div className="absolute bottom-0 left-0 w-full" style={{
          height: '15px',
          overflow: 'hidden'
        }}>
          <div className="absolute left-0 bottom-0 w-full h-full" style={{
            background: 'rgba(255, 255, 255, 0.2)',
            clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
            transform: 'translateY(100%)',
            transformOrigin: 'top center',
            zIndex: 1
          }}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center mt-2">
          <p className={`${ribbonTextSize} truncate`}>{name}</p>
          <p className={`${amountTextSize}`}>{amount}</p>
        </div>
      </div>

      {/* Position Badge */}
      {isTopThree && (
        <div className={`absolute -top-1 -right-1 w-6 h-6 md:w-7 md:h-7 ${position === 1 ? 'bg-yellow-400' : position === 2 ? 'bg-gray-300' : 'bg-amber-700'} rounded-full flex items-center justify-center text-white font-bold text-[10px] md:text-xs shadow-md ${position === 1 ? 'border-2 border-yellow-200' : ''}`}>
          {position}
        </div>
      )}
    </div>
  );
}
