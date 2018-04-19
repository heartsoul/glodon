'use strict'

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
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
            selectedCheckPoint: {
                id: -1,
                name: '',
            },
            inputName: '',
            isShowMark: false,
        };
    }

    componentWillReceiveProps(nextProps) {
        let selectedCheckPoint = this.props.selectedCheckPoint;
        if (selectedCheckPoint && selectedCheckPoint.id && selectedCheckPoint.id != -1) {
            this.setState({
                selectedCheckPoint: selectedCheckPoint,
                inputName: selectedCheckPoint.name,
                isShowMark: true,
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
                        inputName: checkPoint.name,
                        selectedCheckPoint: checkPoint,
                        isShowMark: true,
                    });
                }
            }
        );
    }

    /**
     * 获取选中或者修改后的质检项目
     */
    getSelectedCheckPoint = () => {
        let selectedCheckPoint = {
            name: this.state.inputName,
            id: -1,
        }
        if (this.state.selectedCheckPoint.name === this.state.inputName) {
            selectedCheckPoint.id = this.state.selectedCheckPoint.id;
        }
        return selectedCheckPoint;
    }

    textInputChange = (text) => {
        let isShowMark = this.state.selectedCheckPoint
            && this.state.selectedCheckPoint.name === text
            && this.state.selectedCheckPoint.id && this.state.selectedCheckPoint.id != -1;
        this.setState({
            inputName: text,
            isShowMark: isShowMark,
        });
    }

    toCheckPointInfo = () => {
        let navigator = this.props.navigation;
        storage.pushNext(navigator, "QualityStatardsPage", { 'qualityCheckpointId': this.state.selectedCheckPoint.id, 'qualityCheckpointName': this.state.selectedCheckPoint.name });
    }

    getDetailView = () => {
        return (
            <View style={{ flexDirection: 'row', flex: 1, }}>
                <TextInput
                    style={{ flex: 1, textAlignVertical: 'top', paddingLeft: 12, paddingRight: 12, paddingTop: 12, paddingBottom: 0, backgroundColor: '#ffffff' }}
                    placeholder={''}
                    multiline={false}
                    underlineColorAndroid={"transparent"}
                    textAlign="right"
                    onChangeText={(text) => { this.textInputChange(text) }}
                    value={this.state.inputName}
                />
                {
                    (this.state.isShowMark) ? (
                        <TouchableOpacity style={{ paddingRight: 5, alignSelf: "center", }} onPress={() => { this.toCheckPointInfo() }}>
                            <Image style={styles.markImage} source={require('app-images/icon_benchmark.png')} />
                        </TouchableOpacity>
                    ) : (null)
                }

            </View>
        );
    }

    render() {

        return (
            <View>
                {/* <ListRow title='质检项目' accessory='indicator' bottomSeparator='indent' detail={this.getDetailName()} onPress={() => { this.selectCheckPoint() }} /> */}
                <ListRow title='质检项目' accessory='indicator' bottomSeparator='indent' detail={this.getDetailView()} onPress={() => { this.selectCheckPoint() }} />
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
    markImage: {
        width: 15,
        height: 15,
    },
})