/**
 * Created by Soul on 2018/03/16.
 */
'use strict';

import PropTypes from 'prop-types';
import {StyleSheet, View} from "react-native";
import DocView from './DocView';

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
        // onItemPresss: PropTypes.func,// 选择状态变更 (item,index)=>{xxxxx}
        // onItemSelected: PropTypes.func,// 选择状态变更 (seletedItems, selected，item,index)=>{xxxxx}
        // onAllItemSelected: PropTypes.func,// 选择状态变更 (seletedItems,seleted)=>{xxxxx}
        // onChangeEditMode: PropTypes.func,// 编辑状态变更 (isEdit)=>{xxxxx}
        // isEdit:PropTypes.bool, // 是否是编辑状态
        // onMoreAction:PropTypes.bool,  // 是否需要更多...
        // userPrivilege:PropTypes.object, // 权限

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

            if(isEdit) {
                onMoreAction = null;
            } else {
                onSelect = null;
            }

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