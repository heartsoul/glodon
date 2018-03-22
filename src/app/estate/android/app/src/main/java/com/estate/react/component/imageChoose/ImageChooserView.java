package com.estate.react.component.imageChoose;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.support.annotation.Nullable;
import android.support.v4.content.LocalBroadcastManager;
import android.text.TextUtils;
import android.util.AttributeSet;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.ImageView;
import android.widget.LinearLayout;

import com.estate.R;
import com.glodon.bim.basic.image.ImageLoader;
import com.glodon.bim.basic.utils.LinkedHashList;
import com.glodon.bim.customview.album.AlbumConfig;
import com.glodon.bim.customview.album.AlbumData;
import com.glodon.bim.customview.album.AlbumEditActivity;
import com.glodon.bim.customview.album.ImageItem;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by cwj on 2018/3/22.
 * Description:ImageChooserView
 */

public class ImageChooserView extends LinearLayout {
    private LocalBroadcastManager broadcastManager;

    //图片描述
    private LinearLayout mPhotoParent;
    private ImageView mPhoto0, mPhoto1, mPhoto2, mPhoto3;

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

    private void init() {
        LayoutInflater.from(getContext()).inflate(R.layout.layout_image_chooser, this);
        mPhotoParent = findViewById(R.id.create_check_list_photo_parent);
        mPhoto0 = findViewById(R.id.create_check_list_photo_0);
        mPhoto1 = findViewById(R.id.create_check_list_photo_1);
        mPhoto2 = findViewById(R.id.create_check_list_photo_2);
        mPhoto3 = findViewById(R.id.create_check_list_photo_3);
        registerReceiver();


        setPhoto();
    }

    private void unRegisterReceiver() {
        try {
            if (mReceiver != null) {
                getContext().unregisterReceiver(mReceiver);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    public void setPhoto() {
        if (AlbumConfig.albumData != null) {
            LinkedHashList<String, ImageItem> mSelectedMap = AlbumConfig.albumData.map;
            List<ImageView> list = new ArrayList<>();
            list.add(mPhoto0);
            list.add(mPhoto1);
            list.add(mPhoto2);
            list.add(mPhoto3);
            for (ImageView imageView : list) {
                imageView.setBackgroundDrawable(null);
                imageView.setImageResource(0);
            }
            int position = 0;
            for (ImageItem entry : mSelectedMap.getValueList()) {
                ImageItem item = entry;
                String url = item.thumbnailPath;
                if (TextUtils.isEmpty(url)) {
                    url = item.imagePath;
                }
                ImageLoader.showImageCenterCrop(getContext(), url, list.get(position), R.mipmap.ic_launcher);
                list.get(position).setOnClickListener(null);
                position++;
            }

            list.get(position).setBackgroundDrawable(getResources().getDrawable(R.mipmap.icon_add_picture));
            list.get(position).setOnClickListener(new OnClickListener() {
                @Override
                public void onClick(View v) {
                    Intent intent = new Intent(getContext(), AlbumEditActivity.class);
                    getContext().startActivity(intent);
                }
            });

        } else {
            mPhoto0.setBackgroundDrawable(getResources().getDrawable(R.mipmap.icon_add_picture));
            mPhoto0.setOnClickListener(new OnClickListener() {
                @Override
                public void onClick(View v) {
                    Intent intent = new Intent(getContext(), AlbumEditActivity.class);
                    getContext().startActivity(intent);
                }
            });
        }
    }

    private void registerReceiver() {

        IntentFilter intentFilter = new IntentFilter();

        // 2. 设置接收广播的类型
        intentFilter.addAction(AlbumConfig.ACTION_REFRESH_ALBUM_VIEW);

        // 3. 动态注册：调用Context的registerReceiver（）方法
        getContext().registerReceiver(mReceiver, intentFilter);


//        broadcastManager = LocalBroadcastManager
//                .getInstance(getContext());
//        IntentFilter intentFilter = new IntentFilter();
//        intentFilter.addAction(AlbumConfig.ACTION_REFRESH_ALBUM_VIEW);
//        broadcastManager.registerReceiver(mReceiver, intentFilter);
    }

    private final BroadcastReceiver mReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            if (AlbumConfig.ACTION_REFRESH_ALBUM_VIEW.equals(intent.getAction())) {
                setPhoto();
//                unRegisterReceiver();
            }
        }
    };

}
