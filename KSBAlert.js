import React from 'react';
import { Alert, ActionSheetIOS, Platform } from 'react-native';

export function showAlert(options = {}) {
  if(Platform.OS === "ios") {
    ActionSheetIOS.showActionSheetWithOptions({
      options: options["menus"],
      cancelButtonIndex: 0,
    },
    (buttonIndex) => {
      if (buttonIndex === 1) {
        // return 0;
        if(options["type"] == 0) {
          options["caller"].checkPermisson(0)
        }
        else {
          options["caller"].goToEdit(options["other"])
        }
      }
      else if(buttonIndex === 2) {
        // return 1;
        if(options["type"] == 0) {
          options["caller"].checkPermisson(1)
        }
        else {
          options["caller"].goToDelete(options["other"])
        }
      }
    });
  }
  else {
    Alert.alert(
      null,
      'Select menu',
      [
        {text: options["menus"][0], onPress: () => {}},
        {text: options["menus"][1], onPress: () => {
          if(options["type"] == 0) {
            options["caller"].checkPermisson(0)
          }
          else {
            options["caller"].goToEdit(options["other"])
          }
        }},
        {text: options["menus"][2], onPress: () => {
          if(options["type"] == 0) {
            options["caller"].checkPermisson(1)
          }
          else {
            options["caller"].goToDelete(options["other"])
          }
        }},
      ],
      { cancelable: true }
    )
  }
}
