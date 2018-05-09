
import { requestHTML, requestJSON, BASE_URL} from "common-module"
// import {NativeModules} from 'react-native'
// import {FileReaderModule} from NativeModules
// 用户登录
const api_uaa_login = '/uaa/login'; // POST username=&password=
const api_uaa_oauth_token = '/uaa/oauth/token'; // POST username=&password=
// header
// Content-Type:application/x-www-form-urlencoded
// body
// username=15822320523&password=123qwe&grant_type=password&client_id=aDlPf13UtiGs7yuHCd8eHSLHbHJTU8Sd&client_secret=voL9cWmkdu962V1tN0FE8aVsAD76HDGy

// 用户退出
const api_uaa_logout = '/uaa/logout'; // GET
// 用户退出
const api_logout = '/logout'; // GET
// 获取用户信息
const api_admin_accout = '/admin/account';
// 获取权限
const api_auths_moduleRights = '/admin/auths/{appCode}/moduleRights/{moduleCode}'; // GET deptId=

// 获取用户信息，包含租户列表信息
const api_uaa_user = '/uaa/user';
// 可用项目列表 http://192.168.81.30/pmbasic/swagger-ui.html#!/project-controller/queryAvailableProjectsUsingGET
const api_pmbasic_projects_available = '/pmbasic/projects/available'; // GET page=&size=
// 设置当前选中的租户
const api_user_currentTenant = '/user/currentTenant'; // PUT tenantId=

// {
// 	"name": "1",
// 	"email": "2@1.com",
// 	"title": "sss",
// 	"content": "xxx"
// }
const api_backend_feedbacks = '/backend/feedbacks'; // POST 
const api_forgot_captcha = '/uaa/user/password/forgot/captcha'; // GET 返回图片 
const api_forgot_check = '/uaa/user/password/forgot/check'; // GET 校验用户名 
const api_forgot_code = '/uaa/user/password/forgot/code'; // GET 获取手机验证码
const api_forgot_code_verify = '/uaa/user/password/forgot/code/verify'; // GET 校验手机验证码 
const api_forgot_reset = '/uaa/user/password/forgot/reset'; // POST 重置密码 

// 用户登录
export async function login(username, password) {
    // console.log(requestHTML);
    return requestHTML(api_uaa_login, {
        headers: { "Content-Type": "application/x-www-form-urlencoded", "X-Requested-With": "XMLHttpRequest" },
        method: 'POST',
        body: 'username=' + username + '&password=' + password,
    });
}
export async function authToken(username, password) {
    return requestJSON(api_uaa_oauth_token, {
        headers: { "Content-Type": "application/x-www-form-urlencoded", "X-Requested-With": "XMLHttpRequest" },
        method: 'POST',
        body: 'username=' + username + '&password=' + password +'&grant_type=password&client_id=aDlPf13UtiGs7yuHCd8eHSLHbHJTU8Sd&client_secret=voL9cWmkdu962V1tN0FE8aVsAD76HDGy',
    });
}
// 用户信息
export async function accountInfo() {
    return requestJSON(api_uaa_user, {
        method: 'GET',
    });
}

// 项目信息
export async function getProjects(page, size) {
    return requestJSON(api_pmbasic_projects_available + '?sort=createTime,desc&page=' + page + '&size=' + size, {
        method: 'GET',
    });
}

// 设置当前租户
export async function setCurrentTenant(tenantId) {
    return requestJSON(api_user_currentTenant, {
        method: 'PUT',
        body: JSON.stringify({ 'tenantId': parseInt(tenantId) }),
    });
}

// 退出
export async function loginOut() {
    return requestHTML(api_logout, {
        method: 'GET',
    });
}
// 退出
export async function uaaLoginOut() {
    return requestHTML(api_uaa_logout, {
        method: 'GET',
    });
}

// {
// 	"name": "1",
// 	"email": "2@1.com",
// 	"title": "sss",
// 	"content": "xxx"
// }
export async function feedbacks(jsonData) {
    return requestJSON(api_backend_feedbacks, {
        method: 'POST',
        body: JSON.stringify(jsonData),
    });
}

function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result)
      }
      reader.onerror = function() {
        reject(reader.error)
      }
    })
  }

  function readBlobAsUrlData(blob) {
    var reader = new FileReader()
    var promise = fileReaderReady(reader)
    reader.readAsDataURL(blob)
    return promise
  }
// 获取图片验证码
export async function forgotCaptchaUrl(retFunc) {
    let signupKey = null
   return fetch(BASE_URL + api_forgot_captcha,{
        method:'GET'
    }).then((response)=>{
        signupKey = response.headers.get('signup-key');
        return response.blob();
    }).then((blobData)=>{
       return readBlobAsUrlData(blobData);
    }).then((uri)=>{
    
         console.log("\n\n\ndata:"+uri+"\n\n");
         // let data = response.body();
         
         return {uri: uri,signupKey:signupKey}
     });
}


// 检查用户名是否存在
// {
// 	"success": false,
// 	"responseData": null,
// 	"statusCode": "402",
// 	"errorMessage": "用户名不存在"
// }
//  GET /uaa/user/password/forgot/check?identity=18610799451 HTTP/1.1

export async function forgotCheck(identity) {
    return requestJSON(api_forgot_check+'?identity='+identity,{
        method:'GET'
    }).then((response)=>{
        return response.data
    });
}


// 获取手机验证码
// {
// 	"success": false,
// 	"responseData": null,
// 	"statusCode": "605",
// 	"errorMessage": "手机号不存在"
// }
// GET /uaa/user/password/forgot/code?mobile=18610799451&captcha=YZ9Z&signupKey=799adf6c9a2b4df08776d44549ca6f13
export async function forgotCode(mobile,captcha,signupKey) {
    return requestJSON(api_forgot_code+`?mobile=${mobile}&captcha=${captcha}&signupKey=${signupKey}`,{
        method:'GET'
    }).then((response)=>{
        return response.data
    });
}

// 校验
// {
// 	"success": false,
// 	"responseData": null,
// 	"statusCode": "611",
// 	"errorMessage": "验证码错误"
// }
// /uaa/user/password/forgot/code/verify?verifyCode=1234&mobile=15822320523
export async function forgotCodeVerify(mobile,verifyCode) {
    return requestJSON(api_forgot_code_verify+`?mobile=${mobile}&verifyCode=${verifyCode}`,{
        method:'GET'
    }).then((response)=>{
        return response.data
    });
}

// 重置密码
// uaa/user/password/forgot/reset？mobile code pwd

export async function forgotReset(mobile,verifyCode,pwd) {
    return requestJSON(api_forgot_reset+`?mobile=${mobile}&code=${verifyCode}&pwd=${pwd}`,{
        method:'POST'
    }).then((response)=>{
        return response.data;
    });
}