<template title="取证单列表">
  <div>
    <el-row>
      <el-col :span="24">
        <el-card>
          <div slot="header" class="clearfix">
            <div style="float:left">
              <span>取证单列表</span>
            </div>
          </div>
            <div class="btn-wrap clearfix">
              <!-- <div style="float:left" class="btn">
                <el-button type="primary" @click="EditAccounts('')">新增审计方法</el-button>
              </div> -->
              <div style="float:right;margin-bottom:30px">
                <el-input size="small" :placeholder="selectType==1?'请输入项目名称':''" v-model="selectWord" class="input-with-select" style="width:360px;" @keyup.enter.native="handleCurrentChange(1)">
                  <el-select v-model="selectType" slot="prepend" placeholder="请选择" style="width:125px;" >
                    <el-option label="项目名称" :value=1></el-option>
                  </el-select>
                  <el-button slot="append" type="primary"  @click="handleCurrentChange(1)">搜索</el-button>
                </el-input>                
              </div>
            </div>
            <el-table :data="tableData" style="width: 100%" border fit
              highlight-current-row>
              <el-table-column
                      label="序号"
                      width="70px">
                  <template slot-scope="scope">
                      {{scope.$index+1+(cuPage-1)*10}}
                  </template>
              </el-table-column>
              <el-table-column prop="projectName" label="项目名称" min-width="120" >
              </el-table-column>
              <el-table-column prop="auditObject" label="审计对象" min-width="120">
              </el-table-column>
              <el-table-column prop="auditMatters" label="审计事项" min-width="120">
              </el-table-column>
              <el-table-column prop="cacsMeth.cacsName" label="审计方法" min-width="140">
              </el-table-column>
              <el-table-column prop="createUser" label="制单人" min-width="100">
              </el-table-column>
              <el-table-column prop="createTime" label="生成时间" min-width="180">
                 <template slot-scope="scope">
                  {{changeDate(scope.row.createTime)}}
                </template>
              </el-table-column>

              <el-table-column label="操作" fixed="right"  width="280"  align="center">
                <template slot-scope="scope">
                   <el-button  type="primary"   @click="lookcon(scope.row)"  size="mini">预览</el-button>
                   <el-button  type="primary"   @click="gotourl(scope.row.chooseDataUri)" size="mini">下载疑点</el-button>
                   <el-button  type="primary"   @click="gotourl(scope.row.fileUri)" size="mini">下载</el-button>
                </template>
              </el-table-column>
            </el-table>
          <div class="pagination">
            <el-pagination background @current-change="handleCurrentChange" :page-size="10"
              layout="total,prev, pager, next" :total="tableTotal" :current-page="cuPage">
            </el-pagination>
          </div>


          <el-dialog title="预览取证单" :visible.sync="dialogFormVisible" class="seeformclass">
            <div style="text-align:center;font-size:20px;margin-bottom:20px;font-weight: 600;">审 计 取 证 单</div>
            <el-form ref="form" :model="InfoForm" label-width="80px" style="border:1px solid #ddd">
              <el-form-item prop="projectName" label="项目名称：" style="border:1px solid #ddd;">
                <span>
                  <el-input
                  id="input1"
                    type="textarea"
                    v-model="InfoForm.projectName">
                  </el-input>
                </span>
                
                    </el-form-item>
                    <!-- <el-form-item label="所属行业：" style="border:1px solid #ddd">
                      <span style="padding-left: 20px;">
                  {{InfoForm.industry}}
                </span>
                    </el-form-item> -->
                    <el-form-item prop="auditObject" label="被审查(调查)单位或个人：" style="border:1px solid #ddd">
                        <span >
                  <el-input
                  id="input2"
                    type="textarea"
                    v-model="InfoForm.auditObject">
                  </el-input>
                </span>
                    </el-form-item>
                    <el-form-item prop="auditMatters" label="审查(调查)事项：" style="border:1px solid #ddd" >
                      <span>
                  <el-input
                  id="input3"
                    type="textarea"
                    v-model="InfoForm.auditMatters">
                  </el-input>
                </span>
                    </el-form-item>
                    <el-form-item prop="auditSummary" label="审查(调查)事项摘要：" style="border:1px solid #ddd">
                      <span>
                  <el-input
                  id="input4"
                    type="textarea"
                    v-model="InfoForm.auditSummary">
                  </el-input>
                </span>
                    </el-form-item>
                    <el-form-item label="审计人员(签名)：" style="border:1px solid #ddd">
                        <span >
                  <el-input
                  id="input5"
                    type="textarea"
                    v-model="InfoForm.createUser">
                  </el-input>
                </span>
                    </el-form-item>
                    <el-form-item prop="auditSummary" label="证据提供单位意见：" style="border:1px solid #ddd">
                      <span style="padding-left: 20px;">
                  <!-- {{InfoForm.auditSummary}} -->
                  <div style="position:absolute;bottom:0px;right:20px">
                    被审计单位（盖章）
                  </div>
                </span>
                    </el-form-item>
            </el-form>
            <div style="margin-top:14px;font-weight: 600;">
              <span style="">
              审核人（签名）：
            </span>
            <span style="padding-left:100px">
            附件：
            </span>
            </div>
            
            <div slot="footer" class="dialog-footer" style="text-align:center">
              <el-button @click="closed()"  size="small">关 闭</el-button>
               <el-button type="primary" @click="saveCreat()" size="small">保 存</el-button>
            </div>
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
  import store from '@/store'
  export default {
    beforeRouteEnter: function (to, from, next) {
      next(function (vm) {
        // util.setAuth(to.path,vm);
      });
    },
    data() {
      return {     
        selectInduId : localStorage.getItem("selectInduId"),
        selectIndu : localStorage.getItem("selectIndu"),
        // options: [],

        //筛选项
        selectType:1,
        selectWord:'',
        //表格数据
        tableData: [
        ],
        tableTotal: 3,
        cuPage: 1,
        pageSize:10,
        dialogFormVisible:false,
        InfoForm:{
  
          createUser: store.getters.username,
          industry:"",
          projectName: "",
          auditObject: "",
          auditMatters: "",
          auditSummary: "",
         }
        
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
      //获取行业配置
      // this.industrySet();
      // //初始化加载首页
      this.handleCurrentChange(1);
    },
    created(){

    },
    methods: {

      closed(){
        this.dialogFormVisible = false;
      },
      saveCreat(){
           util.postData(api.saveReviewsSheet,this.InfoForm
            , this).then(res => {
              this.dialogFormVisible=false;
              this.gotourl(res.result.fileUri);
            }).catch(_ => {
            });
          
      },
      lookcon(item){
        this.InfoForm=item;
        this.dialogFormVisible=true;
      },
       gotourl(url){
        if(url.indexOf("https://")!=-1 || url.indexOf("http://")!=-1){
              window.open(url);
          }else{
              window.open("https://"+url);
          }
      },
      seesql(sql){
        this.$alert('<strong>'+sql+'</strong>', '查看sql', {
            dangerouslyUseHTMLString: true
        });
      },
      //获取用户列表
      getList(){
        let para={
          page:this.cuPage,
          pageSize:this.pageSize,
          columnData:{}
        };
        para.columnData.industryId=this.selectInduId;
        this.selectWord=this.selectWord.replace(/^\s+|\s+$/g,"");
        switch(this.selectType)
        {
            case 1:
                para.columnData.projectName=this.selectWord;
                break;
            default:
                ""
        }
        util.postData(api.checkAuditList, para, this).then(result => {
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
      // 分页导航
      handleCurrentChange(val) {
        this.cuPage=val;
        this.getList();
      },
    }
  };

</script >
<style lang="scss"  scoped>
.seeformclass{
        /deep/ #input1 {
           height: 80px;
          width:100%;
          outline:none;
        }
         /deep/ #input2 {
           height: 120px;
           width:100%;
        }
         /deep/ #input3 {
           height: 80px;
           width:100%;
        }
         /deep/ #input4 {
           height: 110px;
          width:100%;
        }
         /deep/ #input5 {
           height: 80px;
           width:100%;
        }

        >>>.el-form-item__label{
          font-weight: 600;
        }
        >>>.el-form-item{
          margin: 0;
        }
      }
</style>
