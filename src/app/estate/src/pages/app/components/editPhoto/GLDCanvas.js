import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    TextInput,
    SafeAreaView,
    Dimensions,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';

var { width, height } = Dimensions.get('window')

const EditState = {
    EDIT_LINE: "EDIT_LINE",
    EDIT_TEXT: "EDIT_TEXT",
    INIT: "INIT",
}

export default class GLDCanvas extends Component {

    canvas;
    ctx;
    dotColors = [
        "#ffffff",
        "#000000",
        "#fe1d11",
        "#fbf412",
        "#16e113",
        "#1b9aff",
        "#850af8",
        "#fe01ff",
    ]
    tempCount = 0;//编辑状态下，新添加的线的数量，用于取消时候做pop操作
    id = 0;//每个input的唯一id
    placeHolderHeight = 252;
    constructor(props) {
        super(props)
        this.state = {
            imageDatas: [],
            selectedDotColor: "#ffffff",
            inputNodes: [],
            editState: EditState.INIT,
            deleteVisible: false,
            showDotPlaceHolder: false,
        }
    }

    componentDidMount() {
        this._initCanvas();
        this._registerKeyboardListener();
    }
    _registerKeyboardListener = () => {
        if (isAndroid()) {
            var clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
            window.addEventListener('resize', () => {
                var nowClientHeight = document.documentElement.clientHeight || document.body.clientHeight;
                if (clientHeight > nowClientHeight && this.state.editState == EditState.EDIT_TEXT) {
                    let placeholderHeight = parseInt(clientHeight) - parseInt(nowClientHeight);
                    this.placeHolderHeight = placeholderHeight;
                    //键盘弹出的事件处理
                    this._setPlaceHolder(placeholderHeight);
                } else {
                    this._setPlaceHolder(0);
                }
            });

        } else if (isiOS()) {
            document.addEventListener('focusin', (ev) => {
                //软键盘弹出的事件处理
                let len = this.state.inputNodes.length;
                setTimeout(() => {
                    if (this.state.editState == EditState.EDIT_TEXT && len > 0 && ev && ev.target && ev.target.id === `transform_input_${this.state.inputNodes[len - 1].id}`) {
                        this._setPlaceHolder(252);
                    } else {
                        this._setPlaceHolder(0);
                    }
                }, 200)

            });
            document.addEventListener('focusout', (ev) => {
                let len = this.state.inputNodes.length;
                //软键盘收起的事件处理
                setTimeout(() => {
                    this._setPlaceHolder(0);
                }, 100)
            });
        }

    }
    _setPlaceHolder = (height) => {
        let ele = document.getElementById("placeholder");
        if (ele) {
            ele.style.height = height;
        }
    }
    //
    _initCanvas() {
        this.canvas = document.getElementById("myCanvas");
        this.ctx = this.canvas.getContext("2d");
        var img = document.createElement('img');
        img.onload = () => {
            this._drawImage(img);
        }
        img.src = this.props.url;

        this.canvas.addEventListener('touchstart', this._touchEvents, false);
        this.canvas.addEventListener('touchmove', this._touchEvents, false);
        this.canvas.addEventListener('touchend', this._touchEvents, false);
    }
    //把图片绘制到画布
    _drawImage(img) {
        let size = this._calcuteImgSize(img);
        img.width = size.width;
        img.height = size.height;
        this.canvas.width = size.width;
        this.canvas.height = size.height;
        this.ctx.drawImage(img, 0, 0, img.width, img.height); // 将图像绘制到canvas上  
        this.state.imageDatas.push(this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height));
    }

    //按屏幕比例缩放
    _calcuteImgSize(img) {
        let wScale = img.width / width;
        let hScale = img.height / height;
        let scale = (wScale > hScale) ? wScale : hScale;
        let size = {
            width: img.width / scale,
            height: img.height / scale
        }
        return size;
    }

    //触摸
    _touchEvents = (e) => {
        if (this.state.editState != EditState.EDIT_LINE) {
            return;
        }
        e.preventDefault();
        if (e.type == "touchstart") {
            let touch = event.touches[0];
            let startx = touch.pageX;
            let starty = touch.pageY;
            this.ctx.beginPath();//开始路径
            this.ctx.moveTo(startx - this.canvas.offsetLeft, starty - this.canvas.offsetTop);
        } else if (e.type == "touchmove") {
            let touch = event.touches[0];
            let movex = touch.pageX;
            let movey = touch.pageY;
            this.ctx.strokeStyle = this.state.selectedDotColor;
            this.ctx.lineTo(movex - this.canvas.offsetLeft, movey - this.canvas.offsetTop);
            this.ctx.stroke();
        } else if (e.type == "touchend" || e.type == "touchcancel") {
            this.state.imageDatas.push(this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height));
            this.tempCount++;
            this.setState({
                imageDatas: [...this.state.imageDatas,]
            })
        }
    }
    //撤销画笔
    reset = (count) => {
        if (this.state.imageDatas && this.state.imageDatas.length > 1) {
            if (!count) {
                this.state.imageDatas.pop();
            } else {
                this.state.imageDatas.splice(this.state.imageDatas.length - this.tempCount, this.tempCount)
            }
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // canvas清屏
            if (this.state.imageDatas.length > 0) {
                this.ctx.putImageData(this.state.imageDatas[this.state.imageDatas.length - 1], 0, 0, 0, 0, width, height);
                this.setState({
                    imageDatas: [...this.state.imageDatas,]
                })
            }
        }
    }


    _addLine = () => {
        if (this.state.editState != EditState.INIT) {
            return;
        }
        this.tempCount = 0;
        this.setState({
            editState: EditState.EDIT_LINE
        })
    }
    _addText = () => {
        this.id++;
        let top = parseInt(this.canvas.offsetTop) + 10 < 36 ? 36 : parseInt(this.canvas.offsetTop) + 10
        let y = top - parseInt(this.canvas.offsetTop) + 23;
        let node = {
            editable: true,
            autoFocus: true,
            id: `${this.id}`,
            color: this.state.selectedDotColor,
            location: { x: parseInt(this.canvas.offsetLeft) + 17, y: y }
        };
        let nodes = [];
        this.state.inputNodes.map((item) => {
            item.editable = false;
            item.autoFocus = false;
            nodes.push(item);
        })
        nodes.push(node)
        this.state.editState = EditState.EDIT_TEXT;
        this.setState({
            inputNodes: nodes,
        })
    }

    //input changeText
    _changeText = (id, value) => {
        let editInput = this.state.inputNodes[this.state.inputNodes.length - 1];
        editInput.value = value;
    }

    _cancel = () => {
        if (this.state.editState === EditState.EDIT_LINE) {
            this.reset(this.tempCount);
        } else if (this.state.editState === EditState.EDIT_TEXT) {
            this.state.inputNodes.pop();
        }
        this.setState({ editState: EditState.INIT })
    }

    _complete = () => {
        if (this.state.editState === EditState.EDIT_TEXT) {
            let editInput = this.state.inputNodes[this.state.inputNodes.length - 1];
            if (!editInput.value || editInput.value.length == 0) {
                this.state.inputNodes.pop();
            } else {
                editInput.editable = false;
            }
        }
        this._setPlaceHolder(0);
        this.setState({ editState: EditState.INIT })
    }

    //关闭编辑页面
    _close() {
        this.props.close();
    }
    //使用图片
    _useImage() {
        this.state.inputNodes.map((node) => {
            this._drawText(node.value, node.color, node.location);
        })
        let imageData = this.canvas.toDataURL("image/png")
        this.props.useImage(imageData);
    }
    //把文字绘制到canvas
    _drawText = (text, color, location) => {
        this.ctx.font = "16px sans-serif";
        this.ctx.fillStyle = color;
        this.ctx.fillText(text, location.x, location.y);
    }

    //画笔颜色
    _renderDot(color) {
        let size = this.state.selectedDotColor === color ? 24 : 18;
        return (
            <TouchableOpacity onPress={(event) => {
                event.preventDefault();
                if (this.state.editState === EditState.EDIT_TEXT) {
                    let editInput = this.state.inputNodes[this.state.inputNodes.length - 1];
                    editInput.color = color;
                }
                this.setState({
                    selectedDotColor: color
                })
            }}>
                <View style={{ width: size, height: size, borderRadius: size, marginLeft: 8, marginRight: 8, backgroundColor: "#fff", justifyContent: "center", alignItems: "center" }}>
                    <View style={{ width: size - 2, height: size - 2, borderRadius: size, backgroundColor: color }}></View>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <SafeAreaView>
                <View id={"box"} style={styles.box}>
                    <View style={styles.canvasBox} >
                        <canvas id="myCanvas" ></canvas>
                    </View>
                    {/* 顶部菜单 */}
                    <View style={[styles.topMenu, this.state.editState != EditState.INIT ? {} : styles.hide]}>
                        <TouchableOpacity onPress={(event) => { event.preventDefault(); this._cancel(); }}>
                            <Text style={{ fontSize: 16, color: "#fff", marginLeft: 11, paddingRight: 20 }}>取消</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ position: "absolute", right: 11 }} onPress={(event) => { event.preventDefault(); this._complete() }}>
                            <Text style={{ fontSize: 16, color: "#02ff00", paddingLeft: 20, }}>完成</Text>
                        </TouchableOpacity>
                    </View>
                    {/* 底部菜单 */}
                    <View style={[styles.bottomMenu, this.state.deleteVisible ? styles.hide : {}]}>
                        <View style={[styles.addBox, this.state.editState == EditState.EDIT_TEXT ? styles.hide : {}]}>
                            {/* 添加线 */}
                            <TouchableOpacity onPress={(event) => { event.preventDefault(); this._addLine() }}>
                                <Image style={{ height: 24, width: 24, resizeMode: "contain", marginRight: 50 }} source={this.state.editState == EditState.EDIT_LINE ? require("app-images/icon_draw_line_green.png") : require("app-images/icon_draw_line_white.png")} />
                            </TouchableOpacity>
                            {/* 添加文字 */}
                            <TouchableOpacity onPress={(event) => { event.preventDefault(); this._addText() }}>
                                <Image style={{ height: 24, width: 24, resizeMode: "contain", }} source={require("app-images/icon_draw_text.png")} />
                            </TouchableOpacity>
                        </View>
                        {/* 分割线 */}
                        <View style={{ height: 3, width: width, backgroundColor: "#7b7b7b" }}></View>
                        {/* 颜色点 */}
                        <View style={styles.dotBox}>
                            {
                                this.dotColors.map((color, index) => {
                                    return this._renderDot(color, index)
                                })
                            }
                            {/* 撤销线 */}
                            <TouchableOpacity style={[this.state.editState == EditState.EDIT_LINE && this.state.imageDatas.length > 1 ? {} : styles.hide]} onPress={(event) => {
                                event.preventDefault();
                                this.reset();
                            }}>
                                <Image style={{ height: 28, width: 28, marginLeft: 16, resizeMode: "contain", }} source={require("app-images/icon_color_back.png")} />
                            </TouchableOpacity>
                        </View>
                        {/* 取消使用照片菜单 */}
                        <View style={[styles.imageMenuBox, this.state.editState != EditState.INIT ? styles.hide : {}]}>
                            <TouchableOpacity onPress={(event) => { event.preventDefault(); this._close() }}>
                                <View style={{ marginRight: 50, alignItems: "center" }} >
                                    <Image style={{ height: 50, width: 50, resizeMode: "contain", }} source={require("app-images/icon_bottom_cancel.png")}  ></Image>
                                    <Text style={{ color: "#fff", fontSize: 14, marginTop: 5 }}>取消</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={(event) => { event.preventDefault(); this._useImage() }}>
                                <View style={{ alignItems: "center" }}>
                                    <Image style={{ height: 50, width: 50, resizeMode: "contain", }} source={require("app-images/icon_bottom_finish.png")}  ></Image>
                                    <Text style={{ color: "#fff", fontSize: 14, marginTop: 5 }}>使用照片</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <div id={"placeholder"}></div>
                    </View>
                    <View style={[styles.bottomMenu, { alignItems: "center", paddingTop: 10 }, this.state.deleteVisible ? {} : styles.hide]}>
                        <Image style={{ height: 24, width: 24, resizeMode: "contain", }} source={require("app-images/icon_bottom_delete.png")} />
                        <Text style={{ fontSize: 12, color: "#fff", marginTop: 7, paddingBottom: 19 }}>拖动到此处删除</Text>
                    </View>
                    {/* 文字输入框 */}
                    {
                        this.state.inputNodes.map((node) => {
                            return (
                                <TransformTextInput
                                    color={node.color}
                                    id={node.id}
                                    autoFocus={node.autoFocus}
                                    value={node.value}
                                    editable={node.editable}
                                    changeText={this._changeText}
                                    showBorder={node.showBorder}
                                    editState={this.state.editState}
                                    rect={{ top: this.canvas.offsetTop, bottom: this.canvas.offsetTop + this.canvas.height }}
                                    changeLocation={(x, y) => {
                                        node.location = {
                                            x: x - this.canvas.offsetLeft,
                                            y: y - this.canvas.offsetTop,
                                        }
                                    }}
                                    setDeleteVisible={(visible) => {
                                        this.setState({
                                            deleteVisible: visible,
                                        })
                                    }}
                                    delete={() => {
                                        this.state.inputNodes.pop();
                                    }}
                                />
                            )
                        })
                    }
                </View>
            </SafeAreaView>
        )
    }
}

class TransformTextInput extends Component {
    myEle = null;
    mInput = null;
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value,
        }
    }


    componentDidMount() {
        this.mInput = document.getElementById(`transform_input_${this.props.id}`);
        this.mInput.style.height = this.mInput.scrollHeight + "px"
        let boxId = `transform_box_${this.props.id}`;
        this.myEle = document.getElementById(boxId);
        this.myEle.addEventListener('touchstart', this._touchEvents, false);
        this.myEle.addEventListener('touchmove', this._touchEvents, false);
        this.myEle.addEventListener('touchend', this._touchEvents, false);


    }

    deltaX = 0;
    deltaY = 0;
    //触摸
    _touchEvents = (e) => {
        if (this.props.editState === EditState.EDIT_TEXT) {
            return;
        }
        this.mInput = document.getElementById(`transform_input_${this.props.id}`);
        e.preventDefault();
        if (e.type == "touchstart") {
            let touch = event.touches[0];
            this.deltaX = parseInt(this.myEle.style.left) - touch.pageX;
            this.deltaY = parseInt(this.myEle.style.top) - touch.pageY;
            this._setBorderRectVisible(true);
            this.props.setDeleteVisible(true);
        } else if (e.type == "touchmove") {
            let touch = event.touches[0];
            this._transfromInput(touch.pageX + this.deltaX, touch.pageY + this.deltaY);
        } else if (e.type == "touchend" || e.type == "touchcancel") {
            this._setBorderRectVisible(false);
            this._checkLocation();
            this.props.setDeleteVisible(false);
            this.mInput.blur();
        }
    }


    _getTextWidth = function (text, fontSize) {
        var span = document.getElementById("__getwidth");
        if (span == null) {
            span = document.createElement("span");
            span.id = "__getwidth";
            document.body.appendChild(span);
            span.style.visibility = "hidden";
            span.style.height = "0px";
            span.style.whiteSpace = "nowrap";
        }
        span.innerText = text;
        span.style.fontSize = fontSize + "px";
        var offsetwidth = span.offsetWidth;
        return offsetwidth;
    }

    _transfromInput = (movex, movey) => {
        console.log(`movey - ${movey} top - ${this.props.rect} `)
        if (movey < this.props.rect.top) {
            return;
        }
        this.myEle.style.left = (movex)
        this.myEle.style.top = (movey)
        this.props.changeLocation(movex + 7, movey + 7 + 16)//处理padding，及文字大小
    }
    _checkLocation = () => {
        if (parseInt(this.myEle.style.left) < 0) {
            this.myEle.style.left = 0;
        } else if ((parseInt(this.myEle.style.left) + parseInt(this.myEle.offsetWidth)) > width) {
            this.myEle.style.left = width - parseInt(this.myEle.offsetWidth);
        }

        if (parseInt(this.myEle.style.top) > height - 80) {
            this.myEle.style.display = "none";
            this.props.delete();
        } else if (parseInt(this.myEle.style.top) > this.props.rect.bottom - parseInt(this.mInput.style.height)) {
            this.myEle.style.top = this.props.rect.bottom - parseInt(this.mInput.style.height);
        }
    }

    _changeText = (value) => {
        // this.mInput.cols = value.length + 4;
        this.mInput.style.height = this.mInput.scrollHeight + "px"
        this.setState({
            value: value,
        })
        this.props.changeText(this.props.id, value)
    }

    _setBorderRectVisible = (visible) => {
        let eles = document.getElementsByClassName(`borderRect_${this.props.id}`);
        if (eles) {
            for (let ele of eles) {
                if (visible) {
                    ele.style.display = "block"
                } else {
                    ele.style.display = "none"
                }
            }
        }
        if (visible) {
            let borderBox = document.getElementById(`border_box_${this.props.id}`);
            borderBox.style.border = "1px solid #fff";
        }
    }
    render() {
        let w = this.props.editable ? width : parseInt(this._getTextWidth(this.props.value, 16)) + 27;
        if (w > width - 27) {
            w = width - 27;
        }
        let boxId = `transform_box_${this.props.id}`;
        return (
            <div id={boxId} style={{
                position: "absolute",
                top: this.props.rect.top + 10 < 36 ? 36 : this.props.rect.top + 10,
                left: 10,
            }}>
                {
                    this.props.editable ? (
                        <TextInput id={`transform_input_${this.props.id}`} multiline={true} underlineColorAndroid={"transparent"}
                            style={{
                                width: w,
                                maxWidth: width - 20,
                                minWidth: 20,
                                fontSize: "16px",
                                margin: 1,
                                borderColor: 'transparent',
                                borderWidth: 1,
                                color: this.props.color,
                                padding: 5,
                                overflow: "hidden",
                                resize: "none",
                                fontFamily: "sans-serif",
                            }}
                            onChangeText={this._changeText}
                            value={this.state.value}
                            autoFocus={this.props.autoFocus}
                            editable={this.props.editable}
                        />
                    ) : (
                            <Text id={`transform_input_${this.props.id}`}
                                style={{
                                    width: w,
                                    maxWidth: width - 20,
                                    minWidth: 20,
                                    fontSize: "16px",
                                    margin: 1,
                                    borderColor: 'transparent',
                                    borderWidth: 1,
                                    color: this.props.color,
                                    padding: 5,
                                    paddingTop: 7,
                                    paddingLeft: 9,
                                    display: "blcok",
                                    overflow: "hidden",
                                    resize: "none",
                                    fontFamily: "sans-serif",
                                }}
                            >{this.state.value}</Text>
                        )
                }
                <div id={`border_box_${this.props.id}`} class={`borderRect_${this.props.id}`} style={{ position: "absolute", left: 1, top: 1, right: 1, bottom: 1, display: "none" }}></div>
                <div class={`borderRect_${this.props.id}`} style={{ position: "absolute", left: 0, top: 0, width: 3, height: 3, backgroundColor: "#fff", display: "none" }}></div>
                <div class={`borderRect_${this.props.id}`} style={{ position: "absolute", right: 0, top: 0, width: 3, height: 3, backgroundColor: "#fff", display: "none" }}></div>
                <div class={`borderRect_${this.props.id}`} style={{ position: "absolute", left: 0, bottom: 0, width: 3, height: 3, backgroundColor: "#fff", display: "none" }}></div>
                <div class={`borderRect_${this.props.id}`} style={{ position: "absolute", right: 0, bottom: 0, width: 3, height: 3, backgroundColor: "#fff", display: "none" }}></div>
            </div>

        )
    }
}
function isAndroid() {
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    return isAndroid;
}
function isiOS() {
    var u = navigator.userAgent;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    return isiOS;
}

const styles = StyleSheet.create({
    hide: {
        display: "none",
    },
    box: {
        width: width,
        height: "100%",
        backgroundColor: "#000000",
        alignItems: "center"
    },
    canvasBox: {
        width: width,
        height: height,
        alignItems: "center",
        justifyContent: "center"
    },
    topMenu: {
        width: width,
        flexDirection: "row",
        position: "absolute", top: 20
    },
    bottomMenu: {
        width: width,
        backgroundColor: "rgba(0,0,0,.67)",
        position: "absolute",
        bottom: 0
    },
    dotBox: {
        paddingBottom: 30,
        paddingTop: 30,
        width: width,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    imageMenuBox: {
        width: width,
        flexDirection: "row",
        justifyContent: "center",
        paddingTop: 25,
        paddingBottom: 17
    },
    addBox: {
        height: 42,
        width: width,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },

    transformInput: {
        maxWidth: width - 20,
        minWidth: 20,
        position: "absolute",
        top: 100,
        left: 10,
        fontSize: 16,
        backgroundColor: "#fff",
    },
})