package com.glodon.bim.business.offline.model.server.source;

import org.apache.httpcore.HttpException;
import org.apache.httpcore.HttpRequest;
import org.apache.httpcore.HttpResponse;
import org.apache.httpcore.protocol.HttpContext;

import java.io.IOException;

/**
 * 描述：server管理
 * 作者：zhourf on 2018/04/18
 * 邮箱：zhourf@glodon.com
 */
public interface RequestHandler {

    /**
     * When is the client request is triggered.
     *
     * @param request  {@link HttpRequest}.
     * @param response {@link HttpResponse}.
     * @param context  {@link HttpContext}.
     * @throws HttpException may be.
     * @throws IOException   read data.
     */
    void handle(HttpRequest request, HttpResponse response, HttpContext context) throws HttpException, IOException;
}