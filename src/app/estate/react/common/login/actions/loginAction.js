'use strict';

import { AlertIOS } from 'react-native';

import * as TYPES from './loginTypes';

import * as USERAPI from "./api+user";

// fake user data
let testUser = {
	'name': 'juju',
	'age': '24',
	'avatar': 'https://avatars1.githubusercontent.com/u/1439939?v=3&s=460'
};

// for skip user 
let skipUser = {
	'name': 'guest',
	'age': 20,
	'avatar': 'https://avatars1.githubusercontent.com/u/1439939?v=3&s=460',
};

function loadUserInfo(successReturn) {
    USERAPI.accountInfo().then((userInfo)=>{
      console.log(userInfo);
      if(userInfo.err) {
        alert('登录失败！');
        dispatch({'type': TYPES.LOGGED_ERROR,error:userInfo.err});
        return ;
      }
      let data = userInfo["data"];
      console.log(global.storage);
      console.log(global.storage.userInfo);
      global.storage.userInfo = data;
      if(data) {
        let ac = data["accountInfo"];
        if (ac) {
          let username = ac["name"];
          console.log(username);
          let userTenants = ac["userTenants"];
          if (userTenants) {
            console.log(userTenants.length);
            userTenants.forEach(tenant => {
              console.log(tenant["tenantName"]);
            });
          }
          dispatch({'type': TYPES.LOGGED_IN, user: testUser});
        //   successReturn();
        } else {
          Alert("登录失败！");
          dispatch({'type': TYPES.LOGGED_ERROR});
        }
      } else {
        dispatch({'type': TYPES.LOGGED_ERROR});
      }
      
    });
  }

export function authaToken(username, pwd, successReturn) {
    return (dispatch) => {
        dispatch({'type': TYPES.LOGGED_DOING});
       
        USERAPI.authaToken(username, pwd).then((response) => {
            console.log(response.data);
            global.storage.saveLoginToken(response.data.access_token);
            loadUserInfo(successReturn);
          }).catch((e)=>{
            Alert(`登录失败！${e.message}`);
            dispatch({'type': TYPES.LOGGED_ERROR, error: e});
        });
	}
    
  }

  
// login
export function logIn(opt){
	return (dispatch) => {
        dispatch({'type': TYPES.LOGGED_DOING});
       
		let inner_get = fetch('http://www.baidu.com')
			.then((res)=>{
				dispatch({'type': TYPES.LOGGED_IN, user: testUser});
			}).catch((e)=>{
				AlertIOS.alert(e.message);
				dispatch({'type': TYPES.LOGGED_ERROR, error: e});
			});
	}
}



// skip login
export function skipLogin(){
	return {
		'type': TYPES.LOGGED_IN,
		'user': skipUser,
	}
}


// logout
export function logOut(){
	return {
		'type': TYPES.LOGGED_OUT
	}
}