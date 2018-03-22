package com.estate.react.module;

import android.text.TextUtils;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.Map;

/**
 * Created by cwj on 2018/3/19.
 * Description:GLDRNBridgeModule <br/>
 * 参数合法的数据格式为 {"caller":"gldrn","name":"version","ver":"1.0","data":{}}}
 */

public class GLDRNBridgeModule extends ReactContextBaseJavaModule {

    public static final String GLDRNBridgeModule = "GLDRNBridgeModule";

    public GLDRNBridgeModule(ReactApplicationContext reactContext) {
        super(reactContext);

    }

    @Override
    public String getName() {
        return GLDRNBridgeModule;
    }

    @ReactMethod
    public void RNInvokeOCCallBack(ReadableMap data, Callback callback) {
        api_execute(data, callback);
    }

    private void api_execute(ReadableMap data, Callback callback) {
        Map<String, Object> map = data.toHashMap();

        CheckMapValid checkMapValid = new CheckMapValid(map);
        if (map == null) {
            callback.invoke("非法调用", map);
        } else {
            String apiMethod = "api_" + checkMapValid.getCallName();
            ModuleExecuteMethod moduleExecuteMethod = new ModuleExecuteMethod();
            //获取方法
            Method m = null;
            try {
                m = ModuleExecuteMethod.class.getDeclaredMethod(apiMethod, ReadableMap.class, Callback.class);
                m.invoke(moduleExecuteMethod, data,callback);
            } catch (NoSuchMethodException e) {
                e.printStackTrace();
            } catch (IllegalAccessException e) {
                e.printStackTrace();
            } catch (InvocationTargetException e) {
                e.printStackTrace();
            }
        }
    }

    class CheckMapValid {
        public final String RNAPI_CALLER = "gldrn";
        public final String RNAPI_version = "version";
        public final String RNAPI_alert = "alert";
        public final String RNAPI_test = "test";
        public final String RNAPI_push = "push";
        public final String RNAPI_present = "present";
        public final String RNAPI_clearCookie = "clearCookie";
        public final String RNAPI_saveCookie = "saveCookie";
        public final String RNAPI_callNative = "callNative"; // 调用原生功能

        Map<String, Object> data;

        public CheckMapValid(Map<String, Object> data) {
            this.data = data;
        }

        // 合法的数据格式为 {"caller":"gldrn","name":"version","ver":"1.0","data":{}}}
        private boolean isValidCallData() {
            String caller = getCaller();
            String callName = getCallName();
            return TextUtils.isEmpty(caller) && caller.equals(RNAPI_CALLER) && TextUtils.isEmpty(callName);
        }

        // 调用者 这里必须是 gldrn
        private String getCaller() {
            Object ret = data.get("caller");
            if (ret instanceof String) {
                return (String) ret;
            }
            return null;
        }

        // 调用的api 名
        private String getCallName() {
            Object ret = (String) data.get("name");
            if (ret instanceof String) {
                return (String) ret;
            }
            return null;
        }

        // api的版本信息
        private String getVersion() {
            Object ret = (String) data.get("ver");
            if (ret instanceof String) {
                return (String) ret;
            }
            return null;
        }

        // 数据对象，这个与业务相关，但必须是字典对象，不支持其它类型的对象
        private Map<String, Object> getCallData() {
            Object ret = data.get("data");
            if (ret instanceof Map) {
                return (Map<String, Object>) ret;
            }
            return null;
        }

    }


}
