package com.glodon.bim.business.offline.model.server.source.filter;

import com.glodon.bim.business.offline.model.server.source.protocol.ETag;
import com.glodon.bim.business.offline.model.server.source.protocol.LastModified;
import com.glodon.bim.business.offline.model.server.source.util.DateUtils;
import com.glodon.bim.business.offline.model.server.source.util.HttpRequestParser;
import com.glodon.bim.business.offline.model.server.source.RequestHandler;
import com.glodon.bim.business.offline.model.server.source.util.DigestUtils;

import org.apache.httpcore.Header;
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
public class HttpCacheFilter implements Filter {

    private static final String CACHE_CONTROL = "Cache-Control";
    private static final String LAST_MODIFIED = "Last-Modified";
    private static final String IF_MODIFIED_SINCE = "If-Modified-Since";
    private static final String IF_UNMODIFIED_SINCE = "If-Unmodified-Since";
    private static final String E_TAG = "ETag";
    private static final String IF_NONE_MATCH = "If-None-Match";

    @Override
    public void doFilter(RequestHandler handler, HttpRequest request, HttpResponse response, HttpContext context) throws HttpException, IOException {
        boolean isLastModified;
        long sourceLastModified = -1;
        if (isLastModified = handler instanceof LastModified) {
            sourceLastModified = ((LastModified) handler).getLastModified(request);
        }

        boolean isETag;
        String sourceETag = null;
        if (isETag = handler instanceof ETag) {
            sourceETag = ((ETag) handler).getETag(request);
        }

        Header ifUnmodifiedSinceHeader = request.getFirstHeader(IF_UNMODIFIED_SINCE);
        if (isLastModified && ifUnmodifiedSinceHeader != null) {
            if (!validateIfUnmodifiedSince(request, sourceLastModified)) {
                response.setStatusCode(412);
                return;
            }
        }

        Header ifModifiedSinceHeader = request.getFirstHeader(IF_MODIFIED_SINCE);
        Header ifNoneMatchHeader = request.getFirstHeader(IF_NONE_MATCH);
        if (isLastModified && isETag) {
            if (ifModifiedSinceHeader != null && ifNoneMatchHeader != null) {
                if (validateIfModifiedSince(request, sourceLastModified) && validateIfNoneMatch(request, sourceETag)) {
                    response.setStatusCode(304);
                    response.addHeader(CACHE_CONTROL, "public");
                    response.addHeader(LAST_MODIFIED, generateLastModified(sourceLastModified));
                    response.addHeader(E_TAG, generateETag(sourceETag));
                    return;
                }
            }
        }

        if (isLastModified && ifModifiedSinceHeader != null) {
            if (validateIfModifiedSince(request, sourceLastModified)) {
                response.setStatusCode(304);
                response.addHeader(CACHE_CONTROL, "public");
                response.addHeader(LAST_MODIFIED, generateLastModified(sourceLastModified));
                return;
            }
        }

        handler.handle(request, response, context);

        if (isLastModified && sourceLastModified >= 0) {
            response.addHeader(LAST_MODIFIED, generateLastModified(sourceLastModified));
        }
        if (isETag && sourceETag != null) {
            response.addHeader(E_TAG, generateETag(sourceETag));
        }
        if (isLastModified) {
            response.addHeader(CACHE_CONTROL, "public");
        }
    }

    /**
     * Generate the {@code ETag} header value from the given response body byte array.
     * <p>The default implementation generates an MD5 hash.</p>
     *
     * @param tag tag of the source.
     * @return the {@code ETag} header value.
     */
    protected String generateETag(String tag) throws IOException {
        return "\"0" + DigestUtils.md5DigestAsHex(tag) + '"';
    }

    /**
     * Verify if the requested {@code If-None-Match} header is still valid.
     *
     * @param request    current request.
     * @param sourceETag tag of the source.
     * @return true, otherwise is false.
     */
    protected boolean validateIfNoneMatch(HttpRequest request, String sourceETag) {
        Header eTagHeader = request.getFirstHeader(IF_NONE_MATCH);
        if (sourceETag == null && eTagHeader == null) return true;

        if (sourceETag != null && eTagHeader != null) {
            String ifNoneMatch = eTagHeader.getValue();
            return sourceETag.equalsIgnoreCase(ifNoneMatch);
        }
        return false;
    }

    /**
     * Generate the {@code Last-Modified} header value from the given response body byte array.
     *
     * @param lastModified last modified timestamp of the source.
     * @return the {@code Last-Modified} header value.
     */
    protected String generateLastModified(long lastModified) throws IOException {
        return DateUtils.formatMillisToGMT(lastModified);
    }

    /**
     * Verify if the requested {@code If-Modified-Since} property is still valid.
     *
     * @param request          current request.
     * @param sourceLastModify last modified timestamp of the source.
     * @return true, otherwise is false.
     */
    protected boolean validateIfModifiedSince(HttpRequest request, long sourceLastModify) {
        if (sourceLastModify < 0) {
            return false;
        }
        long ifModifiedSince = HttpRequestParser.parseDateHeader(request, IF_MODIFIED_SINCE);
        if (ifModifiedSince < 0) {
            return false;
        }
        return ifModifiedSince >= (sourceLastModify / 1000 * 1000);
    }

    /**
     * Verify if the requested {@code If-Unmodified-Since} property is still valid.
     *
     * @param request          current request.
     * @param sourceLastModify last modified timestamp of the source.
     * @return true, otherwise is false.
     */
    protected boolean validateIfUnmodifiedSince(HttpRequest request, long sourceLastModify) {
        if (sourceLastModify < 0) {
            return false;
        }
        long ifUnmodifiedSince = HttpRequestParser.parseDateHeader(request, IF_UNMODIFIED_SINCE);
        if (ifUnmodifiedSince < 0) {
            return false;
        }
        return ifUnmodifiedSince < (sourceLastModify / 1000 * 1000);
    }
}