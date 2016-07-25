import React,{Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    ListView,
    Dimensions,
} from 'react-native';

const ScreenW = Dimensions.get('window').width;
import NavigationBar from 'react-native-navigationbar';
export default class SugerFansDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
        }
    }
    componentDidMount() {
        this.loadData();
    }
    // 请求数据
    loadData () {
        var URL = 'http://m.yidoutang.com/api/case/detail?id='+this.props.id;
        fetch(URL)
            .then((response) => response.json())
            .then((responseData) => {

                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(responseData.data.contents[0].content),
                });
                console.log(responseData);
            })
            .done();
    }
    // 渲染cell
    renderRows (content) {
        console.log('contents',content)
        var type = content.type;

            if (type === 'desc'){
                return (
                    <View style = {styles.container}>
                        <Text style = {styles.desc}>{content.data}</Text>
                    </View>
                );
            }else if (type === 'match') {
                var data = content.data;
                var H = data.height * (ScreenW-20) / data.width;
                return (
                    <View style = {styles.container}>
                        <Image style = {[{height:H},{margin:10}]}
                               source = {{uri : data.image}}
                        />
                    </View>
                );
            }

    }

    render () {
        return (
            <View style = {styles.container}>
                <NavigationBar
                    backHidden={false}
                    barTintColor='white'
                    barStyle={styles.navbar}
                    title='值得买详情'
                    // actionName='About'
                    backFunc={() => {
                        this.props.navigator.pop()
                    }}
                    actionFunc={() => {
                        this.props.navigator.push({
                        component: AboutPage
                    })
                    }}/>
                <ListView
                    dataSource = {this.state.dataSource}
                    renderRow = {this.renderRows.bind(this)}
                    // style = {styles.listView}
                />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'white',
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
    desc: {
        margin:10,
        fontSize:16,
        color:'black',
    },

});

