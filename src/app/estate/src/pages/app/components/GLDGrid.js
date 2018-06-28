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
    Dimensions,
    TouchableOpacity,
    Image,
} from 'react-native';
import PropTypes from 'prop-types';

var { width, height } = Dimensions.get("window")
const defaultCardWith = (width - 40) / 4;

class GLDGrid extends Component {

    static propTypes = {
        numColumns: PropTypes.number,
        cardStyle: PropTypes.any,//每个item样式
        imageStyle: PropTypes.any,//
        onPress: PropTypes.func,
        horizontal: PropTypes.bool
    }

    static defaultProps = {
        numColumns: 4,
        horizontal: false,
        cardStyle: { width: defaultCardWith },
        imageStyle: { width: defaultCardWith, height: defaultCardWith, resizeMode: "contain" },
    }

    _renderGrid = () => {
        let cardW = this.props.cardStyle.width ? this.props.cardStyle.width : defaultCardWith
        let flatW = this.props.numColumns * cardW;
        return (
            <FlatList style={[{ width: flatW, backgroundColor: '#fff' },]}
                data={this.props.data}
                renderItem={({ item, index }) => { return this.renderBuildingItem({ item, index }) }}
                numColumns={this.props.numColumns}
                keyExtractor={(item) => (item.id + "")}
            />
        );
    }
    /**
     * 横向模式
     */
    _renderHorizontalList = () => {
        return (
            <FlatList style={[{ backgroundColor: '#fff' },]}
                data={this.props.data}
                renderItem={({ item, index }) => { return this.renderBuildingItem({ item, index }) }}
                keyExtractor={(item) => (item.name + "")}
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
    renderBuildingItem({ item, index }) {
        return (
            <TouchableOpacity onPress={(event) => {
                event.preventDefault();
                if (this.props.onPress) {
                    this.props.onPress(item, index);
                }
            }}>
                <View style={[styles.card, this.props.cardStyle]}>
                    <Image source={item.source} style={[this.props.imageStyle]} />
                    <Text >{item.name}</Text>
                </View>
            </TouchableOpacity>

        )
    }
}

const styles = StyleSheet.create({
    card: {
        alignItems: "center",
    },
})

export default GLDGrid;
