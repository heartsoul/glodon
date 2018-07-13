import * as API from "./../api/api+bimpm";
import * as PMBASIC from "./../api/api+pmbasic";
import * as ADMIN from "./../api/api+admin";

/**
 * 获取批注列表
 * @param {*} modelVersionId 
 * @param {*} fileId 
 * @param {*} creatorId 
 * @param {*} pageIndex 
 * @param {*} pageSize 
 */
export async function getModelMarkups(modelVersionId, fileId, creatorId, pageIndex, pageSize) {
    let result = {
        "code": "0",
        "data": {
            "list": [
                {
                    "appKey": "aDlPf13UtiGs7yuHCd8eHSLHbHJTU8Sd",
                    "creatorId": "6295429827273925422",
                    "creatorName": "徐园-15822320523",
                    "name": "373d9cae92b44303bc7525052981bec4",
                    "subjectContainerId": "373d9cae92b44303bc7525052981bec4",
                    "subjectId": "5214289",
                    "subjectType": "png",
                    "xdata": "{\"camera\":{\"name\":\"persp\",\"position\":{\"x\":-19842.64407899261,\"y\":-24812.56769195897,\"z\":24185.66096047833},\"target\":{\"x\":2843.099988382717,\"y\":-2126.739991338415,\"z\":1499.9999938912374},\"up\":{\"x\":0,\"y\":-0.000003673204955709934,\"z\":0.9999999999932537},\"version\":1},\"cutting\":false,\"treeObj\":{\"0-0\":\"all\",\"0-0-0\":\"all\",\"0-1\":\"all\",\"0-1-0\":\"all\",\"0-1-0-0\":\"all\",\"0-1-0-0-0\":\"all\",\"0-1-0-1\":\"all\",\"0-1-0-1-0\":\"all\",\"0-1-0-2\":\"all\",\"0-1-0-2-0\":\"all\"},\"filter\":\"{\\\"state\\\":{\\\"FILE_VISIBLE\\\":{},\\\"FILE_HIDDEN\\\":{},\\\"VISIBLE\\\":{},\\\"HIDDEN\\\":{},\\\"TRANSLUCENT\\\":{},\\\"TRANSLUCENT_OTHERS\\\":{},\\\"RENDER_PROMOTION\\\":{},\\\"ISOLATE_HIDDEN\\\":{},\\\"ISOLATE_HIDDEN_OTHERS\\\":{},\\\"ISOLATE_TRANSLUCENT\\\":{},\\\"ISOLATE_TRANSLUCENT_OTHERS\\\":{},\\\"USER_HIDDEN\\\":{},\\\"USER_OVERRIDE\\\":{},\\\"USER_WITH_BOARDLINE\\\":{\\\"categoryId\\\":{\\\"-2001350\\\":true,\\\"-2001180\\\":true,\\\"-2001160\\\":true,\\\"-2001340\\\":true,\\\"-2001260\\\":true,\\\"-2000180\\\":true,\\\"-2000011\\\":true,\\\"-2000035\\\":true,\\\"-2000170\\\":true,\\\"-2000171\\\":true,\\\"-2000340\\\":true,\\\"-2000100\\\":true,\\\"-2000126\\\":true,\\\"-2000032\\\":true,\\\"-2000120\\\":true,\\\"-2001120\\\":true,\\\"-2000014\\\":true,\\\"-2000996\\\":true,\\\"-2001354\\\":true,\\\"-2001300\\\":true,\\\"-2001330\\\":true,\\\"-2001336\\\":true,\\\"-2001320\\\":true,\\\"-2001327\\\":true,\\\"-2009030\\\":true,\\\"-2001220\\\":true,\\\"-2000023\\\":true,\\\"-2000038\\\":true,\\\"-2000946\\\":true}},\\\"CONDITION_HIDDEN_OTHERS\\\":{},\\\"CONDITION_TRANSLUCENT_OTHERS\\\":{},\\\"CONDITION_OVERRIDE\\\":{},\\\"ISOLATE_CONDITION_HIDDEN\\\":{},\\\"ISOLATE_CONDITION_HIDDEN_OTHERS\\\":{},\\\"ISOLATE_CONDITION_TRANSLUCENT\\\":{},\\\"ISOLATE_CONDITION_TRANSLUCENT_OTHERS\\\":{},\\\"FROZENFILTER\\\":{},\\\"FROZENCONDITIONFILTER\\\":{},\\\"OVERRIDEFILTER\\\":{},\\\"sceneState\\\":0,\\\"version\\\":\\\"0.4\\\"},\\\"camera\\\":{\\\"name\\\":\\\"persp\\\",\\\"position\\\":{\\\"x\\\":-19842.64407899261,\\\"y\\\":-24812.56769195897,\\\"z\\\":24185.66096047833},\\\"target\\\":{\\\"x\\\":2843.099988382717,\\\"y\\\":-2126.739991338415,\\\"z\\\":1499.9999938912374},\\\"up\\\":{\\\"x\\\":0,\\\"y\\\":-0.000003673204955709934,\\\"z\\\":0.9999999999932537},\\\"version\\\":1},\\\"selection\\\":[]}\",\"obj\":[{\"id\":\"1\",\"shapeType\":0,\"position\":{\"x\":98.81789404891691,\"y\":44.671869196363616,\"z\":1273.9934699912637},\"size\":{\"width\":25.21724774877413,\"height\":12},\"rotation\":0.6332973764574958,\"shapePoints\":\"\",\"originSize\":null,\"style\":{\"stroke-width\":3,\"stroke-color\":\"#ff0000\",\"stroke-opacity\":1,\"fill-color\":\"#ff0000\",\"fill-opacity\":0,\"font-family\":\"Arial\",\"font-size\":16,\"font-style\":\"\",\"font-weight\":\"\"},\"text\":\"\"}]}",
                    "attachment": null,
                    "status": null,
                    "subjectVersion": 0,
                    "description": "sss",
                    "id": "37da8e029273404186c633f09dd25fe4",
                    "markupId": "37da8e029273404186c633f09dd25fe4",
                    "screenshotKey": "89aea2fd672747d0804800c2142a5d88/null",
                    "screenshotName": null,
                    "screenshotType": "",
                    "screenshotURL": null,
                    "createTime": 1531330238000,
                    "updateTime": 1531330238000,
                    "favor": null,
                    "state": 0
                }
            ],
            "total": 0
        },
        "message": "string"
    }
    return new Promise(function (resolve, reject) {
        let list = [];
        if (result && result.data && result.data.list) {
            list = result.data.list
            length = list.length
        }
        resolve(list)
    })

    return API.getModelMarkups(modelVersionId, fileId, creatorId, pageIndex, pageSize)
        .then(response => {
            let result = response.data;
            let list = [];
            if (result && result.data && result.data.list) {
                list = result.data.list
            }
            return list;
        });
}
/**
 * 批注截图
 */
export async function getModelMarkupScreenUrl(modelVersionId, fileId, markupId) {
    return API.getModelMarkupScreenUrl(modelVersionId, fileId, markupId)
        .then(response => {
            let url = '';
            let result = response.data;
            if (result && result.data && result.data.screenshotURL) {
                url = result.data.screenshotURL;
            }
            return url;
        });
}

/**
 * 删除批注
 * @param {*} modelVersionId 
 * @param {*} fileId 
 * @param {*} markupId 
 * 
 * response
 * {
  "code": "string",
  "data": {
    "appKey": "string",
    "attachment": "string",
    "createTime": "2018-06-27T03:04:15.210Z",
    "creatorId": "string",
    "creatorName": "string",
    "description": "string",
    "favor": false,
    "id": "string",
    "markupId": "string",
    "name": "string",
    "screenshotKey": "string",
    "screenshotName": "string",
    "screenshotType": "string",
    "screenshotURL": "string",
    "state": "string",
    "status": "string",
    "subjectContainerId": "string",
    "subjectId": "string",
    "subjectType": "string",
    "subjectVersion": 0,
    "updateTime": "2018-06-27T03:04:15.210Z",
    "xdata": "string"
  },
  "message": "string"
}
 */
export async function deleteModelMarkup(modelVersionId, fileId, markupId) {
    Api.deleteModelMarkup(modelVersionId, fileId, markupId)
        .then(data => {
            let optInfo = {
                success: false,
                message: ''
            }
            if (data && data.data && data.data.code == 0) {
                optInfo.success = true;
            }
            return optInfo
        })

}

/**
 * 关闭批注
 * @param {*} modelVersionId 
 * @param {*} fileId 
 * @param {*} markupId 
 * response
 * {
  "code": "string",
  "data": {},
  "message": "string"
}
 */
export async function closeModelMarkup(modelVersionId, fileId, markupId) {
    Api.closeModelMarkup(modelVersionId, fileId, markupId)
        .then(data => {
            let optInfo = {
                success: false,
                message: ''
            }
            if (data && data.data && data.data.code == 0) {
                optInfo.success = true;
            }
            return optInfo
        })
}



/**
 * 查询批注评论
 * @param {*} modelVersionId 
 * @param {*} fileId 
 * @param {*} markupId 
 * @param {*} offset 
 * @param {*} limit 
 * 
 * response
 * {
  "code": "string",
  "data": [
    {
      "containerId": "string",
      "content": "string",
      "createTime": "2018-06-27T03:04:15.220Z",
      "creatorId": "string",
      "creatorName": "string",
      "id": "string",
      "markupCommentId": "string",
      "updateTime": "2018-06-27T03:04:15.220Z"
    }
  ],
  "message": "string"
}
 */
export async function getModelMarkupComments(modelVersionId, fileId, markupId, offset, limit) {

    let result = {
        "code": "0",
        "message": "success",
        "data": [{
            "content": "@XU新号 ssd",
            "creatorId": "6295429827273925422",
            "creatorName": "徐园-15822320523",
            "markupCommentId": null,
            "id": "eadc9869e9264098baf3d201664211b8",
            "containerId": "373d9cae92b44303bc7525052981bec4",
            "createTime": 1531458616000,
            "updateTime": null
        }, {
            "content": "@徐园 @张金波 @2323 评论123",
            "creatorId": "6295429827273925422",
            "creatorName": "徐园-15822320523",
            "markupCommentId": null,
            "id": "acc9ab3ac82f4271a01c67f0caed591b",
            "containerId": "373d9cae92b44303bc7525052981bec4",
            "createTime": 1531458362000,
            "updateTime": null
        }]
    }
    return new Promise(function (resolve, reject) {
        let list = [];
        if (result && result.data ) {
            list = result.data
        }
        resolve(list)
    })

    return API.getModelMarkupComments(modelVersionId, fileId, markupId, offset, limit)
        .then(response => {
            let list = [];
            if (response && response.data && response.data.data) {
                list = response.data.data;
            }
            return list;
        });
}

/**
 * 新增批注评论
 * @param {*} modelVersionId 
 * @param {*} fileId
 * @param {*} markupId 
 * @param {*} content 
 * @param {*} deptId 
 * @param {*} receiverIds 
 * response
 * {
  "code": "string",
  "data": {
    "containerId": "string",
    "content": "string",
    "createTime": "2018-06-27T03:04:15.223Z",
    "creatorId": "string",
    "creatorName": "string",
    "id": "string",
    "markupCommentId": "string",
    "updateTime": "2018-06-27T03:04:15.223Z"
  },
  "message": "string"
}
 */
export async function addModelMarkupComment(modelVersionId, fileId, markupId, content, deptId, receiverIds = []) {
    return API.addModelMarkupComment(modelVersionId, fileId, markupId, content, deptId, receiverIds = [])
        .then(response => {
            return response.data.data;//返回新增的评论
        })
}

/**
 * 模型批注@部门列表
 * @param {*} projectId 
 */
export async function getDocmarkUpChooseDepts(projectId) {
    return PMBASIC.getDocmarkUpChooseDepts(projectId)
        .then((response) => {
            let depts = [];
            if (response && response.data) {
                depts = response.data;
            }
            return depts;
        })
}

/**
 * 模型批注@部门列表
 * @param {*} deptId 部门id 
 */
export async function getMembersList(deptId) {
    return ADMIN.getMembersList(deptId)
        .then((response) => {
            let users = [];
            if (response && response.data) {
                users = response.data;
            }
            return users;
        })
}

