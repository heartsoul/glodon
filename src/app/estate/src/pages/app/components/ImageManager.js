
import { NativeModules } from 'react-native'
var PM = NativeModules.GLDPhotoManager;

export function chooseImages(retFun, retFiles = [], maxLength = 3, multiple = false, capture = 'camera') {
    if (multiple || capture !== 'camera') {
        PM.pickerImages(
            (data, bSuccess) => {
                data.map((item, index) => {
                    item.url = "file://" + item.path;
                    retFiles.push(item);
                });
                retFun(retFiles, bSuccess)
            }
        );
    } else {
        PM.takePhoto(
            (data, bSuccess) => {
                data.map((item, index) => {
                    item.url = "file://" + item.path;
                    retFiles.push(item);
                });
                retFun(retFiles, bSuccess)
            }
        );
    }

}