package com.glodon.bim.business.offline.model.server.source.util;

import java.io.IOException;
import java.io.InputStream;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * 描述：server管理
 * 作者：zhourf on 2018/04/18
 * 邮箱：zhourf@glodon.com
 */
public abstract class DigestUtils {

    private static final String MD5_ALGORITHM_NAME = "MD5";

    private static final char[] HEX_CHARS = {'0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'};

    /**
     * Calculate the MD5 digest of string.
     *
     * @param string string to calculate the digest over.
     * @return the digest.
     */
    public static byte[] md5Digest(String string) {
        return md5Digest(string.getBytes());
    }

    /**
     * Calculate the MD5 digest of the given bytes.
     *
     * @param bytes the bytes to calculate the digest over.
     * @return the digest.
     */
    public static byte[] md5Digest(byte[] bytes) {
        return digest(MD5_ALGORITHM_NAME, bytes);
    }

    /**
     * Calculate the MD5 digest of the given stream.
     *
     * @param inputStream the InputStream to calculate the digest over.
     * @return the digest.
     */
    public static byte[] md5Digest(InputStream inputStream) throws IOException {
        return digest(MD5_ALGORITHM_NAME, inputStream);
    }

    /**
     * Return a hexadecimal string representation of the MD5 digest of string.
     *
     * @param string string to calculate the digest over.
     * @return a hexadecimal digest string.
     */
    public static String md5DigestAsHex(String string) {
        return md5DigestAsHex(string.getBytes());
    }

    /**
     * Return a hexadecimal string representation of the MD5 digest of the given bytes.
     *
     * @param bytes the bytes to calculate the digest over.
     * @return a hexadecimal digest string.
     */
    public static String md5DigestAsHex(byte[] bytes) {
        return digestAsHexString(MD5_ALGORITHM_NAME, bytes);
    }

    /**
     * Return a hexadecimal string representation of the MD5 digest of the given stream.
     *
     * @param inputStream the InputStream to calculate the digest over.
     * @return a hexadecimal digest string.
     */
    public static String md5DigestAsHex(InputStream inputStream) throws IOException {
        return digestAsHexString(MD5_ALGORITHM_NAME, inputStream);
    }

    /**
     * Append a hexadecimal string representation of the MD5 digest of the given
     * bytes to the given {@link StringBuilder}.
     *
     * @param bytes   the bytes to calculate the digest over.
     * @param builder the string builder to append the digest to.
     * @return the given string builder.
     */
    public static StringBuilder appendMd5DigestAsHex(byte[] bytes, StringBuilder builder) {
        return appendDigestAsHex(MD5_ALGORITHM_NAME, bytes, builder);
    }

    /**
     * Append a hexadecimal string representation of the MD5 digest of the given
     * inputStream to the given {@link StringBuilder}.
     *
     * @param inputStream the inputStream to calculate the digest over.
     * @param builder     the string builder to append the digest to.
     * @return the given string builder.
     */
    public static StringBuilder appendMd5DigestAsHex(InputStream inputStream, StringBuilder builder) throws IOException {
        return appendDigestAsHex(MD5_ALGORITHM_NAME, inputStream, builder);
    }


    /**
     * Create a new {@link MessageDigest} with the given algorithm.
     * Necessary because {@code MessageDigest} is not thread-safe.
     */
    private static MessageDigest getDigest(String algorithm) {
        try {
            return MessageDigest.getInstance(algorithm);
        } catch (NoSuchAlgorithmException ex) {
            throw new IllegalStateException("Could not find MessageDigest with algorithm \"" + algorithm + "\"", ex);
        }
    }

    private static byte[] digest(String algorithm, byte[] bytes) {
        return getDigest(algorithm).digest(bytes);
    }

    private static byte[] digest(String algorithm, InputStream inputStream) throws IOException {
        MessageDigest messageDigest = getDigest(algorithm);
        final byte[] buffer = new byte[2048];
        int bytesRead;
        while ((bytesRead = inputStream.read(buffer)) != -1) {
            messageDigest.update(buffer, 0, bytesRead);
        }
        return messageDigest.digest();
    }

    private static String digestAsHexString(String algorithm, byte[] bytes) {
        char[] hexDigest = digestAsHexChars(algorithm, bytes);
        return new String(hexDigest);
    }

    private static String digestAsHexString(String algorithm, InputStream inputStream) throws IOException {
        char[] hexDigest = digestAsHexChars(algorithm, inputStream);
        return new String(hexDigest);
    }

    private static StringBuilder appendDigestAsHex(String algorithm, byte[] bytes, StringBuilder builder) {
        char[] hexDigest = digestAsHexChars(algorithm, bytes);
        return builder.append(hexDigest);
    }

    private static StringBuilder appendDigestAsHex(String algorithm, InputStream inputStream, StringBuilder builder)
            throws IOException {

        char[] hexDigest = digestAsHexChars(algorithm, inputStream);
        return builder.append(hexDigest);
    }

    private static char[] digestAsHexChars(String algorithm, byte[] bytes) {
        byte[] digest = digest(algorithm, bytes);
        return encodeHex(digest);
    }

    private static char[] digestAsHexChars(String algorithm, InputStream inputStream) throws IOException {
        byte[] digest = digest(algorithm, inputStream);
        return encodeHex(digest);
    }

    private static char[] encodeHex(byte[] bytes) {
        char chars[] = new char[32];
        for (int i = 0; i < chars.length; i = i + 2) {
            byte b = bytes[i / 2];
            chars[i] = HEX_CHARS[(b >>> 0x4) & 0xf];
            chars[i + 1] = HEX_CHARS[b & 0xf];
        }
        return chars;
    }

}