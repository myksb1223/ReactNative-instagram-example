import React from 'react';
import { StyleSheet, Text, View, ListView, Button, ActivityIndicator, Image, TouchableOpacity, Dimensions, ScrollView, ActionSheetIOS, Platform, Alert } from 'react-native';
import { Constants, SQLite } from 'expo';

const db = SQLite.openDatabase('db.db');

let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class HomeScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: 'Instagram',
      headerRight: (
        <TouchableOpacity
          style={{flex: 1, marginRight: 12}}
          onPress={() => {
              navigation.navigate('Create', { name: 'Jane' })
            }}>
          <Image style={{width: 30, height: 30}}
           source={ require('./assets/write.png')}/>
        </TouchableOpacity>
      ),
      headerLeft: (
        <TouchableOpacity
          style={{flex: 1, marginLeft: 12}}
          onPress={() => {
              navigation.navigate('User', { name: 'Jane' })
            }}>
          <Image style={{width: 30, height: 30}}
           source={ require('./assets/user_no_profile.png')}/>
        </TouchableOpacity>
      ),
    }
  };

  getDeivceType=()=> {
    return Platform.OS === "ios" ? true : false;
  };

  constructor() {
    super();


    this.state = {
      dataSource: ds.cloneWithRows([]),
      datas: null
    };
  }

  componentWillMount() {
    this.read();
  }

  componentWillReceiveProps(nextProps){
    alert("componentWillReceiveProps: " + JSON.stringify(nextProps));

    if(this.props === nextProps){
      return;
    }

    this.read();
    // TODO perform changes on state change
    // this.camera = nextProps.navigation.getParam('image', null);
    // this.image.setState({image: nextProps.navigation.getParam('image', null)});
  }


  read() {
    db.transaction(
      tx => {
        tx.executeSql('SELECT * FROM contents', [], (_, { rows: { _array } }) => {
          // setTimeout(() =>  {
          // const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
          for(var i in _array) {
            if(_array[i]["picture"] === null) {
              _array[i]["picture"] = "https://www.instagram.com/p/BkxfIN4jpeO/media/?size=m";
              break
            }
          }
            this.setState({ dataSource: this.state.dataSource.cloneWithRows(_array), datas: _array})
            // alert("datas: " + JSON.stringify(this.state.datas));
            // alert(JSON.stringify(_array))
          // }, 3000)}
        }

        );
      },
      // null,
      // this.update
    );
  }

  goToEdit(rowID) {
    let data = this.state.datas[rowID]
    this.props.navigation.navigate('Create', { data: data, image: data["picture"] })
  }

  goToDelete(rowID) {
    let data = this.state.datas[rowID]
    this.delete(data["id"])
    this.deleteRow(rowID)
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

  deleteRow(rowId) {
    // let newDatas = this.state.datas.splice()

    this.state.datas.splice(rowId, 1)
    // alert("datas: " + JSON.stringify(this.state.datas));
    this.setState({
      dataSource: ds.cloneWithRows( this.state.datas ),
    })
  }

  render() {
    // alert("datas: " + JSON.stringify(this.state.datas));
    let {height, width} = Dimensions.get('window');
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={(rowData, sectionID, rowID) =>
          <View style={{flex: 1, flexDirection: 'column', margin: 12}}>
            <View style={{flex: 1, flexDirection: 'row', justifyContent: "center",alignItems: "center", marginBottom: 12}}>
              <Image source={{ uri: rowData.user_pic }}
                style={{ width: 36, height: 36, borderRadius: 18, marginRight: 12 }} />
              <Text style={{flex: 1, textAlign: 'left', textAlignVertical: "center", fontSize: 14, fontWeight: "bold"}}>{rowData.user_name}</Text>
              <TouchableOpacity
                onPress={() => {
                  if(this.getDeivceType()) {
                    ActionSheetIOS.showActionSheetWithOptions({
                      options: ['취소', '수정', '삭제'],
                      cancelButtonIndex: 0,
                    },
                    (buttonIndex) => {
                      if (buttonIndex === 1) {
                        this.goToEdit(rowID)
                      }
                      else if(buttonIndex === 2) {
                        this.goToDelete(rowID)
                      }
                    });
                  }
                  else {

                    Alert.alert(
                      null,
                      'Select menu',
                      [
                        {text: '취소', onPress: () => {}},
                        {text: '수정', onPress: () => this.goToEdit(rowID)},
                        {text: '삭제', onPress: () => this.goToDelete(rowID)},
                      ],
                      { cancelable: true }
                    )
                  }

                  }
                }>
                <Image style={{width: 36, height: 36}}
                resizeMode='center'
                 source={ require('./assets/more.png')}/>
              </TouchableOpacity>
            </View>
            <ScrollView
              style={{ flex: 1, marginBottom: 12}}
              horizontal={true}
              pagingEnabled={true}
              showsHorizontalScrollIndicator={true}

              >
                <Image source={{ uri: rowData.picture, cache: 'force-cache', }} style={{ flex: 1, width:  width-24, height: width-24}} />
                <Image source={{ uri: "https://www.instagram.com/p/BlGcOrlDr5W/media/?size=m", cache: 'force-cache', }} style={{ flex: 1, width:  width-24, height: width-24}} />
            </ScrollView>
            <Text style={{fontSize: 14}}>{rowData.content}</Text>
          </View>
        }
        enableEmptySections
      />
    );
  }
}
