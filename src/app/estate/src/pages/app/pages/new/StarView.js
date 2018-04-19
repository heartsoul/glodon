'use strict'

import React, { Component } from 'react';
import {
    View,
    Image,
    StyleSheet,

} from 'react-native';
import PropTypes from 'prop-types';
/**
 * 必填信息校验时候未填写显示星号
 */
class StartView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showStar: false,
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            showStar: nextProps.showStar,
        });
    }

    render() {
        return (
            <View style={{ flexDirection: "row" }}>
                <View style={styles.childViewContainer}>
                    {
                        (this.props.childView) ? (this.props.childView) : (null)
                    }
                </View>
                {
                    (this.state.showStar) ? (
                        <Image source={require("app-images/icon_create_check_list_star.png")} style={styles.starImage} />
                    ) : (null)
                }

            </View>
        );
    }
}
StartView.propTypes = {
    /**
     * 
     */
    childView: PropTypes.element,
    /**
     * 显示隐藏，默认false
     */
    showStar: PropTypes.bool,
}

const styles = StyleSheet.create({
    childViewContainer: {
        flex: 1,
    },
    starImage: {
        width: 8,
        height: 8,
        position: 'absolute',
        alignSelf: 'center'
    },
})

export default StartView;