import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

export class CountButton extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TouchableOpacity
        style={styles.countButton}
        onPress={() => {
          }}>
        <Text style={styles.countTextLarge}>
          {this.props.count}{'\n'}
          <Text style={styles.countTextSmall}>
            {this.props.type}
          </Text>
        </Text>
      </TouchableOpacity>
    );
  }
}

export class ProfieTopLayout extends React.Component {
  render() {
    return (
      <View style={{flex: 0.88, backgroundColor: '#0000ff', flexDirection: 'row'}}>
        <View style={{flex:1, backgroundColor: 'steelblue', justifyContent: 'center', alignItems: 'center'}}>
          <Image source={{ uri: global.currentUser["picture"] }} style={styles.profileImage}/>
        </View>

        <View style={{flex:3, flexDirection: 'column'}}>
          <View style={{flex: 6.5, backgroundColor: 'red', flexDirection: 'row'}}>
            <CountButton
              count={88}
              type={"게시물"}/>
            <CountButton
              count={146}
              type={"팔로워"}/>
            <CountButton
              count={52}
              type={"팔로잉"}/>
          </View>
          <View style={{flex: 3.5, backgroundColor: 'green'}}>
          </View>
        </View>
      </View>
    );
  }
}

export default class HomeScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: global.currentUser["name"],
      headerTitleStyle: {textAlign:'center', alignSelf:'center',flex:1},
      // headerRight: (
      //   <TouchableOpacity
      //     style={{flex: 1, marginRight: 12}}
      //     onPress={() => {
      //         navigation.navigate('Create', { name: 'Jane' })
      //       }}>
      //     <Image style={{width: 30, height: 30}}
      //      source={ require('./assets/write.png')}/>
      //   </TouchableOpacity>
      // ),
      // headerLeft: (
      //   <TouchableOpacity
      //     style={{flex: 1, marginLeft: 12}}
      //     onPress={() => {
      //         navigation.navigate('User', { name: 'Jane' })
      //       }}>
      //     <Image style={{width: 30, height: 30}}
      //      source={ require('./assets/user_create.png')}/>
      //   </TouchableOpacity>
      // ),
    }
  };

  render() {
    // alert("datas: " + JSON.stringify(this.state.datas));
    return (
      <View style={{flex: 1, flexDirection: 'column'}}>
        <ProfieTopLayout />
        <View style={{flex: 4, backgroundColor: 'skyblue'}} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  countButton: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  countTextLarge: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16
  },
  countTextSmall: {
    color: 'gray',
    fontSize: 10
  },
  profileImage: {
    width:70,
    height:70,
    borderRadius: 35
  }
});
