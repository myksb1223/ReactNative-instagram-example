import React from 'react';
import { StyleSheet, Text, View, ScrollView, ListView, Image, TouchableOpacity, Dimensions, TextInput, findNodeHandle} from 'react-native';

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

    let data = this.props.navigation.getParam("data", null);
    this.state = {
      dataSource: ds.cloneWithRows([""]),
      data: data,
      height: 0,
      text: null,
    }
  }

  inputFocused(refName) {
    setTimeout(() => {
        var scrollResponder = this.refs.scrollView.getScrollResponder();
        scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
          findNodeHandle(this.refs[refName]),
          60, //additionalOffset
          true
        );
      },
      50
    );
  }

  render() {
    let {height, width} = Dimensions.get('window');
    return (
      <ScrollView
       style={{flex: 1, flexDirection: 'column' }}
       ref='scrollView'
       automaticallyAdjustContentInsets={false}
        keyboardDismissMode="on-drag"
         showsVerticalScrollIndicator={true}
        keyboardShouldPersistTaps="handled">
          <View style={{flex: 1, flexDirection: 'column', justifyContent: 'space-between',}}>
            <Text style={{fontSize: 14, margin: 12, height: height-200 }}>{this.state.data.content}</Text>
            <View style={{width: width, height: 1, backgroundColor: 'lightgray'}}/>
          </View>

          <TextInput
              ref="newMessage"
                style={{alignSelf: 'stretch', height: Math.max(35, this.state.height), margin: 12}}
                placeholder="Input content"
                multiline={true}
                onChangeText={(text) => this.setState({text})}
                value={this.state.text}
                onFocus={this.inputFocused.bind(this, "newMessage")}
                onContentSizeChange={(event) => {
                            this.setState({ height: Math.min(150, event.nativeEvent.contentSize.height) })
                        }}
              />
      </ScrollView>

    );
  }
}
