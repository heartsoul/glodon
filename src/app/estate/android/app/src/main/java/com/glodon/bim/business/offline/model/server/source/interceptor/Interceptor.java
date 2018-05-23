package com.glodon.bim.business.offline.model.server.source.interceptor;

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
public interface Interceptor {

    /**
     * When receiving a request, first ask if you intercept,
     * if intercepted it will not be distributed to any {@code RequestHandler}.
     */
    boolean onBeforeExecute(HttpRequest request, HttpResponse response, HttpContext context) throws HttpException, IOException;

    /**
     * Called after any {@code RequestHandler} response.
     */
    void onAfterExecute(HttpRequest request, HttpResponse response, HttpContext context) throws HttpException, IOException;

}