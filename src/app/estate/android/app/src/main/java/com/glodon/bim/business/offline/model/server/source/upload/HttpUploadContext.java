package com.glodon.bim.business.offline.model.server.source.upload;

import org.apache.commons.fileupload.UploadContext;
import org.apache.httpcore.Header;
import org.apache.httpcore.HttpEntity;
import org.apache.httpcore.HttpEntityEnclosingRequest;

import java.io.IOException;
import java.io.InputStream;

/**
 * 描述：server管理
 * 作者：zhourf on 2018/04/18
 * 邮箱：zhourf@glodon.com
 */
public class HttpUploadContext implements UploadContext {

    private final HttpEntity mEntity;

    public HttpUploadContext(HttpEntityEnclosingRequest request) {
        this.mEntity = request.getEntity();
    }

    @Override
    public String getCharacterEncoding() {
        Header header = mEntity.getContentEncoding();
        return header == null ? null : header.getValue();
    }

    @Override
    public String getContentType() {
        Header header = mEntity.getContentType();
        return header == null ? null : header.getValue();
    }

    @Override
    public int getContentLength() {
        long contentLength = contentLength();
        return contentLength > Integer.MAX_VALUE ? Integer.MAX_VALUE : (int) contentLength;
    }

    @Override
    public long contentLength() {
        return mEntity.getContentLength();
    }

    @Override
    public InputStream getInputStream() throws IOException {
        return this.mEntity.getContent();
    }
}
