/**
 * 首页---糖粉帮  create by jiaoyindong
 * */
import React ,{Component}from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    Navigator,
    ListView,
    TouchableOpacity,
} from 'react-native';
import NavigationBar from 'react-native-navigationbar';
import SugerDetail from './SugerFansDetail'
// 糖分帮URL
var API_URL = 'http://m.yidoutang.com/api/community/threads??tagid=0';
var REQUEST_URL = API_URL;

export default class SugerFans extends Component {
    render () {

        let defaultComponent = SugerFanss;//默认初始化组件

        return (
            /**
             * 导航器通过'路由对象'来分辨不同的场景,利用'renderScene'属性获取指定路由对象的配置信息,从而改变场景的动画或者手势
             * */
            <Navigator
                // 初始化路由 initial+Route,里面有两个参数,一个name,一个component(组件)
                initialRoute={{component:defaultComponent}}
                // 配置环境 --- 设置动画 会出现bounces效果
                // configureScene={
                //     (route) => {
                //         // 这个是页面之间跳转时候的动画,
                //         return Navigator.SceneConfigs.HorizontalSwipeJump;
                //     }
                // }
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
class SugerFanss extends Component {

    // 构造函数
    constructor(props){
        super(props)
        this.state = {
            // 初始dateSource
            dataSource : new  ListView.DataSource({
               rowHasChanged:(row1,row2) => row1 !== row2,
            }),
            id:null,
            title:'糖分帮详情',
        }
    }
    // 生命周期函数,界面出现后调用该方法
    componentDidMount(){
        this.loadData();
    }
    // 加载数据
    loadData() {
        fetch(REQUEST_URL)
            .then((response) => response.json())
            .then((responseData)=> {
                this.setState({
                    dataSource:this.state.dataSource.cloneWithRows(responseData.data.threads),
                });
            })
    
            .done();
    }

    renderRow (movie,rowID,sectionID) {
        console.log(rowID,sectionID);
        var num = movie.images.length;
        var images = movie.images;
        var CENTERVIEW = [];
        if (num == 0){
            CENTERVIEW.push(
                <View style = {styles.zeroCenterView } key={sectionID}/*中间View*/>
                </View>
            );
        }else if(num == 1){
            CENTERVIEW.push(
                <View style = {styles.centerView } key={sectionID}/*中间View*/>
                    <Image style={[{width:100},{height:140},{marginTop:10},{marginLeft:10}]} source = {{uri:images[0]}} />
                </View>

            );
        }else if (num == 2){
            CENTERVIEW.push(
                <View style = {styles.centerView} key={sectionID}/*中间View*/>
                    <Image style={[{width:100},{height:140},{marginTop:10},{marginLeft:10}]} source = {{uri:images[0]}} />
                    <Image style={[{width:100},{height:140},{marginTop:10},{marginLeft:10}]} source = {{uri:images[1]}} />
                </View>
            );
        }else {
            CENTERVIEW.push(
                <View style = {styles.centerView} key={sectionID}/*中间View*/>
                    <Image style={[{width:100},{height:140},{padding:5},{marginTop:10},{marginLeft:10}]} source = {{uri:images[0]}} />
                    <Image style={[{width:100},{height:140},{padding:5},{marginTop:10},{marginLeft:10}]} source = {{uri:images[1]}} />
                    <Image style={[{width:100},{height:140},{padding:5},{marginTop:10},{marginLeft:10}]} source = {{uri:images[2]}} />
                </View>
            );
        }
        return (
            <TouchableOpacity onPress = {this.toDetailPage.bind(this,movie.tid)}>
                <View style={[styles.container,{padding:2}]} >
                    <View style = {styles.topView}/*上方View*/>
                        <Image style = {styles.user_pic}
                               source = {{uri:movie.user_pic}}
                        />
                        <Text style = {styles.author}>{movie.author}</Text>
                    </View>
                    <Text style = {styles.subject}>{movie.subject}</Text>

                    {CENTERVIEW}

                    <View style = {styles.bottomView}/*下方View*/>
                        <View style = {styles.tagname}>
                            <Text style = {[{alignItems:'center'},{marginLeft:20},{color:'black'}]}>{movie.tagname}</Text>
                        </View>

                        <View style = {styles.eyes}>
                            <Image style={styles.eyesPic} source = {require('../../Resource/eye@2x.png')}/>
                            <Text style = {styles.eyesNum}>{movie.views}</Text>
                        </View>
                        <View style = {styles.eyes}>
                            <Image style={styles.eyesPic} source = {require('../../Resource/reply@2x.png')}/>
                            <Text style = {styles.eyesNum}>{movie.replies}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }



    render () {
        return (
            <View style={[styles.flex,{backgroundColor:'white'}]}>
                <NavigationBar
                    backHidden={true}// 返回按钮是否显示
                    title='糖分帮'// 标题
                    barTintColor="white"// 导航栏颜色
                    titleTextColor="black"// 标题颜色
                />
                <ListView
                    dataSource = {this.state.dataSource}
                    renderRow = {this.renderRow.bind(this)}
                    style = {styles.listView}
                />
            </View>
        );
    }
    toDetailPage (tid){
        this.props.navigator.push ({
            name:'SugerDetail',
            component:SugerDetail,
            params:{
                id:tid,
                title:this.state.title,
            }
        })
        console.log(this.state.tid);
    }
}
const styles = StyleSheet.create ({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    flex: {
        flex: 1
    },
    topView: {
        top:0,
        left:0,
        right:0,
        height:40,
        position:'absolute',
        flexDirection:'row',
        alignItems:'center',
    },
    user_pic: {
        marginLeft:20,
        width:30,
        height:30,
        borderRadius:15,

    },
    author: {
        left:20,
        fontSize:15,
        color:'black',
    },
    subject: {
        marginLeft:20,
        fontSize:15,
        color:'black',
        position:'relative',
        marginTop:40,//如何以topView为标准
    },
    zeroCenterView: {
        height:4,
        // backgroundColor:'red',
        borderBottomWidth:1,
        borderBottomColor:'gray',
        flexDirection:'row',
    },
    centerView: {
        height:160,
        // backgroundColor:'red',
        borderBottomWidth:1,
        borderBottomColor:'gray',
        flexDirection:'row',
    },
    bottomView: {
        height:30,
        backgroundColor:'white',
        flexDirection:'row',
    },

    listView: {
        paddingTop: 5,
        backgroundColor: '#F5FCFF',
    },

    tagname: {
        position:'relative',
        left:0,
        width:175,
        alignItems:'center',
        flexDirection:'row',
    },
    eyes: {
        position:'relative',
        left:0,
        width:80,
        flexDirection:'row',
        alignItems:'center',
    },
    eyesPic: {
        width:20,
        height:20,
        marginLeft:20,
        backgroundColor:'gray'
    },
    eyesNum: {
        left:5,
        fontSize:12,
        color:'black',
        backgroundColor:'rgba(255,255,255,0)',
    },
});