import React from 'react';
import { StyleSheet, Text, View, ListView, Button, ActivityIndicator, Image, TouchableOpacity, ScrollView, ActionSheetIOS, Platform, Alert } from 'react-native';
import { Constants, SQLite } from 'expo';
import ContentRow from './ContentRow';

const db = SQLite.openDatabase('db.db');

let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class HomeScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: 'Instagram',
      headerTitleStyle: {textAlign:'center', alignSelf:'center',flex:1},
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
           source={ require('./assets/user_create.png')}/>
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

    global.homeScreen = this;
    this.rowOffsets = {}
  }

  componentWillMount() {
    this.read();
  }

  componentWillReceiveProps(nextProps){

    if(this.props === nextProps){
      return;
    }

    this.read();

    if(global.profileScreen !== null) {
      global.profileScreen.setState({needReload: true});
    }

    global.container.setState({selectedPath: global.currentUser["picture"]})
    // alert("componentWillReceiveProps: " + JSON.stringify(global.container.state));
    // TODO perform changes on state change
    // this.camera = nextProps.navigation.getParam('image', null);
    // this.image.setState({image: nextProps.navigation.getParam('image', null)});
  }

  shouldComponentUpdate(nextProps, nextState) {
    if(this.state !== nextState) {
      alert("should")
    }

    if(nextState.needReload) {
        this.read();
    }
    return this.state !== nextState;
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
            this.setState({ dataSource: this.state.dataSource.cloneWithRows(_array), datas: _array, needReload: false})
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
    // alert("datas: " + JSON.stringify(global.selectedPath));
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={(rowData, sectionID, rowID) =>
          <ContentRow
            goToComment={(data) => this.props.navigation.navigate('Comment', { data: data })}
            caller= {this}
            rowData= {rowData}
            sectionID= {sectionID}
            rowID= {rowID} />
        }
        enableEmptySections
      />
    );
  }
}
