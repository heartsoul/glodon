'use strict'

import React, { Component } from 'react';
import {
    StyleSheet,
    View,
} from 'react-native';
import PropTypes from 'prop-types';
import { ListRow } from 'app-3rd/teaset';

/**
 * 选择质检项目
 */
export default class SelectCheckPointView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedCheckPoint: {},
        };
    }

    componentDidMount() {
        if (this.props.selectedCheckPoint) {
            this.setState({
                selectedCheckPoint: this.props.selectedCheckPoint,
            });
        }
    }

    selectCheckPoint = () => {
        let navigator = this.props.navigation;

        storage.pushNext(
            navigator,
            'CheckPointPage',
            {
                selectedCheckPoint: this.state.selectedCheckPoint,
                callback: (checkPoint) => {
                    this.setState({
                        selectedCheckPoint: checkPoint,
                    });
                }
            }
        );
    }

    getSelectedCheckPoint = () => {
        return this.state.selectedCheckPoint;
    }
    
    getDetailName = () => {
        let name = '';
        if (this.state.selectedCheckPoint) {
            name = this.state.selectedCheckPoint.name;
        } else if (this.props.selectedCheckPoint) {
            this.setState({
                selectedCheckPoint: this.props.selectedCheckPoint,
            })
        }
        return name;
    }

    render() {

        return (
            <View>
                <ListRow title='质检项目' accessory='indicator' bottomSeparator='indent' detail={this.getDetailName()} onPress={() => { this.selectCheckPoint() }} />
            </View>
        );
    }
}

SelectCheckPointView.propTypes = {
    /**
   * 默认的日期
   */
    selectedCheckPoint: {}
}

const styles = StyleSheet.create({

})