import { Platform } from 'react-native';

export const colors = {
  bg: '#0A0A0F',
  bgElevated: '#12121A',
  bgSurface: '#1A1A24',
  bgGlass: 'rgba(26,26,36,0.7)',
  bgOverlay: 'rgba(10,10,15,0.85)',

  primary: '#7C5CFF',
  primaryDim: '#5B3DDF',
  violet: '#9C7BFF',
  pink: '#FF6BCB',
  cyan: '#5CCFFF',
  green: '#3DDC97',
  amber: '#FFB454',
  red: '#FF5C7A',

  textPrimary: '#F5F5FA',
  textSecondary: '#A1A1B5',
  textMuted: '#5C5C73',

  border: 'rgba(255,255,255,0.06)',
  borderStrong: 'rgba(255,255,255,0.12)',
  divider: 'rgba(255,255,255,0.04)',

  success: '#3DDC97',
  warning: '#FFB454',
  danger: '#FF5C7A',
  info: '#5CCFFF',
};

export const gradients = {
  primary: ['#7C5CFF', '#5B3DDF'],
  violet: ['#9C7BFF', '#7C5CFF'],
  pink: ['#FF6BCB', '#7C5CFF'],
  cyan: ['#5CCFFF', '#7C5CFF'],
  sunrise: ['#FFB454', '#FF6BCB'],
  forest: ['#3DDC97', '#5CCFFF'],
  midnight: ['#1A1A24', '#0A0A0F'],
  glass: ['rgba(124,92,255,0.18)', 'rgba(92,207,255,0.06)'],
  card: ['rgba(255,255,255,0.06)', 'rgba(255,255,255,0.02)'],
};

export const radii = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  pill: 999,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const typography = {
  display: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -0.6,
    lineHeight: 40,
  },
  h1: { fontSize: 28, fontWeight: '700', letterSpacing: -0.4, lineHeight: 34 },
  h2: { fontSize: 22, fontWeight: '700', letterSpacing: -0.3, lineHeight: 28 },
  h3: { fontSize: 18, fontWeight: '600', letterSpacing: -0.2, lineHeight: 24 },
  body: { fontSize: 15, fontWeight: '500', lineHeight: 22 },
  caption: { fontSize: 13, fontWeight: '500', lineHeight: 18 },
  micro: { fontSize: 11, fontWeight: '600', lineHeight: 14, letterSpacing: 0.4 },
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 4,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 8,
  },
  glow: {
    shadowColor: '#7C5CFF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.55,
    shadowRadius: 22,
    elevation: 14,
  },
};

export const animation = {
  spring: { damping: 18, stiffness: 220, mass: 0.8 },
  springSoft: { damping: 22, stiffness: 140, mass: 1 },
  springSnap: { damping: 14, stiffness: 320, mass: 0.7 },
  timingFast: { duration: 180 },
  timingMed: { duration: 280 },
  timingSlow: { duration: 480 },
};

export const isIOS = Platform.OS === 'ios';

const theme = { colors, gradients, radii, spacing, typography, shadows, animation, isIOS };
export default theme;
