import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import theme, { colors as darkColors } from '../constants/theme';

const lightColors = {
  ...darkColors,
  bg: '#F6F6FB',
  bgElevated: '#FFFFFF',
  bgSurface: '#FFFFFF',
  bgGlass: 'rgba(255,255,255,0.7)',
  bgOverlay: 'rgba(0,0,0,0.45)',
  textPrimary: '#0F0F1A',
  textSecondary: '#4B4B5E',
  textMuted: '#8A8AA0',
  border: 'rgba(0,0,0,0.06)',
  borderStrong: 'rgba(0,0,0,0.12)',
  divider: 'rgba(0,0,0,0.04)',
};

const useTheme = () => {
  const dark = useSelector((s) => s.settings.darkMode);
  return useMemo(
    () => ({
      ...theme,
      isDark: dark,
      colors: dark ? darkColors : lightColors,
    }),
    [dark],
  );
};

export default useTheme;
