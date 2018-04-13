/** 
 * 描述：api底层封装
 * 作者：
 * 版权：广联达
 */

import * as AppConfig from "../config/AppConfig"

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
    let ret = response.json();
    return ret;
}

function parseHTML(response) {
    return response;
}

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        // let headers = response.headers;
        // console.log("checkStatus");
        // headers.forEach(function(item, key, mapObj) {
        //     console.log("headers:key" + key + ",value" + item.toString());
        // });
        return response;
    } else if (response.status === 403) {
        alert('请联系管理员获取相应操作权限');
        // return ;
        // Message.error('请联系管理员获取相应操作权限');
    } else if (response.status === 401) {
        storage.gotoLogin();
        return ;
        // Message.error('请联系管理员获取相应操作权限');
    }
    else if (response.status === 500) {
        alert('数据获取失败');
        // return ;
        // Message.error('请联系管理员获取相应操作权限');
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
            "Content-Type": "application/json;charset=utf-8",
            "X-Requested-With": "XMLHttpRequest",
        },
        
        // credentials: 'include', // 带上cookie
    };
    // Authorization  Bearer 6515033c-6c5f-4d6a-8033-ec0906d4f085
    if(storage.isLogin()) {
        ops.headers.Authorization = "Bearer "+storage.getLoginToken();
    }
    for (const i in ops) {
        if (options[i]) {
            options[i] = ops[i] = {...ops[i], ...options[i] };
        }
    }
    ops = {...ops, ...options };
    if (ops.isSpecial) {
        return fetch(AppConfig.BASE_URL + url, ops);
    }
    console.log(AppConfig.BASE_URL + url);
    return fetch(AppConfig.BASE_URL + url, ops)
        .then(checkStatus)
        .then(parseJSON)
        .then((data) => {
            // if (data && data.code === 'FALSE') {
            //   const msg = data.message || '操作失败';
            // }
            return { data };
        })
        .catch(err => {
            console.log(err)
        });
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
        return fetch(AppConfig.BASE_URL + url, ops);
    }
    console.log(AppConfig.BASE_URL + url);
    return fetch(AppConfig.BASE_URL + url, ops)
        .then(checkStatus)
        .then(parseHTML)
        .then((data) => {
            // if (data && data.code === 'FALSE') {
            //   const msg = data.message || '操作失败';
            // }
            console.log(data);
            return data;
        })
        .catch(err => ({ err }));
}