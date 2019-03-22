import React from 'react';
import { StyleSheet, Text, View, ListView, Button, Image } from 'react-native';
import { createDrawerNavigator, createBottomTabNavigator, createStackNavigator, createAppContainer } from 'react-navigation';
import { Constants, SQLite } from 'expo';
import CreateUserScreen from './CreateUserScreen';
import CreateScreen from './CreateScreen';
import CameraScreen from './CameraScreen';
import HomeScreen from './HomeScreen';
import ProfileScreen from './ProfileScreen';

// let selectedPath = null;
global.currentUser = null;
global.container = null;
global.contents = new Array();
global.contents["map"] = null;
global.contents["list"] = null;
global.allUsers = null;

const db = SQLite.openDatabase('db.db');

const Navigator = createStackNavigator({
  Home: { screen: HomeScreen },
});

// Navigator.navigationOptions = ({ navigation }) => {
//   let { routeName } = navigation.state.routes[navigation.state.index];
//   let navigationOptions = {};
//
//   if (routeName === 'User') {
//     navigationOptions.tabBarVisible = false;
//   }
//
//   return navigationOptions;
// };


// Navigator.navigationOptions = ({ navigation }) => {
//   let drawerLockMode = 'unlocked';
//   if (navigation.state.index > 0) {
//     drawerLockMode = 'locked-closed';
//   }
//
//   return {
//     drawerLockMode,
//   };
// };

Navigator.navigationOptions = ({ navigation }) => {
  let drawerLockMode = 'unlocked';
  if (navigation.state.index > 0) {
    drawerLockMode = 'locked-closed';
  }

  if (navigation.state.index > 0) {

  }

  return {
    drawerLockMode: drawerLockMode,
  };
};

const ProfileNavigator = createStackNavigator({
  Profile: { screen: ProfileScreen },
});

const RootDrawer = createDrawerNavigator({
    NavigatorHome : {
      screen: Navigator,
    }
  });

const HomeStack = createStackNavigator({
    Drawer: { screen: RootDrawer,
      navigationOptions: {
          header:null
      }, },
    User: { screen: CreateUserScreen },
    Create: { screen: CreateScreen },
    Camera: { screen: CameraScreen },
    /* add routes here where you want the drawer to be locked */
  });

HomeStack.navigationOptions = ({ navigation }) => {
    let tabBarVisible = true;
    if (navigation.state.index > 0) {
      tabBarVisible = false;
    }

    return {
      tabBarVisible: tabBarVisible,
    };
  };


const DashboardTabRoutes = createBottomTabNavigator({
   Home: { screen: HomeStack },
   Profile: { screen: ProfileNavigator,
            },
},
{
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName = '';
        if (routeName === 'Home') {
          iconName = focused ? require('./assets/home_focused.png') : require('./assets/home.png');
          return <Image source={ iconName } style={{width: 25, height: 25}}/>;

          // iconName = `./assets/home${focused ? '_focused' : ''}.png`;
          // Sometimes we want to add badges to some icons.
          // You can check the implementation below.
          // IconComponent = HomeIconWithBadge;
        } else if (routeName === 'Profile') {
          if(global.currentUser === null || global.currentUser["picture"] === null) {
            iconName = focused ? require('./assets/profile_focused.png') : require('./assets/profile.png');

          // iconName = `./assets/profile${focused ? '_focused' : ''}.png`;
            return <Image source={ iconName } style={{width: 25, height: 25}}/>;
          }
          else {
            return <Image source={{ uri: global.currentUser["picture"] }} style={{width: 25, height: 25}}/>;
          }
        }

        // You can return any component that you like here!

      },
    }),
    // lazy: true,
    tabBarOptions: {
      showLabel: false,
      activeTintColor: 'tomato',
      inactiveTintColor: 'gray',
    },
  });
// alert("componentWillReceiveProps: " + JSON.stringify(DashboardTabRoutes));
const Container = createAppContainer(DashboardTabRoutes);

export default class App extends React.Component {
  constructor() {
    super();


    this.state = {
      selectedPath: null,
    };

    global.container = this;
  }

  componentDidMount() {
        // alert("componentWillReceiveProps: " + JSON.stringify(this.props));
      db.transaction(tx => {
        // tx.executeSql('DROP TABLE users;');
        // tx.executeSql('DROP TABLE contents;');
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS contents (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT, picture TEXT, user_id INTEGER, user_name TEXT, user_pic TEXT);'
        );
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, picture TEXT, current INTEGER DEFAULT 0);'
        );

        tx.executeSql('SELECT * FROM users', [], (_, { rows: { _array } }) => {
          // setTimeout(() =>  {
            for(var i in _array) {
              if(1 === _array[i]["current"]) {
                global.currentUser = _array[i]
                break
              }
            }

            global.allUsers = _array
            // global.selectedPath = selectedPath;
            // alert(JSON.stringify(selectedPath))
            this.setState({ selectedPath: global.currentUser["picture"] })


          // }, 3000)}
        }

        );
      });
    }

  // shouldComponentUpdate(nextProps, nextState) {
  //   // alert("here : " + JSON.stringify(nextState))
  //   return true;
  // }

  render() {
    // alert("path : " + JSON.stringify(global.selectedPath))
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
