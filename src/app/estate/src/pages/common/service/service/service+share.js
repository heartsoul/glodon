import API from "app-api";



export function generateShareToken(containerId = "d289a697494247c8a8c148365513bc13", fileId = "7fd5503f31004b79866cfa10fd15c2ce") {
    let shareInfo = {
        containerId: containerId,
        fileId: fileId,
    }
    return API.createDocShare(containerId, fileId, false)
        .then(response => {
            shareInfo.title = response.data.title;
            shareInfo.token = response.data.token;
            shareInfo.password = response.data.password;
            shareInfo.creatorName = response.data.creatorName;
            shareInfo.expireTime = response.data.expireTime;
            return shareInfo;
        })
}
