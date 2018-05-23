package com.glodon.bim.business.offline.model.server.source.util;

import android.os.Handler;
import android.os.Looper;

import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Future;

/**
 * 描述：server管理
 * 作者：zhourf on 2018/04/18
 * 邮箱：zhourf@glodon.com
 */
public final class Executors {

    private static Executors instance;

    /**
     * Get instance.
     *
     */
    public static Executors getInstance() {
        if (instance == null)
            synchronized (Executors.class) {
                if (instance == null)
                    instance = new Executors();
            }
        return instance;
    }

    /**
     * Executor Service.
     */
    private final ExecutorService mService;

    /**
     * Handler.
     */
    private static Handler mHandler;

    private Executors() {
        mService = java.util.concurrent.Executors.newCachedThreadPool();
        mHandler = new Handler(Looper.getMainLooper());
    }

    /**
     * Execute a runnable.
     */
    public void execute(Runnable runnable) {
        mService.execute(runnable);
    }

    /**
     * Submit a runnable.
     */
    public Future<?> submit(Runnable runnable) {
        return mService.submit(runnable);
    }

    /**
     * Submit a runnable.
     */
    public <T> Future<T> submit(Runnable runnable, T result) {
        return mService.submit(runnable, result);
    }

    /**
     * Submit a callable.
     */
    public <T> Future<T> submit(Callable<T> callable) {
        return mService.submit(callable);
    }

    /**
     * Post a runnable.
     */
    public void post(Runnable command) {
        mHandler.post(command);
    }
}
