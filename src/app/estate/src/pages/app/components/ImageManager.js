
import { NativeModules } from 'react-native'
import { ActionModal,shareboard } from 'app-components'

var PM = NativeModules.GLDPhotoManager;
export function shareApp(text,url) {
    text = text || 'BIM协同，真的来了';
    url = url || 'http://bim.glodon.com';
    // PM.shareAppAction({text:text,url:url},(data, bSuccess) => {
        
    // })
    shareboard(text,'',url,'BIM协同');
}
export function chooseImages(retFun, retFiles = [], maxLength = 3, multiple = false, capture = 'camera') {

    if (multiple || capture !== 'camera') {
        PM.pickerImages(
            (data, bSuccess) => {
                let itemCount = data.length;
                if(itemCount > maxLength) {
                    ActionModal.alertTip('数量超过限制',null,{text:'知道了'});
                    retFun(retFiles,false);
                    return;
                }
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
                let itemCount = data.length;
                if(itemCount > maxLength) {
                    ActionModal.alertTip('数量超过限制',null,{text:'知道了'});
                    retFun(retFiles,false);
                    return;
                }
                data.map((item, index) => {
                    item.url = "file://" + item.path;
                    retFiles.push(item);
                });
                retFun(retFiles, bSuccess)
            }
        );
    }

}