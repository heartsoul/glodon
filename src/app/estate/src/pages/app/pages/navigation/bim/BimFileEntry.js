'use strict'
import { GLDNewMenuView } from 'app-components'
import * as NewQualityAction from "./../../../actions/NewQualityAction";
/**
 * 图纸模型选择及展示入口;
 * PageType 0新建检查单 1检查单编辑状态 2详情查看  3质检单模型模式  4新建材设进场 5新增材设进场编辑状态  6材设模型模式
 * 
 * 首页进入图纸、模型选择页面
 * 
 * 质检单新建页面进入图纸、模型选择及展示
 * 
 * 材设首页进入模型选择
 * 
 * 材设单新建进入模型选择及展示
 * 
 * 详情页进入图纸、模型展示
 * 
 */

import * as PageType from "./PageTypes";

export function homeSelect(navigation) {
    GLDNewMenuView.openMenu(navigation);
}
export function newSelect(navigation) {
    GLDNewMenuView.openChoose(navigation);
}

/**
 *  从质检单首页进入图纸选择
 */
export function chooseBlueprintFromHome(navigator, replace = false, top = false) {
    let next = replace ? storage.replaceNext : storage.pushNext;
    next(navigator, "BimFileChooserPage", {
        top:top,
        fileId: 0,
        dataType: "图纸文件",
        pageType: PageType.PAGE_TYPE_QUALITY_MODEL
        
    });
}

/**
 *  从质检单首页进入模型选择
 */
export function chooseQualityModelFromHome(navigator, replace = false, top = false) {
    let next = replace ? storage.replaceNext : storage.pushNext;
    next(navigator, "BimFileChooserPage", {
        top:top,
        fileId: 0,
        dataType: "模型文件",
        pageType: PageType.PAGE_TYPE_QUALITY_MODEL
    });
}

/**
 * 从质检单新建页面进入图纸选择及展示
 */
export function chooseBlueprintFromQualityNew(navigator, drawingGdocFileId, drawingName, drawingPositionX, drawingPositionY) {
    let blueprint = {
        drawingGdocFileId: drawingGdocFileId,
        drawingName: drawingName,
        drawingPositionX: drawingPositionX,
        drawingPositionY: drawingPositionY,
    }
    if (blueprint.drawingName) {
        storage.pushNext(navigator, "RelevantBlueprintPage", {
            pageType: PageType.PAGE_TYPE_EDIT_QUALITY,
            relevantBluePrint: blueprint,
        });
    } else {
        storage.pushNext(navigator, "BimFileChooserPage", {
            fileId: 0,
            dataType: "图纸文件",
            pageType: PageType.PAGE_TYPE_NEW_QUALITY
        })
    }
}

/**
 * 从质检单新建页面进入模型选择及展示
 */
export function chooseModelFromQualityNew(navigator, gdocFileId, elementId, buildingId, buildingName) {
    let model = {
        gdocFileId: gdocFileId,
        elementId: elementId,
        buildingId: buildingId,
        buildingName: buildingName,
    }

    if (gdocFileId) {
        storage.pushNext(navigator, "RelevantModlePage", {
            pageType: PageType.PAGE_TYPE_EDIT_QUALITY,
            relevantModel: model,
        });
    } else {
        storage.pushNext(navigator, "BimFileChooserPage", {
            fileId: 0,
            dataType: "模型文件",
            pageType: PageType.PAGE_TYPE_NEW_QUALITY,
        })
    }
}


/**
 *  从材设单首页进入模型选择
 */
export function chooseEquipmentModelFromHome(navigator, replace = false, top = false) {
    let next = replace ? storage.replaceNext : storage.pushNext;
    next(navigator, "BimFileChooserPage", {
        top:top,
        fileId: 0,
        dataType: "模型文件",
        pageType: PageType.PAGE_TYPE_EQUIPMENT_MODEL
    });
}

/**
 * 材设单新建进入模型选择及展示
 */
export function chooseEquipmentModelFromNew(navigator, gdocFileId, elementId, buildingId, buildingName) {
    let model = {
        gdocFileId: gdocFileId,
        elementId: elementId,
        buildingId: buildingId,
        buildingName: buildingName,
    }
    if (gdocFileId) {
        storage.pushNext(navigator, "RelevantModlePage", {
            pageType: PageType.PAGE_TYPE_EDIT_EQUIPMENT,
            relevantModel: model,
        });
    } else {
        storage.pushNext(navigator, "BimFileChooserPage", {
            fileId: 0,
            dataType: "模型文件",
            pageType: PageType.PAGE_TYPE_NEW_EQUIPMENT,
        })
    }
}

/**
 * 从图纸选择进入图纸展示页
 * @param {*} pageType 从首页模型进入（PAGE_TYPE_EQUIPMENT_MODEL、PAGE_TYPE_QUALITY_MODEL），
 *  从新建进入，或者进入图纸后重新选择（当做新建 PAGE_TYPE_NEW_QUALITY、PAGE_TYPE_NEW_EQUIPMENT），
 *  choose页已把pageType存在state中，可以直接使用
 * @param {*} drawingGdocFileId 
 * @param {*} drawingName 
 */
export function showBlueprintFromChoose(navigator, pageType, drawingGdocFileId, drawingName) {
    let blueprint = {
        drawingGdocFileId: drawingGdocFileId,
        drawingName: drawingName,
        drawingPositionX: '',//新图纸未做标记，可以为空
        drawingPositionY: '',
    }
    storage.pushNext(navigator, "RelevantBlueprintPage", {
        pageType: pageType,
        relevantBluePrint: blueprint,
    });
}
/**
 * 从模型选择进入模型展示页
 * @param {*} navigator 
 * @param {*} pageType 
 * @param {*} gdocFileId 
 * @param {*} buildingId 
 * @param {*} buildingName 
 */
export function showModelFromChoose(navigator, pageType, gdocFileId, buildingId, buildingName) {
    let model = {
        gdocFileId: gdocFileId,
        buildingId: buildingId,
        buildingName: buildingName,
    }

    storage.pushNext(navigator, "RelevantModlePage", {
        pageType: pageType,
        relevantModel: model,
    });
}

/**
 * 从详情页进入图纸展示
 * @param {*} navigator 
 * @param {*} drawingGdocFileId 图纸文件id
 * @param {*} drawingName 图纸名称
 * @param {*} drawingPositionX  
 * @param {*} drawingPositionY 
 */
export function showBlueprintFromDetail(navigator, drawingGdocFileId, drawingName, drawingPositionX, drawingPositionY) {
    let blueprint = {
        drawingGdocFileId: drawingGdocFileId,
        drawingName: drawingName,
        drawingPositionX: drawingPositionX,
        drawingPositionY: drawingPositionY,
    }
    storage.pushNext(navigator, "RelevantBlueprintPage", {
        pageType: PageType.PAGE_TYPE_DETAIL,
        relevantBluePrint: blueprint,
    });
}

/**
 * 从详情页进入模型展示
 * @param {*} navigator 
 * @param {*} gdocFileId 模型文件id
 * @param {*} elementId 构件id
 */
export function showModelFromDetail(navigator, gdocFileId, elementId) {
    let model = {
        gdocFileId: gdocFileId,
        elementId: elementId,
    }
    storage.pushNext(navigator, "RelevantModlePage", {
        pageType: PageType.PAGE_TYPE_DETAIL,
        relevantModel: model,
    });
}

/**
 * 进入新建检查/整改单
 * @param {*} navigator 
 * @param {*} qualityCheckListId  单据id
 * @param {*} createType  单据类型 CREATE_TYPE_RECTIFY|CREATE_TYPE_REVIEW 具体见常量定义
 */
export function showNewReviewPage(navigator, qualityCheckListId, createType) {
    storage.pushNext(navigator, "NewReviewPage", { qualityCheckListId: qualityCheckListId, createType: createType });
}

/**
 * 从列表提交质检单
 * @param {*} inspectId 质检单id
 * @param {*} callback 提交完成后回调 ,callback的参数 { res: "error", data: err } { res: "success", data: "" }
 */
export function submitInspectionFromList(inspectId, callback) {
    NewQualityAction.submitFromList(inspectId, callback);
}