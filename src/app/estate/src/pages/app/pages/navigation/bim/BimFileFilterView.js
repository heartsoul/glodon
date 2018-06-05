"use strict";
import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
    FlatList,
} from 'react-native';
import PropTypes from 'prop-types';

import * as API from "app-api";
var { width, height } = Dimensions.get("window");

const FILTER_TYPE_SPECIAL = "special";//专业
const FILTER_TYPE_BUILDING = "building";//单体
const normalImage = require("app-images/icon_gray_trangle_down.png")
const selectedImage = require("app-images/icon_blue_trangle_up.png")

/**
 * 模型专业单体筛选
 */
class BimFileFilterView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            show: false,
            filterType: null,
            buildings: [],
            specialty: [],
            selectedBuilding: null,
            selectedSpecialty: null,
        };
    }

    componentDidMount() {
        //专业
        API.getPmbasicSpecialty(false).then(responseData => {
            if (responseData) {
                let all = {
                    code:'all',
                    name:'全部',
                    keywords: null,
                    parentId: null,
                    id: 0,
                    treePath: '0/',
                    orderNum: 0 
                }
                let list =[all];
                let dataList = responseData.data;
                let data = [...list,...dataList];
                this.setState({
                    specialty: data
                });
            }
        }).catch((err) => {
        });
        //单体
        API.getPmbasicBuildings(storage.loadProject()).then(responseData => {
            if (responseData) {
                let all = {
                    name: '全部',
                    code: '0',
                    structureType: '123123',
                    area: 124311113000,
                    projectId: 5213135,
                    id: 0
                }
                let list =[all];
                let dataList = responseData.data;
                let data = [...list,...dataList];
                this.setState({
                    buildings: data
                });
            }
        }).catch((err) => {
        });

    }


    onClickFilter = (type) => {
        if (this.state.show && this.state.filterType === type) {
            this.hideFilter();
        } else {
            this.showFilter(type);
        }
    }

    hideFilter = () => {
        this.setState({
            show: false,
        })
    }

    showFilter = (type) => {
        this.setState({
            show: true,
            filterType: type,
        })
    }

    onFilterChange = (type, item) => {
        this.hideFilter();
        if (type === FILTER_TYPE_SPECIAL) {
            if (this.state.selectedSpecialty && item.id === this.state.selectedSpecialty.id) {//点击相同的返回
                return;
            }
            this.setState({
                selectedSpecialty: item,
            }, () => {
                if (this.props.onFilterChange) {
                    this.props.onFilterChange(this.state.selectedSpecialty, this.state.selectedBuilding);
                }
            })
        } else if (type === FILTER_TYPE_BUILDING) {
            if (this.state.selectedBuilding && item.id === this.state.selectedBuilding.id) {//点击相同的返回
                return;
            }
            this.setState({
                selectedBuilding: item,
            }, () => {
                if (this.props.onFilterChange) {
                    this.props.onFilterChange(this.state.selectedSpecialty, this.state.selectedBuilding);
                }
            })
        }

    }


    onClickBuilding = () => {
        this.setState({
            show: !this.state.show,
        })
    }

    _separator = () => {
        return <View style={{ height: 1, backgroundColor: '#f7f7f7', marginLeft: 20 }} />;
    }
    
    //专业item
    renderSpecialItem = ({ item, index }) => {
        return (
            <TouchableOpacity onPress={() => { this.onFilterChange(FILTER_TYPE_SPECIAL, item) }}>
                <View style={styles.specialItem}>
                    <Text style={(this.state.selectedSpecialty && this.state.selectedSpecialty.id === item.id) ? styles.specialItemTextSelected : styles.specialItemText}>{item.name}</Text>
                    <Image style={(this.state.selectedSpecialty && this.state.selectedSpecialty.id === item.id) ? styles.specialItemImageSelected : styles.specialItemImage} source={require("app-images/icon_choose_list_selected.png")} />
                </View>
            </TouchableOpacity>
        );
    }
    //单体item
    renderBuildingItem = ({ item, index }) => {
        return (
            <TouchableOpacity onPress={() => { this.onFilterChange(FILTER_TYPE_BUILDING, item) }}>
                <View style={styles.buildingItem}>
                    <View style={(this.state.selectedBuilding && this.state.selectedBuilding.id === item.id) ? styles.buildingItemBoxSelected : styles.buildingItemBox}>
                        <Text style={(this.state.selectedBuilding && this.state.selectedBuilding.id === item.id) ? styles.buildingItemTextSelected : styles.buildingItemText}>{item.name}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    renderFilterView = () => {
        return (
            <View style={{ width: width, height: 192, backgroundColor: "#ffffff" }}>
                <FlatList style={[{ width: width,backgroundColor:'#ffffff' }, this.state.filterType === FILTER_TYPE_SPECIAL ? { display: "flex" } : { display: "none" }]}
                    data={this.state.specialty}
                    renderItem={({ item, index }) => { return this.renderSpecialItem({ item, index }) }}
                    ItemSeparatorComponent={this._separator}
                    keyExtractor={(item) => item.id+""}
                />

                <FlatList style={[{ width: width,backgroundColor:'#ffffff' }, this.state.filterType === FILTER_TYPE_BUILDING ? { display: "flex" } : { display: "none" }]}
                    data={this.state.buildings}
                    renderItem={({ item, index }) => { return this.renderBuildingItem({ item, index }) }}
                    numColumns={3}
                    keyExtractor={(item) => (item.id+"")}
                />
            </View>
        );
    }

    render() {
        return (
            <View>
                <View style={styles.container}>
                    <TouchableOpacity style={styles.touchBtn} onPress={() => { this.onClickFilter(FILTER_TYPE_SPECIAL) }}>
                        <View style={styles.leftBtn}>
                            <Text style={(this.state.filterType === FILTER_TYPE_SPECIAL && this.state.show) ? (styles.filterTextNormalSelected) : (styles.filterTextNormal)}>{this.state.selectedSpecialty ? this.state.selectedSpecialty.name : "专业"}</Text>
                            <Image style={styles.filterImage} source={(this.state.filterType === FILTER_TYPE_SPECIAL && this.state.show) ? selectedImage : normalImage} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.touchBtn} onPress={() => { this.onClickFilter(FILTER_TYPE_BUILDING) }}>
                        <View style={styles.rightBtn}>
                            <Text style={(this.state.filterType === FILTER_TYPE_BUILDING && this.state.show) ? (styles.filterTextNormalSelected) : (styles.filterTextNormal)}>{this.state.selectedBuilding ? this.state.selectedBuilding.name : "单体"}</Text>
                            <Image style={styles.filterImage} source={(this.state.filterType === FILTER_TYPE_BUILDING && this.state.show) ? selectedImage : normalImage} />
                        </View>
                    </TouchableOpacity>
                </View>

                {this.props.children}

                {
                    (this.state.show) ? (
                        <View style={[{ width: width, height: height, backgroundColor: "#00000033", position: "absolute", top: 44 }, (this.state.show) ? { display: "flex" } : { display: "none" }]}>
                            <View style={{ width: width, height: 192, backgroundColor: "#ffffff" }}>
                                {
                                    this.renderFilterView()

                                }
                            </View>
                            <TouchableOpacity style={{ flex: 1 }} onPress={() => {
                                this.hideFilter();
                            }} />
                        </View>
                    ) : (null)
                }


            </View>
        );
    }
}
BimFileFilterView.propTypes = {
    /**
     * 筛选条件变化时的回调方法 (specialty, building)=>{}
     */
    onFilterChange: PropTypes.func,
}

export default BimFileFilterView;

const styles = StyleSheet.create({

    container: {
        flexDirection: "row",
        height: 44,
        borderBottomColor: "#f7f7f7",
        borderBottomWidth: 1,
    },
    touchBtn: {
        flex: 1
    },
    leftBtn: {
        flexDirection: "row",
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
        marginRight: 29,
    },
    rightBtn: {
        flexDirection: "row",
        flex: 1,
        alignItems: "center",
        marginLeft: 29,
    },

    filterTextNormal: {
        fontSize: 14,
        color: "#000000"
    },
    filterTextNormalSelected: {
        fontSize: 14,
        color: "#00baf3"
    },
    filterImage: {
        width: 13,
        height: 7,
        marginLeft: 6,
    },
    specialItem: {
        flexDirection: "row",
        height: 48,
        alignItems: "center",
        backgroundColor:'#ffffff'
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
    buildingItem: {
        height: 48,
        width: width / 3,
        alignItems: "center",
        paddingTop: 15,
        justifyContent: "center",
        backgroundColor:'#ffffff'
    },
    buildingItemBox: {
        width: 86,
        height: 32,
        marginLeft: 20,
        backgroundColor: "#f0f0f0",
        borderRadius: 4,
        justifyContent: "center",
        alignItems: "center"
    },
    buildingItemText: {
        color: "#333333",
        fontSize: 14,
    },
    buildingItemBoxSelected: {
        width: 86,
        height: 32,
        marginLeft: 20,
        borderWidth: 1,
        borderColor: "#00baf3",
        backgroundColor: "#ffffff",
        borderRadius: 4,
        justifyContent: "center",
        alignItems: "center"
    },
    buildingItemTextSelected: {
        color: "#00baf3",
        fontSize: 14,
    },
})