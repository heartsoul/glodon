package com.glodon.bim.business.offline.model.server.source.website;

import android.content.res.AssetManager;
import android.os.SystemClock;

import com.glodon.bim.business.offline.model.server.source.exception.NotFoundException;
import com.glodon.bim.business.offline.model.server.source.protocol.ETag;
import com.glodon.bim.business.offline.model.server.source.protocol.LastModified;
import com.glodon.bim.business.offline.model.server.source.util.AssetsReader;
import com.glodon.bim.business.offline.model.server.source.util.HttpRequestParser;
import com.glodon.bim.business.offline.model.server.source.view.View;

import org.apache.httpcore.HttpEntity;
import org.apache.httpcore.HttpException;
import org.apache.httpcore.HttpRequest;
import org.apache.httpcore.entity.ContentType;
import org.apache.httpcore.entity.InputStreamEntity;
import org.apache.httpcore.protocol.HttpContext;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.Charset;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static com.glodon.bim.business.offline.model.server.source.util.FileUtils.getMimeType;

/**
 * 描述：server管理
 * 作者：zhourf on 2018/04/18
 * 邮箱：zhourf@glodon.com
 */
public class AssetsWebsite extends SimpleWebsite implements LastModified, ETag {

    private final AssetsReader mAssetsReader;
    private final String mRootPath;
    private final Map<String, String> mPatternMap;

    private boolean isScanned;


    /**
     * Assets Website.
     *
     * @param assetManager {@link AssetsReader}.
     * @param rootPath     site root directory in assets, such as: {@code ""}, {@code "website"}.
     */
    public AssetsWebsite(AssetManager assetManager, String rootPath) {
        this.mAssetsReader = new AssetsReader(assetManager);
        this.mRootPath = rootPath;
        this.mPatternMap = new LinkedHashMap<>();
    }

    @Override
    public boolean intercept(HttpRequest request, HttpContext context) {
        tryScanFile();

        String httpPath = HttpRequestParser.getRequestPath(request);
        return mPatternMap.containsKey(httpPath);
    }

    /**
     * Try to scan the file, no longer scan if it has already been scanned.
     */
    private void tryScanFile() {
        if (!isScanned) {
            synchronized (AssetsWebsite.class) {
                if (!isScanned) {
                    onScanFile(mRootPath, mAssetsReader, mPatternMap);
                    isScanned = true;
                }
            }
        }
    }

    /**
     * Scan Assets under the file.
     *
     * @param rootPath     The location to scan.
     * @param assetsReader Asset content reader.
     * @param patternMap   The file corresponds to the http path as the key, the file path as the value.
     */
    protected void onScanFile(String rootPath, AssetsReader assetsReader, Map<String, String> patternMap) {
        List<String> fileList = assetsReader.scanFile(rootPath);
        if (fileList.size() > 0) {
            for (String filePath : fileList) {
                String httpPath = trimStartSlash(filePath);
                httpPath = httpPath.substring(rootPath.length(), httpPath.length());
                httpPath = addStartSlash(httpPath);
                patternMap.put(httpPath, filePath);

                if (filePath.endsWith(INDEX_FILE_PATH)) {
                    httpPath = httpPath.substring(0, httpPath.indexOf(INDEX_FILE_PATH));
                    patternMap.put(httpPath, filePath);
                    patternMap.put(addEndSlash(httpPath), filePath);
                }
            }
        }
    }

    @Override
    public View handle(HttpRequest request) throws HttpException, IOException {
        String httpPath = HttpRequestParser.getRequestPath(request);
        String filePath = mPatternMap.get(httpPath);
        InputStream source = mAssetsReader.getInputStream(filePath);
        if (source == null)
            throw new NotFoundException(httpPath);

        int length = source.available();
        String mimeType = getMimeType(filePath);

        HttpEntity httpEntity = new InputStreamEntity(source, length, ContentType.create(mimeType, Charset.defaultCharset()));
        return new View(200, httpEntity);
    }

    @Override
    public long getLastModified(HttpRequest request) throws IOException {
        String httpPath = trimEndSlash(HttpRequestParser.getRequestPath(request));
        String filePath = mPatternMap.get(httpPath);
        InputStream source = mAssetsReader.getInputStream(filePath);
        if (source != null)
            return System.currentTimeMillis() - SystemClock.currentThreadTimeMillis();
        return -1;
    }

    @Override
    public String getETag(HttpRequest request) throws IOException {
        String httpPath = trimEndSlash(HttpRequestParser.getRequestPath(request));
        String filePath = mPatternMap.get(httpPath);
        InputStream source = mAssetsReader.getInputStream(filePath);
        if (source != null) {
            long sourceSize = source.available();
            return sourceSize + filePath;
        }
        return null;
    }
}