/**
 * Haptics wrapper — never throws if the native module is missing
 * (e.g. in unit tests or before pods/gradle sync).
 */

let HapticFeedback;
try {
  HapticFeedback = require('react-native-haptic-feedback').default;
} catch (e) {
  HapticFeedback = null;
}

const opts = { enableVibrateFallback: true, ignoreAndroidSystemSettings: false };

export const haptic = {
  light() {
    HapticFeedback?.trigger('impactLight', opts);
  },
  medium() {
    HapticFeedback?.trigger('impactMedium', opts);
  },
  heavy() {
    HapticFeedback?.trigger('impactHeavy', opts);
  },
  success() {
    HapticFeedback?.trigger('notificationSuccess', opts);
  },
  warning() {
    HapticFeedback?.trigger('notificationWarning', opts);
  },
  selection() {
    HapticFeedback?.trigger('selection', opts);
  },
};
