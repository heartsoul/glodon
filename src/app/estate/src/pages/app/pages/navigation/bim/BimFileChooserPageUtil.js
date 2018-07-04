import * as API from 'app-api';

//获取图纸和模型列表数据
export default class BimFileChooserPageUtil{

     //下载模型文件
    static downloadModel(projectId, latestVersion, callback){
        this._downloadModelAndBlueprint(projectId, latestVersion, callback,'模型文件');
    }

    //下载图纸文件
    static downloadBluePrint(projectId, latestVersion, callback){
        this._downloadModelAndBlueprint(projectId, latestVersion, callback,'图纸文件');
    }

    static _downloadModelAndBlueprint(projectId, projectVersionId, callback,name){

        let _getModelList=(fileId=0)=>{
            // console.log(projectId + '  '+projectVersionId+'  '+fileId)
            if(name=='图纸文件'){
                return API.getDrawingDataList(projectId, projectVersionId, 0, fileId).then(
                    (responseData) => {
                        // console.log('图纸文件 start----------------')
                        // console.log(responseData)
                        // console.log('图纸文件 end----------------')
                        let list = responseData.data;
                        return list;
                    }
                ).catch((error) => {
                    // console.log('图纸文件 err  start----------------')
                    console.log(error)
                    // console.log('图纸文件 err  end----------------')
                });
            }else{
                return API.getModelDataList(projectId, projectVersionId, 0, fileId).then(
                    (responseData) => {
                        // console.log('模型列表 start----------------')
                        // console.log(responseData)
                        // console.log('模型列表 end----------------')
                        let list = responseData.data;
                        return list;
                    }
                ).catch((error) => {
                    // console.log('模型列表 err  start----------------')
                    console.log(error)
                    // console.log('模型列表 err  end----------------')
                });
            }
            
        }

        async function getData(){
            let modellist = await _getModelList();
            // console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxx');
            // console.log(modellist);
            if(modellist && modellist.length>0){
                // console.log('aaaaaaaaa')
                let data = [];
                for(let item of modellist){
                    // console.log('bbbbbbbbbbbbbbbbb')
                    // console.log(item)
                    // if(item.name==name){
                        // console.log('ccccccccccccccccc')
                        item.parentId = '0';
                        data=[...data,item];
                        if(item.folder){
                         let list = await _getModelList(item.fileId);
                         data = [...data,...list]
                         for(let item of list){
                             if(item.folder){
                                let list = await _getModelList(item.fileId);
                                data = [...data,...list]
                                for(let item of list){
                                    if(item.folder){
                                        let list = await _getModelList(item.fileId);
                                        data = [...data,...list]
                                        for(let item of list){
                                            if(item.folder){
                                                let list = await _getModelList(item.fileId);
                                                data = [...data,...list]
                                                for(let item of list){
                                                    if(item.folder){
                                                        let list = await _getModelList(item.fileId);
                                                        data = [...data,...list]
                                                        for(let item of list){
                                                            if(item.folder){
                                                                let list = await _getModelList(item.fileId);
                                                                data = [...data,...list]
                                                                for(let item of list){
                                                                    if(item.folder){
                                                                        let list = await _getModelList(item.fileId);
                                                                        data = [...data,...list]
                                                                        for(let item of list){
                                                                            if(item.folder){
                                                                                let list = await _getModelList(item.fileId);
                                                                                data = [...data,...list]
                                                                                for(let item of list){
                                                                                    if(item.folder){
                                                                                        let list = await _getModelList(item.fileId);
                                                                                        data = [...data,...list]
                                                                                        for(let item of list){
                                                                                            if(item.folder){
                                                                                                let list = await _getModelList(item.fileId);
                                                                                                data = [...data,...list]
                                                                                                for(let item of list){
                                                                                                    if(item.folder){
                                                                                                        let list = await _getModelList(item.fileId);
                                                                                                        data = [...data,...list]
                                                                                                        for(let item of list){
                                                                                                            if(item.folder){
                                                                                                                let list = await _getModelList(item.fileId);
                                                                                                                data = [...data,...list]
                                                                                                                for(let item of list){
                                                                                                                    if(item.folder){
                                                                                       
                                                                                                                    }
                                                                                                                }
                                                                                                            }
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                             }
                         }
                        //  let endText = name=='模型文件'?'/model':'/blueprint'
                        // let key_getModelList = "/model/" + projectId + "/" + projectVersionId + "/bim/file/children"+endText;
                        // console.log('999999999999999999999999999999999999--'+endText)
                        // console.log('list='+JSON.stringify(data));
                        return data;
                        break;
                    }
                }
            }
        }
        getData().then((data)=>{
            callback(data);
        },(e)=>{
            console.log(e);
        });
    }
}