/**
 * Created by JokAr on 2017/4/12.
 */
'use strict';
import React, { Component } from "react";
import {
    ActivityIndicator,
    Text,
    View,
    Image,
    StyleSheet,
    Switch,
    Dimensions,
} from "react-native";
import PropTypes from 'prop-types'

import { ActionModal, ImageChooserView } from "app-components"
import { BimFileEntry, AuthorityManager } from "app-entry";
import * as API from "app-api";

import EquipmentInfoItem from "./equipmentInfoItem"
import { ActionButton,StatusActionButton } from "app-components";

const standardImage = require("app-images/icon_up_to_standard.png");
const notStandardImage = require("app-images/icon_not_up_to_standard.png");

var { width, height } = Dimensions.get("window");

export default class EquipmentDetailView extends Component {

    constructor(props) {
        super(props);
    }

    onOpenModleAction = (info) => {
        // "buildingId": 0,
        // "buildingName": null,
        // "elementId": "318370",
        // "elementName": "常规 - 150mm",
        // "gdocFileId": "a5b812dff199438dba5bacee0b373497",
        // alert(inspectionInfo.gdocFileId);
        // storage.pushNext(null, "RelevantModlePage", { title: inspectionInfo.elementName, fileId: inspectionInfo.gdocFileId, pageType: 1, relevantBluePrint: { "data": inspectionInfo } });
        BimFileEntry.showModelFromDetail(null, info.gdocFileId, info.elementId);
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }
    renderImage = (item) => {
        let imageSource = null
        if (item.committed === true) {
            if (item.qualified === true) {
                imageSource = standardImage;
            } else {
                imageSource = notStandardImage;
            }
            if (imageSource) {
                return (<Image source={imageSource} style={[styles.image]} />)
            }
        }

        return null
    }

    _onOpenEditBaseInfoAction = (info) => {
        info.editType = API.EQUIPMENT_EDIT_TYPE_BASE;
        storage.pushNext(null, "EquipmentDetailPage", { "item": info, editType: info.editType });
    }
    _onOpenEditOtherInfoAction = (info) => {
        info.editType = API.EQUIPMENT_EDIT_TYPE_OTHER;
        storage.pushNext(null, "EquipmentDetailPage", { "item": info, editType: info.editType });
    }
    _onOpenEditImageInfoAction = (info) => {
        info.editType = API.EQUIPMENT_EDIT_TYPE_IMAGE;
        storage.pushNext(null, "EquipmentDetailPage", { "item": info, editType: info.editType });
    }
    _onSaveAction = (info) => {
    
    }
    _onDeleteAction = (info) => {
        ActionModal.alertConfirm('是否确认删除？', "删除当前数据后，数据不可恢复哦！", { text: '取消'}, { text: '删除', onPress:()=>{
            // this.props.onCellAction(item,index,'delete');
        } });
    }
    renderBaseInfo = (info) => {
        let power = AuthorityManager.isEquipmentModify();
        return <View style={{ paddingTop: 20, paddingBottom: 10, backgroundColor: '#ffffff' }}>
            <EquipmentInfoItem leftTitle="基本信息" showType="headerInfo"
                onClick={power ? () => { this._onOpenEditBaseInfoAction(info); } : null} />
            <EquipmentInfoItem showType="line" />
            <EquipmentInfoItem leftTitle="批次编号：" content={info.batchCode} />
            <EquipmentInfoItem leftTitle="进场日期：" content={API.formatUnixtimestampSimple(info.approachDate)} />
            <EquipmentInfoItem leftTitle="材设编码：" content={info.facilityCode} />
            <EquipmentInfoItem leftTitle="材设名称：" content={info.facilityName} />
            {this.renderImage(info)}
        </View>
    }
    renderOtherInfo = (info) => {
        let power = AuthorityManager.isEquipmentModify();
        return <View style={{ marginTop: 20, paddingBottom: 10, backgroundColor: '#ffffff' }}>
            <EquipmentInfoItem leftTitle="其他信息" showType="headerInfo"
                onClick={power ? () => { this._onOpenEditOtherInfoAction(info); } : null} />
            <EquipmentInfoItem showType="line" />
            <EquipmentInfoItem leftTitle="进场数量：" content={info.quantity} />
            <EquipmentInfoItem leftTitle="单位：" content={info.unit} />
            <EquipmentInfoItem leftTitle="规格：" content={info.specification} />
            <EquipmentInfoItem leftTitle="型号：" content={info.modelNum} />
            <EquipmentInfoItem leftTitle="构件位置：" showType="link" onClick={() => {
                this.onOpenModleAction(info);
            }} content={info.elementName} />
            <EquipmentInfoItem leftTitle="厂家：" content={info.manufacturer} />
            <EquipmentInfoItem leftTitle="品牌：" content={info.brand} />
            <EquipmentInfoItem leftTitle="供应商：" content={info.supplier} />
        </View>
    }

    renderImageInfo = (info) => {
        let power = AuthorityManager.isEquipmentModify();
        let image = null;
        if ((info.files && info.files.length)) {
            let urls = [];
            info.files.map((file, index) => {
                urls.push(file.url);
            })
            image = urls.length > 1 ? (<EquipmentInfoItem url={urls[0]} showType="image" />) : (<EquipmentInfoItem urls={urls} showType="images" />);
        }

        return <View style={{ marginTop: 20, paddingBottom: 10, backgroundColor: '#ffffff' }}>
            <EquipmentInfoItem leftTitle="现场照片" showType="headerInfo"
                onClick={power ? () => { this._onOpenEditImageInfoAction(info); } : null} />
            <EquipmentInfoItem showType="line" />
            {image}
        </View>
    }
    renderActionSaveInfo = (info) => {
        let power = AuthorityManager.isEquipmentModify();
        return <View style={{ marginTop: 0 }}>
            <StatusActionButton text='保存' height={40} marginRight={20} marginLeft={20} color='#ffffff' onClick={() => this._onSaveAction(info)} />
        </View>
    }
    renderActionDeleteInfo = (info) => {
        let power = AuthorityManager.isEquipmentDelete();
        return <View style={{ marginTop: 0 }}>
            <StatusActionButton text='删除' height={40} marginRight={20} marginLeft={20} color='#ffffff' onClick={() => this._onDeleteAction(info)} />
        </View>
    }
    renderActionNextInfo = (info,nextAction) => {
        if(info.id) {
            // 是编辑
            return <View style={{ marginTop: 0 }}>
            <StatusActionButton text='确定' height={40} marginRight={20} marginLeft={20} color='#ffffff' onClick={() => this._onConfirmAction(info)} />
        </View>
        }
        return <View style={{ marginTop: 0 }}>
            <StatusActionButton text='下一步' height={40} marginRight={20} backgroundColor='#00b5f2' marginLeft={20} color='#ffffff' onClick={() => nextAction(info)} />
        </View>
    }
    _toOtherInfoAction = (info) => {
        let data = {...info, editType:API.EQUIPMENT_EDIT_TYPE_OTHER};
        this.props.switchPage(data);
        // storage.pushNext(null, "EquipmentDetailPage", { "item": info, editType: info.editType });
    }
    _toImageInfoAction = (info) => {
        let data = {...info, editType:API.EQUIPMENT_EDIT_TYPE_IMAGE};
        this.props.switchPage(data);
    }
    renderBaseEdit = (info) => { 
        return <View style={{ paddingTop: 10, paddingBottom: 10 }}> 
            <EquipmentInfoItem leftTitle="请依次完成下列内容输入" leftTitleColor='#00b5f2' showType="headerInfo" />
            <View style={{ marginTop: 10, paddingTop: 10, paddingBottom: 10, backgroundColor: '#ffffff' }}>
            <EquipmentInfoItem leftTitle="批次编号：" showType="input"/>
            <EquipmentInfoItem showType="line" />
            <EquipmentInfoItem leftTitle="进场日期：" showType="input" />
            <EquipmentInfoItem showType="line" />
            <EquipmentInfoItem leftTitle="材设编码：" showType="input" />
            <EquipmentInfoItem showType="line" />
            <EquipmentInfoItem leftTitle="材设名称：" showType="input" />
            
        </View>
        <View style={{ marginTop: 20 }}>
            {this.renderActionNextInfo(info,this._toOtherInfoAction)}
            </View>
        </View>
    }
    renderOtherEdit = (info) => { 
        return<View style={{ paddingTop: 10, paddingBottom: 10 }}> 
            <EquipmentInfoItem leftTitle="请根据需要选择完成下列内容输入" leftTitleColor='#00b5f2' showType="headerInfo" />
         <View style={{ marginTop: 10, paddingTop: 10, paddingBottom: 10, backgroundColor: '#ffffff' }}>
            <EquipmentInfoItem leftTitle="进场数量：" content={info.quantity} showType="input" />
            <EquipmentInfoItem showType="line" />
            <EquipmentInfoItem leftTitle="单位：" content={info.unit}  showType="input"/>
            <EquipmentInfoItem showType="line" />
            <EquipmentInfoItem leftTitle="规格：" content={info.specification} showType="input" />
            <EquipmentInfoItem showType="line" />
            <EquipmentInfoItem leftTitle="型号：" content={info.modelNum} showType="input"/>
            <EquipmentInfoItem showType="line" />
            <EquipmentInfoItem leftTitle="构件位置：" showType="link" onClick={() => {
                this.onOpenModleAction(info);
            }} content={info.elementName} />
            <EquipmentInfoItem showType="line" />
            <EquipmentInfoItem leftTitle="厂家：" content={info.manufacturer} showType="input" />
            <EquipmentInfoItem showType="line" />
            <EquipmentInfoItem leftTitle="品牌：" content={info.brand} showType="input" />
            <EquipmentInfoItem showType="line" />
            <EquipmentInfoItem leftTitle="供应商：" content={info.supplier} showType="input"/>
            
        </View>
            <View style={{ marginTop: 20 }}>
            {this.renderActionNextInfo(info,this._toImageInfoAction)}
        </View>
        </View>
    }
    renderImageEdit = (info) => { 
        return<View style={{ paddingTop: 10, paddingBottom: 10 }}> 
            <EquipmentInfoItem leftTitle="您可记录现场图片" leftTitleColor='#00b5f2' showType="headerInfo" />
         <View style={{ marginTop: 10, paddingTop: 10, paddingBottom: 10, backgroundColor: '#ffffff' }}>
            <ImageChooserView files={[]} style={{ top: 0, left: 0, width: width, height: 100, marginTop: 20 }} backgroundColor="#00baf3" />
            <EquipmentInfoItem showType="line" />
            <EquipmentInfoItem showType="line" />
            <EquipmentInfoItem showType="line" />
            <Switch onValueChange={(value) => { this.onChangeSwitch(value) }} />   
        </View>
            <View style={{ marginTop: 20 }}>
            <StatusActionButton text='保存' height={40} marginRight={20} marginLeft={20} backgroundColor='#00b5f2' color='#ffffff' onClick={() => this._onSaveAction(info)} />
       
        </View>
        </View>
    }
    render = () => {
        const equipmentInfo = this.props.equipmentInfo;
        const {editType} = equipmentInfo;
        if(!editType || editType == API.EQUIPMENT_EDIT_TYPE_BASE) {
            return this.renderBaseEdit(equipmentInfo);
        }
        if(editType == API.EQUIPMENT_EDIT_TYPE_IMAGE) {
            return this.renderImageEdit(equipmentInfo);
        }
        if(editType == API.EQUIPMENT_EDIT_TYPE_OTHER) {
            return this.renderOtherEdit(equipmentInfo);
        }
        return (
            <View>
                {this.renderBaseInfo(equipmentInfo)}
                {this.renderOtherInfo(equipmentInfo)}
                {this.renderImageInfo(equipmentInfo)}
                {this.renderActionSaveInfo(equipmentInfo)}
                {this.renderActionDeleteInfo(equipmentInfo)}
                
            </View>
        );
    }
}

EquipmentDetailView.propTypes = {
    equipmentInfo: PropTypes.any.isRequired,
    switchPage:PropTypes.func.isRequired,
}

const styles = StyleSheet.create({
    image: {
        marginTop: 16,
        width: 75,
        height: 75,
        right: 20,
        bottom: -7,
        position: 'absolute',
        resizeMode: 'contain',
    },
});