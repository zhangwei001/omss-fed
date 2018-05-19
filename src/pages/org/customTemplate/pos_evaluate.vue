<style lang="scss">
    .pos-evaluate-box{
        height: 300px;
        padding: 20px 30px;
        overflow: hidden;
        overflow-y: auto;
        background: #f6f7f8;
        color: #363636;
        line-height: 24px;

        .ivu-radio-group-vertical .ivu-radio-wrapper{
            height: auto;
        }
    }
</style>

<template>
    <section class="detaile-full-main-l-item">
        <h4>
            <em class="icon iconfont_daydao_common">&#xe615;</em>
            <span>{{templateItem.title}}</span>
        </h4>
        <div class="pos-evaluate-box">
            <div class="pos-evaluate-start" v-if="startEvalueteState && posEvaluateData && posEvaluateData.listIpeQuestion">
                <p v-html="posEvaluateData.ipeRemark"></p>
                <Button style="margin-top: 20px;" type="warning" @click="startEavluateEvent">开始评估</Button>
            </div>

            <div class="pos-evaluate-topic"
                 v-for="(questionItem, index) in posEvaluateData.listIpeQuestion"
                 :key="index"
                 v-if="!answerEvalueteState && index == evaluateQuestionNum">
                <h2>{{index + 1}}、<span v-html="questionItem.questionContent"></span></h2>
                <RadioGroup v-if="questionItem.questionType=='radio'" v-model="questionItem.value" vertical>
                    <Radio v-for="optionItem in questionItem.listOption" :key="optionItem.coordinate" :label="optionItem.coordinate">
                        <span v-html="optionItem.optionContent" style="white-space: normal;"></span>
                    </Radio>
                </RadioGroup>
                <CheckboxGroup v-if="questionItem.questionType=='checkbox'" v-model="questionItem.value" vertical>
                    <Checkbox v-for="optionItem in questionItem.listOption" :key="optionItem.coordinate" :label="optionItem.coordinate">
                        <span v-html="optionItem.optionContent" style="white-space: normal;"></span>
                    </Checkbox>
                </CheckboxGroup>
                <Input v-if="questionItem.questionType=='text'" v-model="questionItem.value" placeholder="请输入..." style="width: 300px"></Input>

                <dl style="margin-top: 20px;">
                    <Button type="warning" @click="evaluateEvent(questionItem.questionId, questionItem.value, questionItem.questionType)">{{index+1 == posEvaluateData.listIpeQuestion.length ? '提交' : '下一题'}}</Button>
                </dl>
            </div>

            <div v-if="!calculateEvalueteState">
                <h2>该职位的评估结果如下：</h2>
                <div>
                    <div>
                        <label>得分：</label>
                        <span>{{calculateEvaluete.score || 0}}</span>
                    </div>
                    <div>
                        <label>等级：</label>
                        <span>{{calculateEvaluete.level || 0}}</span>
                    </div>
                </div>
                <p v-html="calculateEvaluete.ipeRemark"></p>
                <dl style="margin-top: 20px;">
                    <Button type="warning" @click="submitIPE">提交结果</Button>
                    <Button type="warning" @click="aginEvaluteEvent">重新评估</Button>
                </dl>
            </div>

            <div v-if="!endEvalueteState">
                <h2>该职位的评估结果如下：</h2>
                <div>
                    <div>
                        <label>得分：</label>
                        <span>{{endCulateEvaluteData.score || 0}}</span>
                    </div>
                    <div>
                        <label>等级：</label>
                        <span>{{endCulateEvaluteData.level || 0}}</span>
                    </div>
                </div>
                <p v-html="endCulateEvaluteData.ipeRemark"></p>
                <dl style="margin-top: 20px;">
                    <Button type="warning" @click="aginEvaluteEvent">重新评估</Button>
                </dl>
            </div>
        </div>
    </section>
</template>

<script>

    export default {
        name:'pos_evaluate',
        data(){
            return {
                templateItem: {},
                oldPosEvaluateData: {},
                posEvaluateData: {},    // 职位评估数据
                startEvalueteState: true,   // 开始评估状态标识
                answerEvalueteState: true,  // 答题中状态
                calculateEvalueteState: true,  // 计算后的状态标识
                endEvalueteState: true, // 提交后的状态标识
                evaluateQuestionNum: 0, // 当前题目索引
                evaluateSendData: {},   // 职位评估需提交的数据
                calculateEvaluete: {},  // 职位评估计算后的数据
                endCulateEvaluteData: {},   // 职位评估提交后的数据
            }
        },
        created(){
            console.log(this.$parent)
            this.templateItem = JSON.parse(JSON.stringify(this.$parent.sectionItem));
            this.evaluateSendData.modelId = this.$parent.$parent.editCondition.value;
            this.evaluateSendData.modelType = 'pos_id';
            this.getIPEquestions()
        },
        methods:{
            /**
             * 开始评估按钮事件
             */
            startEavluateEvent (){
                var _this = this;
                _this.startEvalueteState = !_this.startEvalueteState;
                _this.answerEvalueteState = !_this.answerEvalueteState;
            },
            /**
             * 题目按钮事件
             */
            evaluateEvent (key, value, type){
                var _this = this;
                console.log(key, value);

                // 校验选择、填写内容是否合法
                if(type == 'text'){
                    if(!value) return _this.$Message.warning('请先填写内容');

                    var re = /^[1-9]\d*$/;
                    if(!re.test(value)) return _this.$Message.warning('请填写正整数');
                }
                else{
                    if(!value || value.length <= 0) return _this.$Message.warning('请先选择一项');
                }

                // 格式化数据，并且将数据保存在指定的对象里
                if(value instanceof Array){
                    // 数组，格式化从字符串拼接
                    _this.evaluateSendData[key] = value.join(',');
                }
                else{
                    // 其它
                    _this.evaluateSendData[key] = value;
                }

                // 判断是否答完题目，如果答完则为提交
                if(_this.posEvaluateData.listIpeQuestion.length - 1 == _this.evaluateQuestionNum){
                    // 题目答完
                    console.log('答完了');
                    _this.evaluateIPE();
                }
                else{
                    // 题目没答完
                    this.evaluateQuestionNum++;
                }
            },
            /**
             * IPE问题列表
             * @options.data
             * @options.success
             * */
            getIPEquestions (){
                var _this = this;

                _this.$daydao.$ajax({
                    url:gMain.apiBasePath +"ipe/getIPEquestions",
                    data:JSON.stringify({
                        modelId: _this.$parent.$parent.editCondition.value,
                        modelType: "pos_id"
                    }),
                    success: function(data){
                        if(data.result == "true"){
                            // 将数据里加入value项。用于存储当前选项的数据
                            data.listIpeQuestion.forEach((item)=>{
                                if(item.questionType == 'checkbox'){
                                    item['value'] = [];
                                }
                                else{
                                    item['value'] = '';
                                }
                            });

                            _this.oldPosEvaluateData = data;
                            _this.posEvaluateData = JSON.parse(JSON.stringify(_this.oldPosEvaluateData));
                        }
                    }
                });
            },
            /**
             * 答完题提交IPE评估结果
             * @options.data
             * @options.success
             * */
            evaluateIPE (options){
                var _this = this;

                _this.$daydao.$ajax({
                    url:gMain.apiBasePath +"ipe/evaluateIPE",
                    data:JSON.stringify(_this.evaluateSendData),
                    success: function(data){
                        if(data.result == "true"){
                            _this.answerEvalueteState = !_this.answerEvalueteState;
                            _this.calculateEvalueteState = !_this.calculateEvalueteState;

                            _this.calculateEvaluete = data;
                        }
                    }
                });
            },
            /**
             * 保存IPE评估结果保存
             * @options.data
             * @options.success
             * */
            submitIPE (){
                var _this = this;

                _this.$daydao.$ajax({
                    url:gMain.apiBasePath +"ipe/submitIPE",
                    data:JSON.stringify(_this.evaluateSendData),
                    success: function(data){
                        if(data.result == "true"){
                            _this.calculateEvalueteState = !_this.calculateEvalueteState;  // 计算后的状态标识
                            _this.endEvalueteState = !_this.endEvalueteState; // 提交后的状态标识
                            _this.endCulateEvaluteData = data;
                        }
                    }
                });
            },
            /**
             * 重新评估
             */
            aginEvaluteEvent (){
                var _this = this;

                _this.posEvaluateData = JSON.parse(JSON.stringify(_this.oldPosEvaluateData));
                _this.evaluateQuestionNum = 0;
                _this.startEvalueteState = true;   // 开始评估状态标识
                _this.answerEvalueteState = true;  // 答题中状态
                _this.calculateEvalueteState = true;  // 计算后的状态标识
                _this.endEvalueteState = true; // 提交后的状态标识
            }
        }

    }
</script>
