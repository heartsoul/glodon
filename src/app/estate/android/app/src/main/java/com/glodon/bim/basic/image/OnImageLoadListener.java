package com.glodon.bim.basic.image;

import android.graphics.Bitmap;

/**
 * 描述：下载图片后的回调
 * 作者：zhourf on 2017/9/14
 * 邮箱：zhourf@glodon.com
 */

public interface OnImageLoadListener {

    /**
     * 图片下载成功
     * @param bitmap 图片
     */
    void onLoadBitmap(Bitmap bitmap);
}
