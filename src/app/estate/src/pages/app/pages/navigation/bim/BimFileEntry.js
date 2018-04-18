'use strict'
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

/**
 *  从质检单首页进入图纸选择
 */
export function chooseBlueprintFromHome(navigator) {
    storage.pushNext(navigator, "BimFileChooserPage", {
        fileId: 0,
        dataType: "图纸文件",
        pageType: PageType.PAGE_TYPE_QUALITY_MODEL
    });
}

/**
 *  从质检单首页进入模型选择
 */
export function chooseQualityModelFromHome(navigator) {
    storage.pushNext(navigator, "BimFileChooserPage", {
        fileId: 0,
        dataType: "模型文件",
        pageType: PageType.PAGE_TYPE_QUALITY_MODEL
    });
}

/**
 * 从质检单新建页面进入图纸选择及展示
 */
export function chooseBluePrintFromQualityNew(navigator, blueprint) {
    if (blueprint && blueprint.name) {
        storage.pushNext(navigator, "RelevantBlueprintPage", {
            title: blueprint.name,
            fileId: blueprint.fileId,
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
export function chooseModuleFromQualityNew(navigator, model) {
    if (model && model.fileName) {
        storage.pushNext(navigator, "RelevantModlePage", {
            title: model.fileName,
            fileId: model.fileId,
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
export function chooseEquipmentModelFromHome(navigator) {
    storage.pushNext(navigator, "BimFileChooserPage", {
        fileId: 0,
        dataType: "模型文件",
        pageType: PageType.PAGE_TYPE_EQUIPMENT_MODEL
    });
}
/**

 * 
 * 详情页进入图纸、模型展示
 */

/**
 * 材设单新建进入模型选择及展示
 */
export function chooseEquipmentModelFromNew(navigator) {
    if (model && model.fileName) {
        storage.pushNext(navigator, "RelevantModlePage", {
            title: model.fileName,
            fileId: model.fileId,
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
 * 从详情页进入图纸展示
 */
export function showBlueprintFromDetail(navigator, blueprint) {
    if (blueprint && blueprint.name) {
        storage.pushNext(navigator, "RelevantBlueprintPage", {
            title: blueprint.name,
            fileId: blueprint.fileId,
            pageType: PageType.PAGE_TYPE_DETAIL,
            relevantBluePrint: blueprint,
        });
    }
}

/**
 * 从详情页进入模型展示
 */
export function showModelFromDetail(navigator, model) {
    if (model && model.fileName) {
        storage.pushNext(navigator, "RelevantModlePage", {
            title: model.fileName,
            fileId: model.fileId,
            pageType: PageType.PAGE_TYPE_DETAIL,
            relevantModel: model,
        });
    }
}


