import React, { Component } from 'react';
import {
    View,
    Text,
    StatusBar,
    TouchableOpacity,
    StyleSheet,
    Platform,
} from 'react-native';
import { SegmentedView, Menu } from 'app-3rd/teaset';
import { BarItems } from 'app-components';
import MarkupSheetTitle from './MarkupSheetTitle'
import DocMarkupList from './DocMarkupList'
import { DOC_MARKUP_LIST_TYPES } from './../../../constants/docMarkupTypes'

class DocMarkupPage extends Component {

    static navigationOptions = ({ navigation, screenProps }) => ({
        headerTitle: <BarItems.TitleBarItem text='批注' />,
        headerLeft: <BarItems />,
        headerRight: navigation.state.params && navigation.state.params.loadRightTitle ? navigation.state.params.loadRightTitle() : <View />
    })

    constructor(props) {
        super(props);
        this.state = {
            activeIndex: 0
        };
        this.props.navigation.setParams({ loadRightTitle: this._loadRightTitle, })
    }

    _loadRightTitle = () => {
        return (
            <BarItems navigation={this.props.navigation}>
                <BarItems.RightBarItem navigation={this.props.navigation} textStyle={{ fontSize: 22, height: 30, }} text="..." onPress={(navigation, event, barItem) => this._onMorePress(navigation, event, barItem)} />
            </BarItems>
        )

    }

    _onMorePress = (navigation, event, barItem) => {
        // 菜单
        let fromView = barItem;
        fromView.measureInWindow((x, y, width, height) => {
            let showMenu = null;
            let items = [
                { title: <Text>更多...</Text>, onPress: () => { } },
                {
                    title: <View><TouchableOpacity onPress={() => { Menu.hide(showMenu); this._changeOrderType('time'); }}>
                        <Text style={{ lineHeight: 30, color: this.state.orderType !== 'time' ? '#000000' : '#00baf3' }}>文件时间</Text>
                    </TouchableOpacity>
                        <TouchableOpacity onPress={() => { Menu.hide(showMenu); this._changeOrderType('name'); }} style={{}}>
                            <Text style={{ lineHeight: 30, color: this.state.orderType !== 'name' ? '#000000' : '#00baf3' }}>文件名称</Text>
                        </TouchableOpacity>
                    </View>
                }
            ];

            showMenu = Menu.show({ x, y, width, height }, items, {
                align: 'end', showArrow: true, shadow: Platform.OS === 'ios' ? true : false,
                popoverStyle: [{ paddingLeft: 10, paddingRight: 10 }], directionInsets: 0, alignInsets: -5, paddingCorner: 10
            });
        });
    }

    _onSegmentedBarChange = (index) => {
        if (this.state.activeIndex == index) return;
        this.setState({ activeIndex: index });
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
                <SegmentedView
                    style={{ flex: 1, backgroundColor: '#fafafa' }}
                    type='projector'
                    barStyle={{
                        width: '100%',
                        height: 44,
                        borderBottomColor: '#e9e9e999',
                        borderBottomWidth: 1,
                    }}
                    indicatorLineWidth={0}
                    autoScroll={false}
                    animated={this.state.activeIndex == 0 ? false : true}
                    justifyItem={'fixed'}
                    type={'projector'}
                    onChange={(index) => this._onSegmentedBarChange(index)}
                    activeIndex={this.state.activeIndex}
                >
                    {
                        DOC_MARKUP_LIST_TYPES.map((item, index) => {
                            return (
                                <SegmentedView.Sheet
                                    key={item.key}
                                    title={<MarkupSheetTitle
                                        key={item.key}
                                        text={item.title}
                                        badge={0}
                                        select={this.state.activeIndex == index}
                                        activeTitleStyle={{ color: '#00baf3', fontSize: 14 }}
                                        titleStyle={{ color: '#6f899b', fontSize: 14 }} />}
                                >
                                    <DocMarkupList listType={item.key} title={item.title} />
                                </SegmentedView.Sheet>
                            )
                        })
                    }

                </SegmentedView>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    moreView: {
        padding: 7,
        fontSize: 16,
        color: "#fff",
        paddingRight: 20
    },
})

export default DocMarkupPage;