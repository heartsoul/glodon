import BaseHandler from './BaseHandler';

//基础信息包

// import Realm from 'app-3rd/realm'

let name = null;
let realm = null;
export default class BasicInfoHandler extends BaseHandler{

   
    //获取数据库表后缀名称
    getTableName = ()=>{
        // let userInfo = storage.loadUserInfo();
        // // let userObj = JSON.parse(userInfo);
        // let account = userInfo.username;//手机号

        // let tenantInfo = storage.loadTenantInfo();
        // let tenantObj = JSON.parse(tenantInfo);
        // let tenantId = tenantObj.value.tenantId;//租户的id

        // let projectId = storage.loadProject();//项目的id
        // let targetPath = `${account}${tenantId}${projectId}`;
        // return targetPath;
    }

    close=()=>{
        // realm.close();
    }

    constructor(){
        super();
        // name = 'basic'+this.getTableName();
        // console.log('name='+name)
        // const basicSchema = {
        //     name:name,
        //     primaryKey:'key',
        //     properties:{
        //         key:'string',
        //         value:'string',
        //     }
        // }
        // realm = new Realm({schema:[basicSchema]});
    }

    
    insert=(key,value)=>{
        // if(!this.isEmpty(value)){
        //     realm.write(()=> {
        //         realm.create(name, {key:key,value:value},true);
        //     })
        // }
        
    }

    update=(key,value)=>{
        // if(!this.isEmpty(value)){
        //     realm.write(()=> {
        //         realm.create(name, {key:key,value:value},true);
        //     })
        // }
    }

    delete=(key)=>{
        // realm.write(()=> {
        //     let infos = realm.objects(name);
        //     let item = infos.filtered(`key="${key}"`);
        //     realm.delete(item);
        // });
    }

    //清空表
    deleteAll = ()=>{
        // realm.write(()=> {
        //     let infos = realm.objects(name);
        //     realm.delete(infos);
        // });
    }
    query =(key)=>{
            // let infos = realm.objects(name);
            // let item = infos.filtered(`key="${key}"`);
            // if(this.isEmpty(item)){
            //     return null;
            // }
            // return item[0].value;
            return {};
    }
    
    queryAll = ()=>{
        // let infos = realm.objects(name);
        // return infos;
        return {};
    }

    // _insert = ()=>{
    //     this.insert('key2','value2');
    //     this.insert('key3','value3');
    // }

    // _update = ()=>{
    //     this.update('key4','value3');
    // }

    // _delete = ()=>{
    //     this.delete('key2');
    // }

    // _query =()=>{
    //     let result = this.query('key3');
    //     console.log(result);
    // }

    // _queryAll =()=>{
    //     let result = this.queryAll();
    //     console.log(result);
    // }
    // render(){
    //     return (
    //         <View style={{}}>
    //             <TouchableHighlight onPress={this._insert} >
    //                 <Text  style={{fontSize:30,marginTop:30}}> insert </Text>
    //             </TouchableHighlight>
    //             <TouchableHighlight onPress={this._update} >
    //                 <Text  style={{fontSize:30,marginTop:30}}> update </Text>
    //             </TouchableHighlight>
    //             <TouchableHighlight onPress={this._delete} >
    //                 <Text  style={{fontSize:30,marginTop:30}}> delete </Text>
    //             </TouchableHighlight>
    //             <TouchableHighlight onPress={this.deleteAll} >
    //                 <Text  style={{fontSize:30,marginTop:30}}> deleteAll </Text>
    //             </TouchableHighlight>
    //             <TouchableHighlight onPress={this._query} >
    //                 <Text  style={{fontSize:30,marginTop:30}}> query </Text>
    //             </TouchableHighlight>
    //             <TouchableHighlight onPress={this._queryAll} >
    //                 <Text  style={{fontSize:30,marginTop:30}}> queryAll </Text>
    //             </TouchableHighlight>
    //         </View>
    //     );
    // }
}
