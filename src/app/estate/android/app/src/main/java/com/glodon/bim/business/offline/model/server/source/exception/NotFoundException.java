package com.glodon.bim.business.offline.model.server.source.exception;

/**
 * 描述：server管理
 * 作者：zhourf on 2018/04/18
 * 邮箱：zhourf@glodon.com
 */
public class NotFoundException extends BaseException {

    public NotFoundException(String path) {
        super(404, String.format("The resource [%1$s] does not exist.", path));
    }
}