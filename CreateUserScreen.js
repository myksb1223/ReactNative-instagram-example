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
            navigation.navigate('Home');
          }}
          title="Done"
        />
      ),
    }
  };

  constructor(props) {
    super(props);
    // this.checkPermisson();
    this.state = {text: ''};
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
    this.image.setState({image: nextProps.navigation.getParam('image', "file://")});
    // alert("componentWillReceiveProps: " + JSON.stringify(nextProps) + ", camera : " + JSON.stringify(this.image));
    // this.setState({image: nextProps.navigation.getParam('image', null)});
  }

  // shouldComponentUpdate(nextProps, nextState){
    // console.log("shouldComponentUpdate: " + JSON.stringify(nextProps) + " " + JSON.stringify(nextState));
    // return true;
// }

  add() {
    db.transaction(
          tx => {
            tx.executeSql('INSERT INTO users (name, picture) values (?, ?)', [_this.state.text, _this.image.state.image]);
            tx.executeSql('SELECT * FROM users', [], (_, { rows }) =>
              alert(JSON.stringify(rows))
            );
          },
        );
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
