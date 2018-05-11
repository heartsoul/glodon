package com.glodon.bim.business.setting.util;

import android.app.AlertDialog;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.os.Handler;
import android.os.Looper;
import android.support.v4.app.NotificationCompat;
import android.support.v4.content.FileProvider;
import android.text.TextUtils;
import android.util.Log;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.estate.BuildConfig;
import com.estate.R;
import com.glodon.bim.basic.network.download.DownloadResponseHandler;
import com.glodon.bim.basic.network.download.GlodonDownloadManager;
import com.glodon.bim.basic.utils.NetWorkUtils;
import com.glodon.bim.basic.utils.ScreenUtil;
import com.glodon.bim.business.setting.bean.CheckVersionBean;

import java.io.File;

import okhttp3.Call;

/**
 * Created by cwj on 2018/3/13.
 * Description:GlodonUpdateManager
 */

public class GlodonUpdateManager {
    private Call call;

    private static GlodonUpdateManager sInstance;

    private NotificationManager mNotifyManager;
    private NotificationCompat.Builder mBuilder;
    private final String DOWNLOAD_PATH = Environment.getExternalStorageDirectory() + "/bmMobile/download/";
    private CheckVersionBean checkVersionBean;
    private boolean isLoading = false;

    private GlodonUpdateManager() {

    }

    public static GlodonUpdateManager getInstance() {
        if (sInstance == null) {
            sInstance = new GlodonUpdateManager();
        }
        return sInstance;
    }

    public void showUpdateDialog(Context context, CheckVersionBean checkVersionBean) {
        if (isLoading) {
            return;
        }
        this.checkVersionBean = checkVersionBean;
        new UpdateDialog(context).show();
    }

    /**
     * 通知栏显示下载
     *
     * @param context context
     * @param url     下载地址
     */
    public void download(final Context context, String url) {
        mBuilder = new NotificationCompat.Builder(context, "11");
        mNotifyManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        final String fileName = "bim" + checkVersionBean.getVersion() + ".apk";
        File file = new File(DOWNLOAD_PATH + fileName);
        if (file.exists()) {
            installApk(context, file);
            return;
        }
        isLoading = true;

        String tempFileName = fileName + ".tmp";
        call = GlodonDownloadManager.getInstance().download(url, DOWNLOAD_PATH, tempFileName, new DownloadResponseHandler() {
            @Override
            public void onFinish(final File download_file) {
                File renameFile = new File(DOWNLOAD_PATH + fileName);
                download_file.renameTo(renameFile);
                download_file.delete();
                call = null;
                mNotifyManager.cancelAll();
                installApk(context, renameFile);
                isLoading = false;
            }

            @Override
            public void onProgress(long currentBytes, long totalBytes) {
                int progress = (int) (currentBytes * 100 / totalBytes);
                Log.i("SettingActivity", "download progress: " + progress);//下载通知栏
                updateProgress(context, progress);
            }

            @Override
            public void onFailure(String error_msg) {
                Log.i("SettingActivity", "download fail " + error_msg);
                isLoading = false;
            }
        });


    }

    private void updateProgress(Context context, int progress) {
        String contentText = "";
        contentText = context.getString(R.string.str_notification_download_progress, progress);

        int icon = context.getApplicationInfo().icon;

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {

            NotificationChannel infoChannel = new NotificationChannel("11", "channel", NotificationManager.IMPORTANCE_DEFAULT);
            infoChannel.setDescription("abc");
            infoChannel.enableLights(false);
            infoChannel.enableVibration(false);
            mNotifyManager.createNotificationChannel(infoChannel);
        }

        mBuilder.setContentTitle("BIM协同").setSmallIcon(icon);
        mBuilder.setContentText(contentText)
                .setProgress(100, progress, false);
        // setContentInent如果不设置在4.0+上没有问题，在4.0以下会报异常
        PendingIntent pendingintent = PendingIntent.getActivity(context, 0,
                new Intent(), 0);
        mBuilder.setContentIntent(pendingintent);
        mBuilder.setAutoCancel(true);
        mNotifyManager.notify(0, mBuilder.build());
    }

    public void installApk(Context context, File apkFile) {
        Intent installIntent = new Intent(Intent.ACTION_VIEW);
        installIntent.setDataAndType(getFileUri(context, apkFile),
                "application/vnd.android.package-archive");
        installIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
        installIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        context.startActivity(installIntent);
    }

    public static Uri getFileUri(Context context, File file) {
        if (Build.VERSION.SDK_INT >= 24) {//7.0及以上版本
            return FileProvider.getUriForFile(context,
                    context.getPackageName() + ".fileProvider", file);
        } else {
            return Uri.fromFile(file);
        }
    }

    class UpdateDialog {
        private Context context;
        private AlertDialog dialog; //悬浮框

        public UpdateDialog(Context context) {
            this.context = context;
        }

        /**
         * 显示下载对话框
         */
        private void show() {
            View view = LayoutInflater.from(context).inflate(R.layout.dialog_recommend_update, null);
            dialog = new AlertDialog.Builder(context).create();
            dialog.show();
            dialog.setCanceledOnTouchOutside(true);
            dialog.setCancelable(true);

            Window dialogWindow = dialog.getWindow();
            dialogWindow.setContentView(view);
            Window window = dialog.getWindow();
            window.setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));

            WindowManager.LayoutParams layoutParams = dialogWindow
                    .getAttributes();

            layoutParams.width = ScreenUtil.widthPixels - ScreenUtil.dp2px(100);
            dialogWindow.setAttributes(layoutParams);

            RelativeLayout updateRl = view.findViewById(R.id.update_update_rl);
            TextView titleTv = view.findViewById(R.id.update_title_tv);
            TextView contentTv = view.findViewById(R.id.update_content_tv);
            TextView sureTv = view.findViewById(R.id.update_sure_tv);
            TextView waitTv = view.findViewById(R.id.update_wait_tv);

            RelativeLayout latestRl = view.findViewById(R.id.update_latest_rl);

            if (BuildConfig.VERSION_NAME.equals(checkVersionBean.getVersion()) || TextUtils.isEmpty(checkVersionBean.getVersion())) {
                latestRl.setVisibility(View.VISIBLE);
                updateRl.setVisibility(View.GONE);
            } else {
                latestRl.setVisibility(View.GONE);
                updateRl.setVisibility(View.VISIBLE);
            }

            contentTv.setText("系统最新版本为V" + checkVersionBean.getVersion());
            final TextView knowTv = view.findViewById(R.id.update_latest_know_tv);
            knowTv.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    dialog.dismiss();
                }
            });
            waitTv.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    dialog.dismiss();
                }
            });
            sureTv.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    dialog.dismiss();
                    if (call == null || call.isCanceled()) {
                        download(context, checkVersionBean.getUrl());
                    }
                }
            });

            WindowManager.LayoutParams lp = dialogWindow.getAttributes();
            dialogWindow.setAttributes(lp);
        }


    }

    /**
     * wifi下自动下载
     */
    public void autoDownload(Context context, CheckVersionBean checkVersionBean) {

        if (!NetWorkUtils.isWifi(context)) {
            return;
        }

        final String fileName = "bim" + checkVersionBean.getVersion() + ".apk";
        String url = checkVersionBean.getUrl();
        File file = new File(DOWNLOAD_PATH + fileName);
        if (file.exists()) {
            return;
        }
        isLoading = true;

        String tempFileName = fileName + ".tmp";
        call = GlodonDownloadManager.getInstance().download(url, DOWNLOAD_PATH, tempFileName, new DownloadResponseHandler() {
            @Override
            public void onFinish(final File download_file) {
                File renameFile = new File(DOWNLOAD_PATH + fileName);
                download_file.renameTo(renameFile);
                download_file.delete();
                call = null;
                isLoading = false;
            }

            @Override
            public void onProgress(long currentBytes, long totalBytes) {
            }

            @Override
            public void onFailure(String error_msg) {
                isLoading = false;
            }
        });

    }

    /**
     * 强制更新下载
     *
     * @param context
     * @param checkVersionBean
     * @param forceUpdateDialog
     */
    public void forceDownload(final Context context, CheckVersionBean checkVersionBean, final ForceUpdateDialog forceUpdateDialog) {

        final String fileName = "bim" + checkVersionBean.getVersion() + ".apk";
        String url = checkVersionBean.getUrl();
        File file = new File(DOWNLOAD_PATH + fileName);
        if (file.exists()) {
            forceUpdateDialog.showFinishView();
            installApk(context,file);
            return;
        }
        isLoading = true;
        forceUpdateDialog.showLoadingView();

        String tempFileName = fileName + ".tmp";
        call = GlodonDownloadManager.getInstance().download(url, DOWNLOAD_PATH, tempFileName, new DownloadResponseHandler() {
            @Override
            public void onFinish(final File download_file) {
                File renameFile = new File(DOWNLOAD_PATH + fileName);
                download_file.renameTo(renameFile);
                download_file.delete();
                call = null;
                isLoading = false;
                forceUpdateDialog.showFinishView();
                installApk(context,renameFile);
            }

            @Override
            public void onProgress(long currentBytes, long totalBytes) {
                int progress = (int) (currentBytes * 100 / totalBytes);
                forceUpdateDialog.updateProgress(progress);
            }

            @Override
            public void onFailure(String error_msg) {
                isLoading = false;
                forceUpdateDialog.showUpdateView();
            }
        });

    }

    /**
     * 强制更新
     */
    public void showForceUpdateDialog(Context context, CheckVersionBean checkVersionBean) {

        new ForceUpdateDialog(context, checkVersionBean).show();

    }


    /**
     * 强制更新对话框
     */
    class ForceUpdateDialog {
        private Context context;
        private AlertDialog dialog; //悬浮框

        private TextView contentTv;
        private TextView loadingTv;
        private TextView finishTv;
        private TextView progressTv;
        private TextView updateTv;
        private ImageView updateIcon;
        private CheckVersionBean checkVersionBean;

        public ForceUpdateDialog(Context context, CheckVersionBean checkVersionBean) {
            this.context = context;
            this.checkVersionBean = checkVersionBean;
        }

        /**
         * 显示下载对话框
         */
        private void show() {
            View view = LayoutInflater.from(context).inflate(R.layout.dialog_force_update, null);

            AlertDialog.Builder builder = new AlertDialog.Builder(context);
            builder.setOnKeyListener(keyListener).setCancelable(false);

            dialog = builder.create();
            dialog.show();
            dialog.setCanceledOnTouchOutside(false);

            Window dialogWindow = dialog.getWindow();
            dialogWindow.setContentView(view);
            Window window = dialog.getWindow();
            window.setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));

            WindowManager.LayoutParams layoutParams = dialogWindow
                    .getAttributes();
            layoutParams.width = ScreenUtil.widthPixels - ScreenUtil.dp2px(100);
            dialogWindow.setAttributes(layoutParams);

            contentTv = view.findViewById(R.id.update_force_tv);
            loadingTv = view.findViewById(R.id.update_loading_tv);
            finishTv = view.findViewById(R.id.update_finish_tv);
            updateTv = view.findViewById(R.id.update_force_update_tv);
            updateIcon = view.findViewById(R.id.update_force_icon);
            progressTv = view.findViewById(R.id.update_force_progress);


            updateTv.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    forceDownload(context, checkVersionBean, ForceUpdateDialog.this);
                }
            });
            finishTv.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    final String fileName = "bim" + checkVersionBean.getVersion() + ".apk";
                    File file = new File(DOWNLOAD_PATH + fileName);
                    if (file.exists()) {
                        installApk(context,file);
                    }
                }
            });

            WindowManager.LayoutParams lp = dialogWindow.getAttributes();
            dialogWindow.setAttributes(lp);
        }

        /**
         * 显示需要更新的View
         */
        public void showUpdateView() {
            updateIcon.setImageDrawable(context.getResources().getDrawable(R.mipmap.icon_update_notice));
            contentTv.setVisibility(View.VISIBLE);
            loadingTv.setVisibility(View.GONE);
            finishTv.setVisibility(View.GONE);
            updateTv.setVisibility(View.VISIBLE);
        }

        /**
         * 下载中显示的View
         */
        public void showLoadingView() {
            updateIcon.setImageDrawable(context.getResources().getDrawable(R.mipmap.icon_update_progress));
            loadingTv.setVisibility(View.VISIBLE);
            finishTv.setVisibility(View.INVISIBLE);
            contentTv.setVisibility(View.INVISIBLE);
            updateTv.setVisibility(View.INVISIBLE);
        }


        /**
         * 下载完成后显示的View
         */
        public void showFinishView() {
            updateIcon.setImageDrawable(context.getResources().getDrawable(R.mipmap.icon_update_success));
            finishTv.setVisibility(View.VISIBLE);
            loadingTv.setVisibility(View.INVISIBLE);
            contentTv.setVisibility(View.INVISIBLE);
            updateTv.setVisibility(View.INVISIBLE);
        }

        /**
         * 更新进度
         *
         * @param progress
         */
        public void updateProgress(final int progress) {
            Handler handler = new Handler(Looper.getMainLooper());
            handler.post(new Runnable() {
                @Override
                public void run() {
                    progressTv.setText(progress + "%");
                }
            });
        }

        /**
         * 返回按钮监听
         */
        private DialogInterface.OnKeyListener keyListener = new DialogInterface.OnKeyListener() {
            public boolean onKey(DialogInterface dialog, int keyCode, KeyEvent event) {
                if (keyCode == KeyEvent.KEYCODE_BACK && event.getRepeatCount() == 0) {
                    return true;
                } else {
                    return false;
                }
            }
        };


    }

}
