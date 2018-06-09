package com.glodon.bim.business.offline.model.server.source.protocol;

import org.apache.httpcore.HttpException;
import org.apache.httpcore.HttpRequest;

import java.io.IOException;

/**
 * 描述：server管理
 * 作者：zhourf on 2018/04/18
 * 邮箱：zhourf@glodon.com
 */
public interface LastModified {

    /**
     * The return value will be sent to the HTTP client as {@code Last-Modified }header,
     * and compared with {@code If-Modified-Since} headers that the client sends back.
     * The content will only get regenerated if there has been a modification.
     *
     * @param request current HTTP request.
     * @return the time the underlying resource was last modified,
     * {@code <0} meaning that the content must always be regenerated.
     */
    long getLastModified(HttpRequest request) throws HttpException, IOException;

}