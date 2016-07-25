/**
 * 底部tabBar --- create by jiaoyindong 
 * */

import React , { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
} from 'react-native';

import Selected from '../HomeFiles/Selected';
import ShowHome from '../HomeFiles/ShowHome/ShowHome';
import Mine from '../HomeFiles/Mine/Mine';
import SugerFans from '../HomeFiles/SugerFans/SugerFans';
import WorthBuy from '../HomeFiles/WorhBuy/WorthBuy';
import TabBarComponent from 'react-native-tab-navigator';

export default class TabBar extends Component {
    // 构造函数--初始化
    constructor (props) {
        super (props)
        this.state = {
            selectedTab:'Selected',

            title:'推荐',
        }
    }


    render () {

        return (
            <TabBarComponent>
                <TabBarComponent.Item
                    selected = {this.state.selectedTab === 'Selected'}
                    title = "精选"
                    onPress = {()=> this.setState({selectedTab:'Selected'})}
                    renderIcon = {() => <Image style = {styles.img} source = {require('../Resource/TabBar/icon_selection_normal@2x.png')}/>}
                    renderSelectedIcon = {()=> <Image style = {styles.img} source = {require('../Resource/TabBar/icon_selection_checked@2x.png')}/>}
                    >
                    <Selected></Selected>

                </TabBarComponent.Item>

                <TabBarComponent.Item

                    selected = {this.state.selectedTab === 'ShowHome'}
                    title = "晒家"
                    onPress = {()=> this.setState({selectedTab:'ShowHome'})}
                    renderIcon = {() => <Image style = {styles.img} source = {require('../Resource/TabBar/icon_showhome_normal@2x.png')}/>}
                    renderSelectedIcon = {()=> <Image style = {styles.img} source = {require('../Resource/TabBar/icon_showhome_checked@2x.png')}/>}
                >
                    <ShowHome></ShowHome>
                </TabBarComponent.Item>

                <TabBarComponent.Item
                    selected = {this.state.selectedTab === 'WorthBuy'}
                    title = "值得买"
                    onPress = {()=> this.setState({selectedTab:'WorthBuy'})}
                    renderIcon = {() => <Image style = {styles.img} source = {require('../Resource/TabBar/icon_worthiness_normal@2x.png')}/>}
                    renderSelectedIcon = {()=> <Image style = {styles.img} source = {require('../Resource/TabBar/icon_worthiness_checked@2x.png')}/>}
                >
                    <WorthBuy></WorthBuy>
                </TabBarComponent.Item>

                <TabBarComponent.Item
                    selected = {this.state.selectedTab === 'SugerFans'}
                    title = "糖粉帮"
                    onPress = {()=> this.setState({selectedTab:'SugerFans'})}
                    renderIcon = {() => <Image style = {styles.img} source = {require('../Resource/TabBar/icon_suger_normal@2x.png')}/>}
                    renderSelectedIcon = {()=> <Image style = {styles.img} source = {require('../Resource/TabBar/icon_suger_checked@2x.png')}/>}
                >
                    <SugerFans></SugerFans>
                </TabBarComponent.Item>

                <TabBarComponent.Item
                    selected = {this.state.selectedTab === 'Mine'}
                    title = "我"
                    onPress = {()=> this.setState({selectedTab:'Mine'})}
                    renderIcon = {() => <Image style = {styles.img} source = {require('../Resource/TabBar/icon_mine_normal@2x.png')}/>}
                    renderSelectedIcon = {()=> <Image style = {styles.img} source = {require('../Resource/TabBar/icon_mine_checked@2x.png')}/>}
                >
                    <Mine></Mine>
                </TabBarComponent.Item>
            </TabBarComponent>
        );
    }
}

const styles = StyleSheet.create({
    img: {
        width:30,
        height:30,
    },
});






