package com.glodon.bim.customview.album;

import com.glodon.bim.basic.utils.LinkedHashList;

import java.io.Serializable;

/**
 * 描述：选中的图片
 * 作者：zhourf on 2017/11/1
 * 邮箱：zhourf@glodon.com
 */

public class AlbumData implements Serializable {
    public LinkedHashList<String,ImageItem> map;

    public AlbumData(LinkedHashList<String, ImageItem> map) {
        this.map = map;
    }
}
