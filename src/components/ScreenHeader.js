import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useTheme from '../hooks/useTheme';
import Icon from './Icon';
import { haptic } from '../utils/haptics';

const ScreenHeader = ({ title, subtitle, onBack, right }) => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  return (
    <View style={[styles.wrap, { paddingTop: insets.top + 8 }]}>
      <View style={styles.row}>
        {onBack ? (
          <Pressable
            hitSlop={10}
            onPress={() => {
              haptic.light();
              onBack();
            }}
            style={[styles.iconBtn, { backgroundColor: colors.bgSurface, borderColor: colors.border }]}
          >
            <Icon name="chevron-left" size={20} color={colors.textPrimary} />
          </Pressable>
        ) : (
          <View style={{ width: 38 }} />
        )}
        <View style={styles.titleWrap}>
          <Text numberOfLines={1} style={[styles.title, { color: colors.textPrimary }]}>
            {title}
          </Text>
          {subtitle ? (
            <Text numberOfLines={1} style={[styles.sub, { color: colors.textMuted }]}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        <View style={styles.right}>{right}</View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 18,
    paddingBottom: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  titleWrap: {
    flex: 1,
    paddingHorizontal: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  sub: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
    letterSpacing: 0.1,
  },
  right: {
    width: 38,
    alignItems: 'flex-end',
  },
});

export default ScreenHeader;
