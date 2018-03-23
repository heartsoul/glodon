package com.glodon.bim.basic.utils;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * 描述：自定义可重复key的LinkedHashMap
 * 作者：zhourf on 2017/12/5
 * 邮箱：zhourf@glodon.com
 */

public class LinkedHashList<T,K> implements Serializable {
    private List<T> keyList;
    private List<K> valueList;

    public LinkedHashList() {
        keyList = new ArrayList<>();
        valueList = new ArrayList<>();
    }

    public void put(T key,K value){
        keyList.add(key);
        valueList.add(value);
    }

    public boolean containsKey(T key){
        return keyList.contains(key);
    }

    public void remove(T key){
        int position = keyList.indexOf(key);
        keyList.remove(position);
        valueList.remove(position);
    }

    public int size(){
        return keyList.size();
    }

    public List<T> getKeyList() {
        return keyList;
    }

    public List<K> getValueList() {
        return valueList;
    }
}
