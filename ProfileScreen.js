import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ListView, Dimensions } from 'react-native';
import { Constants, SQLite } from 'expo';
import ContentRow from './ContentRow';

const db = SQLite.openDatabase('db.db');

let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

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
      <View style={{flex: 0.88, flexDirection: 'row'}}>
        <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
          <Image source={{ uri: global.currentUser["picture"] }} style={styles.profileImage}/>
        </View>

        <View style={{flex:3, flexDirection: 'column'}}>
          <View style={{flex: 1.5}} />
          <View style={{flex: 6.5, flexDirection: 'row'}}>
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
          <View style={{flex: 3.3, justifyContent: 'center'}}>
            <TouchableOpacity
              style={{flex: 1, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderRadius: 5, borderColor: 'lightgray'}}
              onPress={() => {
                }}>
              <Text style={{fontSize: 14, fontWeight: 'bold'}}>
                프로필 수정
              </Text>
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
        <ProfieTopLayout />
        <View style={{flex: 1, backgroundColor: 'skyblue', marginTop: 14}} >
          <Text>
            안녕하세요. 저는 김승범입니다.{'\n'}
            안녕하세요. 저는 김승범입니다.{'\n'}
            안녕하세요. 저는 김승범입니다.{'\n'}
            안녕하세요. 저는 김승범입니다.{'\n'}
            안녕하세요. 저는 김승범입니다.{'\n'}
            안녕하세요. 저는 김승범입니다.{'\n'}
            안녕하세요. 저는 김승범입니다.
          </Text>
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

  renderGridContent(rowData) {
    let {height, width} = Dimensions.get('window');
    let cellWidth = width / 3;

    if(rowData.length === 1) {
      return (
        <View style={{flex: 1, flexDirection: 'row'}}>
          <TouchableOpacity
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
            onPress={() => {
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
        <View style={{flex: 1, flexDirection: 'row'}}>
          <TouchableOpacity
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
            onPress={() => {
              }}>
              <Image style={{width: cellWidth, height: cellWidth}}
               source={{ uri: rowData[0].picture }}/>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
            onPress={() => {
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
        <View style={{flex: 1, flexDirection: 'row'}}>
          <TouchableOpacity
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
            onPress={() => {
              }}>
              <Image style={{width: cellWidth, height: cellWidth}}
               source={{ uri: rowData[0].picture }}/>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
            onPress={() => {
              }}>
              <Image style={{width: cellWidth, height: cellWidth}}
               source={{ uri: rowData[1].picture }}/>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
            onPress={() => {
              }}>
              <Image style={{width: cellWidth, height: cellWidth}}
               source={{ uri: rowData[2].picture }}/>
          </TouchableOpacity>
        </View>
      );
    }
  }

  render() {

    let {height, width} = Dimensions.get('window');
    let cellWidth = width / 3;
    if(this.props.rowID === "0") {
      return(
        <ProfileLayout
          onSelectType={(type) => this.props.onSelectType(type)}/>
      );
    }
    else {
      // alert("datas: " + JSON.stringify(this.props.type));
      if(this.props.type === 0) {
        return(
          this.renderGridContent(this.props.rowData)
        );
      }
      else if(this.props.type === 1) {
        alert("datas: " + JSON.stringify(this.props));
        return(
          <ContentRow
            caller= {this.props}
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
  render() {
    return (
      <TouchableOpacity
        style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
        onPress={() => {
          }}>
          <Text style={{fontWeight: 'bold', fontSize: 16}}>{global.currentUser["name"]} -></Text>
      </TouchableOpacity>
    );
  }
}

export default class HomeScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      // title: global.currentUser["name"],
      headerTitle: <ProfileHeaderTitle />,
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
  }

  constructor() {
    super();

    // let map = new Array();
    // map[0] = new Array();
    // map[0]["profile"] = "profile"
    this.state = {
      dataSource: ds.cloneWithRows([""]),
      ready: false,
      type: 0,
    };

  }

  read() {
    // alert("datas: " + JSON.stringify(global.currentUser["id"]));
    let map = new Array();
    db.transaction(
      tx => {
        tx.executeSql('SELECT * FROM contents WHERE user_id = ?', [global.currentUser["id"]], (_, { rows: { _array } }) => {
          // setTimeout(() =>  {
          // const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

          let j = -1;
          for(var i in _array) {
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

          map.unshift("")
          _array.unshift("")
          global.contents["map"] = map;
          global.contents["list"] = _array;
            this.setState({ dataSource: this.state.dataSource.cloneWithRows(map), ready: true})
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

  updateType(type) {
    if(type === 0) {
      this.setState({type: type, dataSource: ds.cloneWithRows(global.contents["map"])})
    }
    else if(type === 1) {
      this.setState({type: type, dataSource: ds.cloneWithRows(global.contents["list"])})
    }
    else {
      this.setState({type: type, dataSource: ds.cloneWithRows([""])})
    }
  }

  //리스트 뷰의 renderRow 내에서는 {}를 사용하지 않는다.
  render() {
    alert("datas: " + JSON.stringify(this.state.type));
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={(rowData, sectionID, rowID) =>
          <ProfileRow
            rowData={rowData}
            sectionID={sectionID}
            rowID={rowID}
            type={this.state.type}
            onSelectType={(type) => this.updateType(type)} />
          }

        enableEmptySections
      />
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
