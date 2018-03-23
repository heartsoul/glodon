package com.glodon.bim.customview.album;

import com.glodon.bim.basic.utils.LinkedHashList;

/**
 * 描述：相册照片点击后的监听
 * 作者：zhourf on 2017/11/1
 * 邮箱：zhourf@glodon.com
 */

public interface OnAlbumChangeListener {

    void onChange(LinkedHashList<String, ImageItem> map);
}
