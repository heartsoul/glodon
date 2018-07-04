package com.glodon.bim.business.offline.thread;

import android.content.Context;
import android.os.AsyncTask;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.glodon.bim.basic.log.LogUtil;
import com.glodon.bim.business.offline.model.server.NetUtils;
import com.glodon.bim.business.offline.model.server.ServerManager;

import java.util.HashMap;
import java.util.Map;

/**
 * 为rn提供线程服务
 * */

public class ThreadModule extends ReactContextBaseJavaModule {

//    private static final String ROOT_URL = "ROOT_URL";
    private  Context context;
    public ThreadModule(ReactApplicationContext reactContext) {
        super(reactContext);
        context = reactContext;
    }
    @Override
    public String getName() {
        return "ThreadModule";
    }
    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        return constants;
    }

    @ReactMethod
    public void startThread(final String formUrl, final String name, final String fileId, final String parentId, final String item, final Callback callback){
        LogUtil.e("ThreadModule  t");
        LogUtil.e((callback==null)+"");
        new Thread(new Runnable() {
            @Override
            public void run() {
                callback.invoke(formUrl,name,fileId,parentId,item);
            }
        }).start();

//        new AsyncTask<Void, Void, Void>() {
//
//            @Override
//            protected void onPreExecute() {
//                super.onPreExecute();
//            }
//
//            @Override
//            protected Void doInBackground(Void... voids) {
//                callback.invoke(formUrl,name,fileId,parentId,item);
//                return null;
//            }
//
//            @Override
//            protected void onPostExecute(Void aVoid) {
//                super.onPostExecute(aVoid);
//            }
//        }.execute();
    }

}
