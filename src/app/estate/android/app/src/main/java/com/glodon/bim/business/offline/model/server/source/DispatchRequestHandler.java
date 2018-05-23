package com.glodon.bim.business.offline.model.server.source;

import com.glodon.bim.business.offline.model.server.source.annotation.RequestMapping;
import com.glodon.bim.business.offline.model.server.source.exception.BaseException;
import com.glodon.bim.business.offline.model.server.source.exception.MethodNotSupported;
import com.glodon.bim.business.offline.model.server.source.exception.NotFoundException;
import com.glodon.bim.business.offline.model.server.source.exception.resolver.ExceptionResolver;
import com.glodon.bim.business.offline.model.server.source.exception.resolver.SimpleExceptionResolver;
import com.glodon.bim.business.offline.model.server.source.interceptor.Interceptor;
import com.glodon.bim.business.offline.model.server.source.util.HttpRequestParser;
import com.glodon.bim.business.offline.model.server.source.website.WebSite;
import com.glodon.bim.business.offline.model.server.source.filter.Filter;

import org.apache.httpcore.HttpException;
import org.apache.httpcore.HttpRequest;
import org.apache.httpcore.HttpResponse;
import org.apache.httpcore.protocol.HttpContext;
import org.apache.httpcore.protocol.HttpRequestHandler;

import java.io.IOException;
import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * 描述：server管理
 * 作者：zhourf on 2018/04/18
 * 邮箱：zhourf@glodon.com
 */
class DispatchRequestHandler implements HttpRequestHandler {

    private static ExceptionResolver sDefaultExceptionResolver = new SimpleExceptionResolver();

    private Interceptor mInterceptor;
    private WebSite mWebSite;
    private Map<String, RequestHandler> mRequestHandlerMapper = new LinkedHashMap<>();
    private Filter mFilter;
    private ExceptionResolver mExceptionResolver = sDefaultExceptionResolver;

    DispatchRequestHandler() {
    }

    void setInterceptor(Interceptor interceptor) {
        mInterceptor = interceptor;
    }

    void setWebSite(WebSite webSite) {
        this.mWebSite = webSite;
    }

    void registerRequestHandler(String path, RequestHandler handler) {
        mRequestHandlerMapper.put(path, handler);
    }

    void setFilter(Filter filter) {
        this.mFilter = filter;
    }

    void setExceptionResolver(ExceptionResolver exceptionResolver) {
        mExceptionResolver = exceptionResolver;
    }

    @Override
    public void handle(HttpRequest request, HttpResponse response, HttpContext context) throws HttpException, IOException {
        try {
            if (mInterceptor != null && mInterceptor.onBeforeExecute(request, response, context))
                return;

            RequestHandler handler = getRequestHandler(request, context);
            if (handler == null) {
                String path = HttpRequestParser.getRequestPath(request);
                throw new NotFoundException(path);
            } else {
                handleRequest(handler, request, response, context);
            }

            if (mInterceptor != null)
                mInterceptor.onAfterExecute(request, response, context);
        } catch (Exception e) {
            try {
                mExceptionResolver.resolveException(e, request, response, context);
            } catch (Exception ee) {
                sDefaultExceptionResolver.resolveException(e, request, response, context);
            }
        }
    }

    /**
     * Handle Request with handler.
     */
    private void handleRequest(RequestHandler handler, HttpRequest request, HttpResponse response, HttpContext context) throws HttpException, IOException {
        verifyHandler(request, handler);
        if (mFilter != null) {
            mFilter.doFilter(handler, request, response, context);
        } else {
            handler.handle(request, response, context);
        }
    }

    /**
     * The processor that gets the current request.
     */
    private RequestHandler getRequestHandler(HttpRequest request, HttpContext context) throws HttpException, IOException {
        String path = HttpRequestParser.getRequestPath(request);
        if (mWebSite != null && mWebSite.intercept(request, context)) {
            return mWebSite;
        }
        return mRequestHandlerMapper.get(path);
    }

    private void verifyHandler(HttpRequest request, RequestHandler handler) throws BaseException {
        RequestMethod requestMethod = RequestMethod.reverse(request.getRequestLine().getMethod());
        Class<?> clazz = handler.getClass();
        try {
            Method handlerMethod = clazz.getMethod("handle", HttpRequest.class, HttpResponse.class, HttpContext.class);
            RequestMapping requestMapping = handlerMethod.getAnnotation(RequestMapping.class);
            if (requestMapping != null) {
                RequestMethod[] requestMethods = requestMapping.method();
                List<RequestMethod> requestMethodList = Arrays.asList(requestMethods);
                if (!requestMethodList.contains(requestMethod)) {
                    throw new MethodNotSupported(requestMethod);
                }
            }
        } catch (NoSuchMethodException ignored) {
        }
    }
}