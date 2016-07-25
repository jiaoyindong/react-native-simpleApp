import React,{Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    WebView
} from 'react-native';

import NavigationBar from 'react-native-navigationbar';

export default class SugerFansDetail extends Component {
    
    render () {
        var URL = 'http://m.yidoutang.com/api/community/preview?tid='+this.props.id+'&device=android';
        return (
            <View style = {styles.container}>
                <NavigationBar
                    backHidden={false}
                    barTintColor='white'
                    barStyle={styles.navbar}
                    title={this.props.title}
                    // actionName='About'
                    backFunc={() => {
                        this.props.navigator.pop()
                    }}
                    actionFunc={() => {
                        this.props.navigator.push({
                        component: AboutPage
                    })
                    }}/>
                <WebView
                    source = {{uri:URL}}
                />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container:{
        flex:1,
    },
});

