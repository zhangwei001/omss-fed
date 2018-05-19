# 单选下拉框组件
## 一、简单介绍
根据数据类型，自动创建树形下拉框组件。
- 可自定义控件的长宽，内容超过将会显示滚动条 
- 控制某些节点不可选
- 提供节点点击事件的回调函数
- 提供搜索节点功能
- 只能选择一个节点

## 二、引入方式

用es6的方式引入 import

```
    //单选下拉框
    import daydaoDropSelect from 'src/daydaoDropSelect/index'
    
    components:{
       daydaoDropSelect
    }
```

## 三、快速参考：

- template 创建自定义标签 <daydao-drop-select></daydao-drop-select>

```
    <daydao-drop-select :data="oData" name="demoDrop" :val="defaultVal" ref="daydaoDropSelect" :isEdit="true"></daydao-drop-select>
```
- javascript

```
     ,data () {
         return {
             oData:[
                 {id:"1",name:"湖北省",children:[
                     {id:"1-1",name:"武汉市"},
                     {id:"1-2",name:"黄冈市"},
                     {id:"1-3",name:"黄石市"},
                     {id:"1-4",name:"荆州市"},
                     {id:"1-5",name:"宜昌市"}
                 ]},
                 {id:"2",name:"广东省",children:[
                     {id:"2-1",name:"广州市"},
                     {id:"2-2",name:"深圳市"},
                     {id:"2-3",name:"东莞市"},
                     {id:"2-4",name:"惠州市"},
                     {id:"2-5",name:"中山市"}
                 ]}
             ]
             ,defaultVal: '1-1'
             ,newVal:""
         }
     }
```

#### 说明

-  onSelected参数type（该事件的触发方式）：“click”代表手动触发,“codeAuto”代表从代码自动触发

## 四、方法
在实例化完成时候可调用的api

|  **方法名** | **类型**  | **参数类型**  | **返回值**  | **描述**  |
| ------------ | ------------ | ------------ | ------------ |------------ |
| setValue | function  | string1,string2 |无|设置某个值自动选中，string1为必传，如果只传1个参数,string1可以是id也可以是name,如果传两个参数，则string1为id,string2为name |

### 示例

参照“快速参考”

## 五、配置参数

### 1、参数列表

传一个 json对象参数，属性有：

| **参数名** |  **类型** | **是否必传**  | **默认值**  | **描述**  |
| ------------ | ------------ | ------------ | ------------ | ------------ |
| placeholder  | string  | 是  | ——  | 文本框显示的提示文字  |
| width  | Number  | 否  | 180 | 容器的宽度 |
| maxHeight  | Number  | 否  | 250 | 容器的最大高度|
| data  | Array  | 是  | []  | 加载的数据 |
| name  | string  | 是  | 无 | 组件的name值  |
| isEdit  | boolean  | 否  |  true | 是否可以编辑 |
| onSelected  | function  | 否  | undefined | function类型，下拉树选中之后的回调  |
| isAllowOther  | boolean  | 否  | false | 是否允许输入其他值  |
| placeholder  | boolean  | 否  | "" | 描述输入字段预期值的提示信息  |
| val  | string  | 否  | "" | 下拉框的默认值  |

##### 其中参数data的格式如下：
```javascript

[{id:"id1", name:"选项一"},{id:"id2", name:"选项二"}]

```
| **参数名** |  **类型** | **是否必传**  | **默认值**  | **描述**  |
| ------------ | ------------ | ------------ | ------------ | ------------ |
| id  | string  | 是  |  | 当前节点的id  |
| name  | Number  | 否  |   | 当前节点的名称 |


onSelected方法参数oSelect，属性有：

| **参数名** |  **类型** |  **描述** |
| ------------ | ------------ | ------------ |
| key  | string  | 组件的name值 |
| node  | Object  | 被选中项的所有信息，包含id和name |
| value  | string  | 被选中项的id  |

## 六、属性

在实例化完成时候可调用的属性

| **属性名** |  **类型** |  **描述** |
| ------------ | ------------ | ------------ |
| options  |  Object  | 组件创建时候的参数 |
| selectedIds  | String  | 当前被选中项的id|
| selectedVals  | String  | 当前被选中项的name|

### 示例

见 examples 目录中的例子

## 七、Demo图片
 
## 八、其他——演示地址




*组件由 张淇 贡献，说明文档由 张淇 贡献。*     
*本文档更新于2017.08.21*