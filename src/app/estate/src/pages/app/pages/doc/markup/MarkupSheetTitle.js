import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Platform,
} from 'react-native';
import { Badge } from 'app-3rd/teaset';


export default class MarkupSheetTitle extends Component {

    render = () => {
        let { text, activeTitleStyle, titleStyle, select, badge, style } = this.props;
        let w = 28;
        let right = 0;
        if (text.length >= 3) {
            w = 42;
            right = 0;
        }
        text = text;
        return <View style={{
            paddingTop: Platform.OS === 'web' ? 7 : 4,
            overflow: 'visible',
            alignItems: 'center', paddingRight: 20,
            justifyContent: 'center'
        }}>
            <Text style={[{ ...style }, select ? activeTitleStyle : titleStyle]} >{text}</Text>
            <View style={{ width: w, height: 3, marginTop: 0, alignSelf: 'center', overflow: 'visible', }}>
                {select ? <View style={[{ width: w, height: 2, backgroundColor: '#00baf3', position: 'absolute' }, Platform.OS === 'ios' ? { top: 12.5 } : { top: 8.5 }]} resizeMode='contain' /> : null}
            </View>
            <Badge count={badge} style={[{ position: 'absolute', top: -5, right: right }, badge > 0 ? {} : { backgroundColor: '#ffffff' }]} />
        </View>
    }
}

const styles = StyleSheet.create({

})