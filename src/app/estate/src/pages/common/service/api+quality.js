import { requestJSON } from "common-module"
/**
 * 质量检查相关API
 */
import * as CONSTANT from "./api+constant"
/**
 * 生产测试数据
 * 
 * @param {number} size 生产的条数
 * @returns 
 */
function demoData(size) {
    let ret = [];
    let ts = 1518853268000; // 2018-03-07 10:21:08
    let te = 1520389268000; // //2018-03-07 10:21:08
    let tstep = te - ts;

    for (let i = 0; i < size; i++) {
        let t = parseInt(Math.random() * (tstep) + ts);
        ret.push({
            "id": "100" + i,
            "description": "description " + i,
            "qcState": CONSTANT.CLASSIFY_STATES[i % CONSTANT.CLASSIFY_STATES.length],
            "inspectionDate": t,
            "updateTime": t + 1000,
        });
    }
    return ret;
}
var dataLast = { "data": { "content": demoData(100), 'last': false } };

/**
 * 获取质检清单
 * 
 * @export
 * @param {number} projectId 项目id
 * @param {string} qcState 单据状态 可选值 CLASSIFY_STATES
 * @param {number} page 当前页码 从1开始
 * @param {number} size 分页大小
 * @param {number} [qualityCheckpointId=0] 可选 关联的质检项目id
 * @param {string} [qualityCheckpointName='']  可选 关联的质检项目名称
 * @returns 
 {
  "content": [
    {
      "code": "string",
      "creatorId": 0,
      "description": "string",
      "files": [
        {
          "createTime": "2018-03-16T01:47:03.270Z",
          "creatorId": 0,
          "creatorName": "string",
          "digest": "string",
          "extData": "string",
          "extension": "string",
          "id": 0,
          "length": 0,
          "name": "string",
          "objectId": "string",
          "remark": "string",
          "targetId": "string",
          "targetType": "string",
          "updateTime": "2018-03-16T01:47:03.270Z",
          "updatorId": 0,
          "updatorName": "string",
          "uploadId": "string",
          "uploadTime": "2018-03-16T01:47:03.270Z",
          "url": "string"
        }
      ],
      "id": 0,
      "inspectionDate": "2018-03-16T01:47:03.270Z",
      "inspectionType": "string",
      "lastRectificationDate": "2018-03-16T01:47:03.270Z",
      "needRectification": true,
      "projectId": 0,
      "qcState": "string",
      "responsibleUserId": 0,
      "updateTime": "2018-03-16T01:47:03.270Z"
    }
  ],
  "first": true,
  "last": true,
  "number": 0,
  "numberOfElements": 0,
  "size": 0,
  "sort": {},
  "totalElements": 0,
  "totalPages": 0
}
 */
export async function getQualityInspectionAll(projectId, qcState, page, size, qualityCheckpointId = 0, qualityCheckpointName = '') {
    // return dataLast;
    let api = "/quality/" + projectId + "/qualityInspection/all";
    let filter = '';
    if (!(qualityCheckpointId === 0)) {
        filter += '&qualityCheckpointId=' + qualityCheckpointId;
    }
    if (!(qualityCheckpointName === '')) {
        filter += '&qualityCheckpointName=' + qualityCheckpointName;
    }
    return requestJSON(api + '?sort=updateTime,desc&page=' + page + '&size=' + size + "&qcState=" + qcState + filter, {
        method: 'GET',
    });
}

/**
 * 根据id查询检查历史详情
 * 
 * @export
 * @param {number} projectId 项目id
 * @param {string} fileId 单据id
 * @returns 
 {
  "inspectionInfo": {
    "buildingId": 0,
    "buildingName": "string",
    "code": "string",
    "commitTime": "2018-03-16T01:47:03.362Z",
    "committed": true,
    "constructionCompanyId": 0,
    "constructionCompanyName": "string",
    "createTime": "2018-03-16T01:47:03.362Z",
    "creatorId": 0,
    "creatorName": "string",
    "description": "string",
    "drawingGdocFileId": "string",
    "drawingName": "string",
    "drawingPositionX": "string",
    "drawingPositionY": "string",
    "elementId": "string",
    "elementName": "string",
    "files": [
      {
        "createTime": "2018-03-16T01:47:03.362Z",
        "creatorId": 0,
        "creatorName": "string",
        "digest": "string",
        "extData": "string",
        "extension": "string",
        "id": 0,
        "length": 0,
        "name": "string",
        "objectId": "string",
        "remark": "string",
        "targetId": "string",
        "targetType": "string",
        "updateTime": "2018-03-16T01:47:03.362Z",
        "updatorId": 0,
        "updatorName": "string",
        "uploadId": "string",
        "uploadTime": "2018-03-16T01:47:03.362Z",
        "url": "string"
      }
    ],
    "gdocFileId": "string",
    "id": 0,
    "inspectionCompanyId": 0,
    "inspectionCompanyName": "string",
    "inspectionDate": "2018-03-16T01:47:03.362Z",
    "inspectionType": "string",
    "inspectionUserTitle": "string",
    "lastRectificationDate": "2018-03-16T01:47:03.362Z",
    "needRectification": true,
    "projectId": 0,
    "projectName": "string",
    "qcState": "string",
    "qualityCheckpointId": 0,
    "qualityCheckpointName": "string",
    "responsibleUserId": 0,
    "responsibleUserName": "string",
    "responsibleUserTitle": "string",
    "updateTime": "2018-03-16T01:47:03.362Z"
  },
  "progressInfos": [
    {
      "billType": "string",
      "code": "string",
      "commitTime": "2018-03-16T01:47:03.362Z",
      "description": "string",
      "files": [
        {
          "createTime": "2018-03-16T01:47:03.362Z",
          "creatorId": 0,
          "creatorName": "string",
          "digest": "string",
          "extData": "string",
          "extension": "string",
          "id": 0,
          "length": 0,
          "name": "string",
          "objectId": "string",
          "remark": "string",
          "targetId": "string",
          "targetType": "string",
          "updateTime": "2018-03-16T01:47:03.362Z",
          "updatorId": 0,
          "updatorName": "string",
          "uploadId": "string",
          "uploadTime": "2018-03-16T01:47:03.362Z",
          "url": "string"
        }
      ],
      "handleDate": "2018-03-16T01:47:03.362Z",
      "handlerId": 0,
      "handlerName": "string",
      "handlerTitle": "string",
      "id": 0,
      "lastRectificationDate": "2018-03-16T01:47:03.362Z"
    }
  ]
}
 */
export async function getQualityInspectionDetail(projectId, fileId) {
    let api = "/quality/" + projectId + "/qualityInspection/" + fileId + '/detail';
    return requestJSON(api + '?fileId=' + fileId, {
        method: 'GET',
    });
}

/**
 * App端查询质检清单（所有检查+验收单）各种状态的统计数
 * 
 * @export
 * @param {number} projectId 项目id
 * @param {number} [qualityCheckpointId=0] 可选 关联的质检项目id
 * @param {string} [qualityCheckpointName='']  可选 关联的质检项目名称
 * @returns 
 [
  {
    "count": 0,
    "qcState": "string"
  }
]
 */
export async function getQualityInspectionSummary(projectId, qualityCheckpointId = 0, qualityCheckpointName = '') {
    let api = "/quality/" + projectId + "/qualityInspection/all/qcState/summary";
    let filter = '';
    if (!(qualityCheckpointId === 0)) {
        filter += '&qualityCheckpointId=' + qualityCheckpointId;
    }
    if (!(qualityCheckpointName === '')) {
        filter += '&qualityCheckpointName=' + qualityCheckpointName;
    }
    return requestJSON(api + '?' + filter, {
        method: 'GET',
    });
}

/**
 * App端查询图纸文件对应的所有关联点
 * 
 * @export
 * @param {number} projectId 项目id
 * @param {number} drawingGdocFileId 
 * @returns 
 [
  {
    "drawingGdocFileId": "string",
    "drawingPositionX": "string",
    "drawingPositionY": "string",
    "inspectionId": 0,
    "inspectionUserId": 0,
    "qcState": "string",
    "rectificationId": 0,
    "responsibleUserId": 0,
    "reviewId": 0
  }
]
 */
export async function getQualityInspectionAllDrawingPositions(projectId, qualityCheckpointId) {
    let api = "/quality/" + projectId + "/qualityInspection/all/all/drawings/" + drawingGdocFileId + "/drawingPositions";
    return requestJSON(api, {
        method: 'GET',
    });
}


/**
 * App端查询模型文件对应的所有关联构件
 * 
 * @export
 * @param {number} projectId 项目id
 * @param {number} gdocFileId
 * @returns 
 [
  {
    "elementId": "string",
    "elementName": "string",
    "gdocFileId": "string",
    "inspectionId": 0,
    "inspectionUserId": 0,
    "qcState": "string",
    "rectificationId": 0,
    "responsibleUserId": 0,
    "reviewId": 0
  }
]
 */
export async function getQualityInspectionElements(projectId, gdocFileId) {
    let api = "/quality/" + projectId + "/qualityInspection/all/all/model/" + gdocFileId + "/elements";
    return requestJSON(api, {
        method: 'GET',
    });
}

/**
 * 材设 App端查询模型文件对应的关联构件
 * 
 * @export
 * @param {number} projectId 项目id
 * @param {number} gdocFileId
 * @returns 
 [
  {
    "committed": true,
    "elementId": "string",
    "elementName": "string",
    "facilityId": 0,
    "qualified": true
  }
]
 */
export async function getQualityFacilityAcceptanceElements(projectId, gdocFileId) {
    let api = "/quality/" + projectId + "/facilityAcceptance/model/" + gdocFileId + "/elements";
    return requestJSON(api, {
        method: 'GET',
    });
}

/**
 * 获取图纸项目列表
 * 
 * @export
 * @param {number} projectId 项目id
 * @param {number} projectIdIn
 * @returns 
 */
export async function getQualityCheckpointsProject(projectId, projectIdIn) {
    let api = `/quality/${projectId}/quality/checkpoints/project/${projectIdIn}`;
    return requestJSON(api, {
        method: 'GET',
    });
}

/**
 * 获取项目下检查单位列表
 * @param {*} projectId 项目id
 * @returns 
 * 
 [
  {
    "parentId": null,
    "code": "s1t1ri1n1g",
    "name": "11301919",
    "alias": null,
    "type": "GROUP",
    "extData": null,
    "id": 5211919,
    "treePath": "5211919/",
    "orderNum": 1,
    "external": false,
    "formal": true
  }
]
 */
export async function getInspectionCompanies(projectId) {
    let api = `/quality/${projectId}/qualityInspection/inspectionCompanys`;
    return requestJSON(api, {
        method: 'GET',
    });
}
/**
 * 获取质检项目列表
 * @param {*} projectId 
 * @returns 
 * 
 [
    {
        "code": null,
        "name": "其他项目",
        "parentId": null,
        "treePath": null,
        "requirement": "非集团统一安排的检查",
        "projectType": "Estate_Project_Type_House",
        "specialtyId": -1,
        "specialtyName": "",
        "id": -1,
        "hasRule": false
      }
]
 */
export async function getCheckPoints(projectId) {
    let api = `/quality/${projectId}/checkpoints/templates/whole`;
    let filter = `?ifOther=true`;
    return requestJSON(api + filter, {
        method: 'GET',
    });
}

/**
 * url中区分检查单和验收单（inspection\acceptance）
 */
function getApiType(inspectionType) {
    if (inspectionType === "acceptance") {
        return "qualityAcceptance";
    }
    return "qualityInspection";

}

/**
 * 检查单 新增 提交
 * @param {*} projectId 
 * @param {{"code":"","constructionCompanyId":5212715,"constructionCompanyName":"施工单位A","description":"111","inspectId":0,"inspectionCompanyId":5211919,"inspectionCompanyName":"11301919","inspectionType":"inspection","needRectification":false,"projectId":5213135,"projectName":"APP材设","qualityCheckpointId":5200204,"qualityCheckpointName":"墙面","responsibleUserId":5200299,"responsibleUserName":"XP","responsibleUserTitle":"总工"}} props json格式
 * @returns
 * {"id":5201156,"code":"ZLJC_20180328_003"}
 */
export async function createSubmitInspection(projectId, inspectionType, props) {
    let type = getApiType(inspectionType)

    let api = `/quality/${projectId}/${type}/commit`;
    return requestJSON(api, {
        method: 'POST',
        body: props,
    });
}


/**
 * 检查单 新增 保存
 * @param {*} projectId 
 * @param {{"code":"","constructionCompanyId":5212715,"constructionCompanyName":"施工单位A","description":"111","inspectId":0,"inspectionCompanyId":5211919,"inspectionCompanyName":"11301919","inspectionType":"inspection","needRectification":false,"projectId":5213135,"projectName":"APP材设","qualityCheckpointId":5200204,"qualityCheckpointName":"墙面","responsibleUserId":5200299,"responsibleUserName":"XP","responsibleUserTitle":"总工"}} props json格式
 * @returns
 * {"id":5201156,"code":"ZLJC_20180328_003"}
 */
export async function createSaveInspection(projectId, inspectionType, props) {
    let type = getApiType(inspectionType)
    let api = `/quality/${projectId}/${type}`;
    return requestJSON(api, {
        method: 'POST',
        body: props,
    });
}

/**
 * 检查单 编辑   提交
 * @param {*} projectId 
 * @param {*} fileId 检查单id
 * @param {{"code":"","constructionCompanyId":5212715,"constructionCompanyName":"施工单位A","description":"111","inspectId":0,"inspectionCompanyId":5211919,"inspectionCompanyName":"11301919","inspectionType":"inspection","needRectification":false,"projectId":5213135,"projectName":"APP材设","qualityCheckpointId":5200204,"qualityCheckpointName":"墙面","responsibleUserId":5200299,"responsibleUserName":"XP","responsibleUserTitle":"总工"}} props json格式
 * @returns responsebody无内容
 * 
 */
export async function editSubmitInspection(projectId, fileId, inspectionType, props) {
    let type = getApiType(inspectionType)
    let api = `/quality/${projectId}/${type}/${fileId}/commit`;
    return requestJSON(api, {
        method: 'PUT',
        body: props,
    });
}

/**
 * 检查单 编辑   保存
 * @param {*} projectId 
 * @param {*} fileId 检查单id
 * @param {{"code":"","constructionCompanyId":5212715,"constructionCompanyName":"施工单位A","description":"111","inspectId":0,"inspectionCompanyId":5211919,"inspectionCompanyName":"11301919","inspectionType":"inspection","needRectification":false,"projectId":5213135,"projectName":"APP材设","qualityCheckpointId":5200204,"qualityCheckpointName":"墙面","responsibleUserId":5200299,"responsibleUserName":"XP","responsibleUserTitle":"总工"}} props json格式
 * @returns responsebody无内容
 */
export async function editSaveInspection(projectId, fileId, inspectionType, props) {
    let type = getApiType(inspectionType)
    let api = `/quality/${projectId}/${type}/${fileId}`;
    return requestJSON(api, {
        method: 'PUT',
        body: props,
    });
}

/**
 * 检查单 删除
 * @param {*} projectId 
 * @param {*} fileId 检查单id
 * @returns responsebody无内容
 */
export async function createDeleteInspection(projectId, inspectionType, fileId) {
    let type = getApiType(inspectionType)
    let api = `/quality/${projectId}/${type}/${fileId}`;
    return requestJSON(api, {
        method: 'DELETE',
    });
}

/**
 * 获取图纸上检查的点
 * @param {*} projectId 
 * @param {*} drawingGdocFileId 图纸文件id
 * @returns 
 * [ { qcState: 'reviewed',
        inspectionId: 5200073,
        rectificationId: 5200019,
        reviewId: 5200011,
        drawingGdocFileId: 'be645ab6d5204fd19bda437c7a21b1d2',
        drawingPositionX: '2475.5999755859375',
        drawingPositionY: '948.800048828125',
        inspectionUserId: 5200003,
        responsibleUserId: 5200013 },
      { qcState: 'inspected',
        inspectionId: 5200202,
        rectificationId: null,
        reviewId: null,
        drawingGdocFileId: 'be645ab6d5204fd19bda437c7a21b1d2',
        drawingPositionX: '44516.609375',
        drawingPositionY: '44516.609375',
        inspectionUserId: 5200003,
        responsibleUserId: 5210022 } ]
 */
export async function getBluePrintDots(projectId, drawingGdocFileId) {
    let api = `/quality/${projectId}/qualityInspection/all/drawings/${drawingGdocFileId}/drawingPositions`;
    return requestJSON(api, {
        method: 'GET',
    });
}


/**
 * 根据质量预设检查点查询验评标准检查项
 * @param {*} templateId 
 * @returns 
 * [
  {
    "code": "string",
    "content": "string",
    "id": 0,
    "name": "string",
    "parentId": 0,
    "projectProperty": "string",
    "standardId": 0
  }
]
 */
export async function getStandardsItems(templateId) {
    let api = `/quality//acceptanceStandard/templates/${templateId}/standards/items`;
    return requestJSON(api, {
        method: 'GET',
    });
}
/**
 * 复查单  新增  保存
 * @param {*} projectId 
 * @param {*} props 
 */
export async function createSaveReview(projectId, props) {
    let api = `quality/${projectId}/qualityReviews`;
    return requestJSON(api, {
        method: 'POST',
        body: props,
    });
}

/**
 * 复查单  编辑  保存
 * @param {*} projectId 
 * @param {*} fileId 
 * @param {*} props 
 */
export async function editSaveReview(projectId, fileId, props) {
    let api = `quality/${projectId}/qualityReviews/${fileId}`;
    return requestJSON(api, {
        method: 'PUT',
        body: props,
    });
}

/**
 * 复查单  新增  提交
 * @param {*} projectId 
 * @param {*} props 
 */
export async function createSubmitReview(projectId, props) {
    let api = `quality/${projectId}/qualityReviews/commit`;
    return requestJSON(api, {
        method: 'POST',
        body: props,
    });
}

/**
 * 复查单  编辑  提交
 * @param {*} projectId 
 * @param {*} fileId 
 * @param {*} props 
 */
export async function editSubmitReview(projectId, fileId, props) {
    let api = `quality/${projectId}/qualityReviews/${fileId}/commit`;
    return requestJSON(api, {
        method: 'PUT',
        body: props,
    });
}

/**
 * 复查单  查询保存后的复查单数据
 * @param {*} projectId 
 * @param {*} inspectionId 
 */
export async function getReviewInfo(projectId, inspectionId) {
    let api = `quality/${projectId}/qualityReviews/staged?inspectionId=${inspectionId}`;
    return requestJSON(api, {
        method: 'GET',
    });
}

/**
 * 复查单  删除
 * @param {*} projectId 
 * @param {*} fileId 
 */
export async function deleteReview(projectId, fileId) {
    let api = `quality/${projectId}/qualityReviews/${fileId}`;
    return requestJSON(api, {
        method: 'DELETE',
    });
}
