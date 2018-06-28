'use strict'

import React, { Component } from 'react';
import {
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
    View,
} from 'react-native';
import PropTypes from 'prop-types';
import GLDListRow from "./GLDListRow";

/**
 * 选择质检项目
 */
class SelectCheckPointView extends Component {

    // inputName = "";
    constructor(props) {
        super(props);
        let selectedCheckPoint2 = props.selectedCheckPoint;
        let id = 0;
        let name = "";
        let showMark = false;
        if (selectedCheckPoint2 && selectedCheckPoint2.name) {
            id = selectedCheckPoint2.id;
            name = selectedCheckPoint2.name;
            this.inputName = selectedCheckPoint2.name;
            showMark = selectedCheckPoint2.id && selectedCheckPoint2.id != 0;
        }

        this.state = {
            selectedCheckPoint: {
                id: id,
                name: name,
            },
            isShowMark: showMark,
        };
    }

    selectCheckPoint = () => {
        storage.pushNext(
            null,
            'CheckPointPage',
            {
                selectedCheckPoint: this.state.selectedCheckPoint,
                callback: (checkPoint) => {
                    let selectedCheckPoint3 = { ...checkPoint };
                    this.inputName = checkPoint.name,
                        this.setState({
                            selectedCheckPoint: selectedCheckPoint3,
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
        let selectedCheckPoint4 = {
            name: this.inputName,
            id: 0,
        }
        if (this.state.selectedCheckPoint.name === this.inputName) {
            selectedCheckPoint4.id = this.state.selectedCheckPoint.id;
        }
        return selectedCheckPoint4;
    }

    textInputChange = (text) => {
        this.inputName = text;
        let isShowMark3 = this.state.selectedCheckPoint.name === text
            && this.state.selectedCheckPoint.id
            && this.state.selectedCheckPoint.id != 0;
        this.setState({
            isShowMark: isShowMark3,
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
                    style={{ flex: 1, textAlignVertical: 'center',textAlign:"right", minWidth: 100, paddingLeft: 12, paddingRight: 5,}}
                    placeholder={'请设置'}
                    multiline={false}
                    value={this.inputName}
                    autoCorrect={false} 
                    autoCapitalize='none'
                    underlineColorAndroid={"transparent"}
                    onChangeText={(text) => { this.textInputChange(text) }}
                    defaultValue={this.inputName}
                />
                {
                    (this.state.isShowMark) ? (
                        <TouchableOpacity style={{ paddingRight: 5, alignSelf: "center", }} onPress={(event) => {event.preventDefault();  this.toCheckPointInfo() }}>
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
                    <GLDListRow.Item title='质检项目' bottomSeparator='indent' detailTouchable={false} detail={this.getDetailView()} onPress={() => { this.selectCheckPoint() }}></GLDListRow.Item>
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

export default SelectCheckPointView;