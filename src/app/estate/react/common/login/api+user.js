import request from "../base/api+base"

// 用户登录
const api_uaa_login = '/uaa/login'; // POST username=&password=
// 用户退出
const api_uaa_logout = '/uaa/logout'; // GET
// 用户退出
const api_logout = '/logout';// GET
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
    return request(api_uaa_login, {
        method: 'POST',
        body: 'username=' + username + '&password=' + pwd,
    });
}
// 用户信息
export async function accountInfo() {
    return request(api_uaa_user, {
        method: 'GET',
    });
}

// 项目信息
export async function getProjects(page,size) {
    return request(api_pmbasic_projects_available+'?page='+page+'&size='+size, {
        method: 'GET',
    });
}

// 设置当前租户
export async function setCurrentTenant(tenantId) {
    return request(api_user_currentTenant, {
        method: 'PUT',
        body: JSON.stringify({'tenantId':tenantId}),
    });
}

// 退出
export async function loginOut() {
    return request(api_logout, {
        method: 'GET',
    });
}
// 退出
export async function uaaLoginOut() {
    return request(api_uaa_logout, {
        method: 'GET',
    });
}
