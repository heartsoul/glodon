import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet
} from 'react-native';

/**
 * data:{selected:true, key '', data:{name:'xx'}}
 */
class DocChooseUserItem extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <TouchableOpacity onPress={() => {
                this.props.data.selected = !this.props.data.selected;
                this.props.onSelectChange(this.props.data)
                this.setState({})
            }}>
                <View
                    style={styles.itemBox}
                >
                    <Image style={styles.checkBox} source={this.props.data.selected ? require('app-images/doc/icon_doc_checked.png') : require('app-images/icon_downloading_unselected.png')} />
                    <Image style={styles.userAvatar} source={require('app-images/icon_default_boy.png')} />
                    <Text style={styles.nameText}>{this.props.data.data.name}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    itemBox: {
        height: 50,
        marginRight: 30,
        marginLeft: 10,
        marginBottom: 4,
        marginTop: 10,
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 4,
        elevation: 2.5, // android 
        shadowColor: 'rgba(178,192,209,0.50)', // iOS
        shadowOffset: { width: 2, height: 6 }, // iOS
        shadowOpacity: 0.15, // iOS
        shadowRadius: 3, // iOS
    },
    checkBox: {
        width: 16,
        height: 16,
        marginLeft: 14,
        marginRight: 13,
        resizeMode: 'contain'
    },
    userAvatar: {
        width: 30,
        height: 30,
        marginRight: 10,
        resizeMode: 'cover',
        borderRadius: 15,
    },
    nameText: {
        fontSize: 15,
        color: '#333'
    },
})

export default DocChooseUserItem;