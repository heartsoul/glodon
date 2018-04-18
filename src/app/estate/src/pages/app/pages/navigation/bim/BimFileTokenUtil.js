
import * as API from 'app-api';

function getLastetVersion(fileId, callback) {
    API.getModelLatestVersion(storage.projectId).then((responseData) => {
        let latestVersion = responseData.data.data.versionId;
        storage.projectIdVersionId = latestVersion;
        getToken(fileId, callback);
    });

}

function getToken(fileId, callback) {
    API.getModelBimFileToken(storage.projectId, storage.projectIdVersionId, fileId).then((responseData) => {
        let token = responseData.data.data;
        global.storage.bimToken = token;
        callback(token);
    });
}


function fetchData(requestMethod) {
    if (storage.projectId === 0) {
        storage.loadProject((projectId) => {
            storage.projectId = projectId;
            requestMethod();
        });
    } else {
        requestMethod();
    }
}

export function getBimFileToken(fileId, callback) {
    fetchData(() => { getLastetVersion(fileId, callback) })
}
