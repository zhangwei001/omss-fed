# 图片预览插件
## 一、简单介绍

附件预览，可预览类型有：docx，rtf，xls，xlsx，et，pptx，ppt，pdf，wps，txt，rar，zip，7z


## 二、引入方式
用es6的方式引入 import

```
    // 附件预览
    import FilePreview from 'commonVueLib/filePreview/index'
    
    components:{
       FilePreview
    }
```

## 三、快速参考：

```
<template>
    <file-preview
        :file-name="fileName"
        :uuid="fileUuid"
        v-model="showPreview"
     ></file-preview>
</template>
<script>
     export default {
         data(){
             return {
                // 预览文件文件名
                fileName: '预览文件文件名.pdf',
                // 预览文件uuid
                fileUuid: '5000000145103795',
                // 是否打开附件预览框
                showPreview: true
             }
         }
     }
</script>
```

#### API
imagePreview 属性  

|  **属性** | **参数类型**  | **默认值**  | **说明**  |
| ------------ | ------------ | ------------ | ------------ |
| value | Boolean  | 无 | 使用 v-model 来打开关闭附件预览框 |
| fileName | String  | 无 | 预览文件文件名 |
| fileUuid | String  | 0 | 预览文件uuid |
