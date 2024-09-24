<template>
    <div class="all">
        <div class="header">
            <span> 对账单信息</span>
        </div>
        <!-- <div class="info">
            <div>
                <span>请选择月份:</span>
                <el-date-picker v-model="selectMonth" type="month" placeholder="选择月"></el-date-picker>
            </div>
            <el-button @click="getQueryResult()">查询</el-button>
        </div> -->
        <div class="search">
            输入客户编号搜索<el-input v-model="search" clearable size="small" @clear="getCltledgerhList" placeholder="输入关键字搜索" />
            <el-button type="primary" size="small" @click="getMatList()" icon="el-icon-search">搜索</el-button>
        </div>
        <el-table :data="tableData" tooltip-effect="dark" style="width: 100%" max-height="580">
            <el-table-column label="客户编号" width="120">
                <template slot-scope="scope">
                    <el-button @click="goDetail(scope.row)" type="text" size="small">{{ scope.row.cltcode }}</el-button>
                </template>
            </el-table-column>
            <!-- <el-table-column prop="cltcode" label="客户编号" width="120" >
            </el-table-column> -->
            <el-table-column prop="cltname" label="客户名称" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="periodid" sortable label="日期" width="120">
            </el-table-column>
            <el-table-column prop="llbalance1" label="账上余额" width="120">
            </el-table-column>
            <el-table-column prop="prebalance" label="上月余额" width="120">
            </el-table-column>
            <el-table-column prop="salestotalmoney" label="总销售金额" width="120">
            </el-table-column>
            <el-table-column prop="sumcredit" label="本月汇款总额" width="120">
            </el-table-column>
            <el-table-column align="right">
                <template slot-scope="scope">
                    <el-button size="mini" v-loading.fullscreen.lock="fullscreenLoading"
                        @click="popUp(scope.row)">生成</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--===分页=====-->
        <el-pagination :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
            @current-change="handleCurrentChange" style="text-align: right;padding: 10px;"></el-pagination>
        <el-dialog title="选择对账月份" :visible.sync="dialogTableVisible">
            <el-form :model="form">
                <el-form-item label="对账时间段">
                    <el-date-picker v-model="form.statementDate" type="month" value-format="yyyy-MM" placeholder="选择月"></el-date-picker>
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
    name: 'list',
    data() {
        return {
            //对话框
            dialogTableVisible: false,
            //弹出框
            popover: false,
            //loading
            loadingInstance: false,
            dataLoaded: true,
            search: '',
            selectMonth: '',
            tableData: [],
            currentPage: 1, // 当前页码
            total: 20, // 总条数
            pageSize: 10, // 每页的数据条数
            multipleSelection: [],
            fullscreenLoading: false,
            form: {
                statementDate: '',
                row: {}
            }
        }
    },
    created() {
        this.getCltledgerhList()
        // this.tableData = this.currentChangePage(
        //     this.pageSize,
        //     this.currentPage
        // );
        // this.total = this.sourceTableData.length;
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
            this.getCltledgerhList();
        },
        //当前页改变时触发 跳转其他页
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.currentPage = val;
            // this.tableData = this.currentChangePage(this.pageSize, val);
            this.getCltledgerhList();
        },
        //点击行跳转
        goDetail(row) {
            console.log(row);
            let routeData = this.$router.resolve({
                path: "/detail",
                query: { ikey: row.ikey, cltcode: row.cltcode }
            });
            window.open(routeData.href, "_blank");

        },
        //获取对账单列表
        getCltledgerhList() {
            this.loadingInstance = this.starLoading()
            const params = {
                companyid: "1030",
                currentLimit: this.pageSize,
                currentPage: this.currentPage,
                text: this.search
            }
            const res = axios.post('/api/khdz/selectfchecklistcltledgerhList', params)
            console.log(res.data);
            res.then(res => {
                this.tableData = res.data.records;
                this.total = res.data.total
                this.$nextTick(() => {
                    // 在 nextTick 之后关闭 loading
                    this.loadingInstance.closeLoading();
                    this.dataLoaded = true;
                });
            })
        },
        //弹框
        popUp(row) {
            this.dialogTableVisible = true;
            this.form.row = row
            console.log(row);
        },
        //生成按钮
        createStatement() {
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
                    this.getCltledgerhList()
                }, 10000)
            }
        }
    }
}
</script>



<style  lang="scss" scoped>
.all {
    // width: 100%;
    // height: 100%;
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