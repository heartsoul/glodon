import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { BarItems, StatusActionButton } from 'app-components';

class DocChooseUserBar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectAll: false,
        };
    }

    selectAll = (selectAll) => {
        this.setState({
            selectAll: selectAll,
        })
    }

    render() {

        return (
            <View style={styles.bottomBar}>
                <TouchableOpacity onPress={(event) => { event.preventDefault(); this.props.selectAll() }}>
                    <View style={{ paddingLeft: 10, flexDirection: 'row', justifyContent: 'center' }}>
                        <Image style={styles.checkBox} source={this.state.selectAll ? require('app-images/doc/icon_doc_checked.png') : require('app-images/icon_downloading_unselected.png')} />
                        <Text style={{ color: '#333', fontSize: 14, }}>全选</Text>
                    </View>
                </TouchableOpacity>
                <View style={{ flex: 1 }}></View>
                <StatusActionButton style={{ height: 28, width: 58, marginRight: 20, backgroundColor: '#00b5f2', elevation: 0 }} text='确定' color='#ffffff' onClick={() => { }} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    bottomBar: {
        height: 50,
        width: '100%',
        backgroundColor: '#fff',
        alignItems: 'center',
        flexDirection: 'row',
        borderTopColor: '#e6e6e6',
        borderTopWidth: 0.5
    },
    checkBox: {
        width: 16,
        height: 16,
        marginLeft: 14,
        marginRight: 13,
        resizeMode: 'contain'
    },
})

export default DocChooseUserBar;