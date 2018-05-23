package com.glodon.bim.business.offline.model.server.source;

import android.text.TextUtils;

import java.util.Locale;

/**
 * 描述：server管理
 * 作者：zhourf on 2018/04/18
 * 邮箱：zhourf@glodon.com
 */
public enum RequestMethod {

    GET("GET"), HEAD("HEAD"), POST("POST"), PUT("PUT"), PATCH("PATCH"), DELETE("DELETE"), OPTIONS("OPTIONS"), TRACE("TRACE");

    private String method;

    RequestMethod(String method) {
        this.method = method;
    }

    public String getValue() {
        return method;
    }

    /**
     * Whether to allow the body to be transmitted.
     */
    public boolean allowRequestBody() {
        switch (this) {
            case POST:
            case PUT:
            case PATCH:
            case DELETE:
                return true;
            default:
                return false;
        }
    }

    public static RequestMethod reverse(String method) {
        if (TextUtils.isEmpty(method)) return GET;

        method = method.toUpperCase(Locale.ENGLISH);
        switch (method) {
            case "GET": {
                return GET;
            }
            case "HEAD": {
                return HEAD;
            }
            case "POST": {
                return POST;
            }
            case "PUT": {
                return PUT;
            }
            case "PATCH": {
                return PATCH;
            }
            case "DELETE": {
                return DELETE;
            }
            case "OPTIONS": {
                return OPTIONS;
            }
            case "TRACE": {
                return TRACE;
            }
            default: {
                return GET;
            }
        }
    }
}