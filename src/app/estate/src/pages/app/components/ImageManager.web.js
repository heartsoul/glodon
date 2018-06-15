
import { ActionModal } from 'app-components'
export function shareApp(text,url) {
    text = text || 'BIM协同，真的来了';
    url = url || 'http://bim.glodon.com';
    
}
var randomKey = 19830529;
function compressImg(imgData, maxHeight, onCompress) {

    if (!imgData) return;

    onCompress = onCompress || function () { };
    maxHeight = maxHeight || 200;//默认最大高度200px
    var canvas = document.createElement('canvas');
    var img =  document.createElement('img');

    img.onload = function () {
        if (img.height > maxHeight) {//按最大高度等比缩放
            img.width *= maxHeight / img.height;
            img.height = maxHeight;
        } else if (img.width > maxHeight) {//按最大宽度等比缩放
            img.height *= maxHeight / img.width;
            img.width = maxHeight;
        } else {
            onCompress(imgData,null);
            return;
        }
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height); // canvas清屏
        //重置canvans宽高 
        canvas.width = img.width; 
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height); // 将图像绘制到canvas上 
        onCompress(canvas.toDataURL("image/png"),null);//必须等压缩完才读取canvas值，否则canvas内容是黑帆布

    };
    // 记住必须先绑定事件，才能设置src属性，否则img没内容可以画到canvas
    img.src = imgData;
}

/**
 * 启动相册选择 retFun([{url,name,length,...}],success)
 * multiple 是否多选 PS：如果设置了这个属性为true，那么capture属性就无效了，等同于选择所有文件/相册/拍照 
 * capture camera,audio,video
 */
// let input = document.createElement('input');
export function chooseImages(retFun,retFiles = [],maxLength = 3,multiple=false,capture='camera') {
    // ActionModal.alertTip('敬请期待',null,{text:'知道了'});
    let input = document.createElement('input');
    input.type = 'file';
    input.id = "input_file_id_"+Math.random();
    input.hidden = true;
    input.multiple = multiple;
    if(!multiple) {
        input.capture = capture;
    }
    input.accept = 'image/*';

    input.onchange=(ev)=>{
        document.removeChild
        let itemCount = ev.target.files.length;
        if(itemCount > maxLength) {
            ActionModal.alertTip('数量超过限制',null,{text:'知道了'});
            retFun(retFiles,false);
            return;
        }
        retFiles = retFiles||[];
        for(let i = 0; i < itemCount; i++) {
            let file = ev.target.files[i];
            if(!/image\/\w+/.test(file.type)){
                ActionModal.alertTip('请确保文件为图像类型',null,{text:'知道了'});
                retFun(retFiles,false);
                return;
            }//判断是否图片，在移动端由于浏览器对调用file类型处理不同，虽然加了accept = 'image/*'，但是还要再次判断
            
            let reader = new FileReader();
             reader.readAsDataURL(file);
             reader.onload = function(e){
                reader = null;
                compressImg(e.target.result,1136,(url,blob)=>{
                    file.url = url;
                    compressImg(url,160,(thumbUrl,thumbBlob)=>{
                        itemCount--;
                        file.thumbUrl = thumbUrl;
                        retFiles.push({url:url,randomKey:randomKey++,thumbUrl:thumbUrl,name:file.name||'image',type:'h5',length:file.size||0,lastModified:file.lastModified,file:file})
                        if(itemCount <= 0) {
                            retFun(retFiles,true);
                        }
                    })
                })
             };
        };
       
    }
    input.click();
    // PM.pickerImages(
//     (data,bSuccess) => {
//     //   console.log(data);
//       retFun(data,bSuccess)
//     }
//   );
}