package com.glodon.bim.basic.network.download;

import java.io.File;

/**
 * Created by chenwj-a on 2017/12/6.
 */

public interface DownloadResponseHandler {
    void onFinish(File download_file);
    void onProgress(long currentBytes, long totalBytes);
    void onFailure(String error_msg);
}
