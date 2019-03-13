import React from 'react';
import { View, Button, Image, Alert, ActionSheetIOS, Platform } from 'react-native';
import { ImagePicker, Permissions, Camera } from 'expo';
import CameraScreen from './CameraScreen';
import * as KSBAlert from './KSBAlert';

export {
   KSBAlert
};


export default class ImageProcess extends React.Component {
  constructor(props) {
    super(props);
    // alert(JSON.stringify(this.props))
    // this.checkPermisson();
    this.state = {status: false, image: "file://"};

    // this.props.onGetImage();
  }

  // getDeivceType=()=> {
  //   return Platform.OS === "ios" ? true : false;
  // };

  getPermissionStatus(type, p_type) {
    const { Permissions } = Expo;
    if(p_type == 0) {
      if(type == 0) {
        return Permissions.getAsync(Permissions.CAMERA);
      }
      else {
        return Permissions.getAsync(Permissions.CAMERA_ROLL);
      }
    }
    else {
      if(type == 0) {
        return Permissions.askAsync(Permissions.CAMERA);
      }
      else {
        return Permissions.askAsync(Permissions.CAMERA_ROLL);
      }
    }
  }

  async checkPermisson(type) {
    const { status } = await this.getPermissionStatus(type, 0);
    this.setState({ status: status === 'granted' });
    if (status !== 'granted') {
      const { status } = await this.getPermissionStatus(type, 1);
      this.setState({ status: status === 'granted' });
    }

    if (this.state.status) {
      if(type == 0) {

        this.props.onSelectCamera();
      }
      else {
        // this.setState({ status: status === 'granted' });
        // if(this.state.status) {
          this.pickImage();
        // }
      }
    }
    // if(type == 0) {
    //   const { status } = await Permissions.getAsync(Permissions.CAMERA);
    //   if (status !== 'granted') {
    //     const { status } = await Permissions.askAsync(Permissions.CAMERA);
    //     if(status === 'granted') {
    //       this.setState({ status: status === 'granted' });
    //       this.props.navigation.navigate('Camera', { name: 'Jane' })
    //     }
    //   }
    //   else {
    //     this.setState({ status: status === 'granted' });
    //     this.props.navigation.navigate('Camera', { name: 'Jane' })
    //   }
    // }
    // else {
    //   const { status } = await Permissions.getAsync(Permissions.CAMERA_ROLL);
    //   if (status !== 'granted') {
    //     const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    //     this.setState({ status: status === 'granted' });
    //     if(this.state.status) {
    //       this.pickImage();
    //     }
    //   }
    //   else {
    //     this.setState({ status: status === 'granted' });
    //     if(this.state.status) {
    //       this.pickImage();
    //     }
    //   }
    // }
  }

  async pickImage() {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    // alert(result.uri);

    if (!result.cancelled) {
      this.setState({ image: result.uri });
      // this.props.onValuePath(result.uri);
    }
  }

  // showAlert() {
    //
    // if(this.getDeivceType()) {
    //   ActionSheetIOS.showActionSheetWithOptions({
    //     options: ['취소', 'Camera', 'Gallery'],
    //     cancelButtonIndex: 0,
    //   },
    //   (buttonIndex) => {
    //     if (buttonIndex === 1) {
    //       this.checkPermisson(0)
    //     }
    //     else if(buttonIndex === 2) {
    //       this.checkPermisson(1)
    //     }
    //   });
    // }
    // else {
    //   Alert.alert(
    //     null,
    //     'Select menu',
    //     [
    //       {text: '취소', onPress: () => {}},
    //       {text: 'Camera', onPress: () => this.checkPermisson(0)},
    //       {text: 'Gallery', onPress: () => this.checkPermisson(1)},
    //     ],
    //     { cancelable: true }
    //   )
    // }
  // }

  render() {
    // alert(JSON.stringify(this.state))
    return (
      <View>
      <Button
        title= "Select image"
        onPress={() => {
            KSBAlert.showAlert({
              caller: this,
              menus: ['취소', 'Camera', 'Gallery'],
              type: 0
            });
          }
        }
      />


      <Image source={{ uri: this.state.image }} style={{ width: 200, height: 200 }} />
      </View>
    );
  }
}
