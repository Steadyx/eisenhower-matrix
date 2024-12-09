import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '@redux/slices/themeSlice';
import { RootState } from '@redux/store';
import { Moon, Sun } from 'lucide-react';

const ThemeSwitcher: React.FC = () => {
  const dispatch = useDispatch();
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  const handleToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <button
      onClick={handleToggle}
      className={`
        relative 
        w-12 h-6 sm:w-16 sm:h-8 
        rounded-full p-1
        transition-colors duration-500
        ${darkMode ? 'bg-indigo-950' : 'bg-blue-200'}
        focus:outline-none focus:ring-2 focus:ring-blue-500
        overflow-hidden
        touch-manipulation
        active:scale-95
        transform transition-transform
      `}
      aria-label="Toggle Theme"
    >
      <div className={`
        absolute inset-0 transition-opacity duration-500
        ${darkMode ? 'opacity-100' : 'opacity-0'}
      `}>
        <div className="absolute top-1 left-2 w-0.5 h-0.5 sm:w-1 sm:h-1 bg-white rounded-full" />
        <div className="absolute top-2 left-4 w-0.5 h-0.5 bg-white rounded-full hidden sm:block" />
        <div className="absolute top-2 right-2 w-0.5 h-0.5 sm:w-1 sm:h-1 bg-white rounded-full" />
      </div>

      <div
        className={`
          relative 
          w-4 h-4 sm:w-6 sm:h-6 
          rounded-full
          transform transition-all duration-500 ease-in-out
          ${darkMode ? 'translate-x-6 sm:translate-x-8 bg-indigo-300' : 'translate-x-0 bg-yellow-300'}
          shadow-md
        `}
      >
        <div className={`
          absolute inset-0 transition-opacity duration-500 ease-in-out
          ${darkMode ? 'opacity-100' : 'opacity-0'}
        `}>
          <Moon
            size={12}
            className="absolute inset-0 m-auto text-indigo-950 sm:hidden"
          />
          <Moon
            size={16}
            className="absolute inset-0 m-auto text-indigo-950 hidden sm:block"
          />
        </div>
        <div className={`
          absolute inset-0 transition-opacity duration-500 ease-in-out
          ${darkMode ? 'opacity-0' : 'opacity-100'}
        `}>
          <Sun
            size={12}
            className="absolute inset-0 m-auto text-yellow-600 sm:hidden"
          />
          <Sun
            size={16}
            className="absolute inset-0 m-auto text-yellow-600 hidden sm:block"
          />
        </div>
      </div>

      <div className={`
        absolute bottom-1 
        left-6 sm:left-8 
        w-2 sm:w-3 h-1.5 sm:h-2 
        rounded-full
        transition-all duration-500
        ${darkMode ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0 bg-white'}
      `} />
    </button>
  );
};

export default ThemeSwitcher;
