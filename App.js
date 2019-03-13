import React from 'react';
import { StyleSheet, Text, View, ListView, Button } from 'react-native';
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

const DashboardTabRoutes = createBottomTabNavigator({
   Home: Navigator,
   Profile: ProfileScreen
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
