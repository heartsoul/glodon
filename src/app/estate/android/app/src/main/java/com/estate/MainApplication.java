package com.estate;

import android.app.Application;
import android.content.SharedPreferences;
import android.preference.PreferenceManager;

import com.estate.react.GLDReactPackage;
import com.facebook.react.ReactApplication;
import io.realm.react.RealmReactPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.rnziparchive.RNZipArchivePackage;
import com.rnfs.RNFSPackage;

import io.realm.react.RealmReactPackage;

import com.glodon.bim.business.offline.model.server.ServerModulePackage;
import com.rnziparchive.RNZipArchivePackage;
import com.rnfs.RNFSPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.glodon.bim.basic.utils.ScreenUtil;
import com.umeng.commonsdk.UMConfigure;
import com.umeng.socialize.PlatformConfig;
import com.umeng.socialize.UMShareAPI;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

    {
        PlatformConfig.setWeixin("wxdc1e388c3822c80b", "3baf1193c85774b3fd9d18447d76cab0");
    }

    public static MainApplication instance;
    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
            new RealmReactPackage(),
            new RNFetchBlobPackage(),
                    new RNZipArchivePackage(),
                    new RNFSPackage(),
                    new RealmReactPackage(),
                    new GLDReactPackage(),
                    new ServerModulePackage()
            );
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    public ReactContext getCurrentReactContext() {
        return mReactNativeHost.getReactInstanceManager().getCurrentReactContext();
    }

    @Override
    public void onCreate() {
        super.onCreate();
        if (BuildConfig.DEBUG) {
            SharedPreferences mPreferences = PreferenceManager.getDefaultSharedPreferences(getApplicationContext());
            mPreferences.edit().putString("debug_http_host", BuildConfig.DEBUG_HOST).commit();
            mPreferences.edit().putBoolean("reload_on_js_change", true).commit();
            mPreferences.edit().putBoolean("hot_module_replacement", true).commit();
        }
        instance = this;
        ScreenUtil.init(this);
        SoLoader.init(this, /* native exopackage */ false);

        UMConfigure.setLogEnabled(true);
        UMConfigure.init(this, "58edcfeb310c93091c000be2"
                , "umeng", UMConfigure.DEVICE_TYPE_PHONE, "");//58edcfeb310c93091c000be2 5965ee00734be40b580001a0
        UMShareAPI.get(this);

    }
}
