import React from 'react';
import { StyleSheet, View, Button, TextInput } from 'react-native';
import { Constants, SQLite } from 'expo';
// import { ImagePicker, Permissions, Camera } from 'expo';
// import CameraScreen from './CameraScreen';
import ImageProcess from './ImageProcess';

const db = SQLite.openDatabase('db.db');

let _this;

export default class CreateUserScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;
    return {
      title: 'User Write',
      headerRight: (
        <Button
          onPress={() => {
            params.done();
            if(_this.state.updated !== null) {
              navigation.navigate('Profile', {added: 1})
            }
            else {
              navigation.navigate('Home', {added: 1})
            }
          }}
          title="Done"
        />
      ),
    }
  };

  constructor(props) {
    super(props);
    // this.checkPermisson();
    let updated = this.props.navigation.getParam("data", null);
    let text = '';
    let info = '';
    if(updated !== null) {
      text = updated["name"]
      info = updated["info"]
    }
    this.state = {text: text, height: 0, info: info, updated: updated};
    _this = this;
    this.props.navigation.setParams({
      done: this.add,
    });

  }

  componentDidMount() {

  }

  componentWillReceiveProps(nextProps){
    // alert("componentWillReceiveProps: " + JSON.stringify(nextProps) + ", camera : " + JSON.stringify(this.camera));
    if(this.props === nextProps){
      return;
    }
    // TODO perform changes on state change
    // this.setState({image: nextProps.navigation.getParam('image', null)});
    this.image.setState({image: nextProps.navigation.getParam('image', global.defaultProfileUri)});
    // alert("componentWillReceiveProps: " + JSON.stringify(nextProps) + ", camera : " + JSON.stringify(this.image));
    // this.setState({image: nextProps.navigation.getParam('image', null)});
  }

  // shouldComponentUpdate(nextProps, nextState){
    // console.log("shouldComponentUpdate: " + JSON.stringify(nextProps) + " " + JSON.stringify(nextState));
    // return true;
// }

  add() {

    // alert("info : " + JSON.stringify(_this.state.updated["id"]))

    if(_this.state.updated !== null) {
      db.transaction(
        tx => {
          tx.executeSql('UPDATE users SET name = ?, info = ?, picture = ? WHERE id = ?', [_this.state.text, _this.state.info, _this.image.state.image, _this.state.updated["id"]]);

            tx.executeSql('SELECT * FROM users WHERE current = ?', [1], (_, { rows }) => {
              alert(JSON.stringify(rows["_array"][0]))
              global.currentUser = rows["_array"][0];
            });

        },
      );
    }
    else {
      //User can not add profile.
      let imageUri = _this.image.state.image;
      if(imageUri === null) {
        imageUri = global.defaultProfileUri;
      }

      let current = 0;
      if(global.currentUser === null) {
        current = 1;
      }

      db.transaction(
        tx => {
          tx.executeSql('INSERT INTO users (name, info, picture, current) values (?, ?, ?, ?)', [_this.state.text, _this.state.info, _this.image.state.image, current]);
          if(current === 1) {
            tx.executeSql('SELECT * FROM users WHERE current = ?', [1], (_, { rows }) => {
              // alert(JSON.stringify(rows["_array"]))
              global.currentUser = rows["_array"][0];
            });
          }
        },
      );
    }
  }



  render() {
    let { navigate } = this.props.navigation;
    // alert(this.state.image + " 1");
    // alert(this.props.navigation.getParam('image', null) + " 3");
    return (
      <View style={styles.container}>

        <TextInput
              style={{alignSelf: 'stretch', height: 35, margin: 12}}
              placeholder="Input name"
              onChangeText={(text) => this.setState({text: text})}
              value={this.state.text}
          />
          <TextInput
                style={{alignSelf: 'stretch', height: Math.max(35, this.state.height), margin: 12}}
                placeholder="Input content"
                multiline={true}
                onChangeText={(info) => this.setState({info})}
                value={this.state.info}
                onContentSizeChange={(event) => {
                            this.setState({ height: Math.min(150, event.nativeEvent.contentSize.height) })
                        }}
            />
        <ImageProcess
          ref={image => {
            this.image = image;
          }}
          onSelectCamera={() => this.props.navigation.navigate('Camera', { where: 0 })}
          // onValuePath={(path) => {
          //   alert(JSON.stringify(path));
          //   this.setState({image: path})
          // }}
         />
      </View>
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
