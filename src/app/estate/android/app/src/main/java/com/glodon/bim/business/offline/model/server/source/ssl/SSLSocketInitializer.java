package com.glodon.bim.business.offline.model.server.source.ssl;

import org.apache.httpcore.impl.bootstrap.SSLServerSetupHandler;

import javax.net.ssl.SSLException;
import javax.net.ssl.SSLServerSocket;

/**
 * 描述：server管理
 * 作者：zhourf on 2018/04/18
 * 邮箱：zhourf@glodon.com
 */
public interface SSLSocketInitializer {

    void onCreated(SSLServerSocket socket) throws SSLException;

    final class SSLSocketInitializerWrapper implements SSLServerSetupHandler {

        private SSLSocketInitializer mSSLSocketInitializer;

        public SSLSocketInitializerWrapper(SSLSocketInitializer initializer) {
            this.mSSLSocketInitializer = initializer;
        }

        public void initialize(SSLServerSocket socket) throws SSLException {
            if (mSSLSocketInitializer != null) {
                mSSLSocketInitializer.onCreated(socket);
            }
        }
    }
}