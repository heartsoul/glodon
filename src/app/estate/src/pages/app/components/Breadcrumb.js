"use strict";

import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Image,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';

/**
 * 面包屑导航
 */
class Breadcrumb extends Component {

    constructor(props) {
        super(props);
    }

    //点击导航
    _navItemClick = (item, index) => {
        // let len = this.props.data ? this.props.data.length : 0;
        // this.props.data.splice(index, len - index);
        if (this.props.onItemClick) {
            this.props.onItemClick(item, index);
        }
    }

    renderNavItemView = ({ item, index }) => {
        return (
            <TouchableOpacity activeOpacity={0.5} onPress={() => this._navItemClick(item, index)} >
                <View style={styles.navContainer}>
                    <Text style={(index == this.props.data.length - 1) ? styles.lastNavName : styles.navName}> {item.name}</Text>
                    {
                        (index == this.props.data.length - 1) ? (
                            <Image style={styles.navDownArrow} source={require('app-images/icon_blue_arrow_down.png')} />
                        ) :
                            (<Text style={styles.navArrow}> {'->'}</Text>)
                    }

                </View>
            </TouchableOpacity>
        );
    }

    render() {
        return (
            <View style={this.props.data && this.props.data.length > 0 ? { height: 48, marginLeft: 15 } : { height: 0 }}>
                <FlatList
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    data={this.props.data}
                    renderItem={this.renderNavItemView}
                    keyExtractor={(item, index) => index + "key"}
                />
            </View>
        );
    }
}

export default Breadcrumb;

Breadcrumb.propTypes = {
    /**
     * 导航数据
     */
    data: PropTypes.array,

    /**
     * 点击导航(item,index)=>{}
     */
    onItemClick: PropTypes.func,
}

const styles = StyleSheet.create({

    navContainer: {
        flexDirection: 'row',
        height: 48,
        alignItems: 'center'
    },
    navName: {
        fontSize: 14,
        color: '#b5b5b5',
        marginLeft: 5
    },
    lastNavName: {
        fontSize: 14,
        color: '#00baf3',
        marginLeft: 5
    },
    navArrow: {
        fontSize: 14,
        color: '#b5b5b5',
        marginRight: 5,
        flex: 1
    },
    navDownArrow: {
        width: 11,
        height: 5
    },
})