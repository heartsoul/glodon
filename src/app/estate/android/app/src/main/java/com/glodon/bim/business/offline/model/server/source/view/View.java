package com.glodon.bim.business.offline.model.server.source.view;

import org.apache.httpcore.Header;
import org.apache.httpcore.HttpEntity;
import org.apache.httpcore.entity.ContentType;
import org.apache.httpcore.entity.StringEntity;
import org.apache.httpcore.message.BasicHeader;
import org.apache.httpcore.message.HeaderGroup;

/**
 * 描述：server管理
 * 作者：zhourf on 2018/04/18
 * 邮箱：zhourf@glodon.com
 */
public class View {

    private int mHttpCode;
    private HttpEntity mHttpEntity;
    private HeaderGroup mHeaderGroup;

    public View(int httpCode) {
        this(httpCode, (HttpEntity) null);
    }

    public View(int httpCode, String httpBody) {
        this(httpCode, new StringEntity(httpBody, ContentType.TEXT_PLAIN));
    }

    public View(int httpCode, HttpEntity httpEntity) {
        this.mHttpCode = httpCode;
        this.mHttpEntity = httpEntity;
        this.mHeaderGroup = new HeaderGroup();
    }

    public int getHttpCode() {
        return mHttpCode;
    }

    public void setHeader(String key, String value) {
        mHeaderGroup.updateHeader(new BasicHeader(key, value));
    }

    public void addHeader(String key, String value) {
        mHeaderGroup.addHeader(new BasicHeader(key, value));
    }

    public Header[] getHeaders() {
        return mHeaderGroup.getAllHeaders();
    }

    public HttpEntity getHttpEntity() {
        return mHttpEntity;
    }
}