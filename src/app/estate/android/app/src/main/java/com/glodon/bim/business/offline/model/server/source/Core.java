package com.glodon.bim.business.offline.model.server.source;

import com.glodon.bim.business.offline.model.server.source.exception.resolver.ExceptionResolver;
import com.glodon.bim.business.offline.model.server.source.filter.Filter;
import com.glodon.bim.business.offline.model.server.source.interceptor.Interceptor;
import com.glodon.bim.business.offline.model.server.source.ssl.SSLSocketInitializer;
import com.glodon.bim.business.offline.model.server.source.util.Executors;
import com.glodon.bim.business.offline.model.server.source.website.WebSite;

import org.apache.httpcore.ExceptionLogger;
import org.apache.httpcore.config.ConnectionConfig;
import org.apache.httpcore.config.SocketConfig;
import org.apache.httpcore.impl.bootstrap.HttpServer;
import org.apache.httpcore.impl.bootstrap.ServerBootstrap;

import java.net.InetAddress;
import java.nio.charset.Charset;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import javax.net.ssl.SSLContext;
/**
 * 描述：server管理
 * 作者：zhourf on 2018/04/18
 * 邮箱：zhourf@glodon.com
 */
final class Core implements Server {

    static Builder newBuilder() {
        return new Builder();
    }

    private final InetAddress mInetAddress;
    private final int mPort;
    private final int mTimeout;
    private final SSLContext mSSLContext;
    private final SSLSocketInitializer mSSLSocketInitializer;
    private final Interceptor mInterceptor;
    private final WebSite mWebSite;
    private final Map<String, RequestHandler> mRequestHandlerMap;
    private final Filter mFilter;
    private final ExceptionResolver mExceptionResolver;
    private final ServerListener mListener;

    private HttpServer mHttpServer;
    private boolean isRunning;

    private Core(Builder builder) {
        this.mInetAddress = builder.mInetAddress;
        this.mPort = builder.mPort;
        this.mTimeout = builder.mTimeout;
        this.mSSLContext = builder.mSSLContext;
        this.mSSLSocketInitializer = builder.mSSLSocketInitializer;
        this.mInterceptor = builder.mInterceptor;
        this.mWebSite = builder.mWebSite;
        this.mRequestHandlerMap = builder.mRequestHandlerMap;
        this.mFilter = builder.mFilter;
        this.mExceptionResolver = builder.mExceptionResolver;
        this.mListener = builder.mListener;
    }

    @Override
    public boolean isRunning() {
        return isRunning;
    }

    @Override
    public void startup() {
        if (isRunning) return;

        Executors.getInstance().submit(new Runnable() {
            @Override
            public void run() {
                DispatchRequestHandler handler = new DispatchRequestHandler();
                handler.setInterceptor(mInterceptor);
                handler.setWebSite(mWebSite);
                if (mRequestHandlerMap != null && mRequestHandlerMap.size() > 0) {
                    for (Map.Entry<String, RequestHandler> handlerEntry : mRequestHandlerMap.entrySet()) {
                        String path = handlerEntry.getKey();
                        RequestHandler requestHandler = handlerEntry.getValue();
                        handler.registerRequestHandler(path, requestHandler);
                    }
                }
                handler.setFilter(mFilter);
                handler.setExceptionResolver(mExceptionResolver);

                mHttpServer = ServerBootstrap.bootstrap()
                        .setSocketConfig(
                                SocketConfig.custom()
                                        .setSoKeepAlive(true)
                                        .setSoReuseAddress(false)
                                        .setSoTimeout(mTimeout)
                                        .setTcpNoDelay(false)
                                        .build()
                        )
                        .setConnectionConfig(
                                ConnectionConfig.custom()
                                        .setBufferSize(4 * 1024)
                                        .setCharset(Charset.defaultCharset())
                                        .build()
                        )
                        .setLocalAddress(mInetAddress)
                        .setListenerPort(mPort)
                        .setSslContext(mSSLContext)
                        .setSslSetupHandler(new SSLSocketInitializer.SSLSocketInitializerWrapper(mSSLSocketInitializer))
                        .setServerInfo("AndServer")
                        .registerHandler("*", handler)
                        .setExceptionLogger(ExceptionLogger.STD_ERR)
                        .create();
                try {
                    isRunning = true;
                    mHttpServer.start();

                    Executors.getInstance().post(new Runnable() {
                        @Override
                        public void run() {
                            if (mListener != null)
                                mListener.onStarted();
                        }
                    });
                    Runtime.getRuntime().addShutdownHook(new Thread() {
                        @Override
                        public void run() {
                            mHttpServer.shutdown(3, TimeUnit.SECONDS);
                        }
                    });
                } catch (final Exception e) {
                    Executors.getInstance().post(new Runnable() {
                        @Override
                        public void run() {
                            if (mListener != null)
                                mListener.onError(e);
                        }
                    });
                }
            }
        });
    }

    /**
     * The current server InetAddress.
     */
    @Override
    public InetAddress getInetAddress() {
        if (isRunning)
            return mHttpServer.getInetAddress();
        return null;
    }

    /**
     * Stop core server.
     */
    @Override
    public void shutdown() {
        if (!isRunning) return;

        Executors.getInstance().execute(new Runnable() {
            @Override
            public void run() {
                if (mHttpServer != null)
                    mHttpServer.shutdown(3, TimeUnit.MINUTES);

                Executors.getInstance().post(new Runnable() {
                    @Override
                    public void run() {
                        if (mListener != null)
                            mListener.onStopped();
                    }
                });
            }
        });
    }

    private static final class Builder implements Server.Builder {

        private InetAddress mInetAddress;
        private int mPort;
        private int mTimeout;
        private SSLContext mSSLContext;
        private SSLSocketInitializer mSSLSocketInitializer;
        private Interceptor mInterceptor;
        private WebSite mWebSite;
        private Map<String, RequestHandler> mRequestHandlerMap;
        private Filter mFilter;
        private ExceptionResolver mExceptionResolver;
        private ServerListener mListener;

        private Builder() {
            this.mRequestHandlerMap = new LinkedHashMap<>();
        }

        @Override
        public Server.Builder inetAddress(InetAddress inetAddress) {
            this.mInetAddress = inetAddress;
            return this;
        }

        @Override
        public Server.Builder port(int port) {
            this.mPort = port;
            return this;
        }

        @Override
        public Server.Builder timeout(int timeout, TimeUnit timeUnit) {
            long timeoutMs = timeUnit.toMillis(timeout);
            this.mTimeout = (int) Math.min(timeoutMs, Integer.MAX_VALUE);
            return this;
        }

        @Override
        public Server.Builder sslContext(SSLContext sslContext) {
            this.mSSLContext = sslContext;
            return this;
        }

        @Override
        public Server.Builder sslSocketInitializer(SSLSocketInitializer initializer) {
            this.mSSLSocketInitializer = initializer;
            return this;
        }

        @Override
        public Server.Builder interceptor(Interceptor interceptor) {
            this.mInterceptor = interceptor;
            return this;
        }

        @Override
        public Server.Builder exceptionResolver(ExceptionResolver resolver) {
            this.mExceptionResolver = resolver;
            return this;
        }

        @Override
        public Server.Builder registerHandler(String path, RequestHandler handler) {
            this.mRequestHandlerMap.put(path, handler);
            return this;
        }

        @Override
        public Server.Builder filter(Filter filter) {
            this.mFilter = filter;
            return this;
        }

        @Override
        public Server.Builder website(WebSite webSite) {
            this.mWebSite = webSite;
            return this;
        }

        @Override
        public Server.Builder listener(ServerListener listener) {
            this.mListener = listener;
            return this;
        }

        @Override
        public Server build() {
            return new Core(this);
        }
    }
}