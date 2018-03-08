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
    return response.json();
}

function parseHTML(response) {
    // console.log("parseHTML");
    // let headers = response.headers;

    // headers.forEach(function(item, key, mapObj) {
    //     console.log("headers:key" + key + ",value" + item.toString());
    // });
    // let ck = headers.get("set-cookie");
    // ck.forEach(strCookie => {
    //     //将多cookie切割为多个名/值对 
    //     let arrCookie = strCookie.split("; ");
    //     let JSESSIONID;
    //     //遍历cookie数组，处理每个cookie对 
    //     for (let i = 0; i < arrCookie.length; i++) {

    //         let arr = arrCookie[i].split("=");
    //         //找到名称为userId的cookie，并返回它的值 
    //         if ("JSESSIONID" == arr[0]) {
    //             JSESSIONID = arr[1];
    //             break;
    //         }
    //     }
    //     global.storage.saveLoginToken(JSESSIONID);
    //     console.log("token:" + global.storage.loginToken());
    // });
    // "JSESSIONID=9F0905398EC498C67660CA4E2505B6F9; Path=/; HttpOnly"
    // .headers.map["set-cookie"]["0"]

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
        // Message.error('请÷联系管理员获取相应操作权限');
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
            "X-Requested-With": "XMLHttpRequest"
        },
        credentials: 'include', // 带上cookie
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
        .then(parseJSON)
        .then((data) => {
            // if (data && data.code === 'FALSE') {
            //   const msg = data.message || '操作失败';
            // }
            console.log(data);
            return { data };
        })
        .catch(err => ({
            err
            // alert(err);
            }));
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
        credentials: 'include', // 带上cookie
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