import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, Dimensions} from 'react-native';
import * as KSBAlert from './KSBAlert';

export {
   KSBAlert
};

export class ContentTopLayout extends React.Component {
  render() {
    let {height, width} = Dimensions.get('window');
    return(
      <View style={{flex: 1, flexDirection: 'column'}}>
        <View style={{flex: 1, flexDirection: 'row', justifyContent: "center", alignItems: "center", marginBottom: 12}}>
          <Image source={{ uri: global.currentUser["picture"], cache: 'force-cache',}}
            style={{ width: 36, height: 36, borderRadius: 18, marginRight: 12 }} />
          <Text style={{flex: 1, textAlign: 'left', textAlignVertical: "center", fontSize: 14, fontWeight: "bold"}}>{global.currentUser.name}</Text>
          <TouchableOpacity
            onPress={() => {
              KSBAlert.showAlert({
                caller: this.props.caller,
                menus: ['취소', '수정', '삭제'],
                type: 1,
                other: 0,
                })
              }
            }>
            <Image style={{width: 25, height: 25}}
            resizeMode='center'
             source={ require('./assets/more.png')}/>
          </TouchableOpacity>
        </View>
        <ScrollView
          style={{ flex: 1, marginBottom: 12}}
          horizontal={true}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={true} >
            <Image source={{ uri: this.props.data.picture, cache: 'force-cache', }} style={{ flex: 1, width:  width-24, height: width-24}} />
            <Image source={{ uri: "https://www.instagram.com/p/BlGcOrlDr5W/media/?size=m", cache: 'force-cache', }} style={{ flex: 1, width:  width-24, height: width-24}} />
        </ScrollView>
        <View style={{flex: 1, flexDirection: 'row', marginBottom: 12}}>
          <TouchableOpacity
            onPress={() => {

              }
            }>
            <Image style={{width: 25, height: 25}}
            resizeMode='contain'
             source={ require('./assets/heart.png')}/>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              }
            }>
            <Image
              source={{ uri: global.chatIcon.localUri || global.chatIcon.uri }}
              resizeMode= 'contain'
              style={{ width: 25, height: 25, marginLeft: 12 }}
              />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {

              }
            }>
            <Image style={{width: 25, height: 25, marginLeft: 12}}
            resizeMode='contain'
             source={ require('./assets/share.png')}/>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default class CreateScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;
    return {
      title: '사진',
      headerRight: (
        <TouchableOpacity
          style={{flex: 1, marginRight: 12}}
          onPress={() => {

            }}>
          <Image style={{width: 25, height: 25}}
           source={ require('./assets/refresh.png')}/>
        </TouchableOpacity>
      ),
    }
  };

  constructor(props) {
    super(props);

    let data = this.props.navigation.getParam("data", null);
    this.state = {
      data: data,
    }
  }

  goToEdit(rowID) {
    this.props.navigation.navigate('Create', { data: this.state.data, image: this.state.data["picture"] })
  }

  goToDelete(rowID) {
    this.delete(this.state.data["id"])
    this.props.navigation.navigate('Profile', { added: '1' })
  }

  delete(contentId) {
    db.transaction(
      tx => {
        tx.executeSql(`DELETE FROM contents WHERE id = ?;`, [contentId]);
      },
      // null,
      // this.update
    )
  }

  render() {
    return (
      <ScrollView style={{flex: 1, flexDirection: 'column', margin: 12}}>
        <View style={{flex: 1, flexDirection: 'column'}}>
          <ContentTopLayout
            caller={this}
            data={this.state.data} />
          <Text style={{fontSize: 14}}>{this.state.data.content}</Text>
        </View>
      </ScrollView>
    );
  }
}
