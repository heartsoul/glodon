package com.glodon.bim.business.offline.model.server;

import android.app.Service;
import android.content.Intent;
import android.os.Environment;
import android.os.IBinder;
import android.support.annotation.Nullable;

import com.glodon.bim.basic.log.LogUtil;
import com.glodon.bim.business.offline.model.server.source.AndServer;
import com.glodon.bim.business.offline.model.server.source.filter.HttpCacheFilter;
import com.glodon.bim.business.offline.model.server.source.website.StorageWebsite;
import com.glodon.bim.business.offline.model.server.source.Server;
import com.glodon.bim.business.offline.model.server.source.website.WebSite;


import java.io.File;

/**
 * 描述：server服务
 * 作者：zhourf on 2018/04/18
 * 邮箱：zhourf@glodon.com
 */
public class CoreService extends Service {

    /**
     * AndServer.
     */
    private Server mServer;

    @Override
    public void onCreate() {
        LogUtil.e("service  oncreate");
        File file = new File(Environment.getExternalStorageDirectory(), "bimcache");
        String websiteDirectory = file.getAbsolutePath();

        WebSite wesite = new StorageWebsite(websiteDirectory);
//        WebSite wesite = new AssetsWebsite(getAssets(), "");

        // More usage documentation: http://yanzhenjie.github.io/AndServer
        mServer = AndServer.serverBuilder()
                .inetAddress(NetUtils.getLocalIPAddress()) // Bind IP address.
                .port(8080)
//                .timeout(10, TimeUnit.SECONDS)
                .website(wesite)
//                .website(new AssetsWebsite(getAssets(), "web"))
//                .registerHandler("/download", new FileHandler())
//                .registerHandler("/upload", new UploadHandler())
//                .registerHandler("/image", new ImageHandler())
                .filter(new HttpCacheFilter())
                .listener(mListener)
                .build();
    }

    /**
     * Server listener.
     */
    private Server.ServerListener mListener = new Server.ServerListener() {
        @Override
        public void onStarted() {
//            String hostAddress = mServer.getInetAddress().getHostAddress();
//            ServerManager.serverStart(CoreService.this, hostAddress);
            LogUtil.e("listener:onStarted");
        }

        @Override
        public void onStopped() {
//            ServerManager.serverStop(CoreService.this);
            LogUtil.e("listener:onStopped");
        }

        @Override
        public void onError(Exception e) {
//            ServerManager.serverError(CoreService.this, e.getMessage());
            LogUtil.e("listener:onError:"+e.getMessage());
        }
    };

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        startServer();
        return START_STICKY;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        stopServer(); // Stop server.
    }

    /**
     * Start server.
     */
    private void startServer() {
//        LogUtil.e("startServer:"+(mServer==null));
        if (mServer != null) {
//            LogUtil.e("mServer.isRunning():"+(mServer.isRunning()));
            if (mServer.isRunning()) {
//                String hostAddress = mServer.getInetAddress().getHostAddress();
//                ServerManager.serverStart(CoreService.this, hostAddress);
                LogUtil.e("server isRunning");
            } else {
                LogUtil.e("server startup");
                mServer.startup();
            }
        }
    }

    /**
     * Stop server.
     */
    private void stopServer() {
//        LogUtil.e("stopServer:"+(mServer==null)+" isRunning:"+(mServer.isRunning()));
        if (mServer != null && mServer.isRunning()) {
            mServer.shutdown();
            LogUtil.e("server shutdown");
        }
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}
