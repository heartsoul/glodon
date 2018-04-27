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
        // console.log('>>>props.activeTab:' + props.defaultProps.activeTab);
        this.state = {
            activeTab: props.defaultProps.activeTab,//当前选中的tab
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
            <TouchableOpacity key={index} onPress={() => { this.onTabClick(index) }}>
                <View style={styles.tabTextContainer}>
                    <Text style={(this.state.activeTab == index) ? styles.tabTextSelected : styles.tabText} >{tab.title}</Text>
                </View>
                <View style={(this.state.activeTab != index) ? { display: 'none' } : styles.underLine} ></View>
            </TouchableOpacity>
        );
    }

    render() {
        return (
            <View style={styles.tabBar}>
                <View style={styles.tabItemContainer}>
                    {
                        this.props.defaultProps.tabs.map((item, index) => {
                            return (this.renderTab(item, index))
                        })
                    }
                </View>
            </View>
        );
    }
}

NewCheckListTabBar.propTypes = {
    /**
     * defaultTabBar的属性
     */
    defaultProps: PropTypes.object,

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
})

export default NewCheckListTabBar;
