import React, {useEffect} from 'react';
import {Text, View} from 'react-native';
import Home from './src/screens/Home';
import SplashScreen from 'react-native-splash-screen';
import MainScreen from './src/navigations/index';
import {Provider} from 'react-redux';
const App = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);
  return <MainScreen />;
};

export default App;
