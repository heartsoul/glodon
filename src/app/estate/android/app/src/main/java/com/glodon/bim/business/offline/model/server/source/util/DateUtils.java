package com.glodon.bim.business.offline.model.server.source.util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.TimeZone;
/**
 * 描述：server管理
 * 作者：zhourf on 2018/04/18
 * 邮箱：zhourf@glodon.com
 */
public class DateUtils {

    /**
     * Format of http head.
     */
    public static final String FORMAT_HTTP_DATA = "EEE, dd MMM y HH:mm:ss 'GMT'";

    /**
     * Commmon TimeZone for GMT.
     */
    public static final TimeZone GMT_TIME_ZONE = TimeZone.getTimeZone("GMT");

    /**
     * Parsing the TimeZone of time in milliseconds.
     *
     * @param gmtTime GRM Time, Format such as: {@value #FORMAT_HTTP_DATA}.
     * @return The number of milliseconds from 1970.1.1.
     * @throws ParseException if an error occurs during parsing.
     */
    public static long parseGMTToMillis(String gmtTime) throws ParseException {
        SimpleDateFormat formatter = new SimpleDateFormat(FORMAT_HTTP_DATA, Locale.US);
        formatter.setTimeZone(GMT_TIME_ZONE);
        Date date = formatter.parse(gmtTime);
        return date.getTime();
    }

    /**
     * Parsing the TimeZone of time from milliseconds.
     *
     * @param milliseconds the number of milliseconds from 1970.1.1.
     * @return GRM Time, Format such as: {@value #FORMAT_HTTP_DATA}.
     */
    public static String formatMillisToGMT(long milliseconds) {
        Date date = new Date(milliseconds);
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat(FORMAT_HTTP_DATA, Locale.US);
        simpleDateFormat.setTimeZone(GMT_TIME_ZONE);
        return simpleDateFormat.format(date);
    }

}