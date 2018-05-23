package com.glodon.bim.business.offline.model.server.source.filter;


import com.glodon.bim.business.offline.model.server.source.RequestHandler;

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
public interface Filter {

    /**
     * Each request/response pair will be called.
     */
    void doFilter(RequestHandler handler, HttpRequest request, HttpResponse response, HttpContext context) throws HttpException, IOException;

}