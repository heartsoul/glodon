package com.estate;

import android.graphics.Color;
import android.view.View;
import android.widget.Toast;

import com.facebook.drawee.backends.pipeline.Fresco;
import com.facebook.drawee.components.DraweeEventTracker;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.facebook.react.views.image.ReactImageView;

import java.util.Map;

import javax.annotation.Nullable;

/**
 * Created by cwj on 2018/3/22.
 * Description:MyCustomViewManager
 */

public class MyCustomViewManager extends SimpleViewManager<MyCustomView> {
    public static final String REACT_CLASS = "MyCustomView";
    private static final int CHANGE_COLOR = 1;

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected MyCustomView createViewInstance(final ThemedReactContext reactContext) {
        final MyCustomView view = new MyCustomView(reactContext);
        view.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Toast.makeText(reactContext, "afds", Toast.LENGTH_SHORT).show();
                WritableMap nativeEvent = Arguments.createMap();
                nativeEvent.putString("message","MyMessage");
                reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(view.getId(),"topChange",nativeEvent);


//                reactContext.getNativeModule(UIManagerModule.class).getEventDispatcher()
//                        .dispatchEvent(new ClickEvent(view.getId()));
            }
        });

        return view;
    }

    @ReactProp(name = "color")
    public void setColor(MyCustomView view, String color) {
        view.setColor(Color.parseColor(color));
    }

    @Nullable
    @Override
    public Map<String, Integer> getCommandsMap() {
        return MapBuilder.of("changeColor",CHANGE_COLOR);
    }

    @Override
    public void receiveCommand(MyCustomView root, int commandId, @Nullable ReadableArray args) {
        switch (commandId) {
            case CHANGE_COLOR:
                root.changeColor();
                break;
        }

    }

    @Nullable
    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.<String, Object>builder()
                .put("changeColor", MapBuilder.of("registrationName", "onChangeClolr"))
                .build();
    }

    @Override
    protected void addEventEmitters(final ThemedReactContext reactContext, final MyCustomView view) {
        super.addEventEmitters(reactContext, view);

    }

    class ClickEvent extends Event{


        public ClickEvent(int viewTag) {
            super(viewTag);
        }

        @Override
        public String getEventName() {
            return "topClick";
        }

        @Override
        public void dispatch(RCTEventEmitter rctEventEmitter) {
            rctEventEmitter.receiveEvent(getViewTag(),getEventName(),null);
        }
    }
}
