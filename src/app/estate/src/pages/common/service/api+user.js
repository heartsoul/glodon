import { requestHTML, requestJSON } from "common-module"
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