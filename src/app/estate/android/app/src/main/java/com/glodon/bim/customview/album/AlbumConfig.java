package com.glodon.bim.customview.album;

/**
 * Created by cwj on 2018/3/22.
 * Description:AlbumConfig
 */

public class AlbumConfig {

    public static final String ACTION_REFRESH_ALBUM_VIEW = "ACTION_REFRESH_ALBUM_VIEW";

    public static AlbumData albumData = null;


    public static void clearAlbum(){
        albumData = null;
    }
}
