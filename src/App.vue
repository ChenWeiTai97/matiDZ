

<template>
  <el-container v-if="$route.name != null" >
    <el-aside v-if="$route.name !== 'detail' " style="width: 200px;height: 100%;">
      <el-col style="height: 100%;">
        <el-menu :router="true" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b"
          style="height: 100%;">
          <el-menu-item index="/matList">
            <el-image style="height: 36px;" :src="require('./assets/matList.png')" fit="scale-down" />
            <span slot="title">客户列表</span>
          </el-menu-item>
          <el-menu-item index="/list">
            <el-image style="height: 36px;" :src="require('./assets/list.png')" fit="scale-down" />
            <span slot="title">对账单信息</span>
          </el-menu-item>
        </el-menu>
      </el-col>
    </el-aside>
    <el-main><router-view></router-view></el-main>
  </el-container>
</template>


<script>
export default {
  name: "app",
  mounted() {
    console.log(this.$route);
    },
};
</script>


<style lang="scss" >
body,
html {
  display: flex;
  margin: 0;
  height: 100%;
  width: 100%;
  // background-color: #E9EEF3;
  // flex-direction: column;
  // align-items: center;
}

.el-main {
  padding: 0px;
}

// el-container {
//   justify-content: center;
//   height: 100%;
// }

// el-aside {
//   height: 100%;

//   el-menu {
//     height: 100%;
//   }
// }
</style>