package com.glodon.bim.business.setting.bean;

import android.text.TextUtils;
import android.util.Log;

import com.google.gson.Gson;

/**
 * Created by cwj on 2018/3/27.
 * Description:CheckVersionBean 检测版本更新数据
 */

public class CheckVersionBean {

    public String sysName;//平台  android

    public String sysValue;//返回的更新信息

    private SysValue versionInfo;//解析后的更新信息


    public String getVersion() {
        parseSysValue();
        return versionInfo==null?null:versionInfo.version;
    }

    public String getUrl() {
        parseSysValue();
        return versionInfo==null?null:versionInfo.url;
    }

    public String getUpdateOption() {
        parseSysValue();
        return versionInfo==null?null:versionInfo.updateOption;
    }



    private void parseSysValue() {
        if (!TextUtils.isEmpty(sysValue) && versionInfo == null) {
            Gson gson = new Gson();
            versionInfo = gson.fromJson(sysValue, SysValue.class);
        }
        Log.d("aa", "parseSysValue: ");
    }


    class SysValue {
        private String version;//1.2.0 用于和app版本名比较
        private String url;//下载地址
        private String updateOption;//force 是强制下载,manual 手动下载
    }
}
