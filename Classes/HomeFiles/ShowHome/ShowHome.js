/**
 * 首页---晒家  create by jiaoyindong 
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
    RefreshControl
} from 'react-native';
import NavigationBar from 'react-native-navigationbar';
import ShowHomeDetail from './ShowHomeDetail';
// 晒家最新URL
var API_URL = 'http://m.yidoutang.com/api/case/list?order=0&';
var Params = 'page=';
var PageNum = 1;
var REQUEST_URL = API_URL+Params+PageNum;

export default class ShowHome extends Component {
    render () {

        let defaultComponent = ShowHomes;//默认初始化组件
        return (
            /**
             * 导航器通过'路由对象'来分辨不同的场景,利用'renderScene'属性获取指定路由对象的配置信息,从而改变场景的动画或者手势
             * */
            <Navigator
                // 初始化路由 initial+Route,里面有两个参数,一个name,一个component(组件)
                initialRoute={{component:defaultComponent}}
                // 配置环境 --- 设置动画
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
class ShowHomes extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            id:null,
            pageNum:1,
            loadMore:false,
            isRefreshing:true,
        }
    }
    componentDidMount() {
        this.fetchData();
    }

    fetchData() {
        // REQUEST_URL = API_URL + Params + pageNum;
        fetch(REQUEST_URL)
            .then((response) => response.json())
            .then((responseData) => {

                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(responseData.data.cases),
                });
                
            })
            .done();
    }

    renderMovie(movie) {

        return (
            <TouchableOpacity onPress = {this.toDetailPage.bind(this,movie.group_id)}>
                <View style={[styles.container,{padding:2}]}>
                    <Image
                        source={{uri: movie.image}}
                        style={styles.feature}
                    />
                    <View style = {styles.bottomView}>
                        <View style = {styles.clear}>
                            <Image
                                source={{uri: movie.user_pic}}
                                style={styles.user_pic}
                            />
                            <Text style={styles.author}>by {movie.user_name}</Text>
                        </View>
                        <View style = {styles.eyes}>
                            <Image style={styles.eyesPic} source = {require('../../Resource/eye@2x.png')}/>
                            <Text style = {styles.eyesNum}>{movie.click_num}</Text>
                        </View>
                        <View style = {styles.eyes}>
                            <Image style={styles.eyesPic} source = {require('../../Resource/reply@2x.png')}/>
                            <Text style = {styles.eyesNum}>{movie.comment_num}</Text>
                        </View>
                    </View>
                    <View style={styles.bottomContainer}>

                        <View style={styles.flex}>
                            <Text style={styles.title}>{movie.title}</Text>

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
                    title='晒家'// 标题
                    barTintColor="white"// 导航栏颜色
                    titleTextColor="black"// 标题颜色
                    // barStyle= {styles.navbar}
                />
                <ListView
                    dataSource={this.state.dataSource}
                    bounces = {false}
                    renderRow={this.renderMovie.bind(this)/* 这里的renderMovie方法必须要(绑定this),不然不会识别this */}
                    style={styles.listView}
                />

            </View>
        );
    }
    async _refresh () {
        console.log('isRefreshing');
    }
    async _loadmore () {
        if (this.state.loadMore) {
            console.log(this.state.loadMore);
            return
        }

        this.setState({loadMore: true})
        try {
            PageNum += 1;
            REQUEST_URL = API_URL + Params + PageNum;
            console.log('PageNum',PageNum);
            fetch(REQUEST_URL)
                .then((response) => response.json())
                .then((responseData) => {
                    let cases =  responseData.data.cases;
                    let data = [...this.state.dataSource,...cases]
                    this.setState({
                        dataSource: this.state.dataSource.cloneWithRows(data),
                        loadMore:false,
                    });
                })
        }catch (error) {
            console.log(error)
            this.setState({
                loadMore: false,
            })
        }




    }
    toDetailPage (group_id){
        this.props.navigator.push ({
            name:'ShowHomeDetail',
            component:ShowHomeDetail,
            params:{
                id:group_id,
            }
        })
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
    center: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    bottomContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    title: {
        fontSize: 15,
        marginBottom: 8,
        marginLeft:15,
        textAlign: 'left',
    },
    author: {
        textAlign: 'left',
        left:15,
        fontSize:13,
        color:'white',
        backgroundColor:'rgba(255,255,255,0)',
    },
    user_pic: {
        marginLeft:15,
        width: 30,
        height: 30,
        borderRadius:15,
    },
    feature: {
        height: 230,
        borderRadius:10,
    },
    listView: {
        paddingTop: 5,
        backgroundColor: '#F5FCFF',
    },
    
    bottomView: {
        position:'absolute',
        top:190,
        height:40,
        left:0,
        right:0,
        flexDirection:'row',
    },
    clear: {
        flexDirection:'row',
        alignItems:'center',
        position:'relative',
        left:0,
        width:175,
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
    },
    eyesNum: {
        left:5,
        fontSize:12,
        color:'white',
        backgroundColor:'rgba(255,255,255,0)',
    },
    navbar: {
        top: 0,
        left: 0,
        right: 0,
        position: 'absolute'
    },
});


