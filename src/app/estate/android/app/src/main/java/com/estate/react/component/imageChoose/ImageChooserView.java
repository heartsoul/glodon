package com.estate.react.component.imageChoose;

import android.content.Context;
import android.support.annotation.Nullable;
import android.util.AttributeSet;
import android.view.LayoutInflater;
import android.widget.LinearLayout;

import com.estate.R;

/**
 * Created by cwj on 2018/3/22.
 * Description:ImageChooserView
 */

public class ImageChooserView extends LinearLayout {

    public ImageChooserView(Context context) {
        super(context);
        init();
    }

    public ImageChooserView(Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
        init();
    }

    public ImageChooserView(Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init();
    }

    private void init(){
        LayoutInflater.from(getContext()).inflate(R.layout.layout_image_chooser,this);
    }
}
