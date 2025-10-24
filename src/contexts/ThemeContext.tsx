import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme = 'default' | 'halloween' | 'christmas';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('app_theme');
    return (savedTheme as Theme) || 'default';
  });

  useEffect(() => {
    localStorage.setItem('app_theme', theme);
    
    // Apply theme class to document
    document.documentElement.classList.remove('theme-default', 'theme-halloween', 'theme-christmas');
    document.documentElement.classList.add(`theme-${theme}`);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
