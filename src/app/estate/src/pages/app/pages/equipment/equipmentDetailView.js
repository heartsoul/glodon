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
import { PullPicker } from 'app-3rd/teaset';

import * as API from "app-api";

import EquipmentInfoItem from "./equipmentInfoItem"
import { ActionButton, StatusActionButton } from "app-components";
import { DatePicker, List } from 'antd-mobile';

const standardImage = require("app-images/icon_up_to_standard.png");
const notStandardImage = require("app-images/icon_not_up_to_standard.png");

var { width, height } = Dimensions.get("window");
const REF_PHOTO = 'gldPhoto';

export default class EquipmentDetailView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            updateIndex: 0,
        }
        if(!this.props.equipmentInfo ){
            this.props.equipmentInfo = {};
        }
        if(!this.props.equipmentInfo.approachDate){
            this.props.equipmentInfo.approachDate = new Date().getTime();
        }
        this.props.setDetailRef(this);
    }

    onOpenModleAction = (info) => {
        // "buildingId": 0,
        // "buildingName": null,
        // "elementId": "318370",
        // "elementName": "常规 - 150mm",
        // "gdocFileId": "a5b812dff199438dba5bacee0b373497",
        // alert(inspectionInfo.gdocFileId);
        // storage.pushNext(null, "RelevantModlePage", { title: inspectionInfo.elementName, fileId: inspectionInfo.gdocFileId, pageType: 1, relevantBluePrint: { "data": inspectionInfo } });

        BimFileEntry.chooseEquipmentModelFromNew(null, 
            info.gdocFileId, 
            info.elementId, 
            info.buildingId, 
            info.buildingName);
            //详情页使用下面的方法
        // BimFileEntry.showModelFromDetail(null, info.gdocFileId, info.elementId);
        
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    componentWillReceiveProps(nextProps) {
        this.setDefaultCompany();
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
        let data = { ...info, batchCode: '112322', preEditType: API.EQUIPMENT_EDIT_TYPE_CONFIRM, editType: API.EQUIPMENT_EDIT_TYPE_BASE };
        this.props.switchPage(data);
    }
    _onOpenEditOtherInfoAction = (info) => {
        let data = { ...info, quantity: 'sssss', preEditType: API.EQUIPMENT_EDIT_TYPE_CONFIRM, editType: API.EQUIPMENT_EDIT_TYPE_OTHER };
        this.props.switchPage(data);
    }
    _onOpenEditImageInfoAction = (info) => {
        let data = { ...info, preEditType: API.EQUIPMENT_EDIT_TYPE_CONFIRM, editType: API.EQUIPMENT_EDIT_TYPE_IMAGE };
        this.props.switchPage(data);
    }
    _onSaveAction = (info) => {
        this.props.save(info, this.refs[REF_PHOTO]);
    }
    _onDeleteAction = (info) => {
        ActionModal.alertConfirm('是否确认删除？', "删除当前数据后，数据不可恢复哦！", { text: '取消' }, {
            text: '删除', onPress: () => {
                this.props.equipmentDelete(info.id);
            }
        });
    }

    setDefaultCompany = () => {
        if(this.props.acceptanceCompanies && this.props.acceptanceCompanies.length > 0 && !this.props.equipmentInfo.acceptanceCompanyId){
            let item = this.props.acceptanceCompanies[0];
            this.props.equipmentInfo.acceptanceCompanyName = item.name;
            this.props.equipmentInfo.acceptanceCompanyId = item.id;
            this.setState({ updateIndex: this.updateIndex++ });
        }
    }

    showActionSheet = () => {
        PullPicker.show(
            `选择验收单位`,
            this.props.acceptanceCompanies,
            this.getSelectedCompaniesIndex(),
            (item, index) => {
                this.props.equipmentInfo.acceptanceCompanyName = item.name;
                this.props.equipmentInfo.acceptanceCompanyId = item.id;
                this.setState({ updateIndex: this.updateIndex++ });
            },
            { getItemText: (item, index) => { return item.name } }
        );
    }

    getSelectedCompaniesIndex = () => {
        let acceptanceCompanyId = this.props.equipmentInfo.acceptanceCompanyId;
        if (!acceptanceCompanyId) {
            return 0;
        }
        for (let i = 0; this.props.acceptanceCompanies && i < this.props.acceptanceCompanies.length; i++) {
            if (acceptanceCompanyId === this.props.acceptanceCompanies[i].id) {
                return i;
            }
        }
        return 0;
    }


    renderBaseInfo = (info) => {
        let power = AuthorityManager.isEquipmentModify();
        return <View style={{ paddingTop: 20, paddingBottom: 10, backgroundColor: '#ffffff' }}>
            <EquipmentInfoItem leftTitle="基本信息" showType="headerInfo"
                onClick={power ? () => { this._onOpenEditBaseInfoAction(info); } : null} />
            <EquipmentInfoItem showType="line" />
            <EquipmentInfoItem leftTitle="验收单位：" content={info.acceptanceCompanyName} />
            <EquipmentInfoItem leftTitle="批次编号：" content={info.batchCode} />
            <EquipmentInfoItem leftTitle="进场日期：" content={info.approachDate ? API.formatUnixtimestampSimple(info.approachDate) : null} />
            <EquipmentInfoItem leftTitle="材设编码：" content={info.facilityCode} />
            <EquipmentInfoItem leftTitle="材设名称：" content={info.facilityName} />
            {this.renderImage(info)}
        </View>
    }
    renderOtherInfo = (info) => {
        let power = AuthorityManager.isEquipmentModify();
        return <View style={{ marginTop: 20, paddingTop: 10, paddingBottom: 10, backgroundColor: '#ffffff' }}>
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
            image = urls.length > 1 ? (<EquipmentInfoItem urls={urls} showType="images" />) : (<EquipmentInfoItem url={urls[0]} showType="image" />);
        }

        return <View style={{ marginTop: 20, paddingTop: 10, paddingBottom: 10, backgroundColor: '#ffffff' }}>
            <EquipmentInfoItem leftTitle="现场照片" showType="headerInfo"
                onClick={power ? () => { this._onOpenEditImageInfoAction(info); } : null} />
            <EquipmentInfoItem showType="line" />
            {image}
        </View>
    }
    renderActionSaveInfo = (info) => {
        let power = AuthorityManager.isEquipmentModify();
        return <View style={{ marginTop: 20 }}>
            <StatusActionButton text='保存' height={40} marginRight={20} backgroundColor='#00b5f2' marginLeft={20} color='#ffffff' onClick={() => this._onSaveAction(info)} />
        </View>
    }
    renderActionDeleteInfo = (info) => {
        let power = AuthorityManager.isEquipmentDelete();
        if (!power || !info.id) return null;

        return <View style={{ marginTop: 20 }}>
            <StatusActionButton text='删除' height={40} marginRight={20} backgroundColor='#00b5f2' marginLeft={20} color='#ffffff' onClick={() => this._onDeleteAction(info)} />
        </View>
    }
    _onConfirmAction(info) {
        if(!this._checkBasicInfo(info)){
            return;
        }
        this.refs[REF_PHOTO]._loadFile((files) => {
            this._addUrlPropsToFiles(files);
            info.files = files;
            let data = { ...info, preEditType: API.EQUIPMENT_EDIT_TYPE_IMAGE, editType: API.EQUIPMENT_EDIT_TYPE_CONFIRM };
            this.props.switchPage(data);
        });
        let data = { ...info, preEditType: API.EQUIPMENT_EDIT_TYPE_IMAGE, editType: API.EQUIPMENT_EDIT_TYPE_CONFIRM };
        this.props.switchPage(data);
    }
    renderActionNextInfo = (info, nextAction) => {
        if (info.preEditType && info.preEditType === API.EQUIPMENT_EDIT_TYPE_CONFIRM) {
            // 是编辑
            return <View style={{ marginTop: 0 }}>
                <StatusActionButton text='确定' height={40} marginRight={20} backgroundColor='#00b5f2' marginLeft={20} color='#ffffff' onClick={() => this._onConfirmAction(info)} />
            </View>
        }
        return <View style={{ marginTop: 0 }}>
            <StatusActionButton text='下一步' height={40} marginRight={20} backgroundColor='#00b5f2' marginLeft={20} color='#ffffff' onClick={() => nextAction(info)} />
        </View>
    }
    
    _checkBasicInfo = (info) => {
        let ret = info && info.acceptanceCompanyName && info.acceptanceCompanyName.length > 0
                && info.batchCode  && info.batchCode.length > 0
                && info.approachDate  && info.approachDate > 0
                && info.facilityCode  && info.facilityCode.length > 0
                && info.facilityName  && info.facilityName.length > 0
        return ret;
    }

    _toOtherInfoAction = (info) => {
        if(!this._checkBasicInfo(info)){
            return;
        }

        let data = { ...info, preEditType: API.EQUIPMENT_EDIT_TYPE_BASE, editType: API.EQUIPMENT_EDIT_TYPE_OTHER };
        this.props.switchPage(data);
        // storage.pushNext(null, "EquipmentDetailPage", { "item": info, editType: info.editType });
    }
    _toImageInfoAction = (info) => {
        let data = { ...info, preEditType: API.EQUIPMENT_EDIT_TYPE_OTHER, editType: API.EQUIPMENT_EDIT_TYPE_IMAGE };
        this.props.switchPage(data);
    }
    _toConfirmInfoAction = (info) => {
        this.refs[REF_PHOTO]._loadFile((files) => {
            this._addUrlPropsToFiles(files);
            info.files = files;
            let data = { ...info, preEditType: API.EQUIPMENT_EDIT_TYPE_IMAGE, editType: API.EQUIPMENT_EDIT_TYPE_CONFIRM };
            this.props.switchPage(data);
        });
    }

    _addUrlPropsToFiles(files){
        files.map((item)=>{
            let url = item.path;;
            if(!item.path.startsWith("http")){
                url = "file://" + url;
            }
            item.url = url;
        })
    }

    renderBaseEdit = (info) => {
        return <View style={{ paddingTop: 10, paddingBottom: 10 }}>
        
            <EquipmentInfoItem leftTitle="请依次完成下列内容输入" leftTitleColor='#00b5f2' showType="headerInfo" />
            <View style={{ marginTop: 10, paddingTop: 10, paddingBottom: 10, backgroundColor: '#ffffff' }}>

                <EquipmentInfoItem leftTitle="验收单位：" content={info.acceptanceCompanyName} showType="info" onClick={() => { this.showActionSheet() }} />
                <EquipmentInfoItem leftTitle="批次编号：" content={info.batchCode} showType="input" onChangeText={(value) => { info.batchCode = value }} />
                <EquipmentInfoItem showType="line" />
                <DatePicker
                    mode="date"
                    title=" "
                    extra=" "
                    value={info.approachDate ? new Date(info.approachDate):new Date()}
                    onChange={date => { info.approachDate = date.getTime(); this.props.switchPage({ ...info }) }}
                >
                    <List.Item arrow="horizontal" >
                        <Text style={{ fontSize: 15, color: "#000000" }}>
                            进场日期：
                                </Text>
                    </List.Item>
                </DatePicker>
                {/* <EquipmentInfoItem leftTitle="进场日期：" content={info.approachDate ? API.formatUnixtimestampSimple(info.approachDate) : null} showType="input" /> */}
                <EquipmentInfoItem showType="line" />
                <EquipmentInfoItem leftTitle="材设编码：" content={info.facilityCode} showType="input" onChangeText={(value) => { info.facilityCode = value }} />
                <EquipmentInfoItem showType="line" />
                <EquipmentInfoItem leftTitle="材设名称：" content={info.facilityName} showType="input" onChangeText={(value) => { info.facilityName = value }} />

            </View>
            <View style={{ marginTop: 20 }}>
                {this.renderActionNextInfo(info, this._toOtherInfoAction)}
            </View>
        </View>
    }
    renderOtherEdit = (info) => {
        return <View style={{ paddingTop: 10, paddingBottom: 10 }}>
            <EquipmentInfoItem leftTitle="请根据需要选择完成下列内容输入" leftTitleColor='#00b5f2' showType="headerInfo" />
            <View style={{ marginTop: 10, paddingTop: 10, paddingBottom: 10, backgroundColor: '#ffffff' }}>
                <EquipmentInfoItem leftTitle="进场数量：" content={info.quantity} showType="input" onChangeText={(value) => { info.quantity = value }} />
                <EquipmentInfoItem showType="line" />
                <EquipmentInfoItem leftTitle="单位：" content={info.unit} showType="input" onChangeText={(value) => { info.unit = value }} />
                <EquipmentInfoItem showType="line" />
                <EquipmentInfoItem leftTitle="规格：" content={info.specification} showType="input" onChangeText={(value) => { info.specification = value }} />
                <EquipmentInfoItem showType="line" />
                <EquipmentInfoItem leftTitle="型号：" content={info.modelNum} showType="input" onChangeText={(value) => { info.modelNum = value }} />
                <EquipmentInfoItem showType="line" />
                <EquipmentInfoItem leftTitle="构件位置：" showType="link" onClick={() => {
                    this.onOpenModleAction(info);
                }} content={info.elementName} />
                <EquipmentInfoItem showType="line" />
                <EquipmentInfoItem leftTitle="厂家：" content={info.manufacturer} showType="input" onChangeText={(value) => { info.manufacturer = value }} />
                <EquipmentInfoItem showType="line" />
                <EquipmentInfoItem leftTitle="品牌：" content={info.brand} showType="input" onChangeText={(value) => { info.brand = value }} />
                <EquipmentInfoItem showType="line" />
                <EquipmentInfoItem leftTitle="供应商：" content={info.supplier} showType="input" onChangeText={(value) => { info.supplier = value }} />

            </View>
            <View style={{ marginTop: 20 }}>
                {this.renderActionNextInfo(info, this._toImageInfoAction)}
            </View>
        </View>
    }
    onChangeSwitch = (value, info) => {
        let data = { ...info, qualified: (value == true ? true : false) };
        this.props.switchPage(data);
    }
    renderImageEdit = (info) => {
        return <View style={{ paddingTop: 10, paddingBottom: 10 }}>
            <EquipmentInfoItem leftTitle="您可记录现场图片" leftTitleColor='#00b5f2' showType="headerInfo" />
            <View style={{ marginTop: 10, paddingTop: 10, paddingBottom: 10, backgroundColor: '#ffffff' }}>
                <ImageChooserView ref={REF_PHOTO}  files={info.files} style={{ top: 0, left: 0, width: width, height: 100, marginTop: 20 }} backgroundColor="#00baf3" />
                <EquipmentInfoItem showType="line" />
                <Text>验收合格:</Text><Switch value={info.qualified == true ? true : false} onValueChange={(value) => { this.onChangeSwitch(value, info) }} />
            </View>
            <View style={{ marginTop: 20 }}>
                {this.renderActionNextInfo(info, this._toConfirmInfoAction)}

            </View>
        </View>
    }
    render = () => {
        const equipmentInfo = this.props.equipmentInfo;
        let { editType } = equipmentInfo;
        if (!editType) {
            if (!equipmentInfo.id) {
                equipmentInfo.editType = API.EQUIPMENT_EDIT_TYPE_BASE;
            } else {
                equipmentInfo.editType = API.EQUIPMENT_EDIT_TYPE_CONFIRM;
            }
            editType = equipmentInfo.editType;
        }
        if (editType == API.EQUIPMENT_EDIT_TYPE_BASE) {
            return this.renderBaseEdit(equipmentInfo);
        }
        if (editType == API.EQUIPMENT_EDIT_TYPE_IMAGE) {
            return this.renderImageEdit(equipmentInfo);
        }
        if (editType == API.EQUIPMENT_EDIT_TYPE_OTHER) {
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
    acceptanceCompanies: PropTypes.any.isRequired,
    switchPage: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
    equipmentDelete: PropTypes.func.isRequired,
    setDetailRef: PropTypes.func.isRequired,//外部引用
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