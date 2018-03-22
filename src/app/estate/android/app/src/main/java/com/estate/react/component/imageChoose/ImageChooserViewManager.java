package com.estate.react.component.imageChoose;

import android.graphics.Color;
import android.view.View;

import com.estate.react.component.imageChoose.ImageChooserView;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.RCTEventEmitter;

import java.util.Map;

import javax.annotation.Nullable;

/**
 * Created by cwj on 2018/3/22.
 * Description:ImageChooserViewManager
 */

public class ImageChooserViewManager extends ViewGroupManager<ImageChooserView> {

    public static final String REACT_CLASS = "GLDPhoto";
    private static final int CHANGE_COLOR = 1;

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected ImageChooserView createViewInstance(ThemedReactContext reactContext) {
        ImageChooserView imageChooserView = new ImageChooserView(reactContext);

        return imageChooserView;
    }

    @Nullable
    @Override
    public Map<String, Integer> getCommandsMap() {
        return super.getCommandsMap();
    }

    @Override
    public void receiveCommand(ImageChooserView root, int commandId, @Nullable ReadableArray args) {
        super.receiveCommand(root, commandId, args);
    }

    @Nullable
    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.<String, Object>builder()
                .put("onChange", MapBuilder.of("registrationName", "onChange"))
                .build();
    }

    @Override
    protected void addEventEmitters(final ThemedReactContext reactContext, final ImageChooserView view) {
        super.addEventEmitters(reactContext, view);
        //为view绑定事件
        view.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                reactContext.getNativeModule(UIManagerModule.class).getEventDispatcher()
                        .dispatchEvent(new ImageChooserViewEvent(view.getId()));
            }
        });

    }
    @ReactProp(name = "color")
    public void setColor(ImageChooserView view, String color) {
        view.setBackgroundColor(Color.parseColor(color));
    }

    class ImageChooserViewEvent extends Event {


        public ImageChooserViewEvent(int viewTag) {
            super(viewTag);
        }

        @Override
        public String getEventName() {
            return "onChange";
        }

        @Override
        public void dispatch(RCTEventEmitter rctEventEmitter) {
            rctEventEmitter.receiveEvent(getViewTag(), getEventName(), null);
        }
    }
}

