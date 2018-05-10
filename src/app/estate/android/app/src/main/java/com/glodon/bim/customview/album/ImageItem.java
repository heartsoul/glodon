package com.glodon.bim.customview.album;


import com.facebook.react.bridge.ReadableMap;

import java.io.Serializable;
import java.util.Map;

/**
 * Description:  一个图片对象
 * 作者：zhourf on 2017/11/1
 * 邮箱：zhourf@glodon.com
 */
public class ImageItem implements Serializable {
	/**
	 * 图片id
	 */
	public String imageId;
	/**
	 * 图片缩略图路径
	 */
	public String thumbnailPath;
	/**
	 * 图片的原图片路径
	 */
	public String imagePath;

//	public CreateCheckListParamsFile urlFile;

	public String objectId = "-1";
	//是否有已经上传过的图片数据，大于等于0时存在，可以从rn传过来的ReadableMap中取出来
	public int originalIndex = -1;

}
