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