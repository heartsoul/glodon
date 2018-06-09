package com.glodon.bim.basic.log;

import android.util.Log;

/**
 * 描述：控制台日志打印类
 * 作者：zhourf on 2017/9/8
 * 邮箱：zhourf@glodon.com
 */

public class LogUtil {

    private static String TAG = LogUtil.class.getName();
    public static void d(String msg){
        if(isShowLog()){
            Log.d(TAG,msg);
        }
    }
    public static void d(String tag, String msg) {
        if (isShowLog()) {
            Log.d(tag, msg);
        }
    }

    public static void d(String tag, String msg, Throwable t) {
        if (isShowLog()) {
            Log.d(tag, msg, t);
        }
    }

    public static void i(String tag, String msg) {
        if (isShowLog()) {
            Log.i(tag, msg);
        }
    }

    public static void i(String tag, String msg, Throwable t) {
        if (isShowLog()) {
            Log.i(tag, msg, t);
        }
    }

    public static void w(String tag, Throwable t) {
        if (isShowLog()) {
            Log.w(tag, t);
        }
    }

    public static void w(String tag, String msg) {
        if (isShowLog()) {
            Log.w(tag, msg);
        }
    }

    public static void w(String tag, String msg, Throwable t) {
        if (isShowLog()) {
            Log.w(tag, msg, t);
        }
    }

    public static void e(String msg) {
        if (isShowLog()) {
            Log.e(TAG, msg);
        }
    }

    public static void e(String tag, String msg) {
        if (isShowLog()) {
            Log.e(tag, msg);
        }
    }

    public static void e(String tag, String msg, Throwable t) {
        if (isShowLog()) {
            Log.e(tag, msg, t);
        }
    }

    /**
     * 是否显示控制台日志
     *
     * @return true 显示  false  不显示
     */
    private static boolean isShowLog() {
        return true;
    }


}
