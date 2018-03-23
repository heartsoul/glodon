package com.glodon.bim.customview.photopreview;

import android.app.Activity;
import android.support.v4.view.PagerAdapter;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.estate.R;
import com.glodon.bim.basic.image.ImageLoader;
import com.glodon.bim.customview.album.ImageItem;
import com.glodon.bim.customview.imageview.ScaleImageView;

import java.util.List;

/**
 * 描述：图片预览
 * 作者：zhourf on 2017/11/2
 * 邮箱：zhourf@glodon.com
 */

public class PhotoPreviewAdapter extends PagerAdapter {

    private List<ImageItem> mDataList;
    private Activity mActivity;

    public PhotoPreviewAdapter(List<ImageItem> mDataList, Activity mActivity) {
        this.mDataList = mDataList;
        this.mActivity = mActivity;
    }

    public void updateData(List<ImageItem> mDataList){
        this.mDataList = mDataList;
        notifyDataSetChanged();
    }

    @Override
    public int getCount() {

        return mDataList.size();
    }

    @Override
    public boolean isViewFromObject(View view, Object object) {
        return view == object;
    }

    @Override
    public Object instantiateItem(ViewGroup container, int position) {
        View view = LayoutInflater.from(mActivity).inflate(R.layout.quality_photo_preview_item_view,null);
        ScaleImageView imageview = view.findViewById(R.id.photo_preview_item_view_iv);
        String url = mDataList.get(position).imagePath;
//        if(url.startsWith("http")){
//            UploadManger.loadOriginalUrl(mActivity,mDataList.get(position).objectId,imageview);
//        }else{
            ImageLoader.showPreviewImage(mActivity,url,imageview);
//        }

        container.addView(view);
        return view;
    }

    @Override
    public void destroyItem(ViewGroup container, int position, Object object) {
        container.removeView((View) object);
    }
}
