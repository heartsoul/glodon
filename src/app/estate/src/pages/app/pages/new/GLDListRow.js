"use strict"

import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import {BimSwitch} from 'app-components'

const rightImage = require("app-images/icon_arrow_right_gray.png");

class Item extends Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        detail: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
        onPress: PropTypes.func,
        bottomSeparator: PropTypes.oneOfType([PropTypes.element, PropTypes.oneOf(['none', 'full', 'indent'])]),
    };
    static defaultProps = {
        bottomSeparator: 'none',
    }
    constructor(props) {
        super(props);
        this.state = {};
    }

    getDetailView = (detail) => {
        if (typeof detail === 'string') {
            detail = <Text style={styles.itemDetail}>{detail}</Text>
        }
        return detail;
    }

    render() {
        return (
<<<<<<< Updated upstream
            <TouchableOpacity onPress={(event)=>{ event.preventDefault(); this.props.onPress(event);}}>
=======
            <TouchableOpacity onPress={(event)=>{ event.preventDefault(); this.props.onPress();}}>
>>>>>>> Stashed changes
                <View style={styles.itemContainer}>
                    <Text style={styles.itemTitle}>{this.props.title}</Text>
                    {
                        this.getDetailView(this.props.detail)
                    }
                    <Image source={rightImage} style={styles.rightArrow} />
                </View>
                {getBottomSeparator(this.props.bottomSeparator)}
            </TouchableOpacity>

        );
    }
}

class SwitchItem extends Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        onValueChange: PropTypes.func.isRequired,
        switchValue: PropTypes.bool,
        bottomSeparator: PropTypes.oneOfType([PropTypes.element, PropTypes.oneOf(['none', 'full', 'indent'])]),
    };
    static defaultProps = {
        bottomSeparator: 'none',
    }
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <TouchableOpacity onPress={(event)=>{ event.preventDefault(); }} >
                <View style={styles.itemContainer}>
                    <Text style={styles.itemTitle}>{this.props.title}</Text>
                    <BimSwitch value={this.props.switchValue} onValueChange={(value) => { this.props.onValueChange(value) }} />
                </View>
                {getBottomSeparator(this.props.bottomSeparator)}
            </TouchableOpacity>

        );
    }
}

function getBottomSeparator(type) {
    let bottomSeparator = null;
    switch (type) {
        case 'none':
            bottomSeparator = null;
            break;
        case 'full':
            bottomSeparator = <View style={styles.separatorStyle} />;
            break;
        case 'indent':
            bottomSeparator = (
                <View style={styles.indentViewStyle}>
                    <View style={styles.separatorStyle} />
                </View>
            );
            break;
    }
    return bottomSeparator;
}

export default class GLDListRow extends Component {
    static Item = Item;
    static SwitchItem = SwitchItem;

    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <View style={styles.listRowContainer}>
                {this.props.children}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    listRowContainer: {
        flex: 1,
    },
    itemContainer: {
        height: 57,
        flex: 1,
        flexDirection: "row",
        backgroundColor: "#ffffff",
        alignItems: "center",
        paddingLeft: 20,
        paddingRight: 20,
    },
    itemTitle: {
        color: "#000000",
        fontSize: 16,
        flex: 1,
    },
    itemDetail: {
        color: "#000000",
        fontSize: 16,
        marginRight: 5,
    },
    rightArrow: {
        width: 17,
        height: 17,
        resizeMode: 'contain'
    },
    separatorStyle: {
        backgroundColor: "#f7f7f7",
        flex: 1,
        height: 1,
    },
    indentViewStyle: {
        paddingLeft: 20,
        backgroundColor: "#ffffff"
    }
});
