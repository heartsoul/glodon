package com.glodon.bim.customview.album;

import android.app.Activity;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.RelativeLayout;


import com.estate.R;
import com.glodon.bim.basic.image.ImageLoader;
import com.glodon.bim.basic.utils.LinkedHashList;
import com.glodon.bim.basic.utils.ScreenUtil;

import java.util.ArrayList;
import java.util.List;

/**
 * 描述：相册选择
 * 作者：zhourf on 2017/11/1
 * 邮箱：zhourf@glodon.com
 */

public class AlbumEditAdapter extends RecyclerView.Adapter<RecyclerView.ViewHolder> {
    private Activity mActivity;
    private List<ImageItem> mDataList;
    private int w = 90;
    private LinkedHashList<String,ImageItem> mSelectedMap ;
    private int max = 3;
    private OnAlbumChangeListener mListener;

    public AlbumEditAdapter(Activity mActivity, OnAlbumChangeListener listener) {
        this.mActivity = mActivity;
        mDataList = new ArrayList<>();
        w = (ScreenUtil.getScreenInfo()[0]-ScreenUtil.dp2px(3))/4;
        mSelectedMap = new LinkedHashList<>();
        mListener = listener;
    }

    public void upateData(List<ImageItem> list){
        if(list!=null){
            mDataList.clear();
            mDataList.addAll(list);
        }
        notifyDataSetChanged();
    }

    @Override
    public RecyclerView.ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        return new ImageHolder(LayoutInflater.from(mActivity).inflate(R.layout.quality_album_edit_item_view,parent,false));
    }

    @Override
    public void onBindViewHolder(RecyclerView.ViewHolder viewholder, int position) {
        final ImageHolder holder = (ImageHolder) viewholder;
        //设置宽高
        holder.mParent.getLayoutParams().width = w;
        holder.mParent.getLayoutParams().height = w;
        //显示图片
        final ImageItem item = mDataList.get(position);
        String url = item.imagePath;
//        String url = item.thumbnailPath;
//        if(TextUtils.isEmpty(url)){
//            url = item.imagePath;
//        }
        ImageLoader.showImageCenterCrop(mActivity,url,holder.mImageView,R.mipmap.icon_default_image);

        //设置选中状态
        if(mSelectedMap.containsKey(item.imagePath)){
            holder.mSelectView.setBackgroundResource(R.mipmap.icon_album_selected);
        }else{
            holder.mSelectView.setBackgroundResource(R.mipmap.icon_album_normal);
        }
        //设置点击
        holder.mParent.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if(mSelectedMap.containsKey(item.imagePath)){
                    mSelectedMap.remove(item.imagePath);
                    holder.mSelectView.setBackgroundResource(R.mipmap.icon_album_normal);
                }else{
                    if(mSelectedMap.size()<max) {
                        mSelectedMap.put(item.imagePath, item);
                        holder.mSelectView.setBackgroundResource(R.mipmap.icon_album_selected);
                    }
                }
                if(mListener!=null){
                    mListener.onChange(mSelectedMap);
                }
            }
        });
    }

    @Override
    public int getItemCount() {
        return mDataList.size();
    }

    //获取选中的图片
    public AlbumData getSelectedImages(){
        return new AlbumData(mSelectedMap);
    }

    //设置选中的图片
    public void setSelectedMap(AlbumData data){
        if(data!=null && data.map!=null && data.map.size()>0){
            mSelectedMap = data.map;
        }
    }

    class ImageHolder extends RecyclerView.ViewHolder{

        ImageView mImageView;
        ImageView mSelectView;
        RelativeLayout mParent;
        public ImageHolder(View itemView) {
            super(itemView);
            mParent = itemView.findViewById(R.id.album_edit_item_parent);
            mImageView = itemView.findViewById(R.id.album_edit_item_image);
            mSelectView = itemView.findViewById(R.id.album_edit_item_select);
        }
    }
}
