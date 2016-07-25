/**
 * 首页--我的   create by jiaoyindong
 * */

import React ,{Component}from 'react';
import {
    StyleSheet,
    Image,
    View,
    Text,
    Navigator,
    ScrollView,
    Dimensions,
    ListView,
    TouchableOpacity
} from 'react-native';
const ScreenFrame = Dimensions.get('window');
import NavigationBar from 'react-native-navigationbar';
import MyInfo from './MyInfo';

export default class Mine extends Component {
    render () {

        let defaultComponent = Mines;//默认初始化组件

        return (
            /**
             * 导航器通过'路由对象'来分辨不同的场景,利用'renderScene'属性获取指定路由对象的配置信息,从而改变场景的动画或者手势
             * */
            <Navigator
                // 初始化路由 initial+Route,里面有两个参数,一个name,一个component(组件)
                initialRoute={{component:defaultComponent}}
                // 配置环境 --- 设置动画
                configureScene={
                    (route) => {
                        // 这个是页面之间跳转时候的动画,
                        return Navigator.SceneConfigs.HorizontalSwipeJump;
                    }
                }
                // 渲染场景
                renderScene={
                    // 回调
                    (route,navigator)=>{
                        //  route.component 赋值给  Componet
                        let Component = route.component;
                         // ...遍历route的所有对象 赋值给 Component   navigator={navigator}取出navigator赋值给navigator(this.props.navigator)
                         /**
                         * 这里有一个判断,也就是如果传递进来的component存在,那我们就是返回一个这个component,结合前面initialRoute的参数,我们就知道,
                         * 这是一个会被render出来给用户看到的component,然后navigator作为props传递给了这个component
                         * 固定的写法,有就有,没有就没有
                         * */
                        return <Component {...route.params} navigator={navigator} />
                    }
                }
            />
        );
    }
}
class Mines extends Component {

    // 被点击事件
    itemClickedAction (i) {
        if(i==0){
            alert('我的收藏');
        }else if (i==1) {
            this.props.navigator.push ({
                component:MyInfo,
            });
        }else {
            alert('是否要清楚缓存');
            
        }

    }

    render () {
        var colors = ['#F4000B', '#17B4FF', '#FFD900'];
        var tags = ['F ', 'I ', 'C'];
        var items = ['我的收藏', ' 我的信息', '清楚缓存'];
        var JSXDOM = [];
        for(var i in items){
            JSXDOM.push(
                <TouchableOpacity key={items[i]} onPress = {this.itemClickedAction.bind(this,i)}>
                    <View style={[styles.item, {flexDirection:'row'}]}>
                        <Text style={[styles.tag, {color: colors[i]}]}>{tags[i]}</Text>
                        <Text style={[styles.font,{flex:1}]}>{items[i]}</Text>
                    </View>
                </TouchableOpacity>
            );
        }
        return (
            <View style={[styles.flex,{backgroundColor:'white'}]}>
                <NavigationBar
                    backHidden={true}// 返回按钮是否显示
                    title='我'// 标题
                    barTintColor="white"// 导航栏颜色
                    titleTextColor="black"// 标题颜色
                />
                <ScrollView bounces = {false}>
                    <View style={[styles.imageStyle,styles.flex]} >
                        <Image style = {[styles.imageStyle,styles.mode,]} source = {require('../../Resource/Mine/mine_backImage@2x.png')}></Image>
                    </View>
                    {JSXDOM}


                </ScrollView>

            </View>
        );
    }

}
const styles = StyleSheet.create({
    flex: {
        flex:1,
    },
    imageStyle:{
        height:200,
        width:375,
    },
    font:{
        fontSize:20,
        marginLeft:5,
        marginRight:10,
    },
    mode:{
        resizeMode: Image.resizeMode.stretch,
    },
    tag:{
        marginLeft:10,
        fontSize:25,
        fontWeight:'bold'
    },
    item:{
        height:40,
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        backgroundColor:'#fff',
        alignItems:'center',
    },

});




