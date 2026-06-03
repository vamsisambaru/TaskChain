# TaskChain

A premium, dark-luxury mobile to-do app built on a real Data-Structures-and-Algorithms backbone. React Native CLI · JavaScript · Redux Toolkit · Reanimated · NativeWind.

## Highlights

- **DSA-backed core** — every interaction in the UI is wired to a real data structure:
  - `LinkedList` — primary task store, O(1) prepend/append.
  - `DoublyLinkedList` — prev/next navigation in TaskDetails.
  - `Stack` — undo-delete stack (capacity 50).
  - `Queue` — bounded ring buffer for the recent-activity feed.
  - `MergeSort` — stable sort by due date / priority / title / created.
  - `PriorityQueue` (min-heap) — "Smart picks" engine combining priority weight + due-date urgency.
- **Premium UI** — glassmorphism, gradient orbs, animated rings, donut/bar charts, spring-driven gestures.
- **Production architecture** — Redux Toolkit slices, async thunks for hydration, AsyncStorage persistence, custom hooks, reusable components, animated bottom sheets.
- **Eight screens** — Splash, Onboarding, Auth, Home, Tasks, TaskDetails, Analytics, Settings.

## Project layout

```
src/
├── animations/   # reusable reanimated layout transitions
├── components/   # reusable UI building blocks (cards, charts, buttons, sheets)
├── constants/    # theme, categories, onboarding copy
├── dsa/          # LinkedList, DoublyLinkedList, Stack, Queue, MergeSort, PriorityQueue
├── hooks/        # custom hooks (useTheme, useTaskNavigator, useEntranceAnimation)
├── navigation/   # NavigationContainer, custom TabBar, RootNavigator
├── redux/        # store + tasks/auth/settings slices + selectors
├── screens/      # 8 production screens + AddTaskSheet
├── services/     # TaskStore (DSA singleton facade) + AsyncStorage helpers
└── utils/        # date helpers, haptics wrapper
```

## Why a singleton TaskStore?

Redux state must be serializable. A live `LinkedList` instance with `next` pointers is not. The `TaskStore` singleton owns the live DSA structures; reducers call into it (`add`, `remove`, `undoDelete`) and dispatch the resulting array snapshot into Redux. Components stay pure-React, the DSA stays real.

## Run

```sh
npm install
# iOS
cd ios && bundle install && bundle exec pod install && cd ..
npm run ios
# Android
npm run android
```

Vector icons require one extra step on each platform — link the `Feather` font (see [react-native-vector-icons docs](https://github.com/oblador/react-native-vector-icons#installation)).
