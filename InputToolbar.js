import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, TextInput, Keyboard} from 'react-native';

export default class InputToolbar extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      position: 'absolute',
    }

    this.keyboardWillShow = this.keyboardWillShow.bind(this);
    this.keyboardWillHide = this.keyboardWillHide.bind(this);

    this.keyboardDidShow = this.keyboardDidShow.bind(this);
    this.keyboardDidHide = this.keyboardDidHide.bind(this);
  }

  componentWillMount() {
    this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
    this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);

  }

  componentWillUnmount() {
    this.keyboardWillShowListener.remove();
    this.keyboardWillHideListener.remove();
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();

  }

  keyboardWillShow() {
    if (this.state.position !== 'relative') {
      this.setState({
        position: 'relative',
      });
    }
  }

  keyboardWillHide() {
    if (this.state.position !== 'absolute') {
      this.setState({
        position: 'absolute',
      });
    }
  }

  keyboardDidShow() {
    if (this.state.position !== 'relative') {
      this.setState({
        position: 'relative',
      });
    }
  }

  keyboardDidHide() {
    if (this.state.position !== 'absolute') {
      this.setState({
        position: 'absolute',
      });
    }
  }

  onContentSizeChange(e) {
    const { contentSize } = e.nativeEvent;

    // Support earlier versions of React Native on Android.
    if (!contentSize) return;

    if (
      !this.contentSize ||
      this.contentSize.width !== contentSize.width ||
      this.contentSize.height !== contentSize.height
    ) {
      this.contentSize = contentSize;
      this.props.onInputSizeChanged(this.contentSize);
    }
  }

  onChangeText(text) {
    this.props.onTextChanged(text);
  }

  onSend(text) {
    this.props.onSend(text, true);
  }

  render() {
    return(
      <View style={[styles.container, {position: this.state.position}]} >
        <View style={{flexDirection: 'row', alignItems: 'flex-end', marginTop: 6.5, marginBottom: 6.5}}>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', }}>
            <Image source={{ uri: global.currentUser["picture"] }} style={{ width: 35, height: 35, borderRadius: 17.5}}/>
          </View>
          <View style={{flex: 7, flexDirection: 'row', borderRadius: 10, borderWidth: 1, borderColor: 'lightgray', alignItems: 'flex-end',}}>
            <TextInput
                  style={{flex: 7, alignSelf: 'stretch', backgroundColor: 'yellow', height: this.props.composerHeight, marginRight: 12, marginLeft: 12,}}
                  placeholder="Input content"
                  multiline={true}
                  onChange={(e) => this.onContentSizeChange(e)}
                  onContentSizeChange={(e) => this.onContentSizeChange(e)}
                  onChangeText={(text) => this.onChangeText(text)}
                  value={this.props.text}
                  {...this.props.textInputProps}

                />

            <TouchableOpacity style={{flex: 1, marginBottom: 10}}
              onPress={() => {
                this.onSend(this.props.text)
                }
              }>
              <Text>게시</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 0.3}}>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderColor: 'lightgray',
    backgroundColor: '#FF0000'
  },

});
