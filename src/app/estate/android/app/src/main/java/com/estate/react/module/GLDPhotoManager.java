package com.estate.react.module;

import android.view.View;

import com.estate.MainApplication;
import com.estate.react.component.imageChoose.ImageChooserView;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.NativeViewHierarchyManager;
import com.facebook.react.uimanager.UIBlock;
import com.facebook.react.uimanager.UIManagerModule;

/**
 * Created by cwj on 2018/3/26.
 * Description:GLDPhotoManager 相册选择module
 */

public class GLDPhotoManager extends ReactContextBaseJavaModule {

    public static final String GLDPhotoManager = "GLDPhotoManager";


    public GLDPhotoManager(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return GLDPhotoManager;
    }

    /**
     * 选择相册后，在js中调用获取选择的图片数组
     * @param data
     * @param callback
     */
    @ReactMethod
    public void loadFile(final ReadableMap data, final Callback callback){
        UIManagerModule uiManager = MainApplication.instance.getCurrentReactContext().getNativeModule(UIManagerModule.class);
        uiManager.addUIBlock(new UIBlock() {
            public void execute (NativeViewHierarchyManager nvhm) {
                View view = nvhm.resolveView(data.getInt("handleId"));
                if (view instanceof ImageChooserView) {
                    ((ImageChooserView)view).loadFile();
                    callback.invoke(((ImageChooserView)view).loadFile());
                }
            }
        });
    }
}
