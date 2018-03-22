package com.estate.react.module;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;

/**
 * Created by cwj on 2018/3/19.
 * Description:ModuleExecuteMethod rn和native交互的方法
 */

public class ModuleExecuteMethod {

    public void api_clearCookie(ReadableMap inData, Callback callback) {
        String message = "";
        WritableMap writableMap = Arguments.createMap();
        writableMap.putString("successedResponseCode", "0");
        writableMap.putString("message", "message");

        WritableMap data = Arguments.createMap();
        data.putString("test", "test1");
        writableMap.putMap("data", data);

        WritableMap resetIndata = Arguments.createMap();
        resetIndata.putString("test", "test2");


        callback.invoke(writableMap, resetIndata);

    }

    public void api_callNative(ReadableMap inData, Callback callback){

    }
}
