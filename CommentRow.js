import React from 'react';
import { View, TouchableOpacity, Image, ScrollView, Text, Dimensions } from 'react-native';

export default class CommentRow extends React.Component {
  constructor(props) {
      super(props);

  }

  onTextPress(event, data) {
    // alert("datas: !!!" + JSON.stringify(data));
    this.goToProfile(data);
  }

  goToProfile(data) {
    this.props.goToProfile(data);
  }

  render() {
    let {height, width} = Dimensions.get('window');
    if(this.props.rowID === "0") {
      return(
        <View style={{flex: 1, flexDirection: 'column'}} >
          <View style={{flex: 1, flexDirection: 'row', margin: 10}} >
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', }}>
              <Image source={{ uri: this.props.data.user_pic }} style={{ width: 35, height: 35, borderRadius: 17.5}}/>
            </View>
            <View style={{flex: 8, flexDirection: 'column', justifyContent: 'space-between',}}>
              <Text style={{fontSize: 14, margin: 12, fontWeight: 'bold' }}>{this.props.data.user_name}
                <Text style={{fontSize: 14, fontWeight: 'normal'}}>{" " + this.props.data.content}</Text>
              </Text>
            </View>
          </View>
          <View style={{width: width, height: 1, backgroundColor: 'lightgray',}}/>
        </View>
      );
    }
    else {
      return(
        <View style={{flex: 1, flexDirection: 'column'}} >
          <View style={{flex: 1, flexDirection: 'row', margin: 10}} >
            <TouchableOpacity style={{flex: 1, justifyContent: 'center', alignItems: 'center', }}
              onPress={() => {
                this.goToProfile(this.props.rowData);
                }}>
              <Image source={{ uri: this.props.rowData.user_pic }} style={{ width: 35, height: 35, borderRadius: 17.5}}/>
            </TouchableOpacity>
            <View style={{flex: 8, flexDirection: 'column', justifyContent: 'space-between',}}>
              <Text style={{fontSize: 14, margin: 12,}}>
                <Text style={{fontSize: 14, fontWeight: 'bold'}} onPress={(e) => this.onTextPress(e, this.props.rowData)}>{this.props.rowData.user_name}</Text>
                <Text style={{fontSize: 14, fontWeight: 'normal'}}>{" " + this.props.rowData.content}</Text>
              </Text>
            </View>
          </View>
        </View>
      );
    }
  }
}
