package com.glodon.bim.business.offline.model.server.source.exception;


import com.glodon.bim.business.offline.model.server.source.RequestMethod;

/**
 * 描述：server管理
 * 作者：zhourf on 2018/04/18
 * 邮箱：zhourf@glodon.com
 */
public class MethodNotSupported extends BaseException {

    public MethodNotSupported(RequestMethod method) {
        super(405, String.format("The %1$s method is not supported.", method.getValue()));
    }
}