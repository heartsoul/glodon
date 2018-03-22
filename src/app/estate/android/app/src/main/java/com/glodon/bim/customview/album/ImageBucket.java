package com.glodon.bim.customview.album;

import java.io.Serializable;
import java.util.List;

/**
 * Description:  一个目录的相册对象
 * 作者：zhourf on 2017/11/1
 * 邮箱：zhourf@glodon.com
 */
public class ImageBucket implements Serializable {
	/**
	 * @Description serialVersionUID
	 */
	private final long serialVersionUID = -8198419707482282775L;
	/**
	 * 该文件夹内图片总数
	 */
	public int count = 0;
	/**
	 * 文件夹名
	 */
	public String bucketName;
	/**
	 * 该文件夹下所有的图片
	 */
	public List<ImageItem> imageList;
	


	
}
