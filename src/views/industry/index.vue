<template title="配置项列表">
  <div>
    <el-row>
      <el-col :span="24">
        <el-card>
          <div slot="header" class="clearfix">
            <div style="float:left">
              <span>配置项列表</span>
            </div>
          </div>
            <div class="btn-wrap clearfix">
              <div style="float:left" class="btn">
                <el-button type="primary" @click="EditAccounts('')" size="small" v-permission="'industry:add'">新增配置项</el-button>
              </div>
              <div style="float:right;margin-bottom:30px">
                <el-input size="small" placeholder="请输入配置项名称" v-model="selectWord" class="input-with-select" style="width:280px;" @keyup.enter.native="handleCurrentChange(1)">
                  <el-button slot="append" type="primary"  @click="handleCurrentChange(1)">搜索</el-button>
                </el-input>                
              </div>
            </div>
            <el-table :data="tableData" style="width: 100%" border fit
              highlight-current-row>
              <el-table-column prop="configDesc" label="配置项名称" min-width="120" >
              </el-table-column>
              <el-table-column prop="configKey" label="配置项key" min-width="120" >
              </el-table-column>
              <el-table-column prop="configValue" label="配置项value" min-width="100" >
                <template slot-scope="scope">
                  <el-button  type="text"  size="small"  @click="getDetail(scope.row.configValue)" style="color:#3546A4;">查看详情</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="remarks" label="备注" min-width="120">
              </el-table-column>
              <el-table-column prop="updateUser" label="操作人" min-width="120">
              </el-table-column>
              <el-table-column label="操作" fixed="right" min-width="120" align="center">
                <template slot-scope="scope">
                  <el-button  type="text"  size="small"  @click="EditAccounts(scope.row.id)" style="color:#3546A4;">编辑</el-button>
                  <el-button  type="text" size="small"   @click="delte(scope.row.id)" style="color:#3546A4;">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          <div class="pagination">
            <el-pagination background @current-change="handleCurrentChange" :page-size="10"
              layout="total,prev, pager, next" :total="tableTotal" :current-page="cuPage">
            </el-pagination>
          </div>
          <el-dialog title="键值对列表" :visible.sync="dialogTableVisible">
            <el-table :data="currentTableDetail" :border="true" max-height="300px">
              <el-table-column property="id" label="id" ></el-table-column>
              <el-table-column property="name" label="name" ></el-table-column>
            </el-table>
          </el-dialog>
        </el-card>
      </el-col>
    </el-row>

  </div>
</template>
<style lang="scss"  scoped>
</style>
<script>
  import util from "../../utils/";
  import api from '../../utils/apiConstant';
  export default {
    beforeRouteEnter: function (to, from, next) {
      next(function (vm) {
        // util.setAuth(to.path,vm);
      });
    },
    data() {
      return {
        //筛选项
        selectWord:'',

        dialogTableVisible:false,
        currentTableDetail:[],
        tableData:[{}],
        tableTotal: 0,
        cuPage: 1,
        pageSize:10,
        
      };
    },
    watch: {
    },
    mounted() {
      // if(this.$route.meta.id!=undefined || this.$route.meta.id!=null){
      //   //获取页面权限
      //   util.postData(api.btnGet+'/'+localStorage.getItem('id')+'/'+this.$route.meta.id, {}, this).then(result => {
      //     result.data.map(item =>{
      //       this.$set(this.authBtn,item.path , true);
      //     })
      //     console.log(this.authBtn);
      //   }).catch(_ => {});
      // }
      // //初始化加载首页
      this.handleCurrentChange(1);
    },
    created(){

    },
    methods: {
      getDetail: function (item) {
        this.dialogTableVisible=true,
        this.currentTableDetail=JSON.parse(item);
      },
      //获取配置列表
      getList(){
        let para={
          page:this.cuPage,
          pageSize:this.pageSize,
          columnData:{}
        };
        if (this.selectWord) {
          para.columnData.configDesc=this.selectWord;
        }
        util.postData(api.getConfigAll, para, this).then(result => {
          let res=result.result;
          this.tableData=res.content;
          this.tableTotal=res.totalElements;
        }).catch(_ => {

        });
      },
      //处理日期
      changeDate(date){
        return util.formatT(new Date(date),'-');
      },
      // 新建法规
      EditAccounts: function (id) {
        this.$router.push({
            name: "industryadd",
            query: {id:id}  
        });
      },
      // // 编辑供应商
      // EditAccounts: function (id) {
      //   this.$router.push({
      //       name: "agentListAdd",
      //       query: {id:id}  
      //   });
      // },
      delte:function(id){
        this.$confirm('是否删除配置项？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              util.getData(api.deleteConfigById, {id:id}, this).then(result => {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                 this.handleCurrentChange(1);
              }).catch(_ => {

              });
            }).catch(() => {
              
            });
      },
      //清除数据
      clearData: function () {

      },
      // 分页导航
      handleCurrentChange(val) {
        this.cuPage=val;
        this.getList();
      },
    }
  };

</script>
