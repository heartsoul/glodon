package com.glodon.bim.basic.config;

import com.estate.R;

/**
 * 描述：app配置信息
 * 作者：zhourf on 2017/9/8
 * 邮箱：zhourf@glodon.com
 */

public class AppConfig {

    /**
     * 控制是否生成log日志文件   true 生成  false 不生成
     */
    public static boolean LOG_ERR_SAVE = true;

    /**
     * log的存放目录
     */
    public static String BIM_LOG_DIRECTORY = "/sdcard/bimLog";

    /**
     * 头像加载时，加载过程中显示的图片
     */
    public static int LOADING_DRAWABLE = R.mipmap.ic_launcher;
    /**
     * 头像加载时，加载失败显示的图片
     */
    public static int LOADING_DRAWABLE_ERROR = R.mipmap.ic_launcher;

    /**
     * 环境的url
     */

//    public static String BASE_URL = "http://192.168.72.48/";//欧阳
    //开发环境
//    public static String BASE_UPLOAD_URL =  "https://api.glodon.com/";
//    public static String BASE_URL = "http://10.1.83.41/"; //开发
//    public static final String BASE_URL_BLUEPRINT_TOKEN = "http://47.95.204.243/app.html?param=";//图纸的url地址
    //测试环境
    public static String BASE_UPLOAD_URL =  "http://172.16.233.183:8093/";//图片上传  测试
    public static String BASE_URL = "http://10.1.83.30/"; //测试
    public static final String BASE_URL_BLUEPRINT_TOKEN = BASE_URL+"app.html?param=";//图纸的url地址

    //预生产 47.95.204.243
//    public static String BASE_UPLOAD_URL = "https://api.glodon.com/nss/";//图片上传
//    public static String BASE_URL = "http://47.95.204.243/";
//    public static final String BASE_URL_BLUEPRINT_TOKEN = BASE_URL + "app.html?param=";//图纸的url地址

    //生产 47.95.204.243
//    public static String BASE_UPLOAD_URL =  "https://api.glodon.com/nss/";//图片上传
//    public static String BASE_URL = "http://bimcop.glodon.com/";
//    public static final String BASE_URL_BLUEPRINT_TOKEN = BASE_URL+"app.html?param=";//图纸的url地址


    /*
 测试：
192.168.81.30
/usr/share/nginx/html/app
root
123qwe!@#

预发
47.95.204.243
/usr/share/nginx/html/app
deploy
jfbim+pmdeploy

生产：
 60.205.213.168
 /usr/share/nginx/html/app
 deploy
 jfbim+pmdeploy


二维码：

测试：192.168.81.30
1，生成http://10.1.83.30/app/bimcop_app_test_v1.2.0_201804020953.apk二维码
2，覆盖/usr/share/nginx/html/daily/imgs/app_qr_code.png图片

预发：
1，生成http://bimcop-test.glodon.com/app/文件名  二维码
2，覆盖/usr/share/nginx/html/最新版本号/imgs/app_qr_code.png图片


生产：
1，生成http://bimcop.glodon.com/app/bimcop_app_prod_v1.2.0_201803131051.apk文件名 二维码生产
2，覆盖/usr/share/nginx/html/最新版本号/imgs/app_qr_code.png图片
     */
}
