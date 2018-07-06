/**
 * Created by Soul on 2018/03/16.
 */
'use strict';

import PropTypes from 'prop-types';
import {StyleSheet, View} from "react-native";

export default class DocProjectEditFileListView extends DataFileListViewBase {

    constructor(props) {
        super(props);
    }

    /**
     * 构建属性
     *
     * @memberof DocFileListView
     */
    buildProps = () => {

        let {onMoreAction, 
            onSelect, 
            isEdit=false,
            userPrivilege={"enter": true,
            "view": true,
            "download": false,
            "create": false,
            "update": false,
            "delete": false,
            "grant": false},
            ...others} = this.props;

        onMoreAction = null;
        onSelect = null;

        this.props = {onMoreAction, onSelect, userPrivilege, ...others};
    }

    render() {
        this.buildProps();
        return super.render();
    }
}

const styles = StyleSheet.create({
    containerFolderView: {
        // flex: 1,
        height: 52,
        marginLeft: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
    },
    containerFileView: {
        // flex: 1,
        height: 72,
        marginLeft: 20,
        flexDirection: 'row',
        alignItems: 'center'
        // backgroundColor: '#FFF',
    },
    title: {
        fontSize: 15,
        color: 'blue',
    },
    content: {
        left: 0,
        top: 15,
        marginLeft: 12,
        textAlign: "left",
        fontSize: 15,
        color: 'black',
        alignSelf: 'flex-start'
    },

    image: {
        width: 30,
        height: 25,
    },
});