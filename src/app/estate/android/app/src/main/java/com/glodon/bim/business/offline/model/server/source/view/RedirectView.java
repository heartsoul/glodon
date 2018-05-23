package com.glodon.bim.business.offline.model.server.source.view;

/**
 * 描述：server管理
 * 作者：zhourf on 2018/04/18
 * 邮箱：zhourf@glodon.com
 */
public class RedirectView extends View {

    private static final String LOCATION = "Location";

    public RedirectView(String path) {
        super(302);
        setHeader(LOCATION, path);
    }
}