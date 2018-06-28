import { Component } from 'react'
/**
 *  权限操作对象
 */
export default class ActionRightsObject extends Component {
    constructor() {
        super();
        this.items = []; // 权限项目
    }
    // 权限数量
    size = () => {
        return this.items.length;
    }
    // 查找是否拥有某个权限
    contains = (key) => {
        return this.items.indexOf(key) >= 0;
    }
}