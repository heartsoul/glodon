package com.glodon.bim.business.offline.model.server;

import android.content.Context;
import android.widget.Toast;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.glodon.bim.basic.log.LogUtil;

import java.util.HashMap;
import java.util.Map;

/**
 * 描述：
 * 作者：zhourf on 2018/5/23
 * 邮箱：zhourf@glodon.com
 */

public class ServerModule extends ReactContextBaseJavaModule {

    private static final String DURATION_SHORT_KEY = "SHORT";
    private static final String DURATION_LONG_KEY = "LONG";
    private ServerManager sm;
    private  Context context;
    public ServerModule(ReactApplicationContext reactContext) {
        super(reactContext);
        context = reactContext;
    }
    @Override
    public String getName() {
        return "ModelServer";
    }
    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put(DURATION_SHORT_KEY, Toast.LENGTH_SHORT);
        constants.put(DURATION_LONG_KEY, Toast.LENGTH_LONG);
        return constants;
    }

    @ReactMethod
    public void startServer(String message){
        LogUtil.e("Activity startServer");
        if(sm==null){
            sm =new ServerManager(context);
//            sm.register();
        }
        sm.startService();
    }

    @ReactMethod
    public void stopServer() {
        LogUtil.e("Activity stopServer");
        if(sm!=null){
//            sm.unRegister();
            sm.stopService();
        }
    }
}
