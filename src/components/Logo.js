import React from 'react';
import { View } from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Path,
  Rect,
  G,
} from 'react-native-svg';

/**
 * TaskChain logo — single source of truth for every in-app rendering.
 *
 * - `variant="mark"` (default): just the gradient symbol, transparent bg.
 * - `variant="rounded"`: gradient on a rounded-square tile (icon style).
 * - `variant="plain"`: white symbol only (for use over a colored surface).
 *
 * The mark = bold checkmark whose two strokes are styled as interlocking
 * rounded chain segments. Reads clearly at 24px and at 1024px.
 */
const Logo = ({ size = 96, variant = 'mark', style }) => {
  const id = `tc-${variant}-${size}`;
  const tile = variant === 'rounded';
  const plain = variant === 'plain';

  return (
    <View style={[{ width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 120 120">
        <Defs>
          <LinearGradient id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#7C5CFF" />
            <Stop offset="1" stopColor="#5CCFFF" />
          </LinearGradient>
          <LinearGradient id={`${id}-fg`} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#FFFFFF" />
            <Stop offset="1" stopColor="#E9E5FF" />
          </LinearGradient>
          <LinearGradient id={`${id}-shine`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="rgba(255,255,255,0.32)" />
            <Stop offset="1" stopColor="rgba(255,255,255,0)" />
          </LinearGradient>
        </Defs>

        {tile ? (
          <>
            <Rect x="0" y="0" width="120" height="120" rx="26" ry="26" fill={`url(#${id}-bg)`} />
            <Rect x="0" y="0" width="120" height="60" rx="26" ry="26" fill={`url(#${id}-shine)`} />
          </>
        ) : null}

        <G>
          {/* Long stroke of the check — styled as a chain segment */}
          <Path
            d="M52 78 L92 38"
            stroke={tile || plain ? '#FFFFFF' : `url(#${id}-fg)`}
            strokeWidth="14"
            strokeLinecap="round"
            fill="none"
            opacity={tile || plain ? 1 : 1}
          />
          {/* Short stroke — mirrors the chain segment */}
          <Path
            d="M28 60 L52 78"
            stroke={tile || plain ? '#FFFFFF' : `url(#${id}-fg)`}
            strokeWidth="14"
            strokeLinecap="round"
            fill="none"
          />
          {/* Subtle "link" cap at the joint */}
          <Path
            d="M52 78 m -3 0 a 3 3 0 1 0 6 0 a 3 3 0 1 0 -6 0"
            fill={tile || plain ? '#FFFFFF' : `url(#${id}-fg)`}
            opacity={0.85}
          />
        </G>
      </Svg>
    </View>
  );
};

export const LogoMark = (props) => <Logo variant="mark" {...props} />;
export const LogoTile = (props) => <Logo variant="rounded" {...props} />;

export default Logo;
