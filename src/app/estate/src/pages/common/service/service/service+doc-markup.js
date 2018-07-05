import * as API from "./../api/api+bimpm";

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
                    "appKey": "string",
                    "attachment": "string",
                    "createTime": "2018-06-27T03:04:15.201Z",
                    "creatorId": "string",
                    "creatorName": "崔丽杰",
                    "description": "框线的部分要特别注意一下",
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
                    "updateTime": "2018-06-27T03:04:15.201Z",
                    "xdata": "string"
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
            return response;
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