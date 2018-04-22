"use strict";

import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
/**
 * 新建质检单TaBbar，antd-mobile中tab的renderTabBar
 */
class NewCheckListTabBar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeTab: 0,//当前选中的tab
        };
    }

    componentDidMount() {

    }

    onTabClick = (index) => {

        if (this.state.activeTab != index) {
            this.props.defaultProps.goToTab(index);
            this.setState({
                activeTab: index,
            });
        }
    }

    renderTab = (tab, index) => {
        return (
            <View key={index}>
                <View style={styles.tabTextContainer}>
                    <TouchableOpacity onPress={() => { this.onTabClick(index) }}>
                        <Text style={(this.state.activeTab == index) ? styles.tabTextSelected : styles.tabText} >{tab.title}</Text>
                    </TouchableOpacity>
                </View>
                {
                    (this.state.activeTab == index) ? (<View style={styles.underLine} ></View>) : (null)
                }
            </View>
        );
    }

    render() {
        return (
            <View style={styles.tabBar}>

                <TouchableOpacity onPress={() => { this.props.goBack() }} style={styles.goBack}>
                    <Image source={require("app-images/icon_back_white.png")} style={{ width: 9, height: 20 }}></Image>
                </TouchableOpacity>
                <View style={styles.tabItemContainer}>
                    {
                        this.props.defaultProps.tabs.map((item, index) => {
                            return (this.renderTab(item, index))
                        })
                    }

                </View>
                <Text onPress={() => this.props.submit()} style={styles.submit} >提交</Text>
            </View>
        );
    }
}

NewCheckListTabBar.propTypes = {
    /**
     * defaultTabBar的属性
     */
    defaultProps: PropTypes.object,
    /**
     * 提交
     */
    submit: PropTypes.func,
    /**
     * 返回
     */
    goBack: PropTypes.func,

}

const styles = StyleSheet.create({
    tabBar: {
        height: 44,
        flexDirection: "row",
        backgroundColor: "#00baf3",
        alignItems: "center",
    },
    tabItemContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    tabTextContainer: {
        height: 44,
        alignItems: "center",
        flexDirection: "row",
        alignSelf: "center",
    },
    tabText: {
        color: "#ffffff",
        fontSize: 15,
        marginLeft: 7,
        marginRight: 7,
    },
    tabTextSelected: {
        color: "#ffffff",
        fontSize: 17,
        marginLeft: 7,
        marginRight: 7,
    },
    underLine: {
        width: 26,
        height: 2,
        bottom: 4,
        position: "absolute",
        alignSelf: "center",
        backgroundColor: "#ffffff",
    },
    submit: {
        marginRight: 20,
        color: '#FFFFFF',
        width: 60,
        textAlign: "right",
        flex: 1,
    },
    goBack: {
        paddingLeft: 20,
        flex: 1,
    }

})

export default NewCheckListTabBar;
