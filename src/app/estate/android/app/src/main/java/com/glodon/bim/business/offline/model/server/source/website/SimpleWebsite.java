package com.glodon.bim.business.offline.model.server.source.website;

import com.glodon.bim.basic.log.LogUtil;
import com.glodon.bim.business.offline.model.server.source.util.HttpRequestParser;
import com.glodon.bim.business.offline.model.server.source.exception.NotFoundException;
import com.glodon.bim.business.offline.model.server.source.view.View;

import org.apache.httpcore.HttpException;
import org.apache.httpcore.HttpRequest;
import org.apache.httpcore.HttpResponse;
import org.apache.httpcore.protocol.HttpContext;

import java.io.File;
import java.io.IOException;

public abstract class SimpleWebsite implements WebSite {

    protected static final String INDEX_FILE_PATH = "/index.html";

    /**
     * Remove the '/' at the beginning.
     *
     * @param target target string.
     * @return rule result.
     */
    protected String addStartSlash(String target) {
        if (!target.startsWith(File.separator)) target = File.separator + target;
        return target;
    }

    /**
     * Remove the '/' at the beginning.
     *
     * @param target target string.
     * @return rule result.
     */
    protected String addEndSlash(String target) {
        if (!target.endsWith(File.separator)) target = target + File.separator;
        return target;
    }

    /**
     * Remove the '/' at the beginning.
     *
     * @param target target string.
     * @return rule result.
     */
    protected String trimStartSlash(String target) {
        while (target.startsWith(File.separator)) target = target.substring(1);
        return target;
    }

    /**
     * Remove the '/' at the end of the string.
     *
     * @param target target string.
     * @return rule result.
     */
    protected String trimEndSlash(String target) {
        while (target.endsWith(File.separator)) target = target.substring(0, target.length() - 1);
        return target;
    }

    /**
     * Remove the '/' at the beginning and end of the string.
     *
     * @param target target string.
     * @return rule result.
     */
    protected String trimSlash(String target) {
        target = trimStartSlash(target);
        target = trimEndSlash(target);
        return target;
    }

    @Override
    public void handle(HttpRequest request, HttpResponse response, HttpContext context) throws HttpException, IOException {
        View view = handle(request, response);
        response.setStatusCode(view.getHttpCode());
        response.setEntity(view.getHttpEntity());
        response.setHeaders(view.getHeaders());
        LogUtil.e("---------------");
        String url = request.getRequestLine().getUri();
        LogUtil.e("url="+url);
        LogUtil.e(request.toString());

        LogUtil.e("---------------");
        if(url.endsWith(".gz")) {
            response.setHeader("Content-Encoding", "gzip");
        }
//        response.setHeader("Content-Type","application/json;charset=utf-8");
//        for(Header h :response.getAllHeaders()){
//            LogUtil.e("headers="+h.getName()+"  =  "+h.getValue());
//        }
//        response.addHeader("","");
    }

    protected View handle(HttpRequest request, HttpResponse response) throws HttpException, IOException {
        return handle(request);
    }

    protected View handle(HttpRequest request) throws HttpException, IOException {
        throw new NotFoundException(HttpRequestParser.getRequestPath(request));
    }
}