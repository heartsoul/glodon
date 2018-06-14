import * as API from 'app-api'
import * as types from '../constants/qualityInfoTypes'
import OfflineStateUtil from '../../../common/utils/OfflineStateUtil'
import OfflineManager from '../../offline/manager/OfflineManager'

// 获取数据
export function fetchData(fieldId) {
  return dispatch => {
    // dispatch(_loading());
      API.getQualityInspectionDetail(storage.loadProject(), fieldId).then((responseData) => {
        
        if (responseData.data.files && responseData.data.files.length > 0) {
          loadFileUrls(responseData.data.files, (files) => {
            responseData.data.files = files;
            dispatch(_loadSuccess(responseData.data));
          });
        }
        else {
          dispatch(_loadSuccess(responseData.data));
        }
      }).catch(err => {
        dispatch(_loadError(err));
      });
    
  }
}
function loadFileUrls(files, finsh) {
  let countAll = files.length;
  files.map((item, index) => {
    API.getBimFileUrl(item.objectId, (success, data) => {
      countAll--;
      if (success) {
        files[index].url = data;
      }
      if (countAll < 1) {
        finsh(files);
      }
    }).catch((err) => {
      countAll--;
      if (countAll < 1) {
        finsh(files);
      }
    })
  });

}
export function reset() {
  return dispatch => {
    dispatch(_reset())
  }
}

function _loading() {
  return {
    type: types.QUALITY_INFO_DOING,
  }
}

function _loadSuccess(data) {
  return {
    type: types.QUALITY_INFO_DONE,
    data: data,
  }
}

function _reset() {
  return {
    type: types.QUALITY_INFO_INIT,
  }
}
function _loadError(error) {
  return {
    type: types.QUALITY_INFO_ERROR,
    error: error,
  }
}
