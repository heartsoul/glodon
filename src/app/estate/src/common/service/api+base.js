/** 
 * 描述：api底层封装
 * 作者：
 * 版权：广联达
 */

import {BASE_URL} from 'common-module'
// 关于fetch https://github.com/github/fetch
// fetch('/users', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json'
//   },
//   body: JSON.stringify({
//     name: 'Hubot',
//     login: 'hubot',
//   })
// })

function parseJSON(response) {
   let ContentType = response.headers.get('Content-Type');
   if(ContentType && ContentType.toLowerCase().indexOf("application/json",0) > -1) {
    let ret = response.json();
    return ret;
   }
   return response.text();
}

function parseHTML(response) {
    return response;
}

function checkStatus(response) {
    // console.log(">>>返回数据："+JSON.stringify(response));
    if (response.status >= 200 && response.status < 300) {
        return response;
    } else if (response.status === 403) {
        // alert('请联系管理员获取相应操作权限');
        // Toast.info('请联系管理员获取相应操作权限(code:403)',3)
        console.log('请联系管理员获取相应操作权限(code:403)')
        const error = new Error("请联系管理员获取相应操作权限");
        error.response = response;
        throw error;
        return response;
        // Message.error('请联系管理员获取相应操作权限');
    } else if (response.status === 401) {
        // storage.gotoLogin();
        const error = new Error("请联系管理员获取相应操作权限");
        error.response = response;
        throw error;
    }
    else if (response.status === 500) {
        // alert('数据获取失败(code:500).');
        // return ;
        // Message.error('请联系管理员获取相应操作权限');
        // Toast.info('数据获取失败(code:500)',3)
        console.log('数据获取失败(code:500)')
        // {"code":"ERROR_SERVICE_INVOKE","message":"没有指定租户上下文"
        const error = new Error("数据获取失败");
        error.response = response;
        throw error;
        return response;
    }

    const error = new Error(response.statusText);
    error.response = response;
    throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export function requestJSON(url, options) {

    let ops = {
        headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json;charset=utf-8",
            "X-Requested-With": "XMLHttpRequest",
        },
        
        // credentials: 'include', // 带上cookie
    };
    // Authorization  Bearer 6515033c-6c5f-4d6a-8033-ec0906d4f085
    if(storage.isLogin() && storage.getLoginToken() != 'cookie_token') {
        ops.headers.Authorization = "Bearer "+storage.getLoginToken();
    }
    if(storage.isLogin() && storage.loadLastTenant()) {
        let t = storage.loadLastTenant();
        if(t && t != '0') {
            ops.headers['X-CORAL-TENANT'] = t;
        }
    }
    for (const i in ops) {
        if (options[i]) {
            options[i] = ops[i] = {...ops[i], ...options[i] };
        }
    }
    ops = {...ops, ...options };
    if (ops.isSpecial) {
        return fetch(BASE_URL + url, ops);
    }
    // console.log(">>>请求信息："+BASE_URL + url);
    // console.log(ops)
    return fetch(BASE_URL + url, ops)
        .then(checkStatus)
        .then(parseJSON)
        .then((data) => { 
            return { data };
        })
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export function requestHTML(url, options) {
    let ops = {
        // headers: {
        //   'Content-Type': 'application/json;charset=utf-8',
        // },
        // credentials: 'include', // 带上cookie
    };
    for (const i in ops) {
        if (options[i]) {
            options[i] = ops[i] = {...ops[i], ...options[i] };
        }
    }
    ops = {...ops, ...options };
    if (ops.isSpecial) {
        return fetch(BASE_URL + url, ops);
    }
    console.log(BASE_URL + url);
    return fetch(BASE_URL + url, ops)
        .then(checkStatus)
        .then(parseHTML)
        .then((data) => {
            // if (data && data.code === 'FALSE') {
            //   const msg = data.message || '操作失败';
            // }
            // console.log(data);
            if (!data) {
                const error = new Error('没有数据返回');
                error.response = null;
                throw error
              }
            return data;
        })
}
