import React from 'react';
import { StyleSheet, Text, View, ListView, Button, ActivityIndicator, Image, TouchableOpacity, ScrollView, ActionSheetIOS, Platform, Alert, RefreshControl } from 'react-native';
import { Constants, SQLite } from 'expo';
import ContentRow from './ContentRow';
import * as DatabaseUtil from './DatabaseUtil';

export {
   DatabaseUtil
};

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
      datas: null,
      isLoadingMore: false,
      refreshing: false,
      needReload: true,
      moreCount: 0,
    };

    global.homeScreen = this;
    this.rowOffsets = {}
  }

  componentDidMount() {
    this.firstRead();
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
      // alert("should")
    }

    if(nextState.needReload) {
        this.read();
    }
    return this.state !== nextState;
  }

  firstRead() {
    db.transaction(
      tx => {
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
            // alert(JSON.stringify(_array))
            if(global.currentUser !== null && global.currentUser["picture"] != null) {
              global.container.setState({ selectedPath: global.currentUser["picture"] })
            }
          // }, 3000)}

          tx.executeSql('SELECT * FROM content_likes WHERE user_id = ?', [global.currentUser["id"]], (_, { rows: { _array } }) => {
            // alert("second : " + JSON.stringify(_array))
              global.contents["likes"] = _array
              // alert(JSON.stringify(global.contents["likes"]))
            }
          );
        }

        );
    });
  }

  read() {
    db.transaction(
      tx => {
        let query = 'SELECT * FROM contents ORDER BY id DESC LIMIT ?'
        if(this.state.isLoadingMore) {
          alert("here")
          query = 'SELECT * FROM contents WHERE id < ' + this.state.datas[this.state.datas.length-1]["id"] + ' ORDER BY id DESC LIMIT ?'
        }
        tx.executeSql(query, [(this.state.moreCount+1) * 18], (_, { rows: { _array } }) => {
          // setTimeout(() =>  {
          // const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
          for(var i in _array) {
            if(_array[i]["picture"] === null) {
              _array[i]["picture"] = "https://www.instagram.com/p/BkxfIN4jpeO/media/?size=m";
              break
            }
            // alert(JSON.stringify("first? " + global.contents["likes"]))
            for(var j in global.contents["likes"]) {
              // alert(JSON.stringify(global.contents["likes"][j]))
              if(global.contents["likes"][j]["content_id"] === _array[i]["id"]) {
                _array[i]["like"] = global.contents["likes"][j]["is_like"]
              }
            }
          }

          if(this.state.isLoadingMore) {
            // alert("loadingMore" + _array.length);
            let temp = this.state.datas
            _array = temp.concat(_array)
            this.setState({ dataSource: this.state.dataSource.cloneWithRows(_array), datas: _array, needReload: false, moreCount: this.state.moreCount+1})
          }
          else {
            if(this.state.refreshing) {
              // alert("refreshing" + _array.length);
              this.setState({ dataSource: this.state.dataSource.cloneWithRows(_array), datas: _array, needReload: false, refreshing: false})
            }
            else {
              this.setState({ dataSource: this.state.dataSource.cloneWithRows(_array), datas: _array, needReload: false})
            }
          }
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

  fetchMore() {
    // alert("fetchMore"+this.state.datas.length + ", " + 3*(this.state.moreCount+1))
    if(this.state.datas.length >= 18*(this.state.moreCount+1)) {
      // alert("fetchMore")
      this.read();
    }
    else {
      this.setState({isLoadingMore: false});
    }
  }

  _onRefresh = () => {
    this.setState({refreshing: true, moreCount: 0}, () => this.read());

    // fetchData().then(() => {
      // this.setState({refreshing: false});
    // });
  }

  // heartPressed(data) {
  //   if(data["like"] === undefined) {
  //     data["like"] = 1;
  //     // alert("user : " + global.currentUser["id"] + ", " + data["id"])
  //     db.transaction(
  //       tx => {
  //         tx.executeSql('INSERT INTO content_likes (user_id, content_id, is_like) values (?, ?, ?)', [global.currentUser["id"], data["id"], data["like"]]);
  //         tx.executeSql('SELECT * FROM content_likes WHERE user_id = ?', [global.currentUser["id"]], (_, { rows }) => {
  //           alert(JSON.stringify(rows["_array"]))
  //           global.contents["likes"] = rows
  //         });
  //       },
  //     );
  //   }
  //   else {
  //     if(data["like"] === 1) {
  //       data["like"] = 0;
  //     }
  //     else {
  //       data["like"] = 1;
  //     }
  //
  //     db.transaction(
  //       tx => {
  //         tx.executeSql('UPDATE content_likes SET is_like = ? WHERE user_id = ? AND content_id = ?', [data["like"], global.currentUser["id"], data["id"]]);
  //
  //         tx.executeSql('SELECT * FROM content_likes WHERE user_id = ?', [global.currentUser["id"]], (_, { rows }) => {
  //           alert(JSON.stringify(rows["_array"]))
  //           global.contents["likes"] = rows
  //         });
  //       },
  //     );
  //   }
  //
  //   this.setState({
  //     dataSource: ds.cloneWithRows( this.state.datas ),
  //   })
  //   // alert(JSON.stringify(this.state.datas[0]))
  //
  // }

  render() {
    // alert("datas: " + JSON.stringify(global.selectedPath));
    if(this.state.needReload) {
      return(
        <View style={{ flex: 1, padding: 10 }}>
          <ActivityIndicator size="small" />
        </View>
      );
    } else {
      return (
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(rowData, sectionID, rowID) =>
            <ContentRow
              goToProfile={(data) => {
                DatabaseUtil.readSelectedUser({
                  id: data.user_id,
                }).then(function (tableData) {
                    // resolve()의 결과 값이 여기로 전달됨
                    alert(JSON.stringify(tableData))
                    this.props.navigation.navigate('UserProfile', { data: tableData })
                  }.bind(this))


              }}
              heartPressed={(data) => {
                DatabaseUtil.heartStateUpdate({
                caller: this,
                data: data,
                })
                this.setState({
                  dataSource: ds.cloneWithRows( this.state.datas ),
                })
              }}
              goToComment={(data) => this.props.navigation.navigate('Comment', { data: data })}
              caller= {this}
              rowData= {rowData}
              sectionID= {sectionID}
              rowID= {rowID} />
          }
          enableEmptySections
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
          onEndReachedThreshold={100}
          onEndReached={() =>
              this.setState({ isLoadingMore: true }, () => this.fetchMore())}
          renderFooter={() => {
            return (
              this.state.isLoadingMore &&
              <View style={{ flex: 1, padding: 10 }}>
                <ActivityIndicator size="small" />
              </View>
            );
          }}
        />
      );
    }
  }
}
