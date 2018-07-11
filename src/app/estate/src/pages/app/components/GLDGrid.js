/**
 * data 格式[
 *  {source:"",name:""}
 * ] 
 */
import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
} from 'react-native';
import PropTypes from 'prop-types';

class GLDGrid extends Component {

    static propTypes = {
        numColumns: PropTypes.number,
        itemStyle: PropTypes.any,
        imageStyle: PropTypes.any.isRequired, // 设置图片大小{width:60,height:60}
        onPress: PropTypes.func,
        data: PropTypes.array,
        horizontal: PropTypes.bool,
    }

    static defaultProps = {
        numColumns: 4,
        horizontal: false,
    }

    constructor(props) {
        super(props)


    }
    _fixData = () => {
        if (this.props.data) {
            let len = this.props.data.length;
            let fixCount = this.props.numColumns - len % this.props.numColumns;
            for (let i = 0; i < fixCount; i++) {
                this.props.data.push({ name: "fix-" + i, fix: true })
            }
        }

    }
    _keyExtractor = (item, index) => item.name+'-'+index;
    _renderGrid = () => {
        this._fixData();
        return (
            <View style={{ ...this.props.style }}>
                <FlatList
                    data={this.props.data}
                    renderItem={({ item, index }) => { return this.renderItem({ item, index }) }}
                    numColumns={this.props.numColumns}
                    keyExtractor={this._keyExtractor}
                />
            </View>

        );
    }
    /**
     * 横向模式
     */
    _renderHorizontalList = () => {
        return (
            <FlatList
                data={this.props.data}
                renderItem={({ item, index }) => { return this.renderItem({ item, index }) }}
                keyExtractor={(item,index) => (item.name + "_"+index)}
                horizontal={true}
            />
        );
    }

    render() {
        if (this.props.horizontal) {
            return this._renderHorizontalList();
        } else {
            return this._renderGrid();
        }
    }
    renderItem({ item, index }) {
        if (item.fix) {
            return (
                <View
                    style={{ flex: 1 }}
                    key={'fix_'+item.name+'_'+index}
                >
                </View>
            )
        } else {
            return (
                <TouchableOpacity
                    style={{ ...this.props.itemStyle, flex: 1 }}
                    key={'item_'+item.name+'_'+index}
                    onPress={(event) => {
                        event.preventDefault();
                        if (this.props.onPress) {
                            this.props.onPress(item, index);
                        }
                    }}>
                    <View style={[styles.card, { width: "100%" }]}>
                        <Image source={item.source} style={[this.props.imageStyle, { resizeMode: "contain" }]} />
                        <Text style={styles.itemText} >{item.name}</Text>
                    </View>
                </TouchableOpacity>

            )
        }

    }
}

const styles = StyleSheet.create({
    card: {
        alignItems: "center",
    },
    itemText: {
        color: "#000",
        fontSize: 14
    }
})

export default GLDGrid;
