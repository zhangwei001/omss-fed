# selectPerson  新版选人组件
支持选组织和人员、选组织、选人员，单选和多选 3*2种模式，支持自定义API接口

## API
selectPerson props

| 属性        | 说明           | 类型  | 默认值 |
| ------------- |-------------| -----| -----|
| type      | 选择模式，可选值为 `1`组织和人员，`2`组织，`3`人员 | Number | 1 |
| multi      | 是否多选     |   Boolean |   true |
| selectedOrg | 默认已选组织      |    Array |    - |
| selectedPerson | 默认已选人员      |    Array |    - |
| placeholder | 搜索框提示，无特殊情况无需配置      |    String |    - |
| ApiOrgURL | 组织API      |    String |    - |
| ApiOrgParams | 组织API参数      |    Object |    - |
| ApiPersonURL | 人员API      |    String |    - |
| ApiOrgParams | 人员API参数      |    Object |    - |
| autoInit | 组件被挂载时是否自动初始化数据，建议设置为`false`，在业务中配合`init`方法来分步加载，以减轻服务器瞬间请求过多的压力。      |    Boolean |    false |

selectPerson methods

| 方法名        | 说明           | 参数  |
| ------------- |-------------| -----|
| reset      | 重置组件状态，包括已选数据     |   无 |
| init      | 初始化组件，在`autoInit`设置为`false`的情况下使用,只需初始化一次   |   无 |
