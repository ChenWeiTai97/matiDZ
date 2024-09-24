<template>
    <div class="all">
        <div class="header">
            <span> 客户列表</span>
            <!-- <el-button>一键生成客户对账单</el-button> -->
        </div>
        <div class="info">
            <div>
                <span>请选择月份:</span>
                <el-date-picker v-model="selectMonth" size="small" type="month" placeholder="选择月"></el-date-picker>
            </div>
            <el-button @click="checkboxHandle" size="small">多选生成</el-button>
        </div>
        <div class="search">
            输入客户编号搜索<el-input v-model="search" clearable size="small" @clear="getMatList" placeholder="输入关键字搜索" />
            <el-button type="primary" size="small" @click="getMatList()" icon="el-icon-search">搜索</el-button>
        </div>
        <el-table :data="tableData" tooltip-effect="dark" @select-all="handleSelectionAll" style="width: 100%"
            @selection-change="handleSelectionChange" max-height="580">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column prop="cltcode" label="客户编号" width="120">
            </el-table-column>
            <el-table-column prop="cltname" label="客户名称" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="sdorgname" label="销区" width="150">
            </el-table-column>
            <el-table-column prop="salesname" label="区域经理" width="120">
            </el-table-column>
            <el-table-column prop="saledocname" label="对应客服" width="120">
            </el-table-column>
            <el-table-column align="right">
                <template slot-scope="scope">
                    <el-button size="mini" v-loading.fullscreen.lock="fullscreenLoading"
                        @click="popUp(scope.row)">生成</el-button>
                </template>
            </el-table-column>
            <div style="display: flex;flex-direction: column;align-items: center;" slot="empty">
                <img src="../assets/暂无数据.png" />
                <span class="txt">暂无数据</span>
            </div>
        </el-table>
        <!--===分页=====-->
        <el-pagination :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="this.total" @size-change="handleSizeChange"
            @current-change="handleCurrentChange" style="text-align: right;padding: 10px;"></el-pagination>
        <el-dialog title="选择对账月份" :visible.sync="dialogTableVisible">
            <el-form :model="form">
                <el-form-item label="对账时间段">
                    <el-date-picker v-model="form.statementDate" type="month" value-format="yyyy-MM"
                        placeholder="选择月"></el-date-picker>
                </el-form-item>
                <el-popover placement="bottom-start" width="300" v-model="popover">
                    <p>是否生成{{ this.form.row.cltname }}{{ this.form.statementDate }}对账单</p>
                    <div style="text-align: right; margin: 0">
                        <el-button size="mini" type="text" @click="popover = false">取消</el-button>
                        <el-button type="primary" size="mini" @click="createStatement">确定</el-button>
                    </div>
                    <el-button slot="reference" type="primary">确认</el-button>
                </el-popover>
            </el-form>
        </el-dialog>
    </div>
</template>



<script>
import axios from 'axios';
import moment from 'moment';
export default {
    name: 'matList',
    data() {
        return {
            //对话框
            dialogTableVisible: false,
            //弹出框
            popover: false,
            loadingInstance: false,
            dataLoaded: true,
            search: '',
            selectMonth: '',
            tableData: [],
            currentPage: 1, // 当前页码
            total: 0, // 总条数
            pageSize: 20, // 每页的数据条数
            multipleSelection: [],
            fullscreenLoading: false,
            form: {
                statementDate: '',
                row: {}
            }
        }
    },
    created() {
        this.getMatList();
        console.log(this.$route);

    },
    mounted() {
    },
    methods: {
        //loading
        starLoading() {
            // 创建一个 loading 实例并赋值给 loading 变量
            let loading = this.$loading({
                text: "加载中", // 设置 loading 文本为 "加载中"
                spinner: "el-icon-loading", // 使用 Element UI 提供的加载图标
                // 设置 loading 遮罩层背景色为半透明黑色
                // background: "rgba(0, 0, 0, 0.7)", 
                target: document.querySelector("body"), // 将 loading 遮罩层挂载到页面 body 元素上
            });
            // 返回一个包含关闭 loading 遮罩层方法的对象
            return {
                // 方法用于关闭 loading 遮罩层
                closeLoading: () => {
                    loading.close(); // 调用 loading 实例的 close 方法关闭遮罩层
                }
            };
        },
        //每页条数改变时触发 选择一页显示多少行
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.currentPage = 1;
            this.pageSize = val;
            // this.tableData = this.currentChangePage(val, this.currentPage);
            this.getMatList();
        },
        //当前页改变时触发 跳转其他页
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.currentPage = val;
            // this.tableData = this.currentChangePage(this.pageSize, val);
            this.getMatList();
        },
        //弹框
        popUp(row) {
            this.dialogTableVisible = true;
            this.form.row = row
            console.log(row);
        },
        //单条生成按钮
        createStatement(index, row) {
            this.loadingInstance = this.starLoading()
            var month = (moment(this.form.statementDate).startOf('month').format('YYYY-MM'));
            if (!this.form.statementDate) { this.$message.error('请先选择月份，再生成对账单'); this.loadingInstance.closeLoading(); }
            // else if (month == this.form.row.periodid){ this.$message.error('已生成'+ month +'对账单，请勿重复生成'); this.loadingInstance.closeLoading(); } 
            else {
                const params = {
                    companyid: "1030",
                    begindate: moment(this.form.statementDate).startOf('month').format('YYYY-MM-DD'),
                    enddate: moment(this.form.statementDate).endOf('month').format('YYYY-MM-DD'),
                    cltcode: [this.form.row.cltcode],
                    period_type: "按单据日期查询",
                    doctype: "完成",
                    report_userid: "LGY",
                    acctcode: "112201",
                    acctname: "应收账款-正常货款",
                    attributes: "正常货款"
                }
                axios.post('/api/khdz/statementGeneration', params)
                setTimeout(() => {
                    this.loadingInstance.closeLoading();
                    this.dataLoaded = true;
                    this.$message({
                        message: '生成成功',
                        type: 'success'
                    });
                    this.dialogTableVisible = false;
                    this.popover = false;
                    this.getMatList()
                }, 10000)
            }
        },
        //多选生成
        checkboxHandle() {
            if (this.selectMonth == '') { this.$message.error('请先选择月份，再点击按钮'); }
            else if (this.multipleSelection.length == 0) { this.$message.error('请选择客戶，再点击按钮'); }
            else {
                let array = [];
                this.multipleSelection.forEach((item) => { array.push(item.cltcode) });
                this.loadingInstance = this.starLoading()
                console.log('array', array);
                console.log('yuef', this.selectMonth);
                const params = {
                    companyid: "1030",
                    begindate: moment(this.selectMonth).startOf('month').format('YYYY-MM-DD'),
                    enddate: moment(this.selectMonth).endOf('month').format('YYYY-MM-DD'),
                    cltcode: array,
                    period_type: "按单据日期查询",
                    doctype: "完成",
                    report_userid: "LGY",
                    acctcode: "112201",
                    acctname: "应收账款-正常货款",
                    attributes: "正常货款"
                }
                const res = axios.post('/api/khdz/statementGeneration', params)
                setTimeout(() => {
                    this.$nextTick(() => {
                        this.loadingInstance.closeLoading();
                        this.dataLoaded = true;
                        this.$message({
                            message: '生成成功',
                            type: 'success'
                        });
                    });
                }, 5000)
            }
        },
        //全选
        handleSelectionAll(val) {
            this.multipleSelection = val;
        },
        //手动多选
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        //获取客户列表
        getMatList() {
            this.loadingInstance = this.starLoading()
            const params = {
                companyid: "1030",
                currentLimit: this.pageSize,
                currentPage: this.currentPage,
                text: this.search
            }
            const res = axios.post('/api/cltinfo/scltgeneralListPage', params)
            res.then(res => {
                this.tableData = res.data.records;
                this.total = res.data.total
                this.$nextTick(() => {
                    // 在 nextTick 之后关闭 loading
                    this.loadingInstance.closeLoading();
                    this.dataLoaded = true;
                });
            })
            .catch(error =>{
                console.log('error',error);
            })
        }
    }
}
</script>



<style  lang="scss" scoped>
.all {
    display: flex;
    flex-direction: column;
    padding: 10px 20px;
}

.header {
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 10px 0;
    border-bottom: 1px solid;
    border-color: #f3f3f3;

    span {
        font-size: 30px;
    }
}

.info {
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 5px;
}

.search {
    padding-left: 5px;
    display: flex;
    align-items: center;

    .el-input {
        width: 230px;
        padding: 0 10px;


    }

}
</style>