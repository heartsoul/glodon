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

    componentWillReceiveProps(nextProps) {
        if (!(this.state.selectedCheckPoint && this.state.selectedCheckPoint.name) && this.props.selectedCheckPoint && this.props.selectedCheckPoint.name) {
            this.setState({
                selectedCheckPoint: this.props.selectedCheckPoint,
            })
        }
    }


    selectCheckPoint = () => {
        storage.pushNext(
            null,
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
        if (this.state.selectedCheckPoint && this.state.selectedCheckPoint.name) {
            name = this.state.selectedCheckPoint.name;
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
    selectedCheckPoint: PropTypes.object
}

const styles = StyleSheet.create({

})