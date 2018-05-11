package com.glodon.bim.basic.network.download;

import android.content.Context;
import android.os.Handler;

import java.io.IOException;

import okhttp3.Call;
import okhttp3.Dispatcher;
import okhttp3.Headers;
import okhttp3.Interceptor;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

/**
 * Created by cwj on 2018/3/9.
 * Description:下载
 */

public class GlodonDownloadManager {

    private static GlodonDownloadManager mInstance;
    private static final byte[] LOCKER = new byte[0];
    private OkHttpClient okHttpClient;

    private GlodonDownloadManager() {
        okHttpClient = new OkHttpClient();
    }

    public static GlodonDownloadManager getInstance() {
        if (mInstance == null) {
            synchronized (LOCKER) {
                if (mInstance == null) {
                    mInstance = new GlodonDownloadManager();
                }
            }
        }
        return mInstance;
    }


    /**
     * 下载文件
     *
     * @param url                     下载地址
     * @param filedir                 下载目的目录
     * @param filename                下载目的文件名
     * @param downloadResponseHandler 下载回调
     */
    public Call download(String url, String filedir, String filename, final DownloadResponseHandler downloadResponseHandler) {
        return download(null, url, filedir, filename, downloadResponseHandler);
    }

    /**
     * 下载文件
     *
     * @param context                 发起请求的context
     * @param url                     下载地址
     * @param filedir                 下载目的目录
     * @param filename                下载目的文件名
     * @param downloadResponseHandler 下载回调
     */
    public Call download(Context context, String url, String filedir, String filename, final DownloadResponseHandler downloadResponseHandler) {

        Request request;
        Headers headers = null;

        Request.Builder builder = null;

        if (context == null) {
            builder = new Request.Builder()
                    .url(url);
        } else {
            builder = new Request.Builder()
                    .url(url)
                    .tag(context);
        }
        if (headers != null) {
            builder.headers(headers);
        }
        request = builder.build();

        Call call = okHttpClient.newBuilder()
                .addNetworkInterceptor(new Interceptor() {      //设置拦截器
                    @Override
                    public Response intercept(Chain chain) throws IOException {
                        Response originalResponse = chain.proceed(chain.request());
                        return originalResponse.newBuilder()
                                .body(new ResponseProgressBody(originalResponse.body(), downloadResponseHandler))
                                .build();
                    }
                })
                .build()
                .newCall(request);

        call.enqueue(new DownloadCallback(new Handler(), downloadResponseHandler, filedir, filename));
        return call;
    }

    /**
     * 取消所有请求
     *
     * @param tag
     */
    public void cancelAll(Object tag) {
        Dispatcher dispatcher = okHttpClient.dispatcher();
        synchronized (dispatcher) {
            for (Call call : dispatcher.queuedCalls()) {
                if (tag.equals(call.request().tag())) {
                    call.cancel();
                }
            }
            for (Call call : dispatcher.runningCalls()) {
                if (tag.equals(call.request().tag())) {
                    call.cancel();
                }
            }
        }
    }

    /**
     * 取消
     *
     * @param call call
     */
    public void cancelAll(Call call) {
        if (call != null && !call.isCanceled()) {
            call.cancel();
        }
    }
}
