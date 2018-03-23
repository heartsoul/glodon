package com.glodon.bim.customview.album;


import java.io.Serializable;

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
}
