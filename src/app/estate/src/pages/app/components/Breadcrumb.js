"use strict";

import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
    ScrollView,
} from 'react-native';
import PropTypes from 'prop-types';
import { FlatList } from "app-3rd";
var { width, height } = Dimensions.get("window");

/**
 * 面包屑导航
 */
class Breadcrumb extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dir: [],
            showPop: false,
            index: 0,
        }
    }

    //点击导航
    _navItemClick = (item, index) => {
        let showPop = this.state.showPop;
        if (this.state.selectedItem && this.state.selectedItem.fileId === item.fileId) {
            showPop = !showPop;
        } else {
            showPop = true;
        }
        this.setState({
            dir: item.dir,
            selectedItem: item,
            showPop: showPop,
            index: index,
        })

        // if (this.props.onItemClick) {
        //     this.props.onItemClick(item, index);
        // }
    }

    renderNavItemView = ({ item, index }) => {
        return (
            <TouchableOpacity key={'Breadcrumb_'+index+'_'+item.fileId} activeOpacity={0.5} onPress={(event) =>{event.preventDefault(); this._navItemClick(item, index)}} >
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

    popItemClick = (item) => {


        this.setState({
            showPop: false,
        }, () => {
            this.props.onItemClick(item, this.state.index);
        })
    }

    renderPopItem = (item) => {
        return (
            <TouchableOpacity key={item.fileId} onPress={(event) => {event.preventDefault(); 
                this.popItemClick(item);
            }}>
                <View style={styles.specialItem}>
                    <Text style={(this.state.selectedItem && this.state.selectedItem.fileId === item.fileId) ? styles.specialItemTextSelected : styles.specialItemText}>{item.name}</Text>
                    <Image style={(this.state.selectedItem && this.state.selectedItem.fileId === item.fileId) ? styles.specialItemImageSelected : styles.specialItemImage} source={require("app-images/icon_choose_list_selected.png")} />
                </View>
            </TouchableOpacity>
        );
    }

    renderPopView = () => {
        return (
            <View style={[{ width: width, height: height, backgroundColor: "#00000033", position: "absolute", top: 48 }]}>
                <View style={{ width: width, height: 192, backgroundColor: "#ffffff" }}>
                    <ScrollView>
                        {
                            (this.state.dir) ? (
                                this.state.dir.map((item) => {
                                    return this.renderPopItem(item)
                                })
                            ) : (null)
                        }
                    </ScrollView>
                </View>
                <TouchableOpacity style={{ flex: 1 }} onPress={(event) => {
                    event.preventDefault(); 
                    this.setState({
                        showPop: false,
                    })
                }} />
            </View>
        );
    }

    render() {
        return (

            <View style={{ height: "100%" }}>
                <View style={this.props.data && this.props.data.length > 0 ? { width: "100%", height: 48, paddingLeft: 15, backgroundColor: "#f9f9f9" } : { height: 0 }} >
                    <ScrollView horizontal={true}>
                        {
                            this.props.data ? (
                                this.props.data.map((item, index) => {
                                    return this.renderNavItemView({ item, index })
                                })
                            ) : null
                        }
                    </ScrollView>
                </View>
                {
                    (this.props.childView) ? (this.props.childView) : (null)
                }
                {
                    (this.state.showPop) ? this.renderPopView() : (null)
                }
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
        alignItems: 'center',
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
    specialItem: {
        flexDirection: "row",
        height: 48,
        alignItems: "center",
        borderBottomColor: "#e6e6e6",
        borderBottomWidth: 0.5
    },
    specialItemText: {
        flex: 1,
        marginLeft: 20,
        color: "#565656",
        fontSize: 14
    },
    specialItemImage: {
        width: 21,
        height: 14,
        marginRight: 20,
        display: "none",
    },
    specialItemTextSelected: {
        flex: 1,
        marginLeft: 20,
        color: "#00baf3",
        fontSize: 14
    },
    specialItemImageSelected: {
        width: 21,
        height: 14,
        marginRight: 20,
    },
})