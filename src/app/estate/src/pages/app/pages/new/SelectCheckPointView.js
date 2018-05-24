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
import GLDListRow from "./GLDListRow";

/**
 * 选择质检项目
 */
export default class SelectCheckPointView extends Component {

    inputName = "";
    constructor(props) {
        super(props);
        let selectedCheckPoint = this.props.selectedCheckPoint;
        let id = 0;
        let name = "";
        let isShowMark = false;
        if (selectedCheckPoint && selectedCheckPoint.name) {
            id = selectedCheckPoint.id;
            name = selectedCheckPoint.name;
            this.inputName = selectedCheckPoint.name;
            isShowMark = selectedCheckPoint.id && selectedCheckPoint.id != 0;
        }

        this.state = {
            selectedCheckPoint: {
                id: id,
                name: name,
            },
            isShowMark: isShowMark,
        };
    }

    selectCheckPoint = () => {
        storage.pushNext(
            null,
            'CheckPointPage',
            {
                selectedCheckPoint: this.state.selectedCheckPoint,
                callback: (checkPoint) => {
                    let selectedCheckPoint = { ...checkPoint };
                    this.inputName = checkPoint.name,
                        this.setState({
                            selectedCheckPoint: selectedCheckPoint,
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
            name: this.inputName,
            id: 0,
        }
        if (this.state.selectedCheckPoint.name === this.inputName) {
            selectedCheckPoint.id = this.state.selectedCheckPoint.id;
        }
        return selectedCheckPoint;
    }

    textInputChange = (text) => {
        this.inputName = text;
        let isShowMark = this.state.selectedCheckPoint.name === text
            && this.state.selectedCheckPoint.id
            && this.state.selectedCheckPoint.id != 0;
        this.setState({
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
                    style={{ flex: 1, textAlignVertical: 'center', minWidth: 100, paddingLeft: 12, paddingRight: 12,}}
                    placeholder={'请设置'}
                    multiline={false}
                    autoCorrect={false} 
                    autoCapitalize='none'
                    underlineColorAndroid={"transparent"}
                    textAlign="right"
                    
                    onChangeText={(text) => { this.textInputChange(text) }}
                    defaultValue={this.inputName}
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
                <GLDListRow>
                    <GLDListRow.Item title='质检项目' bottomSeparator='indent' detail={this.getDetailView()} onPress={() => { this.selectCheckPoint() }}></GLDListRow.Item>
                </GLDListRow>
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
        resizeMode: 'contain',
    },
})