import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    FlatList,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { BarItems } from 'app-components';
import SERVICE from 'app-api/service'
/**
 * 选择部门
 */
class DocMarkupChooseDeptPage extends Component {

    static navigationOptions = ({ navigation, screenProps }) => ({
        headerTitle: <BarItems.TitleBarItem text='选择用户' />,
        headerLeft: (
            <BarItems navigation={navigation}>
                <BarItems.LeftBarItem navigation={navigation} text="取消" onPress={(navigation) => {
                    navigation.goBack();
                }} />
            </BarItems>
        ),
        headerRight: (<BarItems.RightBarItem imageSource={require('app-images/icon_search_white.png')}
            onPress={(navigation) => storage.pushNext(null, 'SearchPage')} />),
    })

    constructor(props) {
        super(props);
        this.state = {
            depts: []
        };
    }

    componentDidMount() {
        SERVICE.getDocmarkUpChooseDepts(storage.loadProject())
            .then((depts) => {
                this.setState({
                    depts: depts,
                })
            })
    }


    _renderDeptItem = (item, index) => {
        return (
            <TouchableOpacity onPress={() => {
                storage.pushNext(null, 'DocMarkupChooseUserPage', { deptId: item.id })
            }}>
                <View style={styles.itemBox}>
                    <Image style={styles.deptIcon} source={require('app-images/doc/icon_doc_markup_group_a.png')} />
                    <Text style={styles.deptText}>{item.name}</Text>
                    <Image style={styles.arrow} source={require('app-images/doc/icon_doc_markup_right.png')} />
                </View>
            </TouchableOpacity>
        )
    }
    _renderHeader = () => {
        return (
            <View style={{ height: 10, backgroundColor: '#fafafa' }}></View>
        )
    }

    _keyExtractor = (item, index) => {
        return `key-dept-${index}`
    };

    render() {
        return (
            <View style={{ backgroundColor: '#fafafa', height: '100%' }}>
                <FlatList
                    data={this.state.depts}
                    renderItem={({ item, index }) => { return this._renderDeptItem(item, index) }}
                    refreshing={false}
                    onEndReachedThreshold={1}
                    ListHeaderComponent={this._renderHeader()}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={this._keyExtractor}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    itemBox: {
        height: 50,
        marginRight: 10,
        marginLeft: 10,
        marginBottom: 10,
        marginTop: 4,
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 4,
        elevation: 2.5, // android 
        shadowColor: 'rgba(178,192,209,0.50)', // iOS
        shadowOffset: { width: 1.5, height: 11 }, // iOS
        shadowOpacity: 0.15, // iOS
        shadowRadius: 3, // iOS
    },
    deptIcon: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginLeft: 14,
        marginRight: 10,
        resizeMode: 'cover'
    },
    deptText: {
        fontSize: 15,
        color: '#333333',
        flex: 1,
    },
    arrow: {
        width: 5,
        height: 12,
        marginRight: 14,
        resizeMode: 'contain',
    }
})

export default DocMarkupChooseDeptPage;