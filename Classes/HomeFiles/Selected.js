import React ,{Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    ListView,
    Navigator,
    Dimensions,
    ScrollView,
    AlertIndicatorIOS,
    ActivityIndicatorIOS,
    AlertIOS,
} from 'react-native';

import NavigationBar   from  'react-native-navigationbar'
import ShowHomeDetail  from  './ShowHome/ShowHomeDetail'
import SugerFansDetail from  './SugerFans/SugerFansDetail'
import Swiper          from  'react-native-swiper'
// 值得买URL
var REQUEST_URL = 'http://m.yidoutang.com/api/recommend?v=1';
var banners = [];
export default class Selected extends Component {
    render() {
        let defaultName = 'Selecteds';// 默认初始化名称
        let defaultComponent = Selecteds;// 默认初始化组件
        return (
            /**
             * 导航器通过'路由对象'来分辨不同的场景,利用'renderScene'属性获取指定路由对象的配置信息,从而改变场景的动画或者手势
             * */
            <Navigator
                // 初始化路由 initial+Route,里面有两个参数,一个name,一个component(组件)
                initialRoute={{name:defaultName ,component:defaultComponent}}
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

class Selecteds extends Component {
    // 2 、 构造函数 ,首先定义函数:getSectionData / getRowData
    constructor(props) {
        super(props);
        // 固定格式获取SectionData----从dataBlob中取sectionID
        var getSectionData = (dataBlob, sectionID) => {
            return dataBlob[sectionID];
        }
        // 固定格式获取rowData----从dataBlob中取sectionID && rowID
        var getRowData = (dataBlob, sectionID, rowID) => {
            return dataBlob[sectionID + ':' + rowID];
        }

        this.state = {
            loaded : false, 
            // 初始化ListViewDataSource
            dataSource : new ListView.DataSource({
                getSectionData          : getSectionData,// 获取组数据
                getRowData              : getRowData,// 获取行数据
                rowHasChanged           : (row1, row2) => row1 !== row2,
                sectionHeaderHasChanged : (s1, s2) => s1 !== s2
            }),
            id:null,
            title:null,
            
        };
        this.bindMethods();
    }
    // 声明周期函数,加载界面完成后调用:请求数据-----用来做一些复杂操作（定时器、异步操作、数据请求）
    componentDidMount() {
        this.fetchData();
    }
    // 3 、 bindMethods
    bindMethods() {
        if (! this.bindableMethods) {
            return;
        }

        // this.bindableMethods ---> renderRow(rowData, sectionID, rowID)
        for (var methodName in this.bindableMethods) {
            // 将renderRow (rowData, sectionID, rowID) 绑定到 this
            this[methodName] = this.bindableMethods[methodName].bind(this);
        }
    }

    fetchData () {
        fetch(REQUEST_URL).then((response) => response.json()).then((responseData) => {
            // var 定义以下几种变量或者对象,逗号','不算一句话的结束,分号';'才是一句话的结束,所以一个var就可以了
            var datas = responseData.data,
                length = datas.length,
                dataBlob = {},
                sectionIDs = [],
                rowIDs = [],
                data,
                detailDatas,
                detailDatasLength,
                detailData,
                i,
                j;

            // length: 标示一种有几组数据
            for (i = 0; i < length; i++) {
                data = datas[i];
                // 将type值push到sectionID数组中,相当于OC中'addObjectTo'
                sectionIDs.push(data.type);
                /**
                 * dataBlob 中 data.type 对应的是 data.title
                 * 当 data.type 为 '0' 时,对应的是 '广告图' 在字典中表示为{0:广告图,}
                 * 当 data.type 为 '1' 时,对应的是 ''
                 * 当 data.type 为 '2' 时,对应的是 ''
                 * 当 data.type 为 '3' 时,对应的是 ''
                 * */
                // dataBlob为字典,该[]样式为,在字典中定义一个Key,等号'='右边为Value
                dataBlob[data.type] = data.title;
                if (i == 0){
                    banners = data.banners;
                    detailDatasLength = banners.length;
                }else if (i == 1) {
                    detailDatas = data.cases;
                    detailDatasLength = detailDatas.length;
                }else if (i == 2) {
                    detailDatas = data.guides;
                    detailDatasLength = detailDatas.length;
                }else if (i == 3) {
                    detailDatas = data.threads;
                    detailDatasLength = detailDatas.length;
                }


                // rowIDs[i] 为数组rowIDs的第i个元素;
                rowIDs[i] = [];// rowIDs的第i个元素为一个数组

                for(j = 0; j < detailDatasLength; j++) {
                    if (i == 0){
                        detailData = banners[j];
                    }else {
                        detailData = detailDatas[j];
                    }

                    // 将'j'加入到rowIDs[i]数组中
                    rowIDs[i].push(j);
                    // dataBlob为字典,[]为Key, detailData为Value
                    dataBlob[data.type + ':' + j] = detailData;
                }
            }

            this.setState({
                dataSource : this.state.dataSource.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs),
                loaded     : true
            });

        }).done();
    }

    render() {
        // 4、执行render,判断是否loaded完成,true--->this.renderListView(); false--->this.renderLoadingView();
        if (!this.state.loaded) {
            return this.renderLoadingView();
        }
        return this.renderListView();
    }

    renderLoadingView() {
        return (
            <View style={styles.header}>

                <View style={styles.container}>
                    <ActivityIndicatorIOS
                        animating={!this.state.loaded}
                        style={[styles.center, {height: 80}]}
                        size="large"
                    />
                </View>
            </View>
        );
    }

    renderListView() {
        return (
            <View style={[styles.flex,{backgroundColor:'white'}]}>
                <NavigationBar
                     backHidden={true}// 返回按钮是否显示
                     title='精选'// 标题
                     barTintColor="white"// 导航栏颜色
                     titleTextColor="black"// 标题颜色
                     backIconHidden = {true}
                 />
                <ListView
                    dataSource = {this.state.dataSource}
                    style      = {styles.listview}
                    renderRow  = {this.renderRow}
                    renderSectionHeader = {this.renderSectionHeader}
                />
            </View>
        );
    }

    renderSectionHeader(sectionData, sectionID ,rowID) {
        console.log('sectionData',sectionData,'sectionID',banners);
        if (sectionID == 0) {
            return (
                <View style={[{height:140},{flex:1},{backgroundColor: 'orange'}]}>
                    <Swiper style={styles.wrapper} height={140}
                            onMomentumScrollEnd={function(e, state, context){console.log('index:', state.index)}}
                            dot={/* 指示点的颜色 */<View style={{backgroundColor:'white', width: 5, height: 5,borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3,}} />}
                            activeDot={/* 指示点的颜色 */<View style={{backgroundColor: 'black', width: 8, height: 8, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3,}} />}
                            paginationStyle={/* 指示点的位置 */{bottom: 10, left: null, right: 10, }}
                            loop={true}>
                        <View style={styles.slide} >
                            <Image style={[styles.image ,styles.mode]} source={{uri: banners[0].image}} />
                        </View>
                        <View style={styles.slide} >
                            <Image style={[styles.image ,styles.mode]} source={{uri: banners[1].image}} />
                        </View>
                        <View style={styles.slide} >
                            <Image style={[styles.image ,styles.mode]} source={{uri: banners[2].image}} />
                        </View>
                        <View style={styles.slide} /*title={<Text numberOfLines={1}>Aussie tourist dies at Bali hotel</Text>}*/>
                            <Image style={[styles.image ,styles.mode]} source={{uri: banners[3].image}} />
                        </View>
                    </Swiper>

                </View>
            );
        }else {
            return (
                <View style={styles.sectionView}>
                    <Text style={styles.sectionText}>{sectionData}</Text>
                </View>
            );
        }


    }

}
// 1 、
Object.assign(Selecteds.prototype, {
    bindableMethods : {
        toDetailPage (sectionID,rowDataID) {
            if(sectionID == 1) {
                this.props.navigator.push ({
                    component:ShowHomeDetail,
                    params: {
                        id:rowDataID,
                        title:'晒家详情',
                    }
                })
            }else if(sectionID == 3) {
                this.props.navigator.push ({
                    component:SugerFansDetail,
                    params: {
                        id:rowDataID,
                        title:'值得买详情',
                    }
                })
            }else if(sectionID == 2) {
                this.props.navigator.push ({
                    component:SugerFansDetail,
                    params: {
                        id:rowDataID,
                        title:'糖分帮详情',
                    }
                })
            }
        },
        renderRow  (rowData, sectionID, rowID) {
            console.log(rowData,banners);
            if (sectionID == 3) {
                return (//onPress = {this.toDetailPage.bind(this,movie.tid)}
                    <TouchableOpacity onPress = {this.toDetailPage.bind(this,sectionID,rowData.tid)}>
                        <View style={[styles.flex,{padding:2}]} key = {sectionID*10+rowID} >
                            <Image
                                source={{uri: rowData.feature}}
                                style={styles.feature}
                            />
                            <View style = {styles.topView}>
                                <View style = {styles.clear}></View>
                                <View style = {styles.eyes}>
                                    <Image style={styles.eyesPic} source = {require('../Resource/eye@2x.png')}/>
                                    <Text style = {styles.eyesNum}>{rowData.views}</Text>
                                </View>
                                <View style = {styles.eyes}>
                                    <Image style={styles.eyesPic} source = {require('../Resource/reply@2x.png')}/>
                                    <Text style = {styles.eyesNum}>{rowData.replies}</Text>
                                </View>
                            </View>
                            <View style={styles.bottomContainer}>
                                <Image
                                    source={{uri: rowData.user_pic}}
                                    style={styles.user_pic}
                                />
                                <View style={styles.flex}>
                                    <Text style={styles.title} numberOfLine={0}>{rowData.subject}</Text>
                                    <Text style={styles.author}>{rowData.author}</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                );
            }else if (sectionID == 2){
                var num = rowData.images.length;
                var images = rowData.images;
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
                return (//
                    <TouchableOpacity onPress = {this.toDetailPage.bind(this,sectionID,rowData.tid)}>
                        <View style={[styles.container,{padding:2}]}>
                            <View style = {styles.topView}/*上方View*/>
                                <Image style = {styles.user_pic}
                                       source = {{uri:rowData.user_pic}}
                                />
                                <Text style = {styles.Fauthor}>{rowData.author}</Text>
                            </View>
                            <Text style = {styles.subject}>{rowData.subject}</Text>

                            {CENTERVIEW}

                            <View style = {styles.bottomView}/*下方View*/>
                                <View style = {styles.tagname}>
                                    <Text style = {[{alignItems:'center'},{marginLeft:20},{color:'black'}]}>{rowData.tagname}</Text>
                                </View>

                                <View style = {styles.eyes}>
                                    <Image style={styles.eyesPic} source = {require('../Resource/eye@2x.png')}/>
                                    <Text style = {styles.eyesNum}>{rowData.views}</Text>
                                </View>
                                <View style = {styles.eyes}>
                                    <Image style={styles.eyesPic} source = {require('../Resource/reply@2x.png')}/>
                                    <Text style = {styles.eyesNum}>{rowData.replies}</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                );

            } else if(sectionID == 1){
                return (//onPress = {this.toDetailPage.bind(this,movie.group_id)}
                    <TouchableOpacity onPress = {this.toDetailPage.bind(this,sectionID,rowData.group_id)}>
                        <View style={[styles.flex,{padding:2}]} key = {sectionID*10+rowID} >
                            <Image
                                source={{uri: rowData.image}}
                                style={styles.feature}
                            />
                            <View style = {styles.HbottomView}>
                                <View style = {styles.Hclear}>
                                    <Image
                                        source={{uri: rowData.user_pic}}
                                        style={styles.user_pic}
                                    />
                                    <Text style={styles.Hauthor}>by {rowData.user_name}</Text>
                                </View>
                                <View style = {styles.eyes}>
                                    <Image style={styles.eyesPic} source = {require('../Resource/eye@2x.png')}/>
                                    <Text style = {styles.eyesNum}>{rowData.click_num}</Text>
                                </View>
                                <View style = {styles.eyes}>
                                    <Image style={styles.eyesPic} source = {require('../Resource/reply@2x.png')}/>
                                    <Text style = {styles.eyesNum}>{rowData.comment_num}</Text>
                                </View>
                            </View>
                            <View style={styles.bottomContainer}>

                                <View style={styles.flex}>
                                    <Text style={styles.title}>{rowData.title}</Text>

                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                );
            }else if (sectionID == 0) {
                return (
                    <View></View>
                    /*
                     <View style={[styles.flex,{padding:2}]} key = {sectionID*10+rowID}>
                     <Image
                     source={{uri: rowData.image}}
                     style={[{height:150},{borderRadius:10}]}
                     />
                     </View>
                    * */
                );

            }

        },


    }
});

const styles = StyleSheet.create({
    flex: {
        flex: 1
    },
    sectionText: {
        color: 'white',
        paddingHorizontal: 8,
        fontSize: 16
    },
    sectionView: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: 6,
        backgroundColor: 'orange'
    },
    // 图片内部下方的view
    HbottomView: {
        position:'absolute',
        top:160,
        height:40,
        left:0,
        right:0,
        flexDirection:'row',
        // backgroundColor:'red',
    },
    Hauthor: {
        textAlign: 'left',
        left:15,
        fontSize:13,
        color:'white',
        backgroundColor:'rgba(255,255,255,0)',
    },
    Hclear: {
        flexDirection:'row',
        alignItems:'center',
        position:'relative',
        left:0,
        width:175,
    },
    feature: {
        height: 200,
        borderRadius:10,
    },
    listView: {
        paddingTop: 5,
        backgroundColor: '#F5FCFF',
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
    clear: {
        position:'relative',
        left:0,
        width:175,
    },
    eyes: {
        position:'relative',
        left:0,
        width:80,
        // justifyContent:'center',
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
    menuView: {
        flexDirection: 'row',
        marginTop: 10
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    // 图片下方的view
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
        marginTop:8,
        marginRight:15,
    },
    author: {
        textAlign: 'left',
        marginLeft:15,
        fontSize:13,
        color:'gray',
    },
    user_pic: {
        marginLeft:15,
        width: 30,
        height: 30,
        borderRadius:15,
    },
    Fauthor: {
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
        alignItems: 'center',
    },
    wrapper: {
    },

    text: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
    },
    slide: {
        flex: 1,
        // height:140,
        // width:375,
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    image: {
        flex: 1,
    },
    mode:{
        resizeMode: Image.resizeMode.stretch,
    },

});


