import React from 'react';
import { View, Image } from 'react-native';


export default class profileTabbarIcon extends React.Component {

  render() {
    if(global.currentUser === null || global.currentUser["picture"] === null) {
      let iconName = this.props.focused ? require('./assets/profile_focused.png') : require('./assets/profile.png');
      return (
        <View style={{width: 30, height: 30, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'black', borderRadius: 15}}>
          <Image source={ iconName } style={{width: 25, height: 25}}/>
        </View>
      );
    }
    else {
      if(this.props.focused) {
        return (
          <View style={{width: 30, height: 30, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'black', borderRadius: 15}}>
            <Image source={{ uri: global.currentUser["picture"] }} style={{width: 25, height: 25, borderRadius: 12.5}}/>
          </View>
        );
      }
      else {
        // alert("componentWillReceiveProps: " + JSON.stringify(this.props.focused));
        return (
          <Image source={{ uri: global.currentUser["picture"] }} style={{width: 25, height: 25, borderRadius: 12.5}}/>
        );
      }
    }
  }
}
