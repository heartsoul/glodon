package com.glodon.bim.business.offline.model.server.source.exception;

import org.apache.httpcore.HttpEntity;
import org.apache.httpcore.HttpException;
import org.apache.httpcore.entity.ContentType;
import org.apache.httpcore.entity.StringEntity;

/**
 * 描述：server管理
 * 作者：zhourf on 2018/04/18
 * 邮箱：zhourf@glodon.com
 */
public class BaseException extends HttpException {

    private int mHttpCode;
    private HttpEntity mHttpBody;

    public BaseException() {
        this(500, "Unknown exception occurred on server.");
    }

    public BaseException(int httpCode, String httpBody) {
        super(httpBody);
        this.mHttpCode = httpCode;
        this.mHttpBody = new StringEntity(httpBody, ContentType.TEXT_PLAIN);
    }

    public int getHttpCode() {
        return mHttpCode;
    }

    public HttpEntity getHttpBody() {
        return mHttpBody;
    }
}