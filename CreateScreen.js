import React from 'react';
import { StyleSheet, View, Button, TextInput, Alert, Image, Picker, ActivityIndicator } from 'react-native';
import { Constants, SQLite } from 'expo';
// import { ImagePicker, Permissions, Camera } from 'expo';
// import CameraScreen from './CameraScreen';
import ImageProcess from './ImageProcess';

const db = SQLite.openDatabase('db.db');
let _this;

export default class CreateScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;
    return {
      title: 'Write',
      headerRight: (
        <Button
          onPress={() => {
            params.done();
            navigation.navigate('Home', {added: 1})
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
    // this.image.setState({image: this.props.navigation.getParam("image", null) });
    // alert(JSON.stringify(updated))
    let text = '';
    if(updated !== null) {
      text = updated["content"]
    }
    this.state = {text: text, height: 0, users: null, user: null, loading: true, updated: updated};
    _this = this;
    this.props.navigation.setParams({
      done: this.add,
    });

  }

  componentWillMount() {

    db.transaction(
      tx => {
        tx.executeSql('SELECT * FROM users', [], (_, { rows: { _array } }) => {
          // setTimeout(() =>  {
            let user = _array[0]
            if(this.state.updated !== null) {
              for(var i in _array) {
                if(this.state.updated["user_id"] === _array[i]["id"]) {
                  user = _array[i]
                  break
                }
              }
            }
            this.setState({ users: _array, loading: false, user: user })


          // }, 3000)}
        }

        );
      },
      // null,
      // this.update
    );
  }

  componentWillReceiveProps(nextProps){

    if(this.props === nextProps){
      return;
    }

    // alert("componentWillReceiveProps: " + JSON.stringify(this.props));
    // TODO perform changes on state change
    // this.camera = nextProps.navigation.getParam('image', null);
    if(this.image) {
      this.image.setState({image: nextProps.navigation.getParam('image', "file://")});
    }
  }

  add() {
    if(_this.state.updated !== null) {
      db.transaction(
        tx => {
          // alert(JSON.stringify(_this.state) + JSON.stringify(_this.image.state))
          tx.executeSql('UPDATE contents SET content = ?, picture = ?, user_id = ?, user_name = ?, user_pic = ? WHERE id = ?', [_this.state.text, _this.image.state.image, _this.state.user.id, _this.state.user.name, _this.state.user.picture, _this.state.updated["id"]]);
          // tx.executeSql('SELECT * FROM contents', [], (_, { rows }) =>
          //   alert(JSON.stringify(rows))
          // );
        },
        // null,
        // this.update
      );
    }
    else {
      db.transaction(
        tx => {
          // alert(JSON.stringify(_this.state) + JSON.stringify(_this.image.state))
          tx.executeSql('INSERT INTO contents (content, picture, user_id, user_name, user_pic) values (?, ?, ?, ?, ?)', [_this.state.text, _this.image.state.image, _this.state.user.id, _this.state.user.name, _this.state.user.picture]);
          // tx.executeSql('SELECT * FROM contents', [], (_, { rows }) =>
          //   alert(JSON.stringify(rows))
          // );
        },
        // null,
        // this.update
      );
    }
  }

    GetPickerSelectedItemValue=()=>{

      Alert.alert(JSON.stringify(this.state.user));

    }


  render() {
    let { navigate } = this.props.navigation;
    // alert(this.state.image + " 1");
    // alert(this.props.navigation.getParam('image', null) + " 3");

    if(this.state.loading) {
      return (
       <View style={{flex: 1, paddingTop: 20}}>
         <ActivityIndicator />
       </View>
     );
    }

    return (
      <View style={styles.container}>
      <Picker
         selectedValue={this.state.user}
         style={{ height: 50, width: 100 }}
         onValueChange={(itemValue, itemIndex) => this.setState({user: itemValue})}>
         { this.state.users.map((item, key)=>(
            <Picker.Item label={item.name} value={item} key={key} />)
            )}

       </Picker>
        <TextInput
              style={{alignSelf: 'stretch', height: Math.max(35, this.state.height), margin: 12}}
              placeholder="Input content"
              multiline={true}
              onChangeText={(text) => this.setState({text})}
              value={this.state.text}
              onContentSizeChange={(event) => {
                          this.setState({ height: Math.min(150, event.nativeEvent.contentSize.height) })
                      }}
          />
          <ImageProcess
            ref={image => {
              this.image = image;
            }}
            onSelectCamera={() => this.props.navigation.navigate('Camera', { where: 1 })}
           />
           <Button title="Click Here To Get Picker Selected Item Value" onPress={ this.GetPickerSelectedItemValue } />
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
