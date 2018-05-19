# 图片上传插件
## 一、简单介绍  

用于上传图片，包含功能
- 上传图片
- 删除图片
- 预览图片
- 限制图片大小
- 限制上传图片张数
- 上传压缩图片

## 二、引入方式
用es6的方式引入 import

```
    // 图片上传插件
    import UploadImage from 'commonVueLib/uploadImage/index'
    
    components:{
       UploadImage
    }
```

## 三、快速参考：

- 普通组件使用方法  
    只需传入uuid数组，然后定一个接收返回值（返回值类型请参考下面参数说明）
```
<template>
    <upload-image
        :uuids="imguuids"
        v-model="uploadImage"
    ></upload-image>
</template>
<script>
    export default {
        data () {
            return {
                // 组件返回值
                uploadImage: {}
                // 让组件加载图片uuid
                ，imguuids: ["5000000152518736","5000000154120556"]
            }
        }
    }
</script>
```

- 只读（预览）方式使用方法
```
<template>
    <upload-image
        :uuids="imguuids"
        :readonly="readonly"
        
        v-model="uploadImage"
    ></upload-image>
</template>
<script>
    export default {
        data () {
            return {
                // 组件返回值
                uploadImage: {}
                // 让组件加载图片uuid
                ，imguuids: ["5000000152518736","5000000154120556"]
                // 只读方式
                , readonly: true
            }
        }
    }
</script>
```

- 其他配置参数使用方法
```
<template>
    <upload-image
        :uuids="imguuids"
        :maxsize="maxsize"
        :maxlength="maxlength"
        :readonly="readonly"
        :compress-ratio="compressRatio"
        :compress-width="compressWidth"
        
        v-model="uploadImage"
    ></upload-image>
</template>
<script>
    export default {
        data () {
            return {
                // 组件返回值
                uploadImage: {}
                // 让组件加载图片uuid
                ，imguuids: ["5000000152518736","5000000154120556"]
                // 是否只读方式
                , readonly: false
                // 单文件大小默认10M，1代表1M，2代表2M以此类推
                , maxsize: 10
                // 图片最大张数，默认9张
                , maxlength: 9
                // 压缩比率0~1; 1为不压缩
                , compressRatio: 0.7
                // 图片压缩时宽度，默认1000px(只有在图片压缩情况下有效)
                , compressWidth: 1001
            }
        }
    }
</script>
```
#### API
uploadImage 属性  

|  **属性** | **参数类型**  | **默认值**  | **说明**  |
| ------------ | ------------ | ------------ | ------------ |
| value | Object  | 无 | 使用 v-model 来获取组件上传图片数据 |
| uuids | Array  | 无 | 加载图片uuid |
| maxsize | Number  | 10M | 单张图片最大大小，1代表1M，2代表2M以此类推 |
| maxlength | Number  | 9张 | 组价最多上传多少张图片 |
| readonly | Boolean  | false | 是否只读模式，true只读；false编辑 |
| compress-ratio | Number  | 0.7 | 图片压缩质量，默认压缩，1为不压缩 |
| compress-width | Number  | 1001 | 图片压缩最大宽度，只有在图片压缩情况有效 |


uploadImage 返回数据结构 v-model 

|  **属性** | **参数类型**  | **默认值**  | **说明**  |
| ------------ | ------------ | ------------ | ------------ |
| uuid | Array  | 无 | 已上传完成图片uuid |
| upLoading | Boolean  | 无 | 图片是否全部上传完成；true完成；false未完成 |
| files | Object  | 无 | 控件中每个图片对象 {name: 名称, size: 大小, uuid: uuid, status: 状态（waiting：等待；uploading：上传中；success：成功；error失败；）, isNew: 是否新上传图片}|

