import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ListView, Dimensions, TouchableWithoutFeedback, RefreshControl, ActivityIndicator } from 'react-native';
import { Constants, SQLite } from 'expo';
import ContentRow from './ContentRow';
import ContentScreen from './ContentScreen';
import * as DatabaseUtil from './DatabaseUtil';

export {
   DatabaseUtil
};

const db = SQLite.openDatabase('db.db');

let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
let userDs = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export class CountButton extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TouchableOpacity
        style={styles.countButton}
        onPress={() => {
          this.props.moveToFirst();
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
      <View style={{flex: 0.88, flexDirection: 'row'}}>
        <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
          <Image source={{ uri: this.props.currentUser["picture"] }} style={styles.profileImage}/>
        </View>

        <View style={{flex:3, flexDirection: 'column'}}>
          <View style={{flex: 1.5}} />
          <View style={{flex: 6.5, flexDirection: 'row'}}>
            <CountButton
              moveToFirst={() => this.props.moveToFirst()}
              count={88}
              type={"게시물"}/>
            <CountButton
              count={146}
              type={"팔로워"}/>
            <CountButton
              count={52}
              type={"팔로잉"}/>
          </View>
          <View style={{flex: 3.3, justifyContent: 'center'}}>
            <TouchableOpacity
              style={{flex: 1, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderRadius: 5, borderColor: 'lightgray'}}
              onPress={() => {
                this.props.updateProfile();
                }}>
              {this.props.currentUser.id === global.currentUser.id ? <Text style={{fontSize: 14, fontWeight: 'bold'}}>
                프로필 수정
              </Text> : <Text style={{fontSize: 14, fontWeight: 'bold'}}>
                팔로우
              </Text>}
            </TouchableOpacity>
          </View>
          <View style={{flex: 1.5}} />
        </View>
        <View style={{flex: 0.15}} />
      </View>
    );
  }
}

export class ProfileLayout extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      type: 0,
    };
  }

  renderIcon(type) {
    if(this.state.type === 0) {
      if(this.state.type === type) {
        return (
          <Image style={{width: 25, height: 25}}
           source={ require('./assets/grid_focused.png')}/>
        );
      }

      if(type === 1) {
        return (
          <Image style={{width: 25, height: 25}}
           source={ require('./assets/list.png')}/>
        );
      }
      else if(type === 2) {
        return (
          <Image style={{width: 25, height: 25}}
           source={ require('./assets/folder.png')}/>
        )
      }
    }
    else if(this.state.type === 1) {
      if(this.state.type === type) {
        return (
          <Image style={{width: 25, height: 25}}
           source={ require('./assets/list_focused.png')}/>
        );
      }

      if(type === 0) {
        return (
          <Image style={{width: 25, height: 25}}
           source={ require('./assets/grid.png')}/>
        );
      }
      else if(type === 2) {
        return (
          <Image style={{width: 25, height: 25}}
           source={ require('./assets/folder.png')}/>
        );
      }
    }
    else {
      if(this.state.type === type) {
        return (
          <Image style={{width: 25, height: 25}}
           source={ require('./assets/folder_focused.png')}/>
        );
      }

      if(type === 0) {
        return (
          <Image style={{width: 25, height: 25}}
           source={ require('./assets/grid.png')}/>
        );
      }
      else if(type === 1) {
        return (
          <Image style={{width: 25, height: 25}}
           source={ require('./assets/list.png')}/>
        );
      }
    }
  }

  render() {
    return (
      <View style={{flex: 1, flexDirection: 'column', marginTop: 14}}>
        <ProfieTopLayout
          moveToFirst={() => this.props.moveToFirst()}
          updateProfile={() => {this.props.updateProfile()}}
          currentUser={this.props.currentUser}/>
        <View style={{flex: 1, marginTop: 14, marginLeft: 14, marginRight: 14}} >
          <Text style={{ fontWeight: 'bold'}}>{this.props.currentUser["name"]}</Text>
          <Text>{this.props.currentUser["info"]}</Text>
        </View>
        <View style={{flex: 1, flexDirection: 'row', marginTop:14, paddingTop: 8, paddingBottom: 8, borderWidth: 0.5, borderColor: 'lightgray'}} >
          <TouchableOpacity
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
            onPress={() => {
              this.props.onSelectType(0);
              this.setState({type: 0});
              }}>
              {this.renderIcon(0)}
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
            onPress={() => {
              this.props.onSelectType(1);
              this.setState({type: 1});
              }}>
              {this.renderIcon(1)}
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
            onPress={() => {
              this.props.onSelectType(2);
              this.setState({type: 2});
              }}>
              {this.renderIcon(2)}
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export class ProfileRow extends React.Component {
  constructor(props) {
    super(props);

    // this.state = {
    //   type: 0,
    // };
  }

  onLayout(event, rowID) {
    // alert("here render gird " + event.nativeEvent.layout.y)

    this.onRowLayout(event.nativeEvent.layout.y, rowID);
  }

  renderGridContent(rowData, rowID) {
    let {height, width} = Dimensions.get('window');
    let cellWidth = width / 3;

    if(rowData.length === 1) {
      return (
        <View style={{flex: 1, flexDirection: 'row'}} onLayout={(event) => this.onLayout(event, rowID)}>
          <TouchableOpacity
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
            onPress={() => {
              this.props.goToContentScreen(rowData[0])
              }}>
              <Image style={{width: cellWidth, height: cellWidth}}
               source={{ uri: rowData[0].picture }}/>
          </TouchableOpacity>
          <View style={{flex: 1}} />
          <View style={{flex: 1}} />
        </View>
      );
    }
    else if(rowData.length === 2) {
      return (
        <View style={{flex: 1, flexDirection: 'row'}} onLayout={(event) => this.onLayout(event, rowID)}>
          <TouchableOpacity
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
            onPress={() => {
              this.props.goToContentScreen(rowData[0])
              }}>
              <Image style={{width: cellWidth, height: cellWidth}}
               source={{ uri: rowData[0].picture }}/>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
            onPress={() => {
              this.props.goToContentScreen(rowData[1])
              }}>
              <Image style={{width: cellWidth, height: cellWidth}}
               source={{ uri: rowData[1].picture }}/>
          </TouchableOpacity>
          <View style={{flex: 1}} />
        </View>
      );
    }
    else {
      return (
        <View style={{flex: 1, flexDirection: 'row'}} onLayout={(event) => this.onLayout(event, rowID)}>
          <TouchableOpacity
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
            onPress={() => {
              this.props.goToContentScreen(rowData[0])
              }}>
              <Image style={{width: cellWidth, height: cellWidth}}
               source={{ uri: rowData[0].picture }}/>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
            onPress={() => {
              this.props.goToContentScreen(rowData[1])
              }}>
              <Image style={{width: cellWidth, height: cellWidth}}
               source={{ uri: rowData[1].picture }}/>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
            onPress={() => {
              this.props.goToContentScreen(rowData[2])
              }}>
              <Image style={{width: cellWidth, height: cellWidth}}
               source={{ uri: rowData[2].picture }}/>
          </TouchableOpacity>
        </View>
      );
    }
  }

  onRowLayout(y, rowID) {
    // alert("here render gird " + y)
    this.props.sendOffset(y, rowID);

  }

  goToEdit(rowID) {
    this.props.goToEdit(rowID, 0)
  }

  goToDelete(rowID) {
    this.props.goToEdit(rowID, 1)
  }

  render() {

    let {height, width} = Dimensions.get('window');
    let cellWidth = width / 3;
    if(this.props.rowID === "0") {
      return(
        <ProfileLayout
          moveToFirst={() => this.props.moveToFirst()}
          onSelectType={(type) => this.props.onSelectType(type)}
          updateProfile={() => this.props.updateProfile()}
          currentUser={this.props.currentUser}/>
      );
    }
    else {
      // alert("datas: " + JSON.stringify(this.props.type));
      if(this.props.type === 0) {
        return(
          this.renderGridContent(this.props.rowData, this.props.rowID)
        );
      }
      else if(this.props.type === 1) {
        // alert("datas: " + JSON.stringify(this.props));
        return(
          <ContentRow
            heartPressed={(data) => {this.props.heartPressed(data)}}
            goToComment={(data) => this.props.goToComment(data)}
            sendOffset={(y, rowID) => this.onRowLayout(y, rowID)}
            caller= {this}
            rowData= {this.props.rowData}
            sectionID= {this.props.sectionID}
            rowID= {this.props.rowID} />
        );
      }
      else {
        return(
          <View />
        );
      }
    }
  }
}

export class ProfileHeaderTitle extends React.Component {
  constructor() {
    super();

    this.state = { isPopUp: false, };
  }

  updatePopup(isPopUp) {
    this.setState({isPopUp: isPopUp});
    this.props.onPopupView(isPopUp);
  }

  render() {
    return (
      <TouchableOpacity
        style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}
        onPress={() => {
            this.updatePopup(!this.state.isPopUp)
          }}>
          <Text style={{fontWeight: 'bold', fontSize: 16}}>{global.currentUser["name"]}</Text>
          {!this.state.isPopUp ? <Image style={{width: 15, height: 15}} source={ require('./assets/drop_down.png')}/> : <Image style={{width: 15, height: 15}} source={ require('./assets/drop_up.png')}/>}
      </TouchableOpacity>
    );
  }
}

let _this;

const scrollOffset = y => ({
  y,
  x: 0,
  animated: true
})

export default class ProfileScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;
    return {
      // title: global.currentUser["name"],
      headerTitle: <ProfileHeaderTitle
                    ref={title => {
                      navigation.title = title;
                    }}
                    onPopupView={params.updatePopup}/>,
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

  componentWillMount() {

    this.read();
    // alert('willmount');
  }

  constructor(props) {
    super(props);

    // let map = new Array();
    // map[0] = new Array();
    // map[0]["profile"] = "profile"

    let data = this.props.navigation.getParam("data", null);

    let mine = true;
    if(data !== null) {
      mine = false;
      this.currentUser = data;
    }
    else {
      this.currentUser = global.currentUser;
    }
// alert("datas: " + JSON.stringify(this.currentUser));
    this.state = {
      dataSource: ds.cloneWithRows([""]),
      userDataSource: userDs.cloneWithRows(global.allUsers),
      popUp: false,
      ready: false,
      type: 0,
      needReload: false,
      needReloadOnlyProfile: false,
      refreshing: false,
      isLoadingMore: false,
      moreCount: 0,
      map: null,
      list: null,
      mine: mine,
    };
    _this = this;
    this.props.navigation.setParams({
      updatePopup: this.updatePopup,
    });

    if(mine) {
      global.profileScreen = this;
    }
    this.rowOffsets = {}
    // alert("datas: " + JSON.stringify(global.allUsers));
  }

  read() {
    // alert("datas: " + JSON.stringify(global.currentUser["id"]));

    if(this.state.isLoadingMore || this.state.refreshing) {
      global.homeScreen.setState({needReload: true});
    }

    let map = new Array();
    db.transaction(

      tx => {
        let query = 'SELECT * FROM contents WHERE user_id = ? ORDER BY id DESC LIMIT ?'
        if(this.state.isLoadingMore) {
          // alert("here")
          query = 'SELECT * FROM contents WHERE user_id = ? AND id < ' + global.contents["list"][global.contents["list"].length-1]["id"] + ' ORDER BY id DESC LIMIT ?'
        }

        tx.executeSql(query, [this.currentUser.id, (this.state.moreCount+1) * 18], (_, { rows: { _array } }) => {
          // setTimeout(() =>  {
          // const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

          let j = -1;
          for(var i in _array) {
            for(var k in global.contents["likes"]) {
              if(global.contents["likes"][k]["content_id"] === _array[i]["id"]) {
                // alert("datas: " + JSON.stringify(global.contents["likes"][k]["content_id"]));
                _array[i]["like"] = global.contents["likes"][k]["is_like"]
              }
            }
            if(i % 3 === 0) {
              let subMap = new Array();
              j = j + 1;
              map[j] = subMap;
            }
            if(_array[i]["picture"] === null) {
              _array[i]["picture"] = "https://www.instagram.com/p/BkxfIN4jpeO/media/?size=m";
              break
            }
            map[j][i%3] = _array[i];
          }



          if(this.state.isLoadingMore) {
            let tempMap = global.contents["map"]
            let tempList = global.contents["list"]

            if(!this.state.mine) {
              tempMap = this.state.map;
              tempList = this.state.list;
            }
            map = tempMap.concat(map)
            _array = tempList.concat(_array)

            let renderDatas = undefined
            if(this.state.type === 0) {
              renderDatas = map;
            }
            else {
              renderDatas = _array;
            }
            if(this.state.mine) {
              global.contents["map"] = map;
              global.contents["list"] = _array;
            }

            this.setState({ dataSource: this.state.dataSource.cloneWithRows(renderDatas), ready: true, needReload: false, moreCount: this.state.moreCount+1, map: map, list: _array})
          }
          else {
            if(this.state.mine) {
              map.unshift(global.currentUser)
              _array.unshift(global.currentUser)
            }
            else {
              map.unshift(this.data)
              _array.unshift(this.data)
            }

            let renderDatas = undefined
            if(this.state.type === 0) {
              renderDatas = map;
            }
            else {
              renderDatas = _array;
            }

            if(this.state.mine) {
              global.contents["map"] = map;
              global.contents["list"] = _array;
            }

            this.setState({ dataSource: this.state.dataSource.cloneWithRows(renderDatas), ready: true, needReload: false, refreshing: false, map: map, list: _array})
          }


          // global.homeScreen.setState({needReload: true});
            // alert("datas: " + JSON.stringify(map[1].length));
            // alert(JSON.stringify(_array))
          // }, 3000)}
        }

        );
      },
      // null,
      // this.update
    );

    // this.setState({ dataSource: this.state.dataSource.cloneWithRows(global.currentUser), datas: null})
  }

  componentWillReceiveProps(nextProps){

    if(this.props === nextProps){
      return;
    }
    //
    if(this.state.mine) {
      if(global.contents["map"] != null && global.contents["list"] != null) {
        // alert("componentWillReceiveProps: " + JSON.stringify(global.contents["map"]));

        global.contents["map"].splice(0, 1, global.currentUser);
        global.contents["list"].splice(0, 1, global.currentUser);
        this.setState({needReload: true})
        global.homeScreen.setState({needReload: true});
      }

      global.container.setState({selectedPath: global.currentUser["picture"]})
    }

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

  updatePopup(popUp) {
    // alert("popup : " + JSON.stringify(_this.props.navigation.title.state))
    _this.setState({popUp: popUp});
  }

  updateType(type) {
    if(type === 0) {
      this.setState({type: type, dataSource: ds.cloneWithRows(this.state.map)})
    }
    else if(type === 1) {
      this.setState({type: type, dataSource: ds.cloneWithRows(this.state.list)})
    }
    else {
      // this.scrollToRow(1)
      this.setState({type: type, dataSource: ds.cloneWithRows([this.currentUser])})
    }
  }

  scrollToRow = (rowID) => {
    // alert("datas: " + JSON.stringify(this.rowOffsets));
    if (this.listView && this.rowOffsets[rowID]) {
      this.listView.getScrollResponder().scrollTo(scrollOffset(this.rowOffsets[rowID]))
    }
  }

  onRowLayout(y, rowID) {
    //12 is margin
    if(this.state.type === 0) {
      this.rowOffsets[rowID] = y
    }
    else if(this.state.type === 1) {
      this.rowOffsets[rowID] = y-12
    }

    // alert("datas!!!: " + rowID)
  }

  //수정 및 삭제는 리스트에서만 바로 할 수 있다.
  goToEdit(rowID, type) {
    if(type == 0) {
      let data = global.contents["list"][rowID]
      this.props.navigation.navigate('Create', { data: data, image: data["picture"] })
    }
    else {
      let data = global.contents["list"][rowID]
      this.delete(data["id"])
      this.deleteRow(rowID)
    }
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

    global.contents["list"].splice(rowId, 1)
    let map = new Array();
    for(var i in global.contents["list"]) {
      if(i !== 0) {
        if(i % 3 === 0) {
          let subMap = new Array();
          j = j + 1;
          map[j] = subMap;
        }
        map[j][i%3] = global.contents["list"][i];
      }
    }

    map.unshift(global.currentUser);
    global.contents["map"] = map;
    // alert("datas: " + JSON.stringify(this.state.datas));
    this.setState({
      dataSource: ds.cloneWithRows( global.contents["list"] ),
      list: global.contents["list"],
      map: map,
    })
  }

  fetchMore() {
    // alert("fetchMore"+this.state.datas.length + ", " + 3*(this.state.moreCount+1))
    if(this.state.type !== 2) {
      let datas = [this.currentUser]
      if(this.state.type === 0) {
        datas = this.state.map
      }
      else if(this.state.type === 1) {
        datas = this.state.list
      }

      if(datas.length >= 18*(this.state.moreCount+1)) {
        // alert("fetchMore")
        this.read();
      }
      else {
        this.setState({isLoadingMore: false});
      }
    }
  }

  _onRefresh = () => {
    if(this.state.type !== 2) {
      this.setState({refreshing: true, moreCount: 0}, () => this.read());
    }


    // fetchData().then(() => {
      // this.setState({refreshing: false});
    // });
  }

  //리스트 뷰의 renderRow 내에서는 {}를 사용하지 않는다.
  render() {
    // alert("datas: " + JSON.stringify(this.state.type));
    let {height, width} = Dimensions.get('window');
    return (
      <View>
        <ListView
          onScroll={this.onScroll}
          ref={component => this.listView = component}
          dataSource={this.state.dataSource}
          renderRow={(rowData, sectionID, rowID) =>
            <ProfileRow
              heartPressed={(data) => {
                DatabaseUtil.heartStateUpdate({
                caller: this,
                user: global.currentUser,
                data: data,
                })
                global.contents["list"] = this.state.list
                this.setState({
                  dataSource: ds.cloneWithRows(this.state.list)
                })
                global.homeScreen.setState({needReload: true})
              }}
              goToEdit={(id, type) => this.goToEdit(id, type)}
              goToContentScreen={(data) => this.props.navigation.navigate('Content', { data: data })}
              moveToFirst={() => this.scrollToRow(1)}
              sendOffset={(y, rowID) => this.onRowLayout(y, rowID)}
              rowData={rowData}
              sectionID={sectionID}
              rowID={rowID}
              currentUser={this.currentUser}
              type={this.state.type}
              onSelectType={(type) => this.updateType(type)}
              goToComment={(data) => this.props.navigation.navigate('Comment', { data: data })}
              updateProfile={() => this.props.navigation.navigate('User', { data: global.currentUser, image: global.currentUser["picture"] })} />
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
        {this.state.popUp && <View style={{flex: 1, flexDirection: 'column', position: 'absolute', left: 0, top: 0, backgroundColor: 'rgba(1, 0, 0, 0.6)', width: width, height: height}}>
          <TouchableOpacity style={{flex: 1}}
          activeOpacity={1}
          onPress={() => {
            // alert("here");
            _this.props.navigation.title.updatePopup(false)
            }}>
            <ListView
              dataSource={this.state.userDataSource}
              renderRow={(rowData, sectionID, rowID) =>
                <View style={{flex: 1, backgroundColor: 'white', flexDirection: 'row', }}>
                  <View style={{flex: 1, backgroundColor: 'white', flexDirection: 'row', margin: 10}}>
                    <Image source={rowData["id"] === this.currentUser.id ? { uri: this.currentUser["picture"] } : { uri: rowData["picture"] }} style={{width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: 'black'}}/>
                    <View style={{flex: 1, justifyContent: 'center', marginLeft: 10}}>
                      <Text style={{fontWeight: 'bold'}}>{rowData["name"]}</Text>
                    </View>
                  </View>
                </View>
              }
              enableEmptySections
              scrollEnabled={false}
            />
          </TouchableOpacity>
        </View>}
      </View>
    );
    // if(this.state.ready === true) {
    //   <ListView
    //     dataSource={this.state.dataSource}
    //     renderRow={(rowData, sectionID, rowID) => {
    //       alert("datas: " + JSON.stringify(rowID));
    //
    //     }}
    //     enableEmptySections
    //   />
    // }
    // else {
    //   return (
    //     <View style={{flex: 1, flexDirection: 'column'}}>
    //       <ProfieTopLayout />
    //       <View style={{flex: 4, backgroundColor: 'skyblue'}} />
    //     </View>
    //   );
    // }
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
