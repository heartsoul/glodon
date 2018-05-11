package com.estate.react.module;

import android.app.Activity;
import android.content.Intent;
import android.view.View;

import com.estate.MainApplication;
import com.estate.react.Constants;
import com.estate.react.component.imageChoose.ImageChooserView;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.NativeViewHierarchyManager;
import com.facebook.react.uimanager.UIBlock;
import com.facebook.react.uimanager.UIManagerModule;
import com.glodon.bim.common.CommonConfig;
import com.glodon.bim.customview.album.AlbumConfig;
import com.glodon.bim.customview.album.AlbumData;
import com.glodon.bim.customview.album.AlbumEditActivity;
import com.glodon.bim.customview.album.ImageItem;
import com.glodon.bim.basic.utils.CameraUtil;
import com.glodon.bim.business.qualityManage.view.PhotoEditActivity;

import java.io.File;

/**
 * Created by cwj on 2018/3/26.
 * Description:GLDPhotoManager 相册选择module
 */

public class GLDPhotoManager extends ReactContextBaseJavaModule {

    public static final String GLDPhotoManager = "GLDPhotoManager";

    private String mPhotoPath;

    public GLDPhotoManager(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return GLDPhotoManager;
    }

    /**
     * 选择相册后，在js中调用获取选择的图片数组
     *
     * @param data
     * @param callback
     */
    @ReactMethod
    public void loadFile(final ReadableMap data, final Callback callback) {
        UIManagerModule uiManager = MainApplication.instance.getCurrentReactContext().getNativeModule(UIManagerModule.class);
        uiManager.addUIBlock(new UIBlock() {
            public void execute(NativeViewHierarchyManager nvhm) {
                View view = nvhm.resolveView(data.getInt("handleId"));
                if (view instanceof ImageChooserView) {
                    ((ImageChooserView) view).loadFile();
                    callback.invoke(((ImageChooserView) view).loadFile());
                }
            }
        });
    }

    /**
     * 拍照
     *
     * @param callback
     */
    @ReactMethod
    public void takePhoto(final Callback callback) {

        MainApplication.instance.getCurrentReactContext().addActivityEventListener(new ActivityEventListener() {
            @Override
            public void onActivityResult(final Activity activity, int requestCode, int resultCode, Intent data) {
                if (Constants.REQUEST_CODE_TAKE_PHOTO == requestCode && resultCode == Activity.RESULT_OK) {
                    editPhoto(mPhotoPath);
                }
                if (Constants.REQUEST_CODE_EDIT_PHOTO == requestCode && resultCode == Activity.RESULT_OK && data != null) {
                    String savePath = data.getStringExtra(CommonConfig.IAMGE_SAVE_PATH);
                    WritableArray files = Arguments.createArray();
                    File file = new File(savePath);
                    long length = file.length();
                    String name = file.getName();
                    WritableMap writableMap = Arguments.createMap();
                    writableMap.putString("path", savePath);
                    writableMap.putString("name", name);
                    writableMap.putString("length", length + "");
                    files.pushMap(writableMap);
                    MainApplication.instance.getCurrentReactContext().removeActivityEventListener(this);
                    callback.invoke(files, true);
                }
            }

            @Override
            public void onNewIntent(Intent intent) {

            }
        });
        tokePhoto();
    }

    private void editPhoto(String mPhotoPath) {
        Intent intent = new Intent(MainApplication.instance.getCurrentReactContext(), PhotoEditActivity.class);
        intent.putExtra(CommonConfig.IMAGE_PATH, mPhotoPath);
        MainApplication.instance.getCurrentReactContext().getCurrentActivity().startActivityForResult(intent, Constants.REQUEST_CODE_EDIT_PHOTO);
    }


    private void tokePhoto() {
        mPhotoPath = CameraUtil.getFilePath();
        CameraUtil.openCamera(mPhotoPath, MainApplication.instance.getCurrentReactContext().getCurrentActivity(), Constants.REQUEST_CODE_TAKE_PHOTO);
    }

    /**
     * 进入相册选择图片
     *
     * @param callback
     */
    @ReactMethod
    public void pickerImages(final Callback callback) {
        MainApplication.instance.getCurrentReactContext().addActivityEventListener(new ActivityEventListener() {
            @Override
            public void onActivityResult(final Activity activity, int requestCode, int resultCode, Intent data) {
                if (Constants.REQUEST_CODE_TAKE_PHOTO == requestCode && resultCode == Activity.RESULT_OK && data != null) {
                    AlbumData albumData = (AlbumData) data.getSerializableExtra(AlbumConfig.ALBUM_DATA_KEY);
                    MainApplication.instance.getCurrentReactContext().removeActivityEventListener(this);
                    callback.invoke(parseFile(albumData), true);
                }
            }

            @Override
            public void onNewIntent(Intent intent) {

            }
        });
        Intent intent = new Intent(MainApplication.instance.getCurrentReactContext(), AlbumEditActivity.class);
        MainApplication.instance.getCurrentReactContext().getCurrentActivity().startActivityForResult(intent, Constants.OPEN_ALBUM_REQUEST_CODE);

    }

    private WritableArray parseFile(AlbumData albumData) {
        WritableArray files = Arguments.createArray();
        if (albumData != null && albumData.map != null) {
            for (ImageItem entry : albumData.map.getValueList()) {
                File file = new File(entry.imagePath);
                long length = file.length();
                String name = file.getName();
                WritableMap data = Arguments.createMap();
                data.putString("path", entry.imagePath);
                data.putString("name", name);
                data.putString("length", length + "");
                files.pushMap(data);
            }
        }
        return files;
    }
}
