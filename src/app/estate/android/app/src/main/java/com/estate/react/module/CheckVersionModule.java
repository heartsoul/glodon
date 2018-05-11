package com.estate.react.module;

import android.text.TextUtils;
import android.util.Log;
import android.widget.Toast;

import com.estate.BuildConfig;
import com.estate.MainApplication;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.glodon.bim.business.setting.bean.CheckVersionBean;
import com.glodon.bim.business.setting.util.GlodonUpdateManager;

/**
 * Created by cwj on 2018/5/11.
 * Description:CheckVersionModule
 */

public class CheckVersionModule extends ReactContextBaseJavaModule {

    public static final String CheckVersionManager = "CheckVersionManager";

    public CheckVersionModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return CheckVersionManager;
    }

    @ReactMethod
    public void setVersionInfo(final ReadableMap data) {
        Log.d("tag", "setVersionInfo: ");
//        let params = {
//                type: type,
//                sysValue: responseData.data.sysValue,
//                autoDownload: storage.loadAutoDownload(),
//                    }
        CheckVersionBean bean = new CheckVersionBean();
        bean.sysName = "android";
        bean.sysValue = data.getString("sysValue");
        String type = data.getString("type");
        boolean autoDownload = data.getBoolean("autoDownload");
        if (type != null && type.equals("setting")) {
            GlodonUpdateManager.getInstance().showUpdateDialog(MainApplication.instance.getCurrentReactContext().getCurrentActivity(), bean);
        } else {
            //强制升级 弹窗
            if (!BuildConfig.VERSION_NAME.equals(bean.getVersion()) && !TextUtils.isEmpty(bean.getVersion())) {
                if ("force".equals(bean.getUpdateOption())) {
                    GlodonUpdateManager.getInstance().showForceUpdateDialog(MainApplication.instance.getCurrentReactContext().getCurrentActivity(), bean);
                } else {
                    //开启wifi下自动下载
                    if (autoDownload) {
                        GlodonUpdateManager.getInstance().autoDownload(MainApplication.instance.getCurrentReactContext().getCurrentActivity(), bean);
                    }
                }
            }
        }
    }
}
