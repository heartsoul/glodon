'use strict';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    StatusBar,
    Switch,
    requireNativeComponent,
    TextInput,
    ScrollView,
    Button,
    Image,
    TouchableHighlight,
    TouchableOpacity,
    ActivityIndicator,
    Dimensions,
} from 'react-native';
import { connect } from 'react-redux';
import { ActionModal } from 'app-components'
import { Modal, Toast } from 'antd-mobile';
import { SegmentedView, ListRow, Label, ActionSheet, PullPicker, Theme } from 'app-3rd/teaset';
import { ImageChooserView } from 'app-components';
import SelectView from './SelectView';
import RectificationView from './RectificationView';//整改
import SelectCheckPointView from './SelectCheckPointView';
import StarView from "./StarView";

import * as PageType from '../navigation/bim/PageTypes';
import * as API from "app-api";
import * as BimFileEntry from "./../navigation/bim/BimFileEntry";
import * as NewEquipmentAction from "./../../actions/newEquipmentAction";
import * as UpdateDataAction from "./../../actions/updateDataAction";

import EquipmentNewBaseView from './equipmentNewBaseView'
import EquipmentNewOtherView from './equipmentNewOtherView'
import EquipmentNewImageView from './equipmentNewImageView'
import EquipmentDetailView from '../equipment/equipmentDetailView'

var { width, height } = Dimensions.get("window");
const REF_PHOTO = 'gldPhoto';
const REF_INSPECT_COMPANY = 'REF_INSPECT_COMPANY';//检查单位
const REF_COMPANY = 'REF_COMPANY';//施工单位
const REF_PERSON = 'REF_PERSON';//责任人
const REF_RECTIFICATION = 'REF_RECTIFICATION';//整改
const REF_CHECKPOINT = 'REF_CHECKPOINT';//质检项目


class EquipmentNewPage extends React.Component {

    constructor(props) {
        super(props);
    };

    //返回
    goBack = (navigation) => {
        //判断信息是否改变
        let requestParams = this.assembleParams();
        NewQualityAction.isEditInfoChange(requestParams, this.state.inspectionInfo, this.refs[REF_PHOTO], (isChange) => {
            if (isChange) {
                ActionModal.alert('是否确认退出当前页面？', "您还未保存当前数据！", [
                    {
                        text: '取消', style: { color: '#5b5b5b' }
                    },
                    {
                        text: '不保存', style: { color: '#e75452' }, onPress: () => { navigation.goBack() }
                    },
                    {
                        text: '保存', style: { color: '#00baf3' }, onPress: () => { this.save() }
                    }
                ]);
            } else {
                navigation.goBack();
            }
        })
    }

    /**
     * 获取selectView中的数据，没有时返回 null，ref(REF_INSPECT_COMPANY、REF_COMPANY、REF_PERSON)
     */
    getSelectedData = (ref) => {
        let ele = this.refs[ref];
        let ret = {};
        if (ele) {
            ret = ele.getSelectedData();
        }
        return ret;
    }

    /**
     * 整改期限{ value: true, date: '2018-04-08' }
     */
    getRectificationData = () => {
        return this.refs[REF_RECTIFICATION].getRectificationData()
    }

    /**
     * 质检项目
     */
    getSelectedCheckPoint = () => {
        return this.refs[REF_CHECKPOINT].getSelectedCheckPoint()
    }

    /**
     * 提交的数据
     */
    assembleParams = () => {
        let ret = {
            companyData: this.getSelectedData(REF_COMPANY),
            inspectCompanyData: this.getSelectedData(REF_INSPECT_COMPANY),
            personData: this.getSelectedData(REF_PERSON),
            checkPoint: this.getSelectedCheckPoint(),
            rectificationData: this.getRectificationData(),
            inspectionType: this.props.type,
            state: this.state,
        };
        return ret;
    }

    //提交
    submit = (navigation) => {
        //提交
        let requestParams = this.assembleParams();
        NewQualityAction.submit(requestParams, this.refs[REF_PHOTO], navigation, (params) => {
            this.setState(params);
            this.props.updateData();
        });
    }

    //保存
    save = () => {
        let requestParams = this.assembleParams();
        NewQualityAction.save(requestParams, this.refs[REF_PHOTO], (params) => {
            this.setState(params)
            Toast.success('保存成功', 1);
            this.props.updateData();
        });
    }

    //删除
    delete = (navigation) => {
        NewQualityAction.deleteInspection(this.state.inspectId, this.props.type, () => {
            this.props.updateData();
            storage.goBack(this.props.navigator, null);
        });
    }

    //选择图纸文件
    _bimFileChooserBluePrint = (dataType) => {
        let navigator = this.props.navigation;
        storage.bimFileChooseCallback = this._bimChooserCallback;
        BimFileEntry.chooseBlueprintFromQualityNew(navigator,
            this.state.relevantBluePrint.drawingGdocFileId,
            this.state.relevantBluePrint.drawingName,
            this.state.relevantBluePrint.drawingPositionX,
            this.state.relevantBluePrint.drawingPositionY,
        )
    }

    //选择模型文件
    _bimFileChooserModel = (dataType) => {
        let navigator = this.props.navigation;
        storage.bimFileChooseCallback = this._bimChooserCallback;
        BimFileEntry.chooseModelFromQualityNew(navigator,
            this.state.relevantModel.gdocFileId,
            this.state.relevantModel.elementId,
            this.state.relevantModel.buildingId,
            this.state.relevantModel.buildingName)
    }

    //选择图纸或者模型后的回调 dataType 图纸文件{name:'', fileId:'', drawingPositionX:'', drawingPositionY:'' }、模型文件
    _bimChooserCallback = (data, dataType) => {
        if (dataType === '图纸文件') {
            this.setState({
                relevantBluePrint: data,
            });
        } else if (dataType === '模型文件') {
            API.getModelElementProperty(storage.loadProject(), storage.projectIdVersionId, data.gdocFileId, data.elementId)
                .then(responseData => {
                    let relevantModel = {
                        ...data,
                        elementName: responseData.data.data.name,
                    }
                    this.setState({
                        relevantModel: relevantModel,
                    });
                });
        }
    }

    //加载等待的view
    renderLoadingView = () => {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
                <ActivityIndicator
                    animating={true}
                    style={[styles.gray, { height: 80 }]}
                    color='green'
                    size="large"
                />
            </View>
        );
    }
    renderBase = (equipmentInfo) => {
      return <EquipmentNewBaseView equipmentInfo={equipmentInfo} />
    }

    renderOther = (equipmentInfo) => {
      return <EquipmentNewOtherView equipmentInfo={equipmentInfo} />
    }

    renderImage = (equipmentInfo) => {
      return <EquipmentNewImageView equipmentInfo={equipmentInfo} />
    }

    renderConfirm = (equipmentInfo) => {
      return  <EquipmentDetailView equipmentInfo={equipmentInfo} />
    }

    renderData = (editType,equipmentInfo) => {
      if(editType === API.EQUIPMENT_EDIT_TYPE_BASE) {
        return this.renderBase(equipmentInfo);
      }
      if(editType === API.EQUIPMENT_EDIT_TYPE_OTHER) {
        return this.renderOther(equipmentInfo);
      }
      if(editType === API.EQUIPMENT_EDIT_TYPE_IMAGE) {
        return this.renderImage(equipmentInfo);
      }
      if(editType === API.EQUIPMENT_EDIT_TYPE_CONFIRM) {
        return this.renderConfirm(equipmentInfo);
      }
      return this.renderLoadingView();

    }

    componentDidMount = () => {
      const item = this.props.navigation.getParam('item');
      const editType = this.props.navigation.getParam('editType');
      if(item && editType) {
        this.props.featchData(item,editType); // 进行数据转化
      } else {
        this.props.featchData(null,API.EQUIPMENT_EDIT_TYPE_CONFIRM);
      }
    }

    render() {
       const {editType,equipmentInfo} = this.props;
        return (
            <ScrollView style={{ backgroundColor: '#FAFAFA' }}>
                <StatusBar barStyle="light-content" translucent={false} backgroundColor="#00baf3" />
                {
                    this.renderData(editType,equipmentInfo)
                    // this.state.isLoading ? (this.renderLoadingView()) : (this.renderData())
                }
            </ScrollView>

        );
    }
};

var styles = StyleSheet.create({
    dividerLine: {
        height: 10,
        marginLeft: 19,
        flex: 1,
        backgroundColor: '#ff0000'
    },
    saveText: {
        overflow: "hidden",
        height: 20,
        marginTop: 10,
        marginLeft: 38,
        marginRight: 38,
        borderRadius: 20,
        alignItems: "center",
        textAlign: "center",
        fontSize: 16,
        color: "#fff"
    },
    saveTextView: {
        overflow: "hidden",
        height: 40,
        backgroundColor: "#00baf3",
        borderRadius: 20,
        marginLeft: 38,
        marginRight: 38,
        marginTop: 30,
    },

    saveTextViewPressed: {
        overflow: "hidden",
        height: 40,
        backgroundColor: "#33baf3",
        borderRadius: 20,
        marginLeft: 38,
        marginRight: 38,
        marginTop: 30,
    },

    deleteText: {
        overflow: "hidden",
        height: 20,
        marginTop: 10,
        marginLeft: 38,
        marginRight: 38,
        borderRadius: 20,
        alignItems: "center",
        textAlign: "center",
        fontSize: 16,
        color: "#5b5b5b"
    },
    deleteTextView: {
        overflow: "hidden",
        height: 40,
        backgroundColor: "#cbcbcb",
        borderRadius: 20,
        marginLeft: 38,
        marginRight: 38,
        marginTop: 30,
    },

    deleteTextViewPressed: {
        overflow: "hidden",
        height: 40,
        backgroundColor: "#cbcbcb",
        borderRadius: 20,
        marginLeft: 38,
        marginRight: 38,
        marginTop: 30,
    },
});

EquipmentNewPage.propTypes = {
    item: PropTypes.any,
    editType:PropTypes.any, // 所处的编辑页面类型 参考 EQUIPMENT_EDIT_TYPE_BASE
}

export default connect(
    state => ({
      equipmentInfo: state.equipmentNew.data,
      editType: state.equipmentNew.editType,
    }),
    dispatch => ({
        updateData: () => {
            if (dispatch) {
                dispatch(UpdateDataAction.updateData());
            }
        },
        featchData:(item,editType)=> {
          if (dispatch) {
              dispatch(NewEquipmentAction.featchData(item,editType));
          }
      },
    })
)(EquipmentNewPage);