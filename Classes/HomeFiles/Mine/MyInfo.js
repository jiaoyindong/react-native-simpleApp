import React,{Component} from 'react';
import {
    Text,
    View,
    Image,
    StyleSheet,
} from 'react-native';

export default class MyInfo extends Component {


    _pressButton() {
        // const {navigator} = this.props;
        // 这里传递了navigator作为props
        // if (navigator) {
        this.props.navigator.pop();
        // }
    }
    render () {
        return (
            <View style = {styles.container}>
                <Text></Text>

                <Text></Text>
                <Text></Text>

                <Text style={[{fontSize:20}]} /*onPress = {this._pressButton.bind(this)}*/>sdsadadasdasdasdsa</Text>
                <Text style={[{fontSize:20}]}>sdsadadasdasdasdsa</Text>
                <Text style={[{fontSize:20}]}>sdsadadasdasdasdsa</Text>
                <Text style={[{fontSize:20}]}>sdsadadasdasdasdsa</Text>
            </View>
        );
    }
}



const styles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'column',
    },
});





