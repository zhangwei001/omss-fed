# 图片预览插件
## 一、简单介绍

用于图片预览，功能包含
- 上一张和下一张切换图片
- 左右旋转图片
- 放大缩小图片
- 查看原图
- 下载原图

## 二、引入方式
用es6的方式引入 import

```
    // 图片预览插件
    import ImagePreview from 'commonVueLib/imagePreview/index'
    
    components:{
       ImagePreview
    }
```

## 三、快速参考：

```
<template>
    <image-preview
        :src="srcs"
        :index="previewIndex"
        v-model="showPreview"
     ></image-preview>
</template>
<script>
     export default {
         data(){
             return {
                // 预览图片地址，可以是http地址，也可以是base64字符串
                srcs: ['http://....', 'data:image/jpg;base64,.....'],
                // 图片预览位置，默认从第一张开始
                previewIndex: 0,
                // 是否打开图片预览框
                showPreview: true
             }
         }
     }
</script>
```

#### API
filePreview 属性  

|  **属性** | **参数类型**  | **默认值**  | **说明**  |
| ------------ | ------------ | ------------ | ------------ |
| value | Boolean  | 无 | 使用 v-model 来打开关闭图片预览框 |
| src | Array, String  | 无 | 预览图片地址，可以是http地址，也可以是base64字符串 |
| index | Number  | 0 | 图片预览位置，默认从第一张开始 |