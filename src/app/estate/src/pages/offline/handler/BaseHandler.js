export default class BaseHandler{
    isEmpty=(obj)=>{
        if(obj==null){
            return true;
        }
        if(obj==undefined){
            return true;
        }
        if(JSON.stringify(obj) == "[]"){
            return true;
        }
        if(JSON.stringify(obj) == "{}"){
            return true;
        }
        return false;
    }
}