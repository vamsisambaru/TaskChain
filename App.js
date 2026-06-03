/**
 * TaskChain — root entry.
 * Wires Redux + safe-area + gesture handler + navigation.
 */

import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar, View, StyleSheet } from 'react-native';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import store from './src/redux/store';
import RootNavigator from './src/navigation/RootNavigator';
import './global.css';

const App = () => (
  <GestureHandlerRootView style={styles.root}>
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <View style={styles.root}>
          <RootNavigator />
        </View>
      </SafeAreaProvider>
    </Provider>
  </GestureHandlerRootView>
);

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0A0A0F' },
});

export default App;
