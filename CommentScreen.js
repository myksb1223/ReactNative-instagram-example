import React from 'react';
import { StyleSheet, Text, View, ScrollView, ListView, Image, TouchableOpacity, Dimensions, TextInput, Keyboard, Platform, Animated} from 'react-native';
import InputToolbar from './InputToolbar'

let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class CommentScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;
    return {
      title: '댓글',
      headerRight: (
        <TouchableOpacity
          style={{flex: 1, marginRight: 12}}
          onPress={() => {

            }}>
          <Image style={{width: 25, height: 25}}
           source={ require('./assets/share.png')}/>
        </TouchableOpacity>
      ),
    }
  };

  constructor(props) {
    super(props);

    this._keyboardHeight = 0;
        this._bottomOffset = 0;
        this._maxHeight = null;
        this._isFirstLayout = true;

    let data = this.props.navigation.getParam("data", null);
    this.state = {
      dataSource: ds.cloneWithRows([""]),
      data: data,
      composerHeight: this.props.minComposerHeight,
      typingDisabled: false,
      messagesContainerHeight: null,
    }

    this.onKeyboardWillShow = this.onKeyboardWillShow.bind(this);
    this.onKeyboardWillHide = this.onKeyboardWillHide.bind(this);
    this.onKeyboardDidShow = this.onKeyboardDidShow.bind(this);
    this.onKeyboardDidHide = this.onKeyboardDidHide.bind(this);
    this.onInputSizeChanged = this.onInputSizeChanged.bind(this);
    this.onInputTextChanged = this.onInputTextChanged.bind(this);
    this.onMainViewLayout = this.onMainViewLayout.bind(this);
    this.onInitialLayoutViewLayout = this.onInitialLayoutViewLayout.bind(this);

    this.invertibleScrollViewProps = {
      inverted: this.props.inverted,
      keyboardShouldPersistTaps: this.props.keyboardShouldPersistTaps,
      onKeyboardWillShow: this.onKeyboardWillShow,
      onKeyboardWillHide: this.onKeyboardWillHide,
      onKeyboardDidShow: this.onKeyboardDidShow,
      onKeyboardDidHide: this.onKeyboardDidHide,
    };
  }

  setTextFromProp(textProp) {
    // Text prop takes precedence over state.
    if (textProp !== undefined && textProp !== this.state.text) {
      this.setState({ text: textProp });
    }
  }

  getTextFromProp(fallback) {
    if (this.props.text === undefined) {
      return fallback;
    }
    return this.props.text;
  }

  getIsTypingDisabled() {
    return this.state.typingDisabled;
  }

  setIsTypingDisabled(value) {
    this.setState({
      typingDisabled: value,
    });
  }

  prepareMessagesContainerHeight(value) {
    if (this.props.isAnimated === true) {
      return new Animated.Value(value);
    }
    return value;
  }

  onKeyboardWillShow(e) {
    this.setIsTypingDisabled(true);
    this.setKeyboardHeight(e.endCoordinates ? e.endCoordinates.height : e.end.height);
    this.setBottomOffset(this.props.bottomOffset);
    const newMessagesContainerHeight = this.getMessagesContainerHeightWithKeyboard();
    alert("message size : " + this.state.composerHeight);
    if (this.props.isAnimated === true) {
      Animated.timing(this.state.messagesContainerHeight, {
        toValue: newMessagesContainerHeight,
        duration: 210,
      }).start();
    } else {
      this.setState({
        messagesContainerHeight: newMessagesContainerHeight,
      });
    }
  }

  onKeyboardWillHide() {
    this.setIsTypingDisabled(true);
    this.setKeyboardHeight(0);
    this.setBottomOffset(0);
    const newMessagesContainerHeight = this.getBasicMessagesContainerHeight();
    if (this.props.isAnimated === true) {
      Animated.timing(this.state.messagesContainerHeight, {
        toValue: newMessagesContainerHeight,
        duration: 210,
      }).start();
    } else {
      this.setState({
        messagesContainerHeight: newMessagesContainerHeight,
      });
    }
  }

  onKeyboardDidShow(e) {
    if (Platform.OS === 'android') {
      this.onKeyboardWillShow(e);
    }
    this.setIsTypingDisabled(false);
  }

  onKeyboardDidHide(e) {
    if (Platform.OS === 'android') {
      this.onKeyboardWillHide(e);
    }
    this.setIsTypingDisabled(false);
  }

  setBottomOffset(value) {
    this._bottomOffset = value;
  }

  getBottomOffset() {
    return this._bottomOffset;
  }

  setMaxHeight(height) {
    this._maxHeight = height;
  }

  getMaxHeight() {
    return this._maxHeight;
  }

  setKeyboardHeight(height) {
    this._keyboardHeight = height;
  }

  getKeyboardHeight() {
    if (Platform.OS === 'android' && !this.props.forceGetKeyboardHeight) {
      // For android: on-screen keyboard resized main container and has own height.
      // @see https://developer.android.com/training/keyboard-input/visibility.html
      // So for calculate the messages container height ignore keyboard height.
      return 0;
    }
    return this._keyboardHeight;
  }

  // TODO: setMinInputToolbarHeight
  getMinInputToolbarHeight() {
    return this.props.minInputToolbarHeight;
  }
  calculateInputToolbarHeight(composerHeight) {
    return composerHeight + (this.getMinInputToolbarHeight() - this.props.minComposerHeight);
  }

  /**
   * Returns the height, based on current window size, without taking the keyboard into account.
   */
  getBasicMessagesContainerHeight(composerHeight = this.state.composerHeight) {
    return this.getMaxHeight() - this.calculateInputToolbarHeight(composerHeight);
  }

  /**
   * Returns the height, based on current window size, taking the keyboard into account.
   */
  getMessagesContainerHeightWithKeyboard(composerHeight = this.state.composerHeight) {
    return this.getBasicMessagesContainerHeight(composerHeight) - this.getKeyboardHeight() + this.getBottomOffset();
  }

  onInputSizeChanged(size) {
    const newComposerHeight = Math.max(
      this.props.minComposerHeight,
      Math.min(this.props.maxComposerHeight, size.height),
    );
    const newMessagesContainerHeight = this.getMessagesContainerHeightWithKeyboard(
      newComposerHeight,
    );
    this.setState({
      composerHeight: newComposerHeight,
      messagesContainerHeight: this.prepareMessagesContainerHeight(newMessagesContainerHeight),
    });
  }

  onInputTextChanged(text) {
          // alert("here true : " + text);
    if (this.getIsTypingDisabled()) {
      return;
    }
    if (this.props.onInputTextChanged) {
      this.props.onInputTextChanged(text);
    }
    // Only set state if it's not being overridden by a prop.
    if (this.props.text === undefined) {
      this.setState({ text });
    }
  }

  renderInputToolbar() {
    const inputToolbarProps = {
      ...this.props,
      text: this.getTextFromProp(this.state.text),
      composerHeight: Math.max(this.props.minComposerHeight, this.state.composerHeight),
      onSend: this.onSend,
      onInputSizeChanged: this.onInputSizeChanged,
      onTextChanged: this.onInputTextChanged,
      textInputProps: {
        ...this.props.textInputProps,
        ref: (textInput) => (this.textInput = textInput),
        maxLength: this.getIsTypingDisabled() ? 0 : this.props.maxInputLength,
      },
    };

    return (
      <InputToolbar
        {...inputToolbarProps}
      />
    );
  }

  notifyInputTextReset() {
    if (this.props.onInputTextChanged) {
      this.props.onInputTextChanged('');
    }
  }

  onInitialLayoutViewLayout(e) {
    const { layout } = e.nativeEvent;
    if (layout.height <= 0) {
      return;
    }
    this.notifyInputTextReset();
    this.setMaxHeight(layout.height);
    const newComposerHeight = this.props.minComposerHeight;
    const newMessagesContainerHeight = this.getMessagesContainerHeightWithKeyboard(newComposerHeight);
    const initialText = this.props.initialText || '';
    this.setState({
      isInitialized: true,
      text: this.getTextFromProp(initialText),
      composerHeight: newComposerHeight,
      messagesContainerHeight: this.prepareMessagesContainerHeight(newMessagesContainerHeight),
    });
  }

  setIsFirstLayout(value) {
    this._isFirstLayout = value;
  }

  getIsFirstLayout() {
    return this._isFirstLayout;
  }


  onMainViewLayout(e) {
    // fix an issue when keyboard is dismissing during the initialization
    const { layout } = e.nativeEvent;
    if (this.getMaxHeight() !== layout.height || this.getIsFirstLayout() === true) {
      this.setMaxHeight(layout.height);
      this.setState({
        messagesContainerHeight: this.prepareMessagesContainerHeight(this.getBasicMessagesContainerHeight()),
      });
    }
    if (this.getIsFirstLayout() === true) {
      this.setIsFirstLayout(false);
    }
  }

  render() {
    // alert("height : " +this.state.messagesContainerHeight);
    let {height, width} = Dimensions.get('window');
    if (this.state.isInitialized === true) {
      return (
        <View style={{flex: 1, flexDirection: 'column', backgroundColor: '#000000' }} onLayout={this.onMainViewLayout}>
          <View style={{height: this.state.messagesContainerHeight, backgroundColor: '#FFFF00' }}>
            <ScrollView
            {...this.props}
             {...this.invertibleScrollViewProps}
             automaticallyAdjustContentInsets={false}
            inverted={this.props.inverted}
            scrollEventThrottle={100}>
                <View style={{flex: 1, flexDirection: 'column', justifyContent: 'space-between',}}>
                  <Text style={{fontSize: 14, margin: 12 }}>{this.state.data.content}</Text>
                  <View style={{width: width, height: 1, backgroundColor: 'lightgray'}}/>
                </View>
            </ScrollView>
          </View>
          {this.renderInputToolbar()}
        </View>
      );
    }
    return (
      <View style={{flex: 1,}} onLayout={this.onInitialLayoutViewLayout}>
        {null}
      </View>
    );
  }
}

CommentScreen.defaultProps = {
  text: undefined,
  placeholder: "Input text",
  onSend: () => { },
  isAnimated: Platform.select({
    ios: false,
    android: false,
  }),
  textInputProps: {},
  bottomOffset: 0,
  minInputToolbarHeight: 50,
  keyboardShouldPersistTaps: Platform.select({
    ios: 'never',
    android: 'always',
  }),
  onInputTextChanged: null,
  maxInputLength: null,
  forceGetKeyboardHeight: false,
  inverted: true,
  minComposerHeight: 35,
  maxComposerHeight: 150,
};
