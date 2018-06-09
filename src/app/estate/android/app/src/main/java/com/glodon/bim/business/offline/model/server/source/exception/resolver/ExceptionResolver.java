package com.glodon.bim.business.offline.model.server.source.exception.resolver;

import org.apache.httpcore.HttpRequest;
import org.apache.httpcore.HttpResponse;
import org.apache.httpcore.protocol.HttpContext;

/**
 * 描述：server管理
 * 作者：zhourf on 2018/04/18
 * 邮箱：zhourf@glodon.com
 */
public interface ExceptionResolver {

    /**
     * The exception here is thrown by {@code AndServer} or {@code RequestHandler}.
     * Equivalent to the interception of anomalies, unified treatment of anomalies here.
     */
    void resolveException(Exception e, HttpRequest request, HttpResponse response, HttpContext context);
}