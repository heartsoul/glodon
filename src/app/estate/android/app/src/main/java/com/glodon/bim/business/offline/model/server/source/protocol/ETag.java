package com.glodon.bim.business.offline.model.server.source.protocol;

import org.apache.httpcore.HttpException;
import org.apache.httpcore.HttpRequest;

import java.io.IOException;

/**
 * 描述：server管理
 * 作者：zhourf on 2018/04/18
 * 邮箱：zhourf@glodon.com
 */
public interface ETag {

    /**
     * Generate an {@code ETag} for the current Request.
     *
     * @param request current HTTP request.
     * @return eTag value.
     */
    String getETag(HttpRequest request) throws HttpException, IOException;

}