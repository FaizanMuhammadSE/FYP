/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import Home from './components/homeScreen/home';
import Action from './components/dummy/actionButton';
import NavigationApp from './components/NavigationTesting/Navigation.js';
import BottomNavigation from './components/dummy/bottomTabNav';
import ModalApp from './components/ModalsPractice/Modal';
import MainNavigtion from './src/navigation/mainPages/index.js';
import {name as appName} from './app.json';
import TimeSlots from './src/testt/TimeSlots';
import Practice from './components/trianglePractice/index';
import ModalTest from './src/testt/ModalTest';
import AutoComplete from './src/testt/AutoComplete';
import SplashScreen from './src/screens/splash';
import ImportTesting from './components/dummy/importExportTestin/parentComponent.js';
import SearchOnMap from './src/screens/guestSearch/components/searchOnMap.js';
import NavigationTesting from './src/testt/NavigatonTesting/navigation.js';
import StateTesting from './src/testt/stateTesting.js';
//AppRegistry.registerComponent(appName, () => BottomNavigation);
//AppRegistry.registerComponent(appName, () => NavigationApp);

//AppRegistry.registerComponent(appName, () => ImportTesting);
AppRegistry.registerComponent(appName, () => MainNavigtion);
//AppRegistry.registerComponent(appName, () => StateTesting);
//AppRegistry.registerComponent(appName, () => SplashScreen);
//AppRegistry.registerComponent(appName, () => NavigationTesting);

//AppRegistry.registerComponent(appName, () => AutoComplete);
//AppRegistry.registerComponent(appName, () => Practice);
//AppRegistry.registerComponent(appName, () => TimeSlots);
//AppRegistry.registerComponent(appName, () => TimeSlots);
//AppRegistry.registerComponent(appName, () => ModalTest);
//AppRegistry.registerComponent(appName, () => SearchOnMap);
