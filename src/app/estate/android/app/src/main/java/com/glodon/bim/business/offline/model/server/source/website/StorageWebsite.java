package com.glodon.bim.business.offline.model.server.source.website;

import com.glodon.bim.business.offline.model.server.source.exception.NotFoundException;
import com.glodon.bim.business.offline.model.server.source.protocol.ETag;
import com.glodon.bim.business.offline.model.server.source.protocol.LastModified;
import com.glodon.bim.business.offline.model.server.source.util.HttpRequestParser;
import com.glodon.bim.business.offline.model.server.source.view.View;

import org.apache.httpcore.HttpEntity;
import org.apache.httpcore.HttpException;
import org.apache.httpcore.HttpRequest;
import org.apache.httpcore.entity.ContentType;
import org.apache.httpcore.entity.FileEntity;
import org.apache.httpcore.protocol.HttpContext;

import java.io.File;
import java.io.IOException;
import java.nio.charset.Charset;

import static com.glodon.bim.business.offline.model.server.source.util.FileUtils.getMimeType;

/**
 * 描述：server管理
 * 作者：zhourf on 2018/04/18
 * 邮箱：zhourf@glodon.com
 */
public class StorageWebsite extends SimpleWebsite implements LastModified, ETag {

    private final String mRootPath;

    public StorageWebsite(String rootPath) {
        this.mRootPath = rootPath;
    }

    @Override
    public boolean intercept(HttpRequest request, HttpContext context) throws HttpException, IOException {
        String httpPath = HttpRequestParser.getRequestPath(request);
        httpPath = "/".equals(httpPath) ? "/" : trimEndSlash(HttpRequestParser.getRequestPath(request));
        File source = findPathSource(httpPath);
        return source != null;
    }

    /**
     * Find the path specified resource.
     *
     * @param httpPath path.
     * @return return if the file is found.
     */
    private File findPathSource(String httpPath) {
        if ("/".equals(httpPath)) {
            File indexFile = new File(mRootPath, INDEX_FILE_PATH);
            if (indexFile.exists() && indexFile.isFile()) {
                return indexFile;
            }
        } else {
            File sourceFile = new File(mRootPath, httpPath);
            if (sourceFile.exists()) {
                if (sourceFile.isFile()) {
                    return sourceFile;
                } else {
                    File childIndexFile = new File(sourceFile, INDEX_FILE_PATH);
                    if (childIndexFile.exists() && childIndexFile.isFile()) {
                        return childIndexFile;
                    }
                }
            }
        }
        return null;
    }

    @Override
    public View handle(HttpRequest request) throws HttpException, IOException {
        String httpPath = trimEndSlash(HttpRequestParser.getRequestPath(request));
        File source = findPathSource(httpPath);
        if (source == null)
            throw new NotFoundException(httpPath);
        return generateSourceView(source);
    }

    /**
     * Generate {@code View} for source.
     *
     * @param source file.
     * @return view of source.
     */
    private View generateSourceView(File source) throws IOException {
        String mimeType = getMimeType(source.getAbsolutePath());
        HttpEntity httpEntity = new FileEntity(source, ContentType.create(mimeType, Charset.defaultCharset()));
        return new View(200, httpEntity);
    }

    @Override
    public long getLastModified(HttpRequest request) throws IOException {
        String httpPath = trimEndSlash(HttpRequestParser.getRequestPath(request));
        File source = findPathSource(httpPath);
        if (source != null)
            return source.lastModified();
        return -1;
    }

    @Override
    public String getETag(HttpRequest request) throws IOException {
        String httpPath = trimEndSlash(HttpRequestParser.getRequestPath(request));
        File source = findPathSource(httpPath);
        if (source != null) {
            long sourceSize = source.length();
            String sourcePath = source.getAbsolutePath();
            long lastModified = source.lastModified();
            return sourceSize + sourcePath + lastModified;
        }
        return null;
    }
}