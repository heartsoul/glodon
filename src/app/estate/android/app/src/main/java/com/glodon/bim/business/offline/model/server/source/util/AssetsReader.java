package com.glodon.bim.business.offline.model.server.source.util;

import android.content.res.AssetManager;
import android.text.TextUtils;

import java.io.File;
import java.io.InputStream;
import java.util.LinkedList;
import java.util.List;

/**
 * 描述：server管理
 * 作者：zhourf on 2018/04/18
 * 邮箱：zhourf@glodon.com
 */
public class AssetsReader {

    /**
     * {@link AssetManager}.
     */
    private AssetManager mAssetManager;

    /**
     *
     * @param assetManager {@link AssetManager}, such as: context.getAssets();
     */
    public AssetsReader(AssetManager assetManager) {
        this.mAssetManager = assetManager;
    }

    /**
     * Get stream file.
     *
     * @param fileName assets in the absolute path.
     * @return {@link InputStream} or null.
     */
    public InputStream getInputStream(String fileName) {
        try {
            return mAssetManager.open(fileName);
        } catch (Throwable ignored) {
            return null;
        }
    }

    /**
     * Specify whether the destination is a file.
     *
     * @param fileName assets in the absolute path.
     * @return true, other wise is false.
     */
    public boolean isFile(String fileName) {
        return getInputStream(fileName) != null;
    }

    /**
     * Scanning subFolders and files under the specified path.
     *
     * @param path the specified path.
     * @return String[] Array of strings, one for each asset. May be null.
     */
    public String[] fileList(String path) {
        try {
            return mAssetManager.list(path);
        } catch (Throwable ignored) {
            return null;
        }
    }

    /**
     * Scan all files in the inPath.
     *
     * @param inPath path in the path.
     * @return under inPath absolute path.
     */
    public List<String> scanFile(String inPath) {
        List<String> pathList = new LinkedList<>();
        if (isFile(inPath)) {
            pathList.add(inPath);
        } else {
            String[] files = fileList(inPath);
            if (files != null && files.length > 0) {
                for (String file : files) {
                    String realPath = (TextUtils.isEmpty(inPath) ? "" : (inPath + File.separator)) + file;
                    if (isFile(realPath)) pathList.add(realPath);
                    else {
                        List<String> childList = scanFile(realPath);
                        if (childList.size() > 0) pathList.addAll(childList);
                    }
                }
            }
        }
        return pathList;
    }

}
