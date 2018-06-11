
import BaseHandler from './BaseHandler';

import Realm from 'app-3rd/realm'

//项目列表 

let name = null;
let realm = null;
export default class UserInfoHandler extends BaseHandler{

//获取数据库表后缀名称
getTableName = ()=>{
    let userInfo = storage.loadUserInfo();
    let account = userInfo.username;//手机号
    return account;
}

    constructor(){
        super();
        name = 'user'+this.getTableName();
        console.log('name='+name)
        const basicSchema = {
            name:name,
            primaryKey:'key',
            properties:{
                key:'string',
                value:'string',
            }
        }
        realm = new Realm({schema:[basicSchema]});
    }

    close=()=>{
        realm.close();
    }
    
    insert=(key,value)=>{
        if(!this.isEmpty(value)){
            realm.write(()=> {
                realm.create(name, {key:key,value:value},true);
            })
        }
        
    }

    update=(key,value)=>{
        if(!this.isEmpty(value)){
            realm.write(()=> {
                realm.create(name, {key:key,value:value},true);
            })
        }
    }

    delete=(key)=>{
        realm.write(()=> {
            let infos = realm.objects(name);
            let item = infos.filtered(`key="${key}"`);
            realm.delete(item);
        });
    }

    //清空表
    deleteAll = ()=>{
        realm.write(()=> {
            let infos = realm.objects(name);
            realm.delete(infos);
        });
    }
    query =(key)=>{
            let infos = realm.objects(name);
            let item = infos.filtered(`key="${key}"`);
            if(this.isEmpty(item)){
                return null;
            }
            return item[0].value;
    }
    
    queryAll = ()=>{
        let infos = realm.objects(name);
        return infos;
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

