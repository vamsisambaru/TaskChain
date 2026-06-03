import React from 'react';
import * as LucideIcons from 'lucide-react-native';
import { GithubIcon } from './BrandIcon';

/**
 * Icon — single icon component using Lucide (the maintained successor to Feather).
 *
 * - Renders as SVG via react-native-svg (already linked); no font setup, no rebuild.
 * - Keeps the kebab-case API the rest of the app already uses
 *   (e.g. <Icon name="link-2" />), and maps to Lucide's PascalCase exports.
 * - Brand logos Lucide intentionally omits (github, apple, google) live in BrandIcon
 *   and are routed through the registry below.
 */

const BRAND = {
  github: GithubIcon,
};

const cache = new Map();

const toComponentName = (kebab) => {
  if (cache.has(kebab)) return cache.get(kebab);
  const pascal = kebab.replace(/(^|-)([a-z0-9])/g, (_m, _d, c) => c.toUpperCase());
  cache.set(kebab, pascal);
  return pascal;
};

const Icon = ({ name, size = 20, color = '#F5F5FA', style, strokeWidth = 2 }) => {
  const Brand = BRAND[name];
  if (Brand) return <Brand size={size} color={color} style={style} />;

  const Comp = LucideIcons[toComponentName(name)];
  if (!Comp) {
    if (__DEV__) {
      // Surfaces typos early without crashing the screen.
      // eslint-disable-next-line no-console
      console.warn(`<Icon name="${name}" /> not found in lucide-react-native`);
    }
    return null;
  }
  return <Comp size={size} color={color} strokeWidth={strokeWidth} style={style} />;
};

export default Icon;
