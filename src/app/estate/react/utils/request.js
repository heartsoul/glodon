// import fetch from 'dva/fetch';
// import { Message } from 'antd';
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

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
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
export default function request(url, options) {
  let ops = {
    // headers: {
    //   'Content-Type': 'application/json;charset=utf-8',
    // },
    credentials: 'include', // 带上cookie
  };
  for (const i in ops) {
    if (options[i]) {
      options[i] = ops[i] = { ...ops[i], ...options[i] };
    }
  }
  ops = { ...ops, ...options };
  if (ops.isSpecial) {
    return fetch(url, ops);
  }
  return fetch(url, ops)
    .then(checkStatus)
    .then(parseJSON)
    .then((data) => {
      if (data && data.code === 'FALSE') {
        const msg = data.message || '操作失败';
        if (msg !== '提问单编号重复') {
          Message.error(msg);
        }
      }
      return { data };
    })
    .catch(err => ({ err }));
}
