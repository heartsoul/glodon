package com.glodon.bim.business.offline.model.server.source.view;

import org.apache.httpcore.HttpEntity;

/**
 * 描述：server管理
 * 作者：zhourf on 2018/04/18
 * 邮箱：zhourf@glodon.com
 */
public class OkView extends View {

    public OkView() {
        super(200);
    }

    public OkView(String httpBody) {
        super(200, httpBody);
    }

    public OkView(HttpEntity httpEntity) {
        super(200, httpEntity);
    }
}