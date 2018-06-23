import React, { Component } from 'react'
import {
    StyleSheet,
    Text,
    View,
    Keyboard
} from 'react-native';
import PropTypes from 'prop-types'
import { BimSwitch } from 'app-components'
import { DatePicker, List } from 'antd-mobile';
import StarView from "./StarView";
import GLDListRow from "./GLDListRow";
import GLDDatePicker from "./../../components/GLDDatePicker";

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
        Keyboard.dismiss();
        this.setState({
            needRectification: needRectification,
        })
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
                <GLDDatePicker title={"整改期限"}
                    date={this.state.date} onDateChange={(date) => {
                        this.setState({ date: date })
                    }}
                    textStyle={{ alignItems: "flex-end" }}
                ></GLDDatePicker>
            </View >
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
