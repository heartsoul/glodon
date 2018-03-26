package com.estate.react.component.imageChoose;

import android.graphics.Color;
import android.text.TextUtils;
import android.view.View;
import android.widget.Button;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.RCTEventEmitter;

import java.util.Map;

/**
 * Created by cwj on 2018/3/26.
 * Description:GLDDemoManager
 */

public class GLDDemoManager extends SimpleViewManager<Button> {

    public static final String REACT_CLASS = "GLDDemo";
    public static final String NATIVE_METHOD_NAME = "onNativeChange";
    public static final String JS_METHOD_NAME = "onChange";

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected Button createViewInstance(ThemedReactContext reactContext) {
        Button button = new Button(reactContext);
        button.setText("组件测试");
        return button;
    }

    @ReactProp(name = "backgroundColor")
    public void setColor(Button button, String color) {
        button.setBackgroundColor(Color.parseColor(color));
    }

    @ReactProp(name = "title")
    public void setTitle(Button button, ReadableMap title) {
        parseTitle(button, title);

        parseColor(button, title);
    }

    private void parseTitle(Button button, ReadableMap title) {
        String text = null;
        if (title.hasKey("title")) {
            text = title.getString("title");
        }
        if (!TextUtils.isEmpty(text)) {
            button.setText(text);
        }
    }

    private void parseColor(Button button, ReadableMap title) {
        int color = 0;
        if (title.hasKey("color")) {
            color = title.getInt("color");
        }
        if (color != 0) {
            button.setTextColor(color);
        }
    }
    /**
     * 将原生模块中的onNativeChange方法映射为 JS模块的onChange属性
     */
    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.<String, Object>builder()
                .put(NATIVE_METHOD_NAME, MapBuilder.of("registrationName", JS_METHOD_NAME))
                .build();
    }

    @Override
    protected void addEventEmitters(final ThemedReactContext reactContext, final Button view) {
        super.addEventEmitters(reactContext, view);
        //为view绑定事件
        view.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //触发js中的onChange方法
                reactContext.getNativeModule(UIManagerModule.class).getEventDispatcher()
                        .dispatchEvent(new SampleButtonEvent(view.getId()));
            }
        });

    }

    class SampleButtonEvent extends Event {


        public SampleButtonEvent(int viewTag) {
            super(viewTag);
        }

        @Override
        public String getEventName() {
            return NATIVE_METHOD_NAME;
        }

        @Override
        public void dispatch(RCTEventEmitter rctEventEmitter) {
            rctEventEmitter.receiveEvent(getViewTag(), getEventName(), null);
        }
    }
}
