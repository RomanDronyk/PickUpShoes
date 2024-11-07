import React from 'react';

interface LoaderProps {
  color?: 'white' | 'black';
  fullHeight?: boolean; // Новий параметр для контролю висоти
}

const LoaderNew: React.FC<LoaderProps> = ({ color = 'black', fullHeight = false }) => {
  const borderColor = color === 'white' ? 'border-t-white' : 'border-t-black';
  const heightClass = fullHeight ? 'h-screen' : 'h-full'; // Вибір між повною висотою екрану або контейнера

  return (
    <div className={`flex justify-center items-center ${heightClass}`}>
      <div className={`border-2 border-solid border-gray-200 rounded-full aspect-square h-[100%] animate-spin ${borderColor}`}></div>
    </div>
  );
};

export default LoaderNew;
