package com.estate.react;

import com.estate.react.component.imageChoose.GLDDemoManager;
import com.estate.react.component.imageChoose.ImageChooserViewManager;
import com.estate.react.module.GLDRNBridgeModule;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Created by cwj on 2018/3/19.
 * Description:GLDReactPackage
 */

public class GLDReactPackage implements ReactPackage {

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();

        modules.add(new GLDRNBridgeModule(reactContext));
        modules.add(new ImageChooserViewManager());

        return modules;
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
//        return new ArrayList<>();
        return Arrays.<ViewManager>asList(new ImageChooserViewManager(),new GLDDemoManager());
    }
}
