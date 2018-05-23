package com.glodon.bim.business.offline.model.server.source;

/**
 * 描述：server管理
 * 作者：zhourf on 2018/04/18
 * 邮箱：zhourf@glodon.com
 */
public class AndServer {

    private AndServer() {
    }

    public static Server.Builder serverBuilder() {
        return Core.newBuilder();
    }
}