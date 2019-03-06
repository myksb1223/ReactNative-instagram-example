import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Camera, Permissions, FileSystem, Constants } from 'expo';

export default class CameraScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      header: null,
    }
  };

  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    newPhotos: false,
    path: null,
  };

  async componentDidMount() {
    try {
      await FileSystem.makeDirectoryAsync(
        `${FileSystem.documentDirectory}photos`,
        {
          intermediates: true,
        }
      )
    } catch (e) {
      console.log(e)
    }
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  snap = () => {
    if (this.camera) {
      alert(`${FileSystem.documentDirectory}photos`);
      console.log("here!!");
      this.camera.takePictureAsync({onPictureSaved: this.onPictureSaved});

    }
  };

  onPictureSaved = async photo => {
    let path = `${FileSystem.documentDirectory}photos/${Date.now()}.jpg`;
    await FileSystem.moveAsync({
      from: photo.uri,
      to: path,
    });
    this.setState({ path: path });
    this.setState({ newPhotos: true });
  }

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Camera
            ref={ref => {
              this.camera = ref;
            }}
            style={{ flex: 1 }} type={this.state.type}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                style={{
                  flex: 0.33,
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                }}
                onPress={() => {
                  this.setState({
                    type: this.state.type === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back,
                  });
                }}>
                <Text
                  style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>
                  {' '}Flip{' '}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 0.33,
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                }}
                onPress={this.snap}>
                <Text
                  style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>
                  {' '}Snap{' '}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 0.33,
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                }}
                onPress={() => {
                  // alert(this.state.path);
                  if(this.props.navigation.getParam('where', 0) == 0) {
                    this.props.navigation.navigate('User', { image: this.state.path })
                  } else {
                    this.props.navigation.navigate('Create', { image: this.state.path })
                  }
                }}>
                <Text
                  style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>
                  {' '}Done{' '}
                </Text>
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      );
    }
  }
}
