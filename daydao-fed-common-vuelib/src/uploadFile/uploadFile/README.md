# 附件上传插件
## 一、简单介绍  

用于上传附件，包含功能
- 上传附件（本地文件或网盘文件）
- 删除附件
- 预览附件（图片或文件）
- 限制附件大小
- 限制上传附件个数
- 另存为网盘
- 下载附件

## 二、引入方式
用es6的方式引入 import

```
    // 图片上传插件
    import UploadFile from 'commonVueLib/uploadFile/index'
    
    components:{
       UploadFile
    }
```

## 三、快速参考：

- 普通组件使用方法  
    只需传入uuid数组，然后定一个接收返回值（返回值类型请参考下面参数说明）
```
<template>
    <upload-file
        :uuids="uuids"
        v-model="uploadFile"
    ></upload-file>
</template>
<script>
    export default {
        data () {
            return {
                // 组件返回值
                uploadFile: {}
                // 让组件加载文件uuid
                ，uuids: [5000000232353441,5000000232353440...]
            }
        }
    }
</script>
```

- 只读（预览）方式使用方法
```
<template>
     <upload-file
            :uuids="uuids"
            :readyonly="readyonly"
            
            v-model="uploadFile"
        ></upload-file>
</template>
<script>
    export default {
        data () {
            return {
                // 组件返回值
                uploadFile: {}
                // 让组件加载文件uuid
                ，uuids: [5000000232353441,5000000232353440...]
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
    <upload-file
        :uuids="imguuids"
        :maxsize="maxsize"
        :maxlength="maxlength"
        :readonly="readonly"
        
        v-model="uploadFile"
    ></upload-file>
</template>
<script>
    export default {
        data () {
            return {
                // 组件返回值
                uploadFile: {}
                // 让组件加载文件uuid
                ，uuids: [5000000232353441,5000000232353440...]
                // 是否只读方式
                , readonly: false
                // 单文件大小默认10M，1代表1M，2代表2M以此类推
                , maxsize: 10
                // 最多文件个数，默认不限制
                , maxlength: -1
            }
        }
    }
</script>
```
#### API
uploadFile 属性  

|  **属性** | **参数类型**  | **默认值**  | **说明**  |
| ------------ | ------------ | ------------ | ------------ |
| value | Object  | 无 | 使用 v-model 来获取组件上传文件数据 |
| uuids | Array  | 无 | 加载文件uuid |
| maxsize | Number  | 10M | 单张图片最大大小，1代表1M，2代表2M以此类推 |
| maxlength | Number  | -1 | 最多上传文件个数，默认-1不限制 |
| readonly | Boolean  | false | 是否只读模式，true只读；false编辑 |


uploadFile 返回数据结构 v-model 

|  **属性** | **参数类型**  | **默认值**  | **说明**  |
| ------------ | ------------ | ------------ | ------------ |
| uuid | Array  | 无 | 已上传完成图片uuid |
| upLoading | Boolean  | 无 | 图片是否全部上传完成；true完成；false未完成 |
| files | Object  | 无 | 控件中每个图片对象 {name: 名称, size: 大小, uuid: uuid, status: 状态（waiting：等待；uploading：上传中；success：成功；error失败；）, isNew: 是否新上传文件}|

