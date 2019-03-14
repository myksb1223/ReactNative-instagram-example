import React from 'react';
import { StyleSheet, Text, View, ListView, Button, Image } from 'react-native';
import { createBottomTabNavigator, createStackNavigator, createAppContainer } from 'react-navigation';
import { Constants, SQLite } from 'expo';
import CreateUserScreen from './CreateUserScreen';
import CreateScreen from './CreateScreen';
import CameraScreen from './CameraScreen';
import HomeScreen from './HomeScreen';
import ProfileScreen from './ProfileScreen';

const db = SQLite.openDatabase('db.db');

const Navigator = createStackNavigator({
  Home: { screen: HomeScreen },
  User: { screen: CreateUserScreen },
  Create: { screen: CreateScreen },
  Camera: { screen: CameraScreen },
});

const ProfileNavigator = createStackNavigator({
  Profile: { screen: ProfileScreen },
});

const DashboardTabRoutes = createBottomTabNavigator({
   Home: Navigator,
   Profile: ProfileNavigator
},
{
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName = '';
        if (routeName === 'Home') {
          iconName = focused ? require('./assets/home_focused.png') : require('./assets/home.png');

          // iconName = `./assets/home${focused ? '_focused' : ''}.png`;
          // Sometimes we want to add badges to some icons.
          // You can check the implementation below.
          // IconComponent = HomeIconWithBadge;
        } else if (routeName === 'Profile') {
          iconName = focused ? require('./assets/profile_focused.png') : require('./assets/profile.png');

          // iconName = `./assets/profile${focused ? '_focused' : ''}.png`;
        }

        // You can return any component that you like here!
        return <Image source={ iconName } style={{width: 25, height: 25}}/>;
      },
    }),
    tabBarOptions: {
      showLabel: false,
      activeTintColor: 'tomato',
      inactiveTintColor: 'gray',
    },
  });

const Container = createAppContainer(DashboardTabRoutes);

export default class App extends React.Component {
  componentDidMount() {
      db.transaction(tx => {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS contents (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT, picture TEXT, user_id INTEGER, user_name TEXT, user_pic TEXT);'
        );
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, picture TEXT);'
        );
      });
    }

  render() {
    return (
      <Container />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});
