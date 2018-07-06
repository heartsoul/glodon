/**
 * Created by Soul on 2018/03/16.
 */
'use strict';

import PropTypes from 'prop-types';
import {StyleSheet, View} from "react-native";
import DocView from './DocView';
import DataListViewBase from './DataListViewBase'
export default class DocFileListView extends DataListViewBase {

    static propTypes = {
        ...DataFileListViewBase,
        onItemPresss: PropTypes.func,// 选择状态变更 (item,index)=>{xxxxx}
        onItemSelected: PropTypes.func,// 选择状态变更 (seletedItems, selected，item,index)=>{xxxxx}
        onAllItemSelected: PropTypes.func,// 选择状态变更 (seletedItems,seleted)=>{xxxxx}
        onChangeEditMode: PropTypes.func,// 编辑状态变更 (isEdit)=>{xxxxx}
        isEdit:PropTypes.bool, // 是否是编辑状态
        onMoreAction:PropTypes.bool,  // 是否需要更多...
        userPrivilege:PropTypes.object, // 权限
    }

    constructor(props) {
        super(props);
        const {selectedItems=[],isEdit=false} = props ;
        this.state = {
            isEdit:isEdit,
            selectedItems:selectedItems,
            userPrivilege:userPrivilege
        }
    }
    
    // 编辑状态导航处理

    /**
     * 切换到编辑模式
     * isEdit true:开始编辑 false：取消编辑
     */
    changeEditMode = (isEdit=true) => {
        if(!isEdit) {
            this.state.selectedItems = [];
        }
        this.setState({dataArray:this.state.dataArray,isEdit:isEdit},()=>{
            this.props.onChangeEditMode && this.props.onChangeEditMode(isEdit);
        });
    }

    /**
     * 编辑状态点击了项目，就执行选择
     *
     */
    _itemSelected = (selected, item, index) => {
        item.value.selected = !selected;
        
        this.state.selectedItems = this.state.dataArray.filter(function (element, index, self) {
            return element.value.selected === true;
        });
        this.setState({dataArray:this.state.dataArray},()=>{
            this.props.onItemSelected && this.props.onItemSelected(this.state.selectedItems,!selected,item,index);
        });
    }

    /**
     * 全选操作
     * isEdit true:全选 false：取消全选
     */
    changeSelectAll = (selected = true) =>{
        this.state.dataArray.map((item)=>{
            item.value.selected = selected;
        });

        this.state.selectedItems = selected ? this.state.dataArray : [];
        this.setState({dataArray:this.state.dataArray},()=>{
            this.props.onItemSelected && this.props.onAllItemSelected(this.state.selectedItems,selected);
        }); 
    }

    _keyExtractor = (item, index) => index;

    componentDidMount() {
    }

    //加载失败view
    renderErrorView(error) {
        return ( <NoDataView text="加载失败" /> );
    }

    /**
     * 数据分隔线
     *
     */
    renderSeparatorView = () => {
        return <View style={{ height: 1, backgroundColor: '#ededed',marginRight:20}} />;
    }

    /**
     * 构建属性
     *
     * @memberof DocFileListView
     */
    buildProps = () => {
        // dataArray: PropTypes.array.isRequired,
        // onItemPresss: PropTypes.func,// 选择状态变更 (item,index)=>{xxxxx}
        // onEndReached=PropTypes.func,
        // onRefresh=PropTypes.func,
        // refreshing=PropTypes.bool,
        // isLoading=PropTypes.bool,
        // error:PropTypes.object,
        // renderItemView: PropTypes.func, // 数据展示项目
        // renderSeparatorView: PropTypes.func, // 数据展示分隔项
        // renderEmptyView: PropTypes.func, // 数据空页面
        // renderFooterView: PropTypes.func, // 数据头
        // renderHeaderView: PropTypes.func, // 数据尾
        // renderListHeader: PropTypes.func, // 数据列表头
        // renderListFooter: PropTypes.func, // 数据列表尾
        let {renderItemView=this.renderItemView,
            onItemPresss=this.onItemPresss, 
            renderSeparatorView=this.renderSeparatorView, 
            renderListFooter=this.renderListFooter,
            ...others} = this.props;
        this.props = {renderItemView, onItemPresss, ...others};
    }

    //返回itemView
    renderItemView = ({ item, index }) => {
        if (item.value.folder) {
            return this.renderFolderView({ item, index });
        } else {
            return this.renderFileView({ item, index });
        }
    }
    
    /**
     * 文件数据项
     *
     */
    renderFileView = ({ item, index }) => {
        let onPress = this.props.onItemPresss;
        let onMore = this.props.onMoreAction;
        let onSelect = this.props.onItemSelected ? (event,selected) => {this._itemSelected(selected,item, index)} : null;
        let {selected = false} = item.value;
        return (
            <DocView onMore={onMore} onSelect={onSelect} selected={selected}>
                <DocView.DocFileItemView key={index} onPress={onPress}
             content={item.value.name} time={item.value.createTimeShow} fileId={item.value.fileId} ext={item.value.name}/></DocView>
        );
    }

    /**
     * 文件夹数据项
     *
     */
    renderFolderView = ({ item, index }) => {
        let onPress = this.props.onItemPresss;
        let onMore = this.props.onMoreAction;
        let onSelect = this.props.onItemSelected ? (event,selected) => {this._itemSelected(selected,item, index)} : null;
        let {selected = false} = item.value;
        return (
            <DocView onMore={onMore} onSelect={onSelect} selected={selected}>
            <DocView.DocFolderItemView key={index} onPress={onPress}
            content={item.value.name} time={item.value.createTimeShow}/></DocView>
        );
    }

    /**
     * 外的数据列表尾部,一般是一个浮动的工具条
     *  列表底部视图，防止由于工具条导致数据显示不全
     *
     * @memberof DataFileListViewBase
     */
    renderListFooter = () => {
        let ret = super.renderItemView();
        if(ret) {
            return ret;
        }
        return <View style={{height:50,width:'100%'}} />
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