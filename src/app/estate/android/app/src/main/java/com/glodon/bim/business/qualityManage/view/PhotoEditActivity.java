package com.glodon.bim.business.qualityManage.view;

import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.Rect;
import android.os.Bundle;
import android.text.TextPaint;
import android.text.TextUtils;
import android.view.View;
import android.view.ViewTreeObserver;
import android.view.WindowManager;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;

import com.estate.R;
import com.glodon.bim.base.BaseActivity;
import com.glodon.bim.basic.image.ImageLoader;
import com.glodon.bim.basic.image.OnImageLoadListener;
import com.glodon.bim.basic.utils.CameraUtil;
import com.glodon.bim.basic.utils.InputMethodutil;
import com.glodon.bim.basic.utils.ScreenUtil;
import com.glodon.bim.common.CommonConfig;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * 描述：拍照后编辑
 * 作者：zhourf on 2017/9/8
 * 邮箱：zhourf@glodon.com
 */
public class PhotoEditActivity extends BaseActivity implements View.OnClickListener {

    private String mImagePath;
    private String mSavePath;

    private PhotoEditView mPhotoEditView;
    private EditText mEditText;
    private List<DragTextView> mDragTextList;
    private RelativeLayout mTopCancel, mTopFinish;
    private LinearLayout mBottomContent;
    private LinearLayout mBottomDelete;
    private LinearLayout mBottomDrawFunction;
    private ImageView mDrawLine, mDrawText;
    private View mLineView;
    private LinearLayout mBottomCancelFinishParent, mBottomCancel, mBottomFinish;
    private LinearLayout mColorParent;
    private ImageView mColor0, mColor1, mColor2, mColor3, mColor4, mColor5, mColor6, mColor7, mColorBack;
    private int softHeight = 0;//输入法高度
    private RelativeLayout rootLayout;//跟布局
    private View mColorBottomView;
    private int currentState = 0;//1划线  2写字
    private int currentColor;
    private List<ImageView> mColorList;
    private List<Integer> mColorValueList;

    private boolean isFromCreateCheckList = false;

    private String mCreateType = "-1";//创建的类型  0 检查单   1整改单  2复查单

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
//        requestWindowFeature(Window.FEATURE_NO_TITLE);
        //设置全屏
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
                WindowManager.LayoutParams.FLAG_FULLSCREEN);
        setContentView(R.layout.quality_photo_edit_activity);

        initView();

        setListener();

        getInputMethodHeight();
    }

    private void initView() {
        isFromCreateCheckList = getIntent().getBooleanExtra(CommonConfig.FROM_CREATE_CHECK_LIST, false);
        mCreateType = getIntent().getStringExtra(CommonConfig.CREATE_TYPE);
        rootLayout = (RelativeLayout) findViewById(R.id.photo_edit_root_layout);
        mImagePath = getIntent().getStringExtra(CommonConfig.IMAGE_PATH);
        mDragTextList = new ArrayList<>();
        mColorList = new ArrayList<>();
        mColorValueList = new ArrayList<>();
        mEditText = (EditText) findViewById(R.id.photo_edit_et);

        mTopCancel = (RelativeLayout) findViewById(R.id.photo_edit_top_cancel);
        mTopFinish = (RelativeLayout) findViewById(R.id.photo_edit_top_finish);

        mBottomContent = (LinearLayout) findViewById(R.id.photo_edit_bottom_content);
        mBottomDelete = (LinearLayout) findViewById(R.id.photo_edit_bottom_delete);

        mBottomDrawFunction = (LinearLayout) findViewById(R.id.photo_edit_bottom_function);
        mDrawLine = (ImageView) findViewById(R.id.photo_edit_bottom_function_draw_line);
        mDrawText = (ImageView) findViewById(R.id.photo_edit_bottom_function_draw_text);

        mLineView = findViewById(R.id.photo_edit_bottom_line);
        mBottomCancelFinishParent = (LinearLayout) findViewById(R.id.photo_edit_bottom_cancel_finish);
        mBottomCancel = (LinearLayout) findViewById(R.id.photo_edit_bottom_cancel);
        mBottomFinish = (LinearLayout) findViewById(R.id.photo_edit_bottom_finish);

        mColorParent = (LinearLayout) findViewById(R.id.photo_edit_bottom_color_parent);
        mColor0 = (ImageView) findViewById(R.id.photo_edit_bottom_color_0);
        mColor1 = (ImageView) findViewById(R.id.photo_edit_bottom_color_1);
        mColor2 = (ImageView) findViewById(R.id.photo_edit_bottom_color_2);
        mColor3 = (ImageView) findViewById(R.id.photo_edit_bottom_color_3);
        mColor4 = (ImageView) findViewById(R.id.photo_edit_bottom_color_4);
        mColor5 = (ImageView) findViewById(R.id.photo_edit_bottom_color_5);
        mColor6 = (ImageView) findViewById(R.id.photo_edit_bottom_color_6);
        mColor7 = (ImageView) findViewById(R.id.photo_edit_bottom_color_7);
        mColorBack = (ImageView) findViewById(R.id.photo_edit_bottom_color_back);

        mColorBottomView = findViewById(R.id.photo_edit_bottom_color_parent_bottomview);

        mPhotoEditView = (PhotoEditView) findViewById(R.id.photo_edit_background);
        ImageLoader.loadUrl(this, mImagePath, new OnImageLoadListener() {
            @Override
            public void onLoadBitmap(Bitmap bitmap) {
                mPhotoEditView.setImageBitmap(bitmap);
            }
        });
    }

    private void setListener() {
        //划线后的 控制回退按钮的显示
        mPhotoEditView.setmListener(new OnPhotoEditChangeListener() {
            @Override
            public void change(boolean isShowPlayBack) {
                mColorBack.setVisibility(isShowPlayBack ? View.VISIBLE : View.GONE);
            }
        });
        //初次点击划线
        mDrawLine.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                currentState = 1;
                selectById(0);
                mPhotoEditView.setIsCanDraw(true);
                mDrawLine.setBackgroundResource(R.mipmap.icon_draw_line_green);
                mTopCancel.setVisibility(View.VISIBLE);
                mTopFinish.setVisibility(View.VISIBLE);
                mColorParent.setVisibility(View.VISIBLE);
                mColorBack.setVisibility(mPhotoEditView.isShowPlayBack() ? View.VISIBLE : View.GONE);
                mBottomCancelFinishParent.setVisibility(View.GONE);
                mTopCancel.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View view) {
                        currentState = 0;
                        mPhotoEditView.setIsCanDraw(false);
                        mPhotoEditView.cancel();

                        mDrawLine.setBackgroundResource(R.mipmap.icon_draw_line_white);
                        mTopCancel.setVisibility(View.GONE);
                        mTopFinish.setVisibility(View.GONE);
                        mColorParent.setVisibility(View.GONE);
                        mBottomCancelFinishParent.setVisibility(View.VISIBLE);
                    }
                });
                mTopFinish.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View view) {
                        currentState = 0;
                        mPhotoEditView.setIsCanDraw(false);
                        mDrawLine.setBackgroundResource(R.mipmap.icon_draw_line_white);
                        mTopCancel.setVisibility(View.GONE);
                        mTopFinish.setVisibility(View.GONE);
                        mColorParent.setVisibility(View.GONE);
                        mBottomCancelFinishParent.setVisibility(View.VISIBLE);
                        //保存到本地
                        saveToLocal(mPhotoEditView);
                    }
                });
            }
        });

        //划线回退
        mColorBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                mPhotoEditView.playBack();
            }
        });

        mBottomCancel.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                mActivity.finish();
            }
        });

        mBottomFinish.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (mDragTextList.size() > 0) {
                    saveTextToImage(mPhotoEditView);
                    for (DragTextView textview : mDragTextList) {
                        textview.setVisibility(View.INVISIBLE);
                    }
                }
                if (TextUtils.isEmpty(mSavePath)) {
                    mSavePath = mImagePath;
                }
                //判断是否来自创建检查单
                Intent data = new Intent();
                data.putExtra(CommonConfig.IAMGE_SAVE_PATH, mSavePath);
                setResult(RESULT_OK, data);
                finish();
            }
        });

        //初次点击绘制文字
        mDrawText.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                currentState = 2;
                selectById(0);
                //从划线的编辑状态  直接切换到输入文字 //保存到本地
                mDrawLine.setBackgroundResource(R.mipmap.icon_draw_line_white);
                mPhotoEditView.setIsCanDraw(false);
                saveToLocal(mPhotoEditView);

                mTopCancel.setVisibility(View.VISIBLE);
                mTopFinish.setVisibility(View.VISIBLE);

                mBottomDrawFunction.setVisibility(View.GONE);
                mLineView.setVisibility(View.GONE);

                mColorParent.setVisibility(View.VISIBLE);
                mColorBack.setVisibility(View.GONE);

                mBottomCancelFinishParent.setVisibility(View.GONE);

                mEditText.setVisibility(View.VISIBLE);

                //弹起输入法
                mEditText.setFocusable(true);
                mEditText.requestFocus();
                InputMethodutil.ShowKeyboard(mEditText);

                mTopCancel.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View view) {
                        currentState = 0;
                        mTopCancel.setVisibility(View.GONE);
                        mTopFinish.setVisibility(View.GONE);

                        mBottomDrawFunction.setVisibility(View.VISIBLE);
                        mLineView.setVisibility(View.VISIBLE);

                        mColorParent.setVisibility(View.GONE);
                        mColorBack.setVisibility(View.GONE);

                        mBottomCancelFinishParent.setVisibility(View.VISIBLE);

                        mEditText.setText("");
                        mEditText.setVisibility(View.GONE);

                        //隐藏输入法
                        InputMethodutil.HideKeyboard(mEditText);
                    }
                });
                mTopFinish.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View view) {
                        currentState = 0;
                        String text = mEditText.getText().toString().trim();
                        if (TextUtils.isEmpty(text)) {
                            mTopCancel.setVisibility(View.GONE);
                            mTopFinish.setVisibility(View.GONE);

                            mBottomDrawFunction.setVisibility(View.VISIBLE);
                            mLineView.setVisibility(View.VISIBLE);

                            mColorParent.setVisibility(View.GONE);
                            mColorBack.setVisibility(View.GONE);

                            mBottomCancelFinishParent.setVisibility(View.VISIBLE);

                            mEditText.setText("");
                            mEditText.setVisibility(View.GONE);
                        } else {
                            mTopCancel.setVisibility(View.GONE);
                            mTopFinish.setVisibility(View.GONE);

                            mBottomDrawFunction.setVisibility(View.VISIBLE);
                            mLineView.setVisibility(View.VISIBLE);

                            mColorParent.setVisibility(View.GONE);
                            mColorBack.setVisibility(View.GONE);

                            mBottomCancelFinishParent.setVisibility(View.VISIBLE);

                            final DragTextView currentShowText = new DragTextView(mActivity);
                            currentShowText.setTextSize(18);
                            currentShowText.setTextColor(mEditText.getTextColors());
                            RelativeLayout.LayoutParams showTextParams = new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.WRAP_CONTENT, RelativeLayout.LayoutParams.WRAP_CONTENT);
                            RelativeLayout.LayoutParams editParams = (RelativeLayout.LayoutParams) mEditText.getLayoutParams();
                            showTextParams.topMargin = editParams.topMargin;
                            showTextParams.leftMargin = editParams.leftMargin;
                            rootLayout.addView(currentShowText, showTextParams);

                            currentShowText.setText(text);

                            mEditText.setText("");
                            mEditText.setVisibility(View.GONE);

                            //拖动文字的监听
                            currentShowText.setmListener(new OnDragTextListener() {
                                @Override
                                public void onStartDrag() {
                                    mBottomContent.setVisibility(View.GONE);
                                    mBottomDelete.setVisibility(View.VISIBLE);
                                    currentShowText.setBackgroundResource(R.mipmap.icon_show_text_bg);
                                }

                                @Override
                                public void onStopDrag() {
                                    currentShowText.setBackgroundResource(R.color.transparent);
                                    mBottomContent.setVisibility(View.VISIBLE);
                                    mBottomDelete.setVisibility(View.GONE);
                                    int left = currentShowText.getLeft();
                                    int top = currentShowText.getTop();
                                    RelativeLayout.LayoutParams params = (RelativeLayout.LayoutParams) (currentShowText.getLayoutParams());
                                    params.leftMargin = left;
                                    params.topMargin = top;
                                    currentShowText.setLayoutParams(params);
                                    if (currentShowText.getBottom() > mBottomDelete.getTop()) {
                                        //大于范围删除
                                        currentShowText.setText("");
                                        currentShowText.setVisibility(View.GONE);
                                        mDragTextList.remove(currentShowText);
                                    }
                                }
                            });
                            mDragTextList.add(currentShowText);
                        }
                        //隐藏输入法
                        InputMethodutil.HideKeyboard(mEditText);
                    }
                });
            }
        });

        mColor0.setOnClickListener(this);
        mColor1.setOnClickListener(this);
        mColor2.setOnClickListener(this);
        mColor3.setOnClickListener(this);
        mColor4.setOnClickListener(this);
        mColor5.setOnClickListener(this);
        mColor6.setOnClickListener(this);
        mColor7.setOnClickListener(this);
        mColorList.add(mColor0);
        mColorList.add(mColor1);
        mColorList.add(mColor2);
        mColorList.add(mColor3);
        mColorList.add(mColor4);
        mColorList.add(mColor5);
        mColorList.add(mColor6);
        mColorList.add(mColor7);
        mColorValueList.add(R.color.white);
        mColorValueList.add(R.color.transparent);
        mColorValueList.add(R.color.c_fe1d11);
        mColorValueList.add(R.color.c_fbf412);
        mColorValueList.add(R.color.c_16e113);
        mColorValueList.add(R.color.c_1b9aff);
        mColorValueList.add(R.color.c_850af8);
        mColorValueList.add(R.color.c_fe01ff);

        selectById(0);
    }

    @Override
    public void onClick(View view) {
        int id = view.getId();
        switch (id) {
            case R.id.photo_edit_bottom_color_0:
                selectById(0);
                break;
            case R.id.photo_edit_bottom_color_1:
                selectById(1);
                break;
            case R.id.photo_edit_bottom_color_2:
                selectById(2);
                break;
            case R.id.photo_edit_bottom_color_3:
                selectById(3);
                break;
            case R.id.photo_edit_bottom_color_4:
                selectById(4);
                break;
            case R.id.photo_edit_bottom_color_5:
                selectById(5);
                break;
            case R.id.photo_edit_bottom_color_6:
                selectById(6);
                break;
            case R.id.photo_edit_bottom_color_7:
                selectById(7);
                break;
        }
    }

    //设置选中颜色
    private void selectById(int position) {
        for (int i = 0; i < mColorList.size(); i++) {
            ImageView iv = mColorList.get(i);
            LinearLayout.LayoutParams params = (LinearLayout.LayoutParams) iv.getLayoutParams();
            if (i != position) {
                params.height = ScreenUtil.dp2px(20);
                params.width = ScreenUtil.dp2px(20);
            } else {
                params.height = ScreenUtil.dp2px(26);
                params.width = ScreenUtil.dp2px(26);
            }
            iv.setLayoutParams(params);
        }

        currentColor = getResources().getColor(mColorValueList.get(position));
        if (currentState == 1) {
            //划线
            mPhotoEditView.setColor(currentColor);
        } else if (currentState == 2) {
            //写字
            mEditText.setTextColor(currentColor);
//            mEditText.setTextColor(currentColor);
        }
    }

    private int mInitHeight = 0;
    private boolean mIsInit = true;

    /**
     * 输入法高度
     */
    private void getInputMethodHeight() {
        rootLayout.getViewTreeObserver().addOnGlobalLayoutListener(new ViewTreeObserver.OnGlobalLayoutListener() {

            @Override
            public void onGlobalLayout() {
                Rect r = new Rect();
                rootLayout.getWindowVisibleDisplayFrame(r);

                int screenHeight = rootLayout.getRootView().getHeight();
                softHeight = screenHeight - (r.bottom - r.top);
                if (mIsInit) {
                    mInitHeight = softHeight;
                    mIsInit = false;
                }
                //更改颜色框位置
                if (softHeight > screenHeight / 3) {
                    mColorBottomView.getLayoutParams().height = softHeight - mInitHeight;
                    mColorBottomView.setVisibility(View.VISIBLE);
                } else {
                    mColorBottomView.setVisibility(View.GONE);
                }

            }
        });
    }

    /**
     * 保存划线到图片
     */
    private void saveToLocal(ImageView view) {
        if (TextUtils.isEmpty(mSavePath)) {
            mSavePath = CameraUtil.getFilePath();
        }
        Bitmap bitmap = Bitmap.createBitmap(view.getWidth(), view.getHeight(), Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(bitmap);
        view.draw(canvas);

        try {
            File imageFile = new File(mSavePath);
            FileOutputStream outStream;
            outStream = new FileOutputStream(imageFile);
            bitmap.compress(Bitmap.CompressFormat.JPEG, 100, outStream);
            outStream.flush();
            outStream.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        mPhotoEditView.setImageBitmap(bitmap);
        mPhotoEditView.cancel();

        CameraUtil.frushStyemDCIM(mActivity, mSavePath);
    }

    /**
     * 保存文字到图片
     */
    private void saveTextToImage(ImageView view) {
        if (TextUtils.isEmpty(mSavePath)) {
            mSavePath = CameraUtil.getFilePath();
        }
        Bitmap bitmap = Bitmap.createBitmap(view.getWidth(), view.getHeight(), Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(bitmap);
        view.draw(canvas);

        //画文字
        for (DragTextView mShowText : mDragTextList) {
            TextPaint tp = mShowText.getPaint();
            Paint.FontMetrics metrics = tp.getFontMetrics();
            canvas.drawText(mShowText.getText().toString().trim(), mShowText.getLeft() + mShowText.getPaddingLeft(), mShowText.getBottom() - metrics.descent - mShowText.getPaddingBottom(), tp);
        }

        try {
            File imageFile = new File(mSavePath);
            FileOutputStream outStream;
            outStream = new FileOutputStream(imageFile);
            bitmap.compress(Bitmap.CompressFormat.JPEG, 100, outStream);
            outStream.flush();
            outStream.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        //设置显示最新的图像
        mPhotoEditView.setImageBitmap(bitmap);
        //将之前的设定清空
        mPhotoEditView.cancel();

        CameraUtil.frushStyemDCIM(mActivity, mSavePath);
    }

}
