package com.glodon.bim.customview.dialog;

import android.app.Dialog;
import android.content.Context;
import android.view.Display;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.TextView;

import com.estate.R;


/**
 * 描述：拍照相片弹出框
 * 作者：zhourf on 2017/9/29
 * 邮箱：zhourf@glodon.com
 */
public class PhotoAlbumDialog {
    private Context context;
    private Dialog dialog; //悬浮框
    private Display display;//window展示
    private TextView mPhotoView,mAlbumView,mGoView,mCancelView;
    private View mLineView;

    public PhotoAlbumDialog(Context context) {
        this.context = context;
        WindowManager windowManager = (WindowManager) context
                .getSystemService(Context.WINDOW_SERVICE);
        display = windowManager.getDefaultDisplay();
    }


    public PhotoAlbumDialog builder(final View.OnClickListener photoClickListener, final View.OnClickListener albumClickListener, final View.OnClickListener goClickListener) {
        View view = LayoutInflater.from(context).inflate(R.layout.view_photo_album_dialog,null);
        mPhotoView = view.findViewById(R.id.photo_album_view_photo);
        mAlbumView = view.findViewById(R.id.photo_album_view_album);
        mGoView = view.findViewById(R.id.photo_album_view_go);
        mCancelView = view.findViewById(R.id.photo_album_view_cancel);
        mLineView = view.findViewById(R.id.photo_album_view_line);

        //设置点击事件
        mPhotoView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if(photoClickListener!=null) {
                    photoClickListener.onClick(view);
                }
                dismiss();
            }
        });
        mAlbumView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if(albumClickListener!=null) {
                    albumClickListener.onClick(view);
                }
                dismiss();
            }
        });
        mGoView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if(goClickListener!=null) {
                    goClickListener.onClick(view);
                }
                dismiss();
            }
        });

        mCancelView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                dismiss();
            }
        });
        // 设置Dialog最小宽度为屏幕宽度
        view.setMinimumWidth(display.getWidth());

        // 定义Dialog布局和参数
        dialog = new Dialog(context, R.style.transparentDialog);
        dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
        Window dialogWindow = dialog.getWindow();
//        dialogWindow.setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE |
//                WindowManager.LayoutParams.SOFT_INPUT_STATE_VISIBLE);
//        dialogWindow.setGravity(Gravity.LEFT | Gravity.CENTER);
        dialogWindow.setGravity(Gravity.BOTTOM);
        WindowManager.LayoutParams lp = dialogWindow.getAttributes();
        lp.x = 0;
        lp.y = 0;
        dialogWindow.setAttributes(lp);
        dialog.setContentView(view);

        return this;
    }

    public PhotoAlbumDialog builder(final View.OnClickListener photoClickListener, final View.OnClickListener albumClickListener) {
        View view = LayoutInflater.from(context).inflate(R.layout.view_photo_album_dialog,null);
        mPhotoView = view.findViewById(R.id.photo_album_view_photo);
        mAlbumView = view.findViewById(R.id.photo_album_view_album);
        mGoView = view.findViewById(R.id.photo_album_view_go);
        mCancelView = view.findViewById(R.id.photo_album_view_cancel);
        mLineView = view.findViewById(R.id.photo_album_view_line);

        mAlbumView.setText("相册");
        mGoView.setVisibility(View.GONE);
        mLineView.setVisibility(View.GONE);

        //设置点击事件
        mPhotoView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if(photoClickListener!=null) {
                    photoClickListener.onClick(view);
                }
                dismiss();
            }
        });
        mAlbumView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if(albumClickListener!=null) {
                    albumClickListener.onClick(view);
                }
                dismiss();
            }
        });

        mCancelView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                dismiss();
            }
        });
        // 设置Dialog最小宽度为屏幕宽度
        view.setMinimumWidth(display.getWidth());

        // 定义Dialog布局和参数
        dialog = new Dialog(context, R.style.transparentDialog);
        dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
        Window dialogWindow = dialog.getWindow();
//        dialogWindow.setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE |
//                WindowManager.LayoutParams.SOFT_INPUT_STATE_VISIBLE);
//        dialogWindow.setGravity(Gravity.LEFT | Gravity.CENTER);
        dialogWindow.setGravity(Gravity.BOTTOM);
        WindowManager.LayoutParams lp = dialogWindow.getAttributes();
        lp.x = 0;
        lp.y = 0;
        dialogWindow.setAttributes(lp);
        dialog.setContentView(view);

        return this;
    }

    public PhotoAlbumDialog setCancelable(boolean cancel) {
        dialog.setCancelable(cancel);
        return this;
    }

    public PhotoAlbumDialog setCanceledOnTouchOutside(boolean cancel) {
        dialog.setCanceledOnTouchOutside(cancel);
        return this;
    }

    public void show() {
        if(dialog!=null) {
            dialog.show();
        }
    }

    public void dismiss(){
        if(dialog!=null) {
            dialog.dismiss();
        }
    }

}
