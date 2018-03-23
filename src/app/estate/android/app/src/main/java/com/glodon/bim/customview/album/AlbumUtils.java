package com.glodon.bim.customview.album;

import android.app.Activity;
import android.content.ContentResolver;
import android.database.Cursor;
import android.provider.MediaStore.Images.Media;
import android.provider.MediaStore.Images.Thumbnails;
import android.text.TextUtils;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

/**
 * Description:  获取手机图片
 * 作者：zhourf on 2017/11/1
 * 邮箱：zhourf@glodon.com
 */
public class AlbumUtils {
    private Activity context;
    private ContentResolver cr;

    // 缩略图列表 key：image_id value： 缩略图的路径
    private HashMap<String, String> thumbnailList = new HashMap<>();
    // 相册列表
    private List<HashMap<String, String>> albumList = new ArrayList<>();
    // key：文件夹id value：文件夹内所有图片的集合
    private HashMap<String, ImageBucket> bucketList = new HashMap<>();


    public AlbumUtils(Activity context) {
        this.context = context;
        cr = context.getContentResolver();
        // 先清除之前查询的数据
        thumbnailList.clear();
        bucketList.clear();
        albumList.clear();
    }


    public List<ImageItem> getImageList() {
        List<ImageItem> list = new ArrayList<>();
        getThumbnail();
        String columns[] = new String[]{Media._ID, Media.BUCKET_ID,
                Media.PICASA_ID, Media.DATA, Media.DISPLAY_NAME, Media.TITLE,
                Media.SIZE, Media.BUCKET_DISPLAY_NAME};
        // 得到一个游标
        Cursor cur = cr.query(Media.EXTERNAL_CONTENT_URI, columns, null, null,
                Media.DATE_MODIFIED + " desc");
        if (cur != null) {
            if (cur.moveToFirst()) {
                // 获取指定列的索引
                int photoIDIndex = cur.getColumnIndexOrThrow(Media._ID);
                int photoPathIndex = cur.getColumnIndexOrThrow(Media.DATA);

                do {
                    String _id = cur.getString(photoIDIndex);
                    String path = cur.getString(photoPathIndex);

                    // 某一张图片
                    ImageItem imageItem = new ImageItem();
                    imageItem.imageId = _id;// 图片索引id
                    imageItem.imagePath = path;// 原图片路径

                    imageItem.thumbnailPath = thumbnailList.get(_id);// 原图片的缩略图路径
                    list.add(imageItem);

                } while (cur.moveToNext());
            }
            cur.close();
        }
//        LogUtil.e("size=",list.size()+"");
//        for (ImageItem item :list) {
//            LogUtil.e("item=",item.imageId+" "+item.imagePath+" "+item.thumbnailPath);
//        }

        return list;
    }


    /**
     * 得到图片集 以文件夹为单位 获得所有文件夹
     */
    public List<ImageBucket> getImagesBucketList() {
        buildImagesBucketList();
        if (bucketList != null) {
            List<ImageBucket> tmpList = new ArrayList<ImageBucket>();
            Iterator<Entry<String, ImageBucket>> itr = bucketList.entrySet()
                    .iterator();
            while (itr.hasNext()) {
                Map.Entry<String, ImageBucket> entry = (Map.Entry<String, ImageBucket>) itr
                        .next();
                if (entry.getValue().imageList != null
                        && entry.getValue().imageList.size() > 0) {
                    tmpList.add(entry.getValue());
                }
            }
            return tmpList;
        } else {
            return null;
        }
    }


    /**
     * 得到图片集
     */
    private void buildImagesBucketList() {
        // 构造缩略图索引
        getThumbnail();

        /**
         * 图片表 Media._ID, 图片表索引 对应 缩略图表的Thumbnails.IMAGE_ID Media.BUCKET_ID,
         * 该图片所在文件夹对应的id 如： -10236598 该id与文件夹名一一对应 Media.PICASA_ID, Media.DATA,
         * 图片的绝对路径，原图的 如： /mnt/sdcard/hello.jpg Media.DISPLAY_NAME, 图片名 如：
         * hello.jpg Media.TITLE, 名称 如： hello Media.SIZE, 图片大小 如：111251 单位字节
         * Media.BUCKET_DISPLAY_NAME 该图片所在文件夹的名称 如： caochen
         */
        // 构造相册索引
        String columns[] = new String[]{Media._ID, Media.BUCKET_ID,
                Media.PICASA_ID, Media.DATA, Media.DISPLAY_NAME, Media.TITLE,
                Media.SIZE, Media.BUCKET_DISPLAY_NAME};
        // 得到一个游标
        Cursor cur = cr.query(Media.EXTERNAL_CONTENT_URI, columns, null, null,
                Media.DATE_MODIFIED + " desc");
        if (cur != null) {
            if (cur.moveToFirst()) {
                // 获取指定列的索引
                int photoIDIndex = cur.getColumnIndexOrThrow(Media._ID);
                int photoPathIndex = cur.getColumnIndexOrThrow(Media.DATA);
                int bucketDisplayNameIndex = cur
                        .getColumnIndexOrThrow(Media.BUCKET_DISPLAY_NAME);
                int bucketIdIndex = cur.getColumnIndexOrThrow(Media.BUCKET_ID);

                do {
                    String _id = cur.getString(photoIDIndex);
                    String path = cur.getString(photoPathIndex);
                    String bucketName = cur.getString(bucketDisplayNameIndex);
                    String bucketId = cur.getString(bucketIdIndex);

                    // 一个文件夹对应的相册
                    ImageBucket bucket = bucketList.get(bucketId);
                    if (bucket == null) {
                        // 创建该文件夹的相册
                        bucket = new ImageBucket();
                        bucketList.put(bucketId, bucket);
                        // 该文件夹内所有图片的集合
                        bucket.imageList = new ArrayList<>();
                        // 文件夹名
                        bucket.bucketName = bucketName;
                    }
                    bucket.count++;
                    // 某一张图片
                    ImageItem imageItem = new ImageItem();
                    imageItem.imageId = _id;// 图片索引id
                    imageItem.imagePath = path;// 原图片路径

                    imageItem.thumbnailPath = thumbnailList.get(_id);// 原图片的缩略图路径
                    bucket.imageList.add(imageItem);

                } while (cur.moveToNext());
            }
            cur.close();
        }
    }


    /**
     * 得到缩略图
     */
    public void getThumbnail() {
        /**
         * 查的是缩略图表 所有的图片的缩略图都在这张表里 Thumbnails._ID 缩略图表id 1 2 3 4 5 6
         * Thumbnails.IMAGE_ID 图片表中的id，表示这张缩略图指向的那张图片 2 6 8 9 4 Thumbnails.DATA
         * 这张图片的缩略图的路径 /mnt/sdcard/DCIM/.thumbnails/1564445.jpg Thumbnails.WIDTH
         * 缩略图宽 Thumbnails.HEIGHT 缩略图高
         */
        String[] projection = {Thumbnails._ID, Thumbnails.IMAGE_ID,
                Thumbnails.DATA};
        Cursor cursor = Thumbnails.queryMiniThumbnails(cr,
                Thumbnails.EXTERNAL_CONTENT_URI, Thumbnails.MINI_KIND,
                projection);
        if (cursor != null) {
            getThumbnailColumnData(cursor);
            cursor.close();
        }
    }

    /**
     * 从数据库中得到缩略图
     *
     * @param cur
     * @Description
     * @date 2015年5月8日 上午7:54:53
     */
    private void getThumbnailColumnData(Cursor cur) {
        if (cur != null && cur.moveToFirst()) {
            int image_id;
            String image_path;// 缩略图路径
            // 缩略图的id的所在列
            // int _idColumn = cur.getColumnIndex(Thumbnails._ID);
            // 缩略图的图片id所在缩略图表中的列
            int image_idColumn = cur.getColumnIndex(Thumbnails.IMAGE_ID);
            // 缩略图路径所在列
            int dataColumn = cur.getColumnIndex(Thumbnails.DATA);

            do {
                // Get the field values
                // _id = cur.getInt(_idColumn);
                image_id = cur.getInt(image_idColumn);
                image_path = cur.getString(dataColumn);
                if (!TextUtils.isEmpty(image_path)) {
                    thumbnailList.put("" + image_id, image_path);
                }
            } while (cur.moveToNext());
        }
    }


    /**
     * 得到原始图像路径
     *
     * @param image_id
     * @return
     */
    private String getOriginalImagePath(String image_id) {
        String path = null;
        String[] projection = {Media._ID, Media.DATA};
        Cursor cursor = cr.query(Media.EXTERNAL_CONTENT_URI, projection,
                Media._ID + "=" + image_id, null, null);
        if (cursor != null) {
            cursor.moveToFirst();
            path = cursor.getString(cursor.getColumnIndex(Media.DATA));
            cursor.close();
        }
        return path;
    }

}
