package com.estate.react.component.imageChoose;

import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.support.annotation.Nullable;
import android.support.v4.content.LocalBroadcastManager;
import android.text.TextUtils;
import android.util.AttributeSet;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.Toast;

import com.estate.MainApplication;
import com.estate.R;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.glodon.bim.basic.image.ImageLoader;
import com.glodon.bim.basic.utils.LinkedHashList;
import com.glodon.bim.customview.album.AlbumConfig;
import com.glodon.bim.customview.album.AlbumData;
import com.glodon.bim.customview.album.AlbumEditActivity;
import com.glodon.bim.customview.album.ImageItem;
import com.glodon.bim.customview.photopreview.PhotoPreviewActivity;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by cwj on 2018/3/22.
 * Description:ImageChooserView
 */

public class ImageChooserView extends LinearLayout {
    private LocalBroadcastManager broadcastManager;
    public static final int OPEN_ALBUM_REQUEST_CODE = 0X1000;
    public static final int REQUEST_CODE_PHOTO_PREVIEW = 0X1001;


    //图片描述
    private LinearLayout mPhotoParent;
    private ImageView mPhoto0, mPhoto1, mPhoto2, mPhoto3;
    private Activity activity;

    private String tag;
    private AlbumData albumData = null;//选中的图片数据
    public ReadableArray originalData;//从rn传过来的数据

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

        addActivityEventListener();

        setPhoto();
        tag = this.toString();
    }

    public void setPhoto() {
        if (albumData != null) {
            LinkedHashList<String, ImageItem> mSelectedMap = albumData.map;
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
                list.get(position).setOnClickListener(new OpenPreViewListener(position));
                position++;
            }

            list.get(position).setBackgroundDrawable(getResources().getDrawable(R.mipmap.icon_add_picture));
            list.get(position).setOnClickListener(openAlbumListener);
            if(position == 3){
                list.get(position).setVisibility(View.GONE);
            }else{
                list.get(position).setVisibility(View.VISIBLE);
            }
        } else {
            mPhoto0.setBackgroundDrawable(getResources().getDrawable(R.mipmap.icon_add_picture));
            mPhoto0.setOnClickListener(openAlbumListener);
        }
    }
    class  OpenPreViewListener implements OnClickListener {
        private int position;

        public OpenPreViewListener(int position) {
            this.position = position;
        }

        @Override
        public void onClick(View v) {
            Intent intent = new Intent(getContext(), PhotoPreviewActivity.class);
            intent.putExtra(AlbumConfig.ALBUM_DATA_KEY, albumData);
            intent.putExtra(AlbumConfig.ALBUM_POSITION, position);
            activity.startActivityForResult(intent, REQUEST_CODE_PHOTO_PREVIEW);
        }
    };

    private OnClickListener openAlbumListener = new OnClickListener() {
        @Override
        public void onClick(View v) {
            Intent intent = new Intent(getContext(), AlbumEditActivity.class);
            if (albumData != null) {
                intent.putExtra(AlbumConfig.ALBUM_DATA_KEY, albumData);
            }
            if (activity != null) {
                intent.putExtra("chooserView", tag);
                activity.startActivityForResult(intent, OPEN_ALBUM_REQUEST_CODE);
            }
        }
    };


    public void setActivity(Activity activity) {
        this.activity = activity;
    }

    public void addActivityEventListener() {
        MainApplication.instance.getCurrentReactContext().addActivityEventListener(new ActivityEventListener() {
            @Override
            public void onActivityResult(final Activity activity, int requestCode, int resultCode, Intent data) {
                if (OPEN_ALBUM_REQUEST_CODE == requestCode && resultCode == Activity.RESULT_OK) {
                    String chooserView = data.getStringExtra("chooserView");
                    if (chooserView != null && chooserView.equals(tag)) {
                        albumData = (AlbumData) data.getSerializableExtra(AlbumConfig.ALBUM_DATA_KEY);
                        setPhoto();
                    }
                }else  if (REQUEST_CODE_PHOTO_PREVIEW == requestCode && resultCode == Activity.RESULT_OK  && data != null) {
                    albumData = (AlbumData) data.getSerializableExtra(AlbumConfig.ALBUM_DATA_KEY);
                    setPhoto();
                }
            }

            @Override
            public void onNewIntent(Intent intent) {

            }
        });
    }

    /**
     * 图片数组
     *
     * @return
     */
    public WritableArray loadFile() {
        WritableArray files = Arguments.createArray();
        if (albumData != null && albumData.map != null) {
            for (ImageItem entry : albumData.map.getValueList()) {
                if (entry.originalIndex >= 0 && originalData != null) {
                    WritableMap data = Arguments.createMap();
                    data.merge(originalData.getMap(entry.originalIndex));
                    files.pushMap(data);
                }else{
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
        }
        return files;
    }

    public void setFiles(ReadableArray array) {
        originalData = array;
        if (array != null && array.size() > 0) {

            if(albumData == null){
                albumData = new AlbumData(null);
            }
            LinkedHashList<String, ImageItem> mSelectedMap = new LinkedHashList<>();
            for (int i = 0; i < array.size(); i++) {
                ReadableMap readableMap = array.getMap(i);
                ImageItem imageItem = new ImageItem();
                imageItem.imagePath = readableMap.getString("url");
                imageItem.originalIndex = i;
                mSelectedMap.put(imageItem.imagePath,imageItem);
            }
            albumData.map = mSelectedMap;
            setPhoto();
        }
    }
}
