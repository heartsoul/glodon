package com.glodon.bim.customview.photopreview;

import android.content.Intent;
import android.os.Bundle;
import android.support.v4.view.ViewPager;
import android.view.View;
import android.view.WindowManager;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.estate.R;
import com.glodon.bim.base.BaseActivity;
import com.glodon.bim.basic.utils.LinkedHashList;
import com.glodon.bim.customview.album.AlbumData;
import com.glodon.bim.customview.album.ImageItem;

import java.util.ArrayList;
import java.util.List;

/**
 * 描述：图片预览
 * 作者：zhourf on 2017/9/8
 * 邮箱：zhourf@glodon.com
 */
public class PhotoPreviewActivity extends BaseActivity implements View.OnClickListener {

    private RelativeLayout mBackView;
    private RelativeLayout mDeleteView;
    private TextView mTitleView;
    private ViewPager mPagerView;
    private List<ImageItem> mDataList;
    private PhotoPreviewAdapter mAdapter;
    private int mSelectedPosition ;
    private boolean mIsShowDelete=true;
    public static final String ALBUM_POSITION = "albumPosition";
    public static final String ALBUM_DATA = "albumData";
    public static final String ALBUM_SHOW_DELETE = "albumShowDelete";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
//        requestWindowFeature(Window.FEATURE_NO_TITLE);
        //设置全屏
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
                WindowManager.LayoutParams.FLAG_FULLSCREEN);
        setContentView(R.layout.activity_photo_preview);

        initView();

        setListener();

        initData();
    }

    private void initData() {
        mDataList = new ArrayList<>();
        mSelectedPosition = getIntent().getIntExtra(ALBUM_POSITION,0);
        AlbumData mAlbumData = (AlbumData) getIntent().getSerializableExtra(ALBUM_DATA);
        mIsShowDelete = getIntent().getBooleanExtra(ALBUM_SHOW_DELETE,true);
        mDeleteView.setVisibility(mIsShowDelete?View.VISIBLE:View.GONE);
        if(mAlbumData!=null && mAlbumData.map!=null && mAlbumData.map.size()>0)
        {
            for(ImageItem entry:mAlbumData.map.getValueList()){
                mDataList.add(entry);
            }
        }
        mAdapter = new PhotoPreviewAdapter(mDataList,this);
        mPagerView.setOffscreenPageLimit(3);
        mPagerView.setAdapter(mAdapter);
        mPagerView.setCurrentItem(mSelectedPosition);
        showTitle();
    }

    private void initView() {
        mBackView = (RelativeLayout) findViewById(R.id.photo_preview_back);
        mDeleteView = (RelativeLayout) findViewById(R.id.photo_preview_delete);
        mTitleView = (TextView) findViewById(R.id.photo_preview_title);
        mPagerView = (ViewPager) findViewById(R.id.photo_preview_viewpager);
    }

    private void setListener() {
        mBackView.setOnClickListener(this);
        mDeleteView.setOnClickListener(this);
        mPagerView.addOnPageChangeListener(new ViewPager.OnPageChangeListener() {
            @Override
            public void onPageScrolled(int position, float positionOffset, int positionOffsetPixels) {

            }

            @Override
            public void onPageSelected(int position) {
                mSelectedPosition = position;
                showTitle();
            }

            @Override
            public void onPageScrollStateChanged(int state) {

            }
        });
    }

    private void showTitle(){
        mTitleView.setText((mSelectedPosition+1)+"/"+mDataList.size());
    }

    @Override
    public void onClick(View view) {
        int id = view.getId();
        switch (id)
        {
            case R.id.photo_preview_back:
                backData();
                break;
            case R.id.photo_preview_delete:
                if(mDataList.size()>1) {
                    int oldPosition = mSelectedPosition;
                    if(oldPosition==mDataList.size()-1){
                        oldPosition--;
                    }
                    mDataList.remove(mSelectedPosition);
                    mAdapter = new PhotoPreviewAdapter(mDataList,mActivity);
                    mPagerView.setAdapter(mAdapter);
                    mPagerView.setCurrentItem(oldPosition);
                    mSelectedPosition = oldPosition;
                    showTitle();
                }else{
                    mDataList.remove(mSelectedPosition);
                    backData();
                }
                break;

        }
    }

    @Override
    public void onBackPressed() {
        backData();
    }

    private void backData(){
        Intent data = new Intent();
        LinkedHashList<String,ImageItem> map = new LinkedHashList<>();
        if(mDataList.size()>0){
            for(ImageItem item:mDataList)
            {
                map.put(item.imagePath,item);
            }
        }
        data.putExtra(ALBUM_DATA,new AlbumData(map));
        setResult(RESULT_OK,data);
        finish();
    }
}
