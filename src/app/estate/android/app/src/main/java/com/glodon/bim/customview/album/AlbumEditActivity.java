package com.glodon.bim.customview.album;

import android.content.Intent;
import android.os.AsyncTask;
import android.os.Bundle;
import android.support.v7.widget.DefaultItemAnimator;
import android.support.v7.widget.GridLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.View;
import android.widget.TextView;

import com.estate.R;
import com.glodon.bim.base.BaseActivity;
import com.glodon.bim.basic.utils.LinkedHashList;
import com.glodon.bim.customview.photopreview.PhotoPreviewActivity;

import java.util.List;

/**
 * 描述：相册选择
 * 作者：zhourf on 2017/9/8
 * 邮箱：zhourf@glodon.com
 */
public class AlbumEditActivity extends BaseActivity implements View.OnClickListener {

    private static final int REQUEST_CODE_PHOTO_PREVIEW = 0;
    private static final int REQUEST_CODE_CREATE_CHECK_LIST = 1;
    private TextView mNavCancel,mNavFinish;
    private View mStatusView;
    private RecyclerView mRecyclerView;
    private TextView mPreviewView;
    private AlbumEditAdapter mAdapter;
    private List<ImageItem> mDataList;
    private OnAlbumChangeListener mListener ;
    public static final String ALBUM_DATA = "albumData";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_album_edit);

        initView();

        setListener();

        initData();

    }

    private void initData() {
        new AsyncTask<Void, Void, List<ImageItem>>() {
            @Override
            protected List<ImageItem> doInBackground(Void... voids) {
                return new AlbumUtils(mActivity).getImageList();
            }

            @Override
            protected void onPostExecute(List<ImageItem> list) {
                super.onPostExecute(list);
                mDataList = list;
                mAdapter.upateData(mDataList);
            }
        }.execute();
    }


    private void initView() {
        mNavCancel = (TextView) findViewById(R.id.album_edit_nav_cancel);
        mNavFinish = (TextView) findViewById(R.id.album_edit_nav_finish);
        mStatusView = findViewById(R.id.album_edit_status_view);
        mRecyclerView = (RecyclerView) findViewById(R.id.album_edit_recyclerview);
        mPreviewView = (TextView) findViewById(R.id.album_edit_preview);

        initStatusBar(mStatusView);
        initRecyclerView();
    }

    private void setListener() {
        mNavCancel.setOnClickListener(this);
        mNavFinish.setOnClickListener(this);
        mPreviewView.setOnClickListener(this);
    }

    private void initRecyclerView(){

        mRecyclerView.setItemAnimator(new DefaultItemAnimator());
        mRecyclerView.setVerticalScrollBarEnabled(true);
        GridLayoutManager manager = new GridLayoutManager(this,4);
        mRecyclerView.setLayoutManager(manager);
        mListener = new OnAlbumChangeListener() {
            @Override
            public void onChange(LinkedHashList<String, ImageItem> map) {
                if(map.size()==0){
                    mNavFinish.setText("完成");
                }else{
                    mNavFinish.setText("完成("+map.size()+")");
                }
            }
        };
        mAdapter = new AlbumEditAdapter(this, mListener);
        //设置选中后的数量
        AlbumData data = (AlbumData) getIntent().getSerializableExtra(ALBUM_DATA);
        if(data!=null) {
            LinkedHashList<String, ImageItem> map = data.map;
            if(map.size()==0){
                mNavFinish.setText("完成");
            }else{
                mNavFinish.setText("完成("+map.size()+")");
            }
        }
        mAdapter.setSelectedMap(data);
        mRecyclerView.setAdapter(mAdapter);
    }


    @Override
    public void onClick(View view) {
        int id = view.getId();
        switch (id){
            case R.id.album_edit_nav_cancel:
                finish();
                break;
            case R.id.album_edit_nav_finish:
                AlbumConfig.albumData = mAdapter.getSelectedImages();
                Intent intent1 = new Intent();
//对应BroadcastReceiver中intentFilter的action
                intent1.setAction(AlbumConfig.ACTION_REFRESH_ALBUM_VIEW);
//发送广播
                sendBroadcast(intent1);

//                sendBroadcast(new Intent(AlbumConfig.ACTION_REFRESH_ALBUM_VIEW));
                finish();
                break;
            case R.id.album_edit_preview:
                Intent intent = new Intent(mActivity, PhotoPreviewActivity.class);
                intent.putExtra(ALBUM_DATA,mAdapter.getSelectedImages());
                startActivityForResult(intent,REQUEST_CODE_PHOTO_PREVIEW);
                break;
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        switch (requestCode)
        {
            case REQUEST_CODE_PHOTO_PREVIEW:
                if(resultCode == RESULT_OK && data!=null) {
                    AlbumData albumdata = (AlbumData) data.getSerializableExtra(ALBUM_DATA);
                    if(albumdata!=null)
                    {
                        mAdapter=new AlbumEditAdapter(mActivity,mListener);
                        mAdapter.setSelectedMap(albumdata);
                        mRecyclerView.setAdapter(mAdapter);
                        mAdapter.upateData(mDataList);

                        LinkedHashList<String, ImageItem> map = albumdata.map;
                        if(map.size()==0){
                            mNavFinish.setText("完成");
                        }else{
                            mNavFinish.setText("完成("+map.size()+")");
                        }
                    }
                }
                break;
        }
    }
}
