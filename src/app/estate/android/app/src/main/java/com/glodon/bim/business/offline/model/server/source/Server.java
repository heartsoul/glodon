package com.glodon.bim.business.offline.model.server.source;


import com.glodon.bim.business.offline.model.server.source.exception.resolver.ExceptionResolver;
import com.glodon.bim.business.offline.model.server.source.ssl.SSLSocketInitializer;
import com.glodon.bim.business.offline.model.server.source.filter.Filter;
import com.glodon.bim.business.offline.model.server.source.interceptor.Interceptor;
import com.glodon.bim.business.offline.model.server.source.website.WebSite;

import java.net.InetAddress;
import java.util.concurrent.TimeUnit;

import javax.net.ssl.SSLContext;

/**
 * 描述：server管理
 * 作者：zhourf on 2018/04/18
 * 邮箱：zhourf@glodon.com
 */
public interface Server {

    /**
     * Server running status.
     *
     * @return return true, not return false.
     */
    boolean isRunning();

    /**
     * Start the server.
     */
    void startup();

    /**
     * Get the network address.
     */
    InetAddress getInetAddress();

    /**
     * Quit the server.
     */
    void shutdown();

    interface Builder {

        /**
         * Specified server need to monitor the ip address.
         */
        Builder inetAddress(InetAddress inetAddress);

        /**
         * Specify the port on which the server listens.
         */
        Builder port(int port);

        /**
         * Connection and response timeout.
         */
        Builder timeout(int timeout, TimeUnit timeUnit);

        /**
         * Setting up the server is based on the SSL protocol.
         */
        Builder sslContext(SSLContext sslContext);

        /**
         * Set SSLServerSocket's initializer.
         */
        Builder sslSocketInitializer(SSLSocketInitializer initializer);

        /**
         * Set request/response pair interceptor.
         */
        Builder interceptor(Interceptor interceptor);

        /**
         * Set up a website.
         */
        Builder website(WebSite webSite);

        /**
         * Register a {@link RequestHandler} for a path.
         */
        Builder registerHandler(String path, RequestHandler handler);

        /**
         * Set Handler's filter.
         */
        Builder filter(Filter filter);

        /**
         * Set the exception resolver in the request/response process.
         */
        Builder exceptionResolver(ExceptionResolver resolver);

        /**
         * Set the server listener.
         */
        Builder listener(ServerListener listener);

        /**
         * Create a server.
         */
        Server build();
    }

    interface ServerListener {
        /**
         * When the server is started.
         */
        void onStarted();

        /**
         * When the server stops running.
         */
        void onStopped();

        /**
         * An error occurred while starting the server.
         */
        void onError(Exception e);
    }
}
