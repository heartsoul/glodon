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

const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);

export default class RectificationView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            needRectification: false,//需要整改
            date: now,
        };
    }

    componentWillReceiveProps(nextProps) {
        let rectificationData = this.props.rectificationData;
        if (rectificationData) {
            let date = now;
            if(rectificationData.date){
                date = new Date(rectificationData.date);
            }
            this.setState({
                needRectification: rectificationData.value,
                date: date,
            })
        }
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
        if (this.state.needRectification) {
            date = this.state.date;
        }
        return {
            value: this.state.needRectification,
            date: date,
        };
    }

    render() {

        return (
            <View style={styles.container}>
                <ListRow title='需要整改' bottomSeparator='indent' detail={this.renderSwitchView()} />

                {
                    (this.state.needRectification) ? (
                        <DatePicker
                            mode="date"
                            title=" "
                            extra=" "
                            value={this.state.date}
                            onChange={date => this.setState({ date: date })}
                        >
                            <List.Item arrow="horizontal" >
                                <Text style={{ fontSize: 15, color: "#000000" }}>
                                    整改期限
                        </Text>
                            </List.Item>
                        </DatePicker>
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
    date: PropTypes.string
}

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        marginBottom: 11
    },
})
