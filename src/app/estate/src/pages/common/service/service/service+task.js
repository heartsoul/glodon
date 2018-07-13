import {docDownloadFile} from './service+doc-download'
import {docUpLoadFile} from './service+doc-upload'
import {hex_md5} from './md5'
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
        const { containerId, parentId = 0, name, size, file, filePath, randomKey, taskState, updateTime, fileId, type = 'download' } = props;
        if (containerId) { this.containerId = containerId; }
        if (parentId) { this.parentId = parentId; }
        this.randomKey = randomKey ? randomKey : this._randomKey(containerId, parentId);
        if (name) { this.name = name; }
        if (size) { this.size = size; }
        if (file) { this.file = file; }
        if (filePath) { this.filePath = filePath; }
        this.fileId = fileId ? fileId : 0;
        if (type) { this.type = type; }
        this.taskState = taskState ? taskState : TAKS_ITEM_STATUS.pending;
        this.updateTime = updateTime ? updateTime : new Date().getTime();
        if(this.state){
            delete this.state;
        }
    }
    static newFileTaskItem(data={containerId:null,
        parentId:null,
        randomKey:null,
        name:null,
        size:0,
        file:null,
        filePath:null,
        fileId:0,
        type:'download',}){
        return new FileTaskItem(data);
    }
    _randomKey = (containerId, parentId) =>{
        return `FK${containerId}-${parentId}-${new Date().getTime()}-${FileTaskItem.___keyIndex++}`;
    }

    toString = () =>{
        return JSON.stringify(this);
    }
}

export class FileTask extends Object {
    static fileTask = null;
    constructor(props){
        super(props);
        this.taskKey = props.taskKey;
        this.taskItems = [];
        this.currentTask = null;
        this.isRun = false; // 是否在运行
        this.isStop = false;
        let tasks = this.loadTasks(this.taskKey);
        if(tasks) {
            this.taskItems = [...tasks];
        } else {
            this.taskItems = [];
        }
    }
    static taskKey(){
        // 用户id+租户id+项目id 隔离的md5字符串
        return hex_md5(storage.getUserId()+'-'+storage.loadTenant()+'-'+storage.loadProject()+'-fileTask');
    }
    static taskInstance(){
        let key = FileTask.taskKey();
        // 处理是否已经存在
        if(FileTask.fileTask) {
            if(FileTask.fileTask.taskKey === key) {
                return FileTask.fileTask; // 存在，并且是自己的任务队列就直接返回了
            } else {
                // 存在，但不是自己的任务队列，就结束当前的
                FileTask.fileTask.stoped();
            }
        }
        // 重新构建任务队列。
        FileTask.fileTask = new FileTask({taskKey:key});
        return FileTask.fileTask;
    }
    static loadTaskList(){
       return FileTask.taskInstance().loadTasks();
    }
    static saveTasksList(){
        return FileTask.taskInstance().saveTasks();
    }
    static addUploadTask(fileTaskItem/*= FileTaskItem*/){
        return FileTask.taskInstance().addTask(fileTaskItem,'upload');
    }
    static addDownloadTask(fileTaskItem/*= FileTaskItem*/){
        return FileTask.taskInstance().addTask(fileTaskItem, 'download');
    }
    static runTask() {
        FileTask.taskInstance().run();
    }
    static isRunning() {
        return FileTask.taskInstance().isRun === true;
    }
    static runTaskAll() {
        FileTask.taskInstance().runTaskAll();
    }
    static stopTask() {
        FileTask.taskInstance().stopTask();
    }
    static clearAll(taskItemState=null) {
        FileTask.taskInstance().clearTask(taskItemState);
    }
    
    stopTask = () => {
        this.isStop = YES;
        this.taskItems.map((item)=>{
            if((item.taskState ==  TAKS_ITEM_STATUS.uploading) 
            || (item.taskState ==  TAKS_ITEM_STATUS.downloading)) {
                item.taskState = TAKS_ITEM_STATUS.stoped;
            } else if((item.taskState ==  TAKS_ITEM_STATUS.waiting)) {
                item.taskState = TAKS_ITEM_STATUS.pending;
            }
        });
        this.saveTasks();
    }
    // type: download/upload
    addTask = (fileTaskItem/*= FileTaskItem*/,type='download') => {
        fileTaskItem.type = type;
        if(!this.taskItems.map) {
            this.taskItems = [];
        }
        if(this.isRun) {
            fileTaskItem.taskState = TAKS_ITEM_STATUS.waiting;
        } 
        this.taskItems.push(fileTaskItem);
    }
    runTaskAll = () => {
        this.taskItems.map((item)=>{
            if((item.taskState ==  TAKS_ITEM_STATUS.stoped) 
            || (item.taskState ==  TAKS_ITEM_STATUS.pending)
            || (item.taskState ==  TAKS_ITEM_STATUS.pause)) {
                item.taskState = TAKS_ITEM_STATUS.waiting;
            }
        });
        this.saveTasks();
        this.run();
    }
    clearTask = (taskItemState) =>{
        if(taskItemState) {
            this.taskItems = this.taskItems.filter((item)=>{
                return (item.taskState != taskItemState);
            });
        } else {
            this.taskItems = [];
        }
        this.saveTasks();
    }
    loadTasks = () => {
       this.taskItems = [];
       let jsonData = storage.getItem(this.taskKey) || []; 
       let jsonObject = JSON.parse(jsonData);
       if (jsonObject.map) {
        jsonObject.map((item)=>{
            let taskItem = new FileTaskItem(item);
            this.addTask(taskItem,taskItem.type)
        });
        return this.taskItems;
       } 
       return [];
    }
    saveTasks = () => {
        storage.setItem(this.taskKey,JSON.stringify(this.taskItems));
    }
    nextTask = () =>{
        if(this.isStop){
            return null;
        } 
        if(typeof this.taskItems !== 'array') {
            this.taskItems = [];
        }
      return this.taskItems.filter((item)=>{
            return item.taskState == TAKS_ITEM_STATUS.waiting;
        }).slice(0,1);
    }
    run = () =>{
        if(this.isRun) {
            return; // 正在执行，就不用重写开始
        }
        this.isRun = true;
        this.currentTask = this.nextTask();
        if(!this.currentTask) {
            this.isRun = false;
            return;
        }
        if(this.currentTask.type == 'upload') {
            this.upload();
        }
        if(this.currentTask.type == 'download') {
            this.download();
        }
    }
    upload = () =>{
       
        docUpLoadFile(this.currentTask.toJsonObject()).then((fileData)=>{
            // 上传完成了
            this.currentTask.taskState = TAKS_ITEM_STATUS.finished;
            this.currentTask.fileId = fileData.fileId;
            this.isRun = false;
            this.run();
        }).catch(err=>{
            // 出错了是否进行下一个呢？ 当前进行
            this.currentTask.taskState = TAKS_ITEM_STATUS.failed;
            this.saveTasks();
            this.currentTask = null;
            
            setTimeout(() => {
                this.isRun = false;
                this.run();
            }, 1000);
            
        })
    }
    download = () =>{
        
        docDownloadFile(this.currentTask.toJsonObject()).then((fileData)=>{
            // 下载完成了
            this.currentTask.taskState = TAKS_ITEM_STATUS.finished;
            this.currentTask.fileId = fileData.fileId;
            this.isRun = false;
            this.run();
        }).catch(err=>{
            // 出错了是否进行下一个呢？ 当前进行
            this.currentTask.taskState = TAKS_ITEM_STATUS.failed;
            this.saveTasks();
            this.currentTask = null;
            
            setTimeout(() => {
                this.isRun = false;
                this.run();
            }, 1000);
            
        })
    }
}
