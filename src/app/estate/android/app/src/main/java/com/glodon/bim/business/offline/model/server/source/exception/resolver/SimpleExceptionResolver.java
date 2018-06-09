package com.glodon.bim.business.offline.model.server.source.exception.resolver;

import com.glodon.bim.business.offline.model.server.source.view.View;
import com.glodon.bim.business.offline.model.server.source.exception.BaseException;

import org.apache.httpcore.HttpEntity;
import org.apache.httpcore.HttpRequest;
import org.apache.httpcore.HttpResponse;
import org.apache.httpcore.entity.ContentType;
import org.apache.httpcore.entity.StringEntity;
import org.apache.httpcore.protocol.HttpContext;

/**
 * 描述：server管理
 * 作者：zhourf on 2018/04/18
 * 邮箱：zhourf@glodon.com
 */
public class SimpleExceptionResolver implements ExceptionResolver {

    @Override
    public final void resolveException(Exception e, HttpRequest request, HttpResponse response, HttpContext context) {
        View view = resolveException(e, request, response);
        response.setStatusCode(view.getHttpCode());
        response.setEntity(view.getHttpEntity());
        response.setHeaders(view.getHeaders());
    }

    public View resolveException(Exception e, HttpRequest request, HttpResponse response) {
        return resolveException(e);
    }

    protected View resolveException(Exception e) {
        if (e instanceof BaseException) {
            BaseException exception = (BaseException) e;
            return new View(exception.getHttpCode(), exception.getHttpBody());
        }
        String message = String.format("Server error occurred:\n%1$s", e.getMessage());
        HttpEntity httpEntity = new StringEntity(message, ContentType.TEXT_PLAIN);
        return new View(500, httpEntity);
    }
}