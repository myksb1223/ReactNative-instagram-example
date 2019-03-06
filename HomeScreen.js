import React from 'react';
import { StyleSheet, Text, View, ListView, Button, ActivityIndicator, Image } from 'react-native';
import { Constants, SQLite } from 'expo';

const db = SQLite.openDatabase('db.db');

let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class HomeScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: 'Instagram',
      headerRight: (
        <View style={{flex: 1, flexDirection: 'row', marginRight: 12}}>
          <Button
            onPress={() =>
              navigation.navigate('Create', { name: 'Jane' })
            }
            title="Write"
          />
          <Button
            onPress={() =>
              navigation.navigate('User', { name: 'Jane' })
            }
            title="User"
          />
        </View>
      ),
    }
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
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={(rowData, sectionID, rowID) =>
          <View style={{flex: 1, flexDirection: 'column', margin: 12}}>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <Image source={{ uri: rowData.user_pic }} style={{ width: 36, height: 36 }} />
              <Text style={{flex: 1}}>{rowData.user_name}</Text>
              <Button
                onPress={() => {
                    let data = this.state.datas[rowID]
                    this.props.navigation.navigate('Create', { data: data, image: data["picture"] })
                  }
                }
                title="수정"
              />
              <Button
                onPress={() => {
                    let data = this.state.datas[rowID]
                    // alert(JSON.stringify(data["id"]))
                    this.delete(data["id"])
                    this.deleteRow(rowID)
                  }
                }
                title="삭제"
              />
            </View>
            <Image source={{ uri: rowData.picture, cache: 'force-cache', }} style={{ flex: 1, height: 200 }} />
            <Text>{rowData.content}</Text>
          </View>
        }
        enableEmptySections
      />
    );
  }
}
