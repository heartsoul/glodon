package com.glodon.bim.basic.utils;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.MediaStore;
import android.support.v4.content.FileProvider;

import java.io.File;

/**
 * 描述：相机工具类
 * 作者：zhourf on 2017/10/9
 * 邮箱：zhourf@glodon.com
 */

public class CameraUtil {

    /**
     * 应用程序文件夹名称
     **/
    public static String APP_DIR_NAME = "bmMobile";
    public static String DIR_APP_NAME = Environment.getExternalStorageDirectory()
            .getAbsolutePath() + "/" + APP_DIR_NAME;
    public static String DIR_APP_CACHE_CAMERA = DIR_APP_NAME + "/camera/";

    public static void openCamera(String filepath, Activity activity, int resultCode) {
        File file = new File(DIR_APP_CACHE_CAMERA);
        if (!file.exists()) {
            file.mkdirs();
        }
        File imageFile = new File(filepath);
        Intent intent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
        if (Build.VERSION.SDK_INT > Build.VERSION_CODES.M) {
            // 添加这一句表示对目标应用临时授权该Uri所代表的文件
            intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            // 第二参数是在manifest.xml定义 provider的authorities属性
            Uri photoURI = FileProvider.getUriForFile(activity,
                    activity.getPackageName() + ".fileProvider", imageFile);
            // 将拍取的照片保存到指定URI
            intent.putExtra(MediaStore.EXTRA_OUTPUT, photoURI);
        } else {
            // 将拍取的照片保存到指定URI
            intent.putExtra(MediaStore.EXTRA_OUTPUT, Uri.fromFile(imageFile));
        }
        activity.startActivityForResult(intent, resultCode);
    }

    /**
     * 得到当前拍照的图片名称
     *
     * @return 返回照片名称
     */
    private static String getCameraName() {
        return "c" + System.currentTimeMillis();
    }

    public static String getFilePath(){
//        return DIR_APP_CACHE_CAMERA+getCameraName()+".jpg";
        return Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DCIM).getAbsolutePath()+"/"+getCameraName()+".jpg";
    }

    //刷新系统相册
    public static void frushStyemDCIM(Context context,String path) {
        //插入系统图库
//        try {
//            File file = new File(path);
//            MediaStore.Images.Media.insertImage(context.getContentResolver(),
//                    file.getAbsolutePath(), file.getName(), null);
//        } catch (FileNotFoundException e) {
//            e.printStackTrace();
//        }


        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {//如果是4.4及以上版本
            //更新系统图库 某一个文件
            context.sendBroadcast(new Intent(Intent.ACTION_MEDIA_SCANNER_SCAN_FILE, Uri.fromFile(new File(path))));
        } else {
            //更新系统图库  所有文件
            context.sendBroadcast(new Intent(
                    Intent.ACTION_MEDIA_MOUNTED,
                    Uri.parse("file://"
                            + Environment.getExternalStorageDirectory())));
        }
    }
}
