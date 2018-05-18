package com.glodon.bim.business.qualityManage.view;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.PorterDuff;
import android.graphics.PorterDuffXfermode;
import android.support.annotation.Nullable;
import android.util.AttributeSet;
import android.view.MotionEvent;
import android.widget.ImageView;


import com.estate.R;

import java.util.ArrayList;
import java.util.List;

/**
 * 描述：照片编辑页
 * 作者：zhourf on 2017/9/26
 * 邮箱：zhourf@glodon.com
 */

public class PhotoEditView extends ImageView {
    private Paint mPaint;

    //    private List<Path> list;
    private boolean isAdd = false;
    private OnPhotoEditChangeListener mListener;
    private boolean isCanDraw = false;
    private int color;//画笔颜色

    private List<Path> mPathList;
    private List<Integer> mColorList;
    private Path mPath;

    public void setIsCanDraw(boolean isCanDraw){
        this.isCanDraw = isCanDraw;
    }

    public void setmListener(OnPhotoEditChangeListener mListener) {
        this.mListener = mListener;
    }

    private float preX, preY;// 记录上一个触摸事件的位置坐标
    private static final int MIN_MOVE_DIS = 5;// 最小的移动距离：如果我们手指在屏幕上的移动距离小于此值则不会绘制

    public PhotoEditView(Context context) {
        super(context);
        init();
    }

    public PhotoEditView(Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
        init();
    }

    private void init() {
        color = getResources().getColor(R.color.white);
        mPath = new Path();
        mPathList = new ArrayList<>();
        mColorList = new ArrayList<>();

        mPaint = new Paint(Paint.ANTI_ALIAS_FLAG);

//        mPaint.setXfermode(getPdf());
        mPaint.setColor(Color.WHITE);
        mPaint.setStyle(Paint.Style.STROKE);
        mPaint.setStrokeWidth(10);
        mPaint.setStrokeJoin(Paint.Join.ROUND);
        mPaint.setStrokeCap(Paint.Cap.ROUND);
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        mPaint.setColor(color);
        canvas.drawPath(mPath,mPaint);
        if(mPathList!=null && mPathList.size()>0) {
            for(int i = 0;i<mPathList.size();i++) {
                mPaint.setColor(mColorList.get(i));
                canvas.drawPath(mPathList.get(i), mPaint);
            }
        }

    }

    private PorterDuffXfermode getPdf(){
        PorterDuff.Mode mode = PorterDuff.Mode.SRC_IN;
        return  new PorterDuffXfermode(mode);
    }

    /**
     * View的事件将会在7/12详解
     */
    @Override
    public boolean onTouchEvent(MotionEvent event) {
        if(isCanDraw) {
        /*
         * 获取当前事件位置坐标
         */
            float x = event.getX();
            float y = event.getY();

            switch (event.getAction()) {
                case MotionEvent.ACTION_DOWN:// 手指接触屏幕重置路径
                    mPath.moveTo(x, y);
                    preX = x;
                    preY = y;
                    break;
                case MotionEvent.ACTION_MOVE:// 手指移动时连接路径
                    float dx = Math.abs(x - preX);
                    float dy = Math.abs(y - preY);
                    if (dx >= MIN_MOVE_DIS || dy >= MIN_MOVE_DIS) {
                        mPath.quadTo(preX, preY, (x + preX) / 2, (y + preY) / 2);
                        preX = x;
                        preY = y;
                        isAdd = true;
                    }
                    break;
                case MotionEvent.ACTION_UP:
                    if (isAdd) {
                        mPathList.add(mPath);
                        mColorList.add(color);
                        mListener.change(mPathList.size() > 0);
                        mPath = new Path();
                    }
                    isAdd = false;
                    break;
            }

            // 重绘视图
            invalidate();
            return true;
        }else{
            return super.onTouchEvent(event);
        }
    }



    public void playBack() {
        int size = mPathList.size();
        if(size>0){
            mPathList.remove(size-1);
            mColorList.remove(size-1);
        }
        invalidate();
        mListener.change(mPathList.size()>0);
    }

    public void cancel(){
        mPathList.clear();
        mColorList.clear();
        invalidate();
        mListener.change(mPathList.size()>0);
    }

    public boolean isShowPlayBack(){
        return mPathList.size()>0;
    }

    public void setColor(int color) {
        this.color = color;
        mPaint.setColor(color);
    }
}
