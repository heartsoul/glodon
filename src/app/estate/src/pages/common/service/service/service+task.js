import {docDownloadFile} from './service+doc-download'
import {docUpLoadFile} from './service+doc-upload'
export const TAKS_ITEM_STATUS = {
    pending:0,
    uploading:1,
    downloading:10,
    waiting:2,
    pause:3,
    stoped:4,
    finished:5,
    failed:6,
};
export const TAKS_ITEM_STATUS_TEXT = {
    pending:'下载',
    waiting:'等待中',
    uploading:'下载中',
    downloading:'上传中',
    pause:'已暂停',
    stoped:'已停止',
    finished:'完成',
    failed:'失败',
};
/**
 * 任务项目，负责存储相应的任务信息
 *
 * @export
 * @class FileTaskItem
 * @extends {Object}
 */
export class FileTaskItem extends Object {
    static ___keyIndex = 0;
    constructor(props){
        super(props);
        const {containerId,parentId,name,size,file,filePath,randomKey,taskState,updateTime,fileId,type='download'} = props.jsonData;
        this.state = {
            containerId:containerId,
            parentId,parentId,
            randomKey:randomKey?randomKey:this.randomKey(containerId,parentId),
            name:name,
            size:size,
            file:file,
            filePath:filePath,
            fileId:fileId?fileId:0,
            type:type,
            taskState:uploadState?taskState:TAKS_ITEM_STATUS.pending,
            updateTime:updateTime?updateTime:new Date().getTime(),
        }
    }

    randomKey(containerId,parentId) {
        return `FK${containerId}-${parentId}-${new Date().getTime()}-${___keyIndex++}`;
    }

    toJsonObject(){
        return JSON.stringify(this.state);
    }
}

export class FileTask extends Object {
    constructor(props){
        super(props);
        this.taskItems = new Array();
        this.currentTask = null;
        this.isRun = false; // 是否在运行
        this.isStop = false;
    }
    // type: download/upload
    addTask(fileTaskItem,type='download'){
        fileTaskItem.state.type = type;
        this.taskItems.push(fileTaskItem);
    }
    clearTask(){
        this.taskItems = [];
    }
    loadTasks(taskKey) {
       let jsonData = storage.getItem(taskKey); 
       this.taskItems = jsonData;
    }
    saveTasks() {
        storage.setItem(taskKey,JSON.stringify(this.taskItems));
    }
    nextTask(){
      return this.taskItems.filter((item)=>{
            return item.state.waiting == true;
        }).slice(0,1);
    }
    run(){
        if(this.isRun) {
            return; // 正在执行，就不用重写开始
        }
        this.isRun = true;
        this.currentTask = this.nextTask();
        if(!this.currentTask) {
            this.isRun = false;
            return;
        }
        if(this.currentTask.state.type == 'upload') {
            this.upload();
        }
        if(this.currentTask.state.type == 'download') {
            this.download();
        }
    }
    upload(){
       
        docUpLoadFile(this.currentTask.toJsonObject()).then((fileData)=>{
            // 上传完成了
            this.currentTask.state.taskState = TAKS_ITEM_STATUS.finished;
            this.currentTask.state.fileId = fileData.fileId;
            this.isRun = false;
            this.run();
        }).catch(err=>{
            // 出错了是否进行下一个呢？ 当前进行
            this.currentTask.state.taskState = TAKS_ITEM_STATUS.failed;
            this.saveTasks();
            this.currentTask = null;
            
            setTimeout(() => {
                this.isRun = false;
                this.run();
            }, 1000);
            
        })
    }
    download(){
        
        docDownloadFile(this.currentTask.toJsonObject()).then((fileData)=>{
            // 下载完成了
            this.currentTask.state.taskState = TAKS_ITEM_STATUS.finished;
            this.currentTask.state.fileId = fileData.fileId;
            this.isRun = false;
            this.run();
        }).catch(err=>{
            // 出错了是否进行下一个呢？ 当前进行
            this.currentTask.state.taskState = TAKS_ITEM_STATUS.failed;
            this.saveTasks();
            this.currentTask = null;
            
            setTimeout(() => {
                this.isRun = false;
                this.run();
            }, 1000);
            
        })
    }
}

