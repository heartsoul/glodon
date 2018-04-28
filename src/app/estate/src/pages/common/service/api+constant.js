// 应用相关定义
export const PAGE_INNDX_HOME = 0;
export const PAGE_INNDX_SUBSCRIBE = 1;
export const PAGE_INNDX_MESSAGE = 2;
export const PAGE_INNDX_MINE = 3;

export const PAGE_NAME_HOME = '首页'
export const PAGE_NAME_SUBSCRIBE = '订阅'
export const PAGE_NAME_MESSAGE = '消息'
export const PAGE_NAME_MINE = '我'

// 质检相关常量定义
// 单据类型
export const TYPE_INSPECTION =[
    "inspection",// 检查
    "acceptance" // 验收
];
export const TYPE_INSPECTION_NAME =[
    "检查单",// 
    "验收单" // 
];

export const TYPE_NEW_NAME_RECTIFY = "整改单";
export const TYPE_NEW_NAME_REVIEW = "复查单";
export const TYPE_NEW_NAME =[
    "+"+TYPE_NEW_NAME_RECTIFY,// 
    "+"+TYPE_NEW_NAME_REVIEW // 
];

export const INSPECTION_COMPANY_NAME_TIP = ["检查单位","验收单位"];
export const CREATE_TYPE_CHECK = "0";//新建检查单
export const CREATE_TYPE_RECTIFY = "1";//新建整改单
export const CREATE_TYPE_REVIEW = "2";//新建复查单


/**
 * 复查合格 "closed"
 *
 * 复查不合格  "notAccepted"
 */
export const STATUS_ALL = "";
export const STATUS_CLOSED = "closed";//复查合格 "closed
export const STATUS_NOT_ACCEPTED = "notAccepted";//复查不合格  "notAccepted"
export const QC_STATE_STAGED = "staged";
export const QC_STATE_UNRECTIFIED = "unrectified";
export const QC_STATE_UNREVIEWED = "unreviewed";
export const QC_STATE_INSPECTED = "inspected";
export const QC_STATE_REVIEWED = "reviewed";
export const QC_STATE_DELAYED = "delayed";
export const QC_STATE_ACCEPTED = "accepted";
export const CREATE_CHECK_LIST_PROPS = "createCheckListProps";
export const QUALITY_CHECK_LIST_SHOW_REPAIR = "showRepair";

/**
 * 材设进场
 */
export const QC_STATE_ALL = "all";
export const QC_STATE_EDIT = "edit";
export const QC_STATE_STANDARD = "standard";
export const QC_STATE_NOT_STANDARD = "notStandard";

/** 
 * 编辑页面类型
*/
export const EQUIPMENT_EDIT_TYPE_CONFIRM = "confirmPage"; // 最后的确认页面，同详情页面
export const EQUIPMENT_EDIT_TYPE_BASE = "basePage"; // 基本信息编辑页面
export const EQUIPMENT_EDIT_TYPE_OTHER = "otherPage"; // 其他信息页面
export const EQUIPMENT_EDIT_TYPE_IMAGE = 'imagePage';// 图片编辑页面
/**
 * 侧滑菜单项目
 */
export const APP_COLOR_ITEM = "#ffffff";
export const APP_COLOR_CURRENT = "#00baf3"; // 
// 质检管理
export const APP_QUALITY = "Quality"; // 质检清单
export const APP_QUALITY_DRAWER = "QualityDrawer"; // 模型
export const APP_QUALITY_MODLE = "QualityModle"; // 图纸
export const APP_QUALITY_CHECK_POINT = "QualityCheckPoint"; // 质检项目
// 材设进场
export const APP_EQUIPMENT = "Equipment"; // 材设清单
export const APP_EQUIPMENT_MODLE = "EquipmentModle"; // 模型预览

export const EQUIPMENT_CLASSIFY_NAMES = ["全部", "待提交", "合格", "不合格"];
export const EQUIPMENT_CLASSIFY_STATES = [QC_STATE_ALL, QC_STATE_EDIT, QC_STATE_STANDARD, QC_STATE_NOT_STANDARD];

// 状态
export const EQUIPMENT_CLASSIFY_STATES_SUMMARY = ["-"+QC_STATE_ALL,  'uncommittedCount', 'qualifiedCount','unqualifiedCount'];

// 状态显示颜色
export const CLASSIFY_STATES_COLOR = ["#979797"
, "#f39b3d"
, "#f55353"
, "#f55353"
, "#28d575"
, "#28d575"
, "#f55353"
, "#28d575"
];
// 状态
export const CLASSIFY_STATES = [STATUS_ALL
, QC_STATE_STAGED
, QC_STATE_UNRECTIFIED
, QC_STATE_UNREVIEWED
, QC_STATE_INSPECTED
, QC_STATE_REVIEWED
, QC_STATE_DELAYED
, QC_STATE_ACCEPTED
];
// 状态
export const CLASSIFY_STATES_SUMMARY = ["-"+STATUS_ALL
    , QC_STATE_STAGED
    , QC_STATE_UNRECTIFIED
    , QC_STATE_UNREVIEWED
    , "-"+QC_STATE_INSPECTED
    , "-"+QC_STATE_REVIEWED
    , QC_STATE_DELAYED
    , "-"+QC_STATE_ACCEPTED
    ];
// 状态显示名
export const CLASSIFY_NAMES = ["全部"
, "待提交"
, "待整改"
, "待复查"
, "已检查"
, "已复查"
, "已延迟"
, "已验收"
];
// 状态数据总表
export const CLASSIFY_STATUS_LIST = [{ name: CLASSIFY_NAMES[0], state: CLASSIFY_STATES[0], color: CLASSIFY_STATES_COLOR[0] }
    , { name: CLASSIFY_NAMES[1], state: CLASSIFY_STATES[1], color: CLASSIFY_STATES_COLOR[1] }
    , { name: CLASSIFY_NAMES[2], state: CLASSIFY_STATES[2], color: CLASSIFY_STATES_COLOR[2] }
    , { name: CLASSIFY_NAMES[3], state: CLASSIFY_STATES[3], color: CLASSIFY_STATES_COLOR[3] }
    , { name: CLASSIFY_NAMES[4], state: CLASSIFY_STATES[4], color: CLASSIFY_STATES_COLOR[4] }
    , { name: CLASSIFY_NAMES[5], state: CLASSIFY_STATES[5], color: CLASSIFY_STATES_COLOR[5] }
    , { name: CLASSIFY_NAMES[6], state: CLASSIFY_STATES[6], color: CLASSIFY_STATES_COLOR[6] }
    , { name: CLASSIFY_NAMES[7], state: CLASSIFY_STATES[7], color: CLASSIFY_STATES_COLOR[7] }
];

// 状态数据总表
export const EQUIPMENT_CLASSIFY_STATUS_LIST = [
    { name: EQUIPMENT_CLASSIFY_NAMES[0], state: EQUIPMENT_CLASSIFY_STATES[0], color: CLASSIFY_STATES_COLOR[0] }
    , { name: EQUIPMENT_CLASSIFY_NAMES[1], state: EQUIPMENT_CLASSIFY_STATES[1], color: CLASSIFY_STATES_COLOR[1] }
    , { name: EQUIPMENT_CLASSIFY_NAMES[2], state: EQUIPMENT_CLASSIFY_STATES[2], color: CLASSIFY_STATES_COLOR[2] }
    , { name: EQUIPMENT_CLASSIFY_NAMES[3], state: EQUIPMENT_CLASSIFY_STATES[3], color: CLASSIFY_STATES_COLOR[3] }
];

export const BILL_TYPE_ITEM_INSPECT = "检查";
export const BILL_TYPE_ITEM_RECTIFY = "整改";
export const BILL_TYPE_ITEM_REVIEW = "复查";
export const BILL_TYPE_ITEM_ACCEPT = "验收";
export const BILL_TYPE_ITEM_SUBMIT = "提交";
export const BILL_TYPE_ITEM_DELETE = "删除";
export const BILL_TYPE = [BILL_TYPE_ITEM_INSPECT, BILL_TYPE_ITEM_RECTIFY, BILL_TYPE_ITEM_REVIEW, BILL_TYPE_ITEM_ACCEPT,BILL_TYPE_ITEM_SUBMIT,BILL_TYPE_ITEM_DELETE];
export const BILL_TYPE_COLOR = ["#00B5F2", "#F6AD5F", "#F6AD5F","#00B5F2","#00B5F2", "#f55353"];

// 状态相关转换函数
/**
 * 检查单位标题
 * 
 * @export
 * @param {string} inspectionType 单据类型 TYPE_INSPECTION
 * @returns 
 */
export function toCompanyNameTip(inspectionType) {
    let index = TYPE_INSPECTION.indexOf(inspectionType);
    if (index > 0) {
        index = 0;
    }
    return INSPECTION_COMPANY_NAME_TIP[index];
}                

/**
 * 状态转换为显示状态
 * 
 * @export
 * @param {string} qcState 状态
 * @returns 
 */
export function toQcStateShow(qcState) {
    let index = CLASSIFY_STATES.indexOf(qcState);
    if (index > 0) {
        return CLASSIFY_NAMES[index];
    }
    return "";
}

/**
 * 状态转换为BillType
 * 
 * @export
 * @param {string} inspectionType 单据类型 TYPE_INSPECTION
 * @returns 
 */
export function toBillType(inspectionType) {
    let index = TYPE_INSPECTION.indexOf(inspectionType);
    if (index == 0) {
        return BILL_TYPE[0];
    }
    if (index == 1) {
        return BILL_TYPE[3];
    }
    return BILL_TYPE[0];
}


/**
 * 状态转化为显示颜色
 * 
 * @export
 * @param {string} qcState 状态
 * @returns 
 */
export function toQcStateShowColor(qcState) {
    let index = CLASSIFY_STATES.indexOf(qcState);
    if (index > 0) {
        return CLASSIFY_STATES_COLOR[index];
    }
    return "";
}

/**
 * billType状态转化为显示颜色
 * 
 * @export
 * @param {string} billType 状态 BILL_TYPE
 * @returns 
 */
export function toBillTypeColor(billType) {
    let index = BILL_TYPE.indexOf(billType);
    if (index >= 0) {
        return BILL_TYPE_COLOR[index];
    }
    return "gray";
}

/**
 * 时间戳转换为显示时间 年-月-日 时:分:秒
 * 后续可以考虑增加个性化展示，比如显示今天，刚刚，一周前等。
 * @export
 * @param {number} inputTime 
 * @returns 
 */
export function formatUnixtimestamp(inputTime) {

    var date = new Date(inputTime);
    // console.log(inputTime);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
};

/**
 * 时间戳转换为显示时间 年-月-日
 * 后续可以考虑增加个性化展示，比如显示今天，刚刚，一周前等。
 * @export
 * @param {number} inputTime 
 * @returns 
 */
export function formatUnixtimestampSimple(inputTime) {

    var date = new Date(inputTime);
    // console.log(inputTime);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    return y + '-' + m + '-' + d;
};

/**
 * 过滤html
 * @export
 * @param {string} htmlStr 
 * @returns 
 */
export function removeHTMLTag(htmlStr) {
    let str = htmlStr.replace(/<\/?[^>]*>/g,''); //去除HTML tag
    str = str.replace(/[ | ]*\n/g,'<br>'); //去除行尾空白
    //str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
    str=str.replace(/ /ig,'');//去掉 
    return "<p>"+str+"</p>";
}