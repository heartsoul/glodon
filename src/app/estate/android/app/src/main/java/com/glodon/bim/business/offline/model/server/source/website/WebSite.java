package com.glodon.bim.business.offline.model.server.source.website;

import com.glodon.bim.business.offline.model.server.source.RequestHandler;

import org.apache.httpcore.HttpException;
import org.apache.httpcore.HttpRequest;
import org.apache.httpcore.protocol.HttpContext;

import java.io.IOException;

/**
 * 描述：server管理
 * 作者：zhourf on 2018/04/18
 * 邮箱：zhourf@glodon.com
 */
public interface WebSite extends RequestHandler {

    boolean intercept(HttpRequest request, HttpContext context) throws HttpException, IOException;
}