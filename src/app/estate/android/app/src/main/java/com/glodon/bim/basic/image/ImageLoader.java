package com.glodon.bim.basic.image;

import android.content.Context;
import android.graphics.Bitmap;
import android.widget.ImageView;

import com.bumptech.glide.Glide;
import com.bumptech.glide.load.Transformation;
import com.bumptech.glide.request.animation.GlideAnimation;
import com.bumptech.glide.request.target.SimpleTarget;

import jp.wasabeef.glide.transformations.CropCircleTransformation;
import jp.wasabeef.glide.transformations.CropSquareTransformation;

/**
 * 描述：图片加载
 * 作者：zhourf on 2017/9/13
 * 邮箱：zhourf@glodon.com
 */

public class ImageLoader {

    /**
     * 展示一般图片
     */
    public static void showImageCenterCrop(Context context, String url, ImageView view) {
        Glide.with(context)
                .load(url)
                .crossFade(200)
                .centerCrop()
                .bitmapTransform(new CropSquareTransformation(context))
//                .override(20,20)
                .into(view);
    }

    /**
     * 展示一般图片
     */
    public static void showImageCenterCrop(Context context, String url, ImageView view,int defaultResource) {
        Glide.with(context)
                .load(url)
                .placeholder(defaultResource)
                .error(defaultResource)
                .crossFade(200)
                .centerCrop()
                .bitmapTransform(new CropSquareTransformation(context))
//                .override(20,20)
                .into(view);
    }

    /**
     * 展示一般图片
     */
    public static void showImage(Context context, String url, ImageView view) {
        Glide.with(context)
                .load(url)
                .crossFade(200)
                .bitmapTransform(new CropSquareTransformation(context))
//                .override(20,20)
                .into(view);
    }

    /**
     * 展示一般图片
     */
    public static void showImageNormal(Context context, String url, ImageView view) {
        Glide.with(context)
                .load(url)
                .crossFade(200)
                .centerCrop()
                .into(view);
    }

    /**
     * 展示一般图片
     */
    public static void showPreviewImage(Context context, String url, ImageView view) {
        Glide.with(context)
                .load(url)
                .crossFade(200)
                .into(view);
    }

    public static void setImage(Context context, String url, final ImageView imageView) {
        Glide.with(context).load(url).asBitmap()
                .into(new SimpleTarget<Bitmap>() {
                    @Override
                    public void onResourceReady(Bitmap resource, GlideAnimation<? super Bitmap> glideAnimation) {
                        imageView.setImageBitmap(resource);
                    }
                });
    }

    /**
     * 展示头像 圆形
     */
    public static void showHeadIcon(Context context, String url, ImageView view) {
        Glide.with(context)
                .load(url)
                .bitmapTransform(new CropCircleTransformation(context))
                .into(view);
    }

    /**
     * 展示头像 圆形
     */
    public static void showHeadIcon(Context context, int resourceId, ImageView view) {
        Glide.with(context)
                .load(resourceId)
                .bitmapTransform(new CropCircleTransformation(context))
                .into(view);
    }

    /**
     * 根据url获取bitmap
     */
    public static void loadUrl(Context context, String url, final OnImageLoadListener listener) {
        SimpleTarget<Bitmap> target = new SimpleTarget<Bitmap>() {
            @Override
            public void onResourceReady(Bitmap resource, GlideAnimation<? super Bitmap> glideAnimation) {
                if(listener!=null){
                    listener.onLoadBitmap(resource);
                }
            }
        };
        Glide.with(context)
                .load(url)
                .asBitmap()
                .into(target);
    }


    /*
     .with() 图片加载的环境：1,Context对象。2,Activity对象。3,FragmentActivity对象。4,Fragment对象
     .load() 加载资源：1,drawable资源。2,本地File文件。3,uri。4,网络图片url。5,byte数组（可以直接加载GIF图片）
     .placeholder() 图片占位符
     .error() 图片加载失败时显示
     .crossFade() 显示图片时执行淡入淡出的动画默认300ms
     .dontAnimate() 不执行显示图片时的动画
     .override() 设置图片的大小
     .centerCrop() 和 fitCenter() 图片的显示方式
     .animate() view动画 2个重构方法
     .transform() bitmap转换
     .bitmapTransform() bitmap转换。比如旋转，放大缩小，高斯模糊等（当用了转换后你就不能使用.centerCrop()或.fitCenter()了。）
     .priority(Priority.HIGH) 当前线程的优先级
     .signature(new StringSignature(“ssss”))
     .thumbnail(0.1f) 缩略图，3个重构方法：优先显示原始图片的百分比(10%)
     .listener() 异常监听
     .into() 图片加载完成后进行的处理：1,ImageView对象。2,宽高值。3,Target对象


    bitmapTransform转换器
    圆形：CropCircleTransformation
    方形：CropSquareTransformation
    圆角：RoundedCornersTransformation
    颜色覆盖：ColorFilterTransformation
    置灰：GrayscaleTransformation
    毛玻璃：BlurTransformation


    // ListView滑动时触发的事件
        lv.setOnScrollListener(new AbsListView.OnScrollListener() {
            @Override
            public void onScrollStateChanged(AbsListView view, int scrollState) {
                switch (scrollState) {
                    case AbsListView.OnScrollListener.SCROLL_STATE_TOUCH_SCROLL:
                    case AbsListView.OnScrollListener.SCROLL_STATE_FLING:
                        // 当ListView处于滑动状态时，停止加载图片，保证操作界面流畅
                        Glide.with(QualityMangeMainActivity.this).pauseRequests();
                        break;
                    case AbsListView.OnScrollListener.SCROLL_STATE_IDLE:
                        // 当ListView处于静止状态时，继续加载图片
                        Glide.with(QualityMangeMainActivity.this).resumeRequests();
                        break;
                }
            }

            @Override
            public void onScroll(AbsListView view, int firstVisibleItem, int visibleItemCount, int totalItemCount) {
            }
        });
     */

    /**
     * 显示图片
     *
     * @param context           上下文
     * @param url               图片网络地址
     * @param view              显示图片的控件
     * @param placeImageId      图片占位符，在图片没有加载出来或加载失败时显示的图片
     * @param errorImageId      错误时显示的图片
     * @param crossFadeDuration 动画时间
     * @param transformation    图片形状
     */
    public static void showImage(Context context, String url, ImageView view, int placeImageId, int errorImageId, int crossFadeDuration, Transformation<Bitmap> transformation) {
        Glide.with(context)
                .load(url)
                .placeholder(placeImageId)
                .error(errorImageId)
                .crossFade(crossFadeDuration)
                .centerCrop()
                .bitmapTransform(transformation)
//                .thumbnail(0.1f)
                .into(view);
    }


}
