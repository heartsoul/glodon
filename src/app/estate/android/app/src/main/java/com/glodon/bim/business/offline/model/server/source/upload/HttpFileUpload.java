package com.glodon.bim.business.offline.model.server.source.upload;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileItemFactory;
import org.apache.commons.fileupload.FileItemIterator;
import org.apache.commons.fileupload.FileUpload;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.httpcore.HttpEntityEnclosingRequest;
import org.apache.httpcore.HttpRequest;

import java.io.IOException;
import java.util.List;
import java.util.Map;

/**
 * 描述：server管理
 * 作者：zhourf on 2018/04/18
 * 邮箱：zhourf@glodon.com
 */
public class HttpFileUpload extends FileUpload {
    
    public HttpFileUpload() {
    }

    public HttpFileUpload(FileItemFactory fileItemFactory) {
        super(fileItemFactory);
    }

    public List<FileItem> parseRequest(HttpRequest request) throws FileUploadException {
        return parseRequest(new HttpUploadContext((HttpEntityEnclosingRequest) request));
    }

    public Map<String, List<FileItem>> parseParameterMap(HttpRequest request) throws FileUploadException {
        return parseParameterMap(new HttpUploadContext((HttpEntityEnclosingRequest) request));
    }

    public FileItemIterator getItemIterator(HttpRequest request) throws FileUploadException, IOException {
        return getItemIterator(new HttpUploadContext((HttpEntityEnclosingRequest) request));
    }
}
