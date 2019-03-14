import React from 'react';
import { View, TouchableOpacity, Image, ScrollView, Text, Dimensions } from 'react-native';
import { Asset, ImageManipulator } from 'expo';

export default class ContentRow extends React.Component {
  constructor(props) {
      super(props);

      this.state = {image: null, ready: false};
  }

  componentWillMount() {

  }

  componentDidMount() {
    (async () => {
      const image = Asset.fromModule(require('./assets/reply.png'));
      await image.downloadAsync();
      this.setState({
        ready: true,
        image,
      });
      this._rotate180andFlip();
    })();
  }

  _rotate180andFlip = async () => {
      const manipResult = await ImageManipulator.manipulateAsync(
        this.state.image.localUri || this.state.image.uri,
        [{ rotate: 180}, { flip: { vertical: true }}, {resize: {width: 50, height: 50}}],
        { format: 'png' }
      );

      this.setState({ image: manipResult });
  }

  render() {
    let {height, width} = Dimensions.get('window');
    return(
      <View style={{flex: 1, flexDirection: 'column', margin: 12}}>
        <View style={{flex: 1, flexDirection: 'row', justifyContent: "center",alignItems: "center", marginBottom: 12}}>
          <Image source={{ uri: this.props.rowData.user_pic }}
            style={{ width: 36, height: 36, borderRadius: 18, marginRight: 12 }} />
          <Text style={{flex: 1, textAlign: 'left', textAlignVertical: "center", fontSize: 14, fontWeight: "bold"}}>{this.props.rowData.user_name}</Text>
          <TouchableOpacity
            onPress={() => {

              }
            }>
            <Image style={{width: 25, height: 25}}
            resizeMode='center'
             source={ require('./assets/more.png')}/>
          </TouchableOpacity>
        </View>
        <ScrollView
          style={{ flex: 1, marginBottom: 12}}
          horizontal={true}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={true} >
            <Image source={{ uri: this.props.rowData.picture, cache: 'force-cache', }} style={{ flex: 1, width:  width-24, height: width-24}} />
            <Image source={{ uri: "https://www.instagram.com/p/BlGcOrlDr5W/media/?size=m", cache: 'force-cache', }} style={{ flex: 1, width:  width-24, height: width-24}} />
        </ScrollView>
        <View style={{flex: 1, flexDirection: 'row', marginBottom: 12}}>
          <TouchableOpacity
            onPress={() => {

              }
            }>
            <Image style={{width: 25, height: 25}}
            resizeMode='contain'
             source={ require('./assets/heart.png')}/>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              }
            }>
            {this.state.ready && this._renderImage()}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {

              }
            }>
            <Image style={{width: 25, height: 25, marginLeft: 12}}
            resizeMode='contain'
             source={ require('./assets/share.png')}/>
          </TouchableOpacity>
        </View>
        <Text style={{fontSize: 14}}>{this.props.rowData.content}</Text>
      </View>
    )
  }

  _renderImage = () => {
      return (
        <Image
          source={{ uri: this.state.image.localUri || this.state.image.uri }}
          resizeMode= 'contain'
          style={{ width: 25, height: 25, marginLeft: 12 }}
          />
      );

  };
}
