<template>
  <div class="body">
    <div class="all" v-if="dataLoaded">
      <div class="header">
        <span size="40px"> {{ this.baseData.cltname || "-" }}</span>
      </div>
      <div class="main">
        <div class="base">
          <el-descriptions class="margin-top" :column="3" direction="vertical">
            <el-descriptions-item label="经销商名称">{{ this.baseData.cltname || "-" }}</el-descriptions-item>
            <el-descriptions-item label="对账月份">{{ this.baseData.periodid || "-" }}</el-descriptions-item>
            <el-descriptions-item label="上月余额">{{ this.baseData.prebalance || "-" }}</el-descriptions-item>
            <el-descriptions-item label="本月汇款金额">{{ this.baseData.sumcredit || "-" }}</el-descriptions-item>
            <el-descriptions-item label="订单预付">{{ this.baseData.sumentermoney || "-" }}</el-descriptions-item>
            <el-descriptions-item label="账上欠款">{{ this.baseData.llbalance1 || "--" }}</el-descriptions-item>
            <el-descriptions-item label="总销售金额">{{ this.baseData.salestotalmoney || "-" }}</el-descriptions-item>
            <el-descriptions-item label="欠款大写">{{ this.baseData.llbalance1 | capitalize }}元</el-descriptions-item>
            <el-descriptions-item label="总销售金额大写">{{ this.baseData.salestotalmoney | capitalize || "-"}}元</el-descriptions-item>
            <el-descriptions-item label="对账征询函">
              <div class="downloadBox">
                <!-- <a class="item-btn download" :href="'http://33a42407e0.qicp.vip/khdzfile/' + this.baseData.khdzFilename" :download=this.baseData.khdzFilename>下载附件</a> -->
                <el-image :src="require('../assets/合同.png')" @click.native="dzhDownload()" fit="scale-down" />
                <span>{{ this.baseData.dzhFilename }}</span>
              </div>
            </el-descriptions-item>
            <el-descriptions-item label="对账单明细">
              <div class="downloadBox">
                <el-image :src="require('../assets/合同.png')" @click.native="khdzdDownload()" fit="scale-down" />
                <span>{{ this.baseData.khdzFilename }}</span>
              </div>
            </el-descriptions-item>
            <el-descriptions-item label="销售明细">
              <div class="downloadBox">
                <el-image :src="require('../assets/合同.png')" @click.native="xsmxDownload()" fit="scale-down" />
                <span>{{ this.baseData.xsmxFilename }}</span>
              </div>
            </el-descriptions-item>
          </el-descriptions>

        </div>
        <div style="display: flex; flex-direction: column;width: 90%;padding: 0 40px;">
          <span style="font-size: large;padding: 20px 10px;font-weight:bold" size="mini"> 对账单明细</span>
          <el-table min-height="500" :data="tableData" border style="width: 100%" max-height="500">
            <el-table-column prop="docDate" label="日期" width="100">
              <template slot-scope="scope">{{ scope.row.docDate | dateFormat }}</template>
            </el-table-column>
            <el-table-column prop="doccode" label="凭证单号" width="140">
            </el-table-column>
            <el-table-column prop="doctype" label="单据类别">
            </el-table-column>
            <el-table-column prop="dcflag" label="借贷方向">
            </el-table-column>
            <el-table-column prop="amountDebit" label="借方发生额">
              <template slot-scope="scope">{{ scope.row.amountDebit }}</template>
            </el-table-column>
            <el-table-column prop="amountCredit" label="贷方发生额">
              <template slot-scope="scope">{{ scope.row.amountCredit }}</template>
            </el-table-column>
            <el-table-column prop="entermoney" label="订单预付">
              <template slot-scope="scope">{{ scope.row.entermoney }}</template>
            </el-table-column>
            <el-table-column prop="lbalance1" label="实欠累计">
              <template slot-scope="scope">{{ scope.row.lbalance1 }}</template>
            </el-table-column>
            <el-table-column prop="remitter" label="备注">
            </el-table-column>
            <el-table-column prop="attributes" label="款项属性">
            </el-table-column>
            <div style="display: flex;flex-direction: column;align-items: center;" slot="empty">
              <img src="../assets/暂无数据.png" />
              <span class="txt">暂无数据</span>
            </div>
          </el-table>
        </div>
      </div>
    </div>
    <div style="align-items: center;" v-if="!dataLoaded">参数错误，禁止访问</div>
  </div>
</template>
  
<script>

import axios from 'axios';
// import dayjs from 'dayjs'
import moment from 'moment';
export default {
  name: 'detail',
  data() {
    return {
      loadingInstance: true,
      dataLoaded: false,
      baseData: {},
      tableData: [],
      urlParams: {},
      firstDay: '',
      lastDay: ''
    }
  },

  methods: {
    getData() {
      this.loadingInstance = this.starLoading()
      const res = axios.post('/api/khdz/pagedatail', { ikey: this.$route.query.ikey },)
      // 设置回调函数，接收返回的响应对象
      // 异步操作成功时，执行的回调函数
      res.then(res => {
        this.baseData = res.data.fchecklistcltledger_h;
        this.tableData = res.data.fchecklistcltledgerList;
        console.log('route.cltcode', this.$route.query.cltcode);
        console.log('baseData.cltcode', this.baseData.cltcode);
        console.log( this.baseData.cltcode == this.$route.cltcode);
        this.$nextTick(() => {
          // 在 nextTick 之后关闭 loading
          this.loadingInstance.closeLoading();
          if (this.baseData.cltcode != this.$route.query.cltcode) {
            this.dataLoaded = false
          } else { this.dataLoaded = true; }
        });
      })
      res.catch(error => {
        console.log('请求失败:')
        // console.log('error:',error)
        console.log('请求失败响应对象获取', error.res)
        this.$nextTick(() => {
          // 在 nextTick 之后关闭 loading
          this.loadingInstance.closeLoading();
        });
      })
    },
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
    //对账函下载
    dzhDownload() {
      const a = document.createElement("a");
      const event = new MouseEvent("click");
      a.download = this.baseData.dzhFilename;
      a.href = '/api/khdzfile/' + this.baseData.dzhFilename;
      a.dispatchEvent(event);
    },
    khdzdDownload() {
      const a = document.createElement("a");
      const event = new MouseEvent("click");
      a.download = this.baseData.khdzFilename;
      a.href = '/api/khdzfile/' + this.baseData.khdzFilename;
      a.dispatchEvent(event);
    },
    xsmxDownload() {
      const a = document.createElement("a");
      const event = new MouseEvent("click");
      a.download = this.baseData.xsmxFilename;
      a.href = '/api/khdzfile/' + this.baseData.xsmxFilename;
      a.dispatchEvent(event);
    }
  },
  created() {
    this.getData();
  },
  mounted() {

  }
}
</script>
  
<style lang="scss" scoped>
.body {
  display: flex;
  width: 100%;
  // height: 100%;
  justify-content: center;
  background-color: rgb(245, 245, 249);
}

.all {
  height: 100%;
  width: 80%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  padding-bottom: 20px;
}

.header {
  height: auto;
  width: 100%;
  margin: 20px;

  span {
    font-size: 30px;
    padding: 20px;
  }
}

.base {
  margin: 0px 20px;
  display: flex;

  .downloadBox {
    height: 130px;
    width: 186px;
    display: flex;
    flex-direction: column;
    border: 1px solid #e0e0e0;

    span {
      size: 20px;
      background-color: rgb(255, 255, 255);
      align-self: center;
      align-content: center;
      height: 32px;
    }

  }

  .el-image :hover {
    height: 100px;
    background-color: #f5f5f5;
    cursor: pointer;
    content: url("../assets/下载.png");
  }

  /deep/.el-descriptions__body .el-descriptions__table {
    tbody {
      width: 100%;
      margin: 30px 0;
      border-bottom: 1px solid;
      border-color: #f3f3f3;
    }

    .el-descriptions-item__content {
      height: 50px;
    }

    .el-descriptions-item__cell {
      padding: 20px 0;
    }


    .el-descriptions-item__label {
      font-size: 13px;
      color: rgb(117, 117, 117);
      font-weight: bold;
    }

    .el-descriptions-item__content {
      padding: 0;

    }
  }


}
</style>
  