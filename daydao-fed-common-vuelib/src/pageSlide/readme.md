# 侧滑组件


### props

|  属性 | 说明 | 类型 | 默认值 |
| ------------ | ------------ | ------------ | ------------ |------------ |
| pageTitle | 顶部标题 | String , 可传html | 无 , 可不传 |
| value | 显示隐藏 ,  使用v-model双向绑定 | Boolean | false
| width | 侧滑宽度 | Number , String | 660
| cover | 是否有遮罩 | Boolean | true
| transfer | 是否将弹层放置于 body 内 | Boolean | false

### 事件名
|  事件名 | 说明 | 返回值 | 
| ------------ | ------------ | ------------ |
| iconHideHandler | 点击标题关闭icon触发的事件 | 无 |


### 使用

```html
	<page-slide :pageTitle="title" v-model="isShow"></page-slide>
```

```js
 	import pageSlide from 'commonVueLib/pageSlide'

	export default{
		data(){
			return {
					isShow : false,
					title  : 'title'
			}		
		},
		components:{pageSlide:pageSlide},
	}
```


### 其他

使用滚动条
```html

<page-slide :pageTitle="title">
	<div class="page-slide-overflow"></div>
</page-slide>

```

由于各业务内容里面的padding不一致 , 如果加上类名滚动计算有误 , 请自行写高度

```css
	customerClass {
		height: 70%;
        height: calc(100% - 66px);
        height: -ms-calc(100% - 66px);
        height: -moz-calc(100% - 66px);
        overflow-y: auto;
        overflow-x: hidden;
	}
```