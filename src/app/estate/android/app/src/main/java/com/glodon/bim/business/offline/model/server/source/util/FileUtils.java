package com.glodon.bim.business.offline.model.server.source.util;

import android.text.TextUtils;
import android.webkit.MimeTypeMap;

/**
 * 描述：server管理
 * 作者：zhourf on 2018/04/18
 * 邮箱：zhourf@glodon.com
 */
public class FileUtils {

    /**
     * Get MimeType of file path.
     *
     * @param path file path.
     * @return get contentType based on file name, if not {@code application/octet-stream}.
     */
    public static String getMimeType(String path) {
        String mimeType = "application/octet-stream";
        if (!TextUtils.isEmpty(path)) {
            String extension = MimeTypeMap.getFileExtensionFromUrl(path);
            if (MimeTypeMap.getSingleton().hasExtension(extension))
                mimeType = MimeTypeMap.getSingleton().getMimeTypeFromExtension(extension);
        }
        return mimeType;
    }

}