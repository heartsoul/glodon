import React, { Component } from 'react';
import {
    View,
    StatusBar,
    StyleSheet,
} from 'react-native';
import { SegmentedView } from 'app-3rd/teaset';
import { BarItems } from 'app-components';
import MarkupSheetTitle from './MarkupSheetTitle'
import DocMarkupList from './DocMarkupList'
import { DOC_MARKUP_LIST_TYPES } from './../../../constants/docMarkupTypes'

class DocMarkupPage extends Component {

    static navigationOptions = ({ navigation, screenProps }) => ({
        headerTitle: <BarItems.TitleBarItem text='批注' />,
        headerLeft: <BarItems />,
        headerRight: <View />
    })

    constructor(props) {
        super(props);
        this.state = {
            activeIndex: 0
        };
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
})

export default DocMarkupPage;