"use strict"

import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TextInput,
    StatusBar,
    Switch,
    ScrollView,
} from 'react-native';
import PropTypes from 'prop-types';
import { ListRow } from 'app-3rd/teaset';
import { DatePicker, List } from 'antd-mobile';
import WideButton from "./../../components/WideButton";

class NewReviewPage extends Component {

    static navigationOptions = ({ navigation, screenProps }) => ({
        title: '复查单',
        headerTintColor: "#FFF",
        headerStyle: { backgroundColor: "#00baf3" },
        headerRight: (
            <Text onPress={() => navigation.state.params.rightNavigatePress()} style={{ marginRight: 20, color: '#FFFFFF', width: 60, textAlign: "right" }} >
                提交
        </Text>
        ),
        headerLeft: (
            <Text onPress={() => navigation.state.params.leftNavigatePress()} style={{ marginLeft: 20, color: '#FFFFFF', width: 60, textAlign: "left" }} >
                取消
        </Text>
        ),
        gesturesEnabled: false,
        // header: null
    });

    constructor(props) {
        super(props);
        this.state = {
            description: PropTypes.string,//内容描述
            qualified: false,//复查合格，默认不合格
            expand: false,//检查单是否展开
        };
        this.props.navigation.setParams({ leftNavigatePress: this.goBack, rightNavigatePress: this.submit })
    }

    goBack = () => {
        storage.goBack(this.props.navigation)
    }

    submit = () => {
        alert("submit");
    }

    onChangeSwitch = (qualified) => {
        this.setState({
            qualified: qualified,
        })
    }

    renderSwitchView = () => {
        return (
            <Switch value={this.state.qualified} onValueChange={(value) => { this.onChangeSwitch(value) }} />
        );
    }

    renderReviewDate = () => {
        return (
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
        );
    }
    //质检单展开闭合箭头
    renderAccessory = () => {
        return (
            <Image
                style={{ width: 12, height: 6, marginRight: 5 }}
                source={
                    (this.state.expand) ?
                        require("app-images/icon_draw_arrow_up.png") :
                        require("app-images/icon_drawer_arrow_down.png")
                } />
        );
    }
    render() {
        return (
            <ScrollView>
                <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
                <TextInput
                    maxLength={255}
                    style={styles.input}
                    placeholder={'现场情况描述...'}
                    multiline={true}
                    underlineColorAndroid={"transparent"}
                    textAlign="left"
                    onChangeText={(text) => { this.setState({ description: text }) }}
                    value={(typeof this.state.description === 'string') ? (this.state.description) : ('')}
                />
                <View style={styles.container}>
                    <ListRow title='复查合格' bottomSeparator='full' detail={this.renderSwitchView()} />
                    {
                        (this.state.qualified) ? (null) : (this.renderReviewDate())
                    }
                </View>

                <ListRow title='检查单' bottomSeparator='full' style={{ marginTop: 20 }}
                    accessory={this.renderAccessory()}
                    onPress={() => { this.setState({ expand: !this.state.expand, }) }}
                />

                <View style={this.state.expand ? {} : { display: "none" }}>
                    <Text>{` 检查单详情\nstart
                    
                    end`}</Text>
                </View>

                <WideButton text="保存" onClick={() => { alert(11) }} style={{ marginTop: 30 }} />
                <WideButton text="删除" type="gray" onClick={() => { alert(22) }} style={{ marginTop: 20 }} />

            </ScrollView>
        );
    }
}

export default NewReviewPage;

const styles = StyleSheet.create({
    input: {
        textAlignVertical: 'top',
        paddingLeft: 12,
        paddingRight: 12,
        paddingTop: 12,
        paddingBottom: 0,
        backgroundColor: '#ffffff',
        minHeight: 120
    }
})