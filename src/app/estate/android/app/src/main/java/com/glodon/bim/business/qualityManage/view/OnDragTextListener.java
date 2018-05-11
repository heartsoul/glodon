package com.glodon.bim.business.qualityManage.view;

/**
 * 描述：拖动文字的监听
 * 作者：zhourf on 2017/10/20
 * 邮箱：zhourf@glodon.com
 */

public interface OnDragTextListener {

    /**
     * 开始拖动
     */
    void onStartDrag();

    /**
     * 结束拖动
     */
    void onStopDrag();
}
