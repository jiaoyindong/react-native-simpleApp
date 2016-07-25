/**
 * 晒家详情页 --- create by jiaoyindong
 * */
import React , { Component } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    ListView,
    Dimensions,
} from 'react-native';
import NavigationBar from 'react-native-navigationbar';
const ScreenW = Dimensions.get('window').width;
export default class ShowHomeDetail extends Component {
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
    loadData () {
        var URL = 'http://m.yidoutang.com/api/case/detail?id='+this.props.id;
        console.log(URL);
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
    renderRows (content) {
        console.log('hello',content);
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

// <ListView
    //     dataSource = {this.state.dataSource}
    //     renderRow = {this.renderRows.bind(this)}
    //     style = {styles.listView}
    // />
    render () {
        return (
            <View style = {styles.container}>
                <NavigationBar
                    backHidden={false}
                    barTintColor='white'
                    barStyle={styles.navbar}
                    title='晒家详情'
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
                    style = {styles.listView}
                />

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
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
