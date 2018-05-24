import React, { Component } from 'react'
import {
    StyleSheet,
    Text,
    Switch,
    View,
    TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types'
import { ListRow } from 'app-3rd/teaset';
import { DatePicker, List } from 'antd-mobile';
import StarView from "./StarView";
import GLDListRow from "./GLDListRow";
const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);

export default class RectificationView extends Component {
    constructor(props) {
        super(props);
        let rectificationData = this.props.rectificationData;
        let needRectification = false;
        let date = now;
        if (rectificationData) {
            if (rectificationData.date) {
                date = new Date(rectificationData.date);
            }
            needRectification = rectificationData.value;
        }
        this.state = {
            needRectification: needRectification,//需要整改
            date: date,
            showStar: false,
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            showStar: nextProps.showStar,
        });
    }

    onChangeSwitch = (needRectification) => {
        this.setState({
            needRectification: needRectification,
        })
    }


    renderSwitchView = () => {
        return (
            <Switch value={this.state.needRectification} onValueChange={(value) => { this.onChangeSwitch(value) }} />
        );
    }

    /**
     * 获取整改信息
     */
    getRectificationData = () => {
        let date = '';
        if (this.state.needRectification && this.state.date) {
            date = this.state.date.getTime();
        }
        return {
            value: this.state.needRectification,
            date: date,
        };
    }

    renderStarChildView = () => {
        return (
            <View>
                <DatePicker
                    mode="date"
                    title=" "
                    extra=" "
                    value={this.state.date}
                    onChange={date => this.setState({ date: date })}
                >
                    <List.Item arrow="horizontal" >
                        <Text style={{ fontSize: 16, color: "#000000", marginLeft: 7, paddingTop: 8, paddingBottom: 8 }}>
                            整改期限
                                </Text>
                    </List.Item>
                </DatePicker>
            </View>
        );
    }

    render() {

        return (
            <View style={styles.container}>
                <GLDListRow>
                    <GLDListRow.SwitchItem title="需要整改" bottomSeparator={this.state.needRectification ? "indent" : "none"} switchValue={this.state.needRectification} onValueChange={this.onChangeSwitch} />
                </GLDListRow>
                {
                    (this.state.needRectification) ? (

                        <StarView
                            showStar={this.state.showStar}
                            childView={this.renderStarChildView()}
                        />
                    ) : (null)
                }
            </View>
        )
    }
}

RectificationView.propTypes = {
    /**
   * 默认的日期
   */
    date: PropTypes.string,

    showStar: PropTypes.bool,
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        marginBottom: 10
    },
})
