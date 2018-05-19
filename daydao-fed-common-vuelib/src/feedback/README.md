# 用户反馈
## 一、简单介绍

用于用户反馈，包含功能
- 反馈内容（10<文字个数<200）
- 上传图片 (图片不超过10M(最多9张))


## 二、引入方式
用es6的方式引入 import

```
    // 图片上传插件
    import feedback from 'commonVueLib/feedback/index';

    components:{
       feedback
    }
```

## 三、快速参考：

- 组件使用方法

```
<template>
       <feedback
           :isShow="isShow"
           :wrapWidth="650"
           :feedbackContentHeight="160"
           @close-feedback="closeFeedback"
       ></feedback>
</template>
<script>
    export default {
        data () {
            return {
                isShow:false
            }
        }
        ,methods:{
                //反馈组件的关闭反馈组件的事件， 子到爷事件流
                closeFeedback (val){
                    this.isShow = val;
                }
        }
    }
</script>
```




#### API
 feedback props 属性

|  **属性** | **参数类型**  | **默认值**  | **说明**  |
| ------------ | ------------ | ------------ | ------------ |
| isShow | Boolean  | false | 反馈滑层显示或者隐藏 |
| wrapWidth | Number  | 660 | 反馈滑层宽度 |
| feedbackContentHeight  | Number  | 160 | 反馈内容的textarea 高度  |
| placeholder | String  | 亲爱的用户，请描述您使用daydao遇到的问题和对产品的改进期望，我们将尽快回复您。 | 反馈内容的textarea placeholder |

feedback events 事件

|  **事件名** | **说明**  | **返回值**  |
| ------------ | ------------ | ------------ |
| close-feedback | 点击滑层遮罩触发，监听滑层组件的关闭事件  | false  |
| feedback-success | 反馈成功，点击确认按钮的事件  | 无  |





