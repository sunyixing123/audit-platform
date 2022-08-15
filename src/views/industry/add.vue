<template title="新建配置项">
  <div>
    <el-row>
      <el-col :span="24">
        <el-card>
          <div slot="header" class="clearfix">
            <div style="float:left">
              <span>{{pagename}}</span>
            </div>
          </div>
            <el-form :model="InfoForm"  ref="InfoForm" :rules="rules" label-width="140px"  size="medium" >
              <el-form-item prop="configDesc" label="配置项名称：" >
                <el-input v-model="InfoForm.configDesc" placeholder="请输入配置项名称" style="width:276px" ></el-input>
              </el-form-item>
              <el-form-item prop="configKey" label="配置项key：" >
                <el-input v-model="InfoForm.configKey" placeholder="请输入配置项key" style="width:276px" ></el-input>
              </el-form-item>
              <el-form-item label="配置项value：" >
                <el-table
                  :data="tableData"
                  style="width: 60%"
                  border
                  max-height="250">
                  <el-table-column
                    fixed
                    prop="id"
                    label="id"
                    width="auto">
                  </el-table-column>
                  <el-table-column
                    prop="name"
                    label="name"
                    width="auto">
                  </el-table-column>
                  <el-table-column
                    fixed="right"
                    label="操作"
                    width="80">
                    <template slot-scope="scope">
                      <el-button
                        @click.native.prevent="deleteRow(scope.$index, tableData)"
                        type="text"
                        size="small">
                        移除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <el-form :inline="true" :model="addKeyParam" class="demo-form-inline" style="margin:20px 0px">
                  <el-form-item label="id：">
                    <el-input v-model="addKeyParam.id" placeholder="请输入id" size="mini"></el-input>
                  </el-form-item>
                  <el-form-item label="name：">
                    <el-input v-model="addKeyParam.name" placeholder="请输入name" size="mini"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button  size="mini" type="primary"  @click="addKeyParamFun()">增加键值对</el-button>
                  </el-form-item>
                </el-form>
              </el-form-item>
               <el-form-item label="备注">
                <el-input type="textarea" v-model="InfoForm.remarks" placeholder="输入备注" :rows="4" style="width:350px" resize="none" maxlength="200" show-word-limit></el-input>
              </el-form-item>
            </el-form>
            <el-form style="padding:12px 0px 0px 40px">
              <el-form-item style="text-align:left">
                  <span style="color:#E79820">提示：请确保信息准确无误</span>
              </el-form-item>
              <el-form-item  style="text-align:left">
                <el-button @click="close()" size="small">取消</el-button>
                <el-button  @click="onSubmit()" type="primary" size="small">{{savename}}</el-button>
              </el-form-item>
            </el-form>
        </el-card>
      </el-col>
    </el-row>

  </div>
</template>
<style lang="scss"  scoped>
table{  text-align:center;border-collapse: collapse; padding:0; margin:0; }
	.outTable{width: 100%;height: 500px;margin-bottom: 40px;}
	.inTable{ width:100%; height:100%;}
	.outTable td{border: 1px solid rgba(31, 44, 119, 0.1)}	
	.div{ width:100%; height:500px;}
</style>
<script>
  import util from "../../utils";
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
        tableData:[],
        addKeyParam:{},
        id:this.$route.query.id,
        pagename:'新建配置项',
        savename:"确认添加",
        baseurl:"http://home.19951106.xyz:8999/file/uploadFile",
        // editflag: false,
        // 表单字段
        InfoForm:{
          createUser:  store.getters.username,
          id: "",
          name: "",
          remarks: "",
          updateUser: store.getters.username,
        },
        rules: {
          //合同编号校验
          configDesc: [{
              required: true,
              message: '请输入配置项名称',
              trigger: 'blur'
            },
            // {
            //   min: 2,
            //   max: 50,
            //   message: '长度在 2 到 50个字符',
            //   trigger: 'blur'
            // }
          ],
          configKey: [{
              required: true,
              message: '请输入备注',
              trigger: 'blur'
            },
            // {
            //   min: 2,
            //   max: 100,
            //   message: '长度在 2 到 100个字符',
            //   trigger: 'blur'
            // }
          ],
          
        },
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
      if(!this.id){
        this.pagename="新建配置项";
        this.savename="确认添加";
      }else{
        this.getListById();
        this.pagename="编辑配置项";
        this.savename="确认编辑";
      }      
    },
    created(){

    },
    methods: {
      deleteRow(index, rows) {
        rows.splice(index, 1);
      },
      addKeyParamFun() {
        if(this.addKeyParam.id && this.addKeyParam.name){
          this.tableData.push(this.addKeyParam);
          this.addKeyParam={};
        }else{
          this.$message({type: 'error',message: '请填写完整键值对',});
        }
        
      },
      
      //根据id获取生产单
      getListById(){
        util.getData(api.getConfigById+"?id="+this.id, {}, this).then(result => {
          this.InfoForm=result.result;
          this.tableData=JSON.parse(this.InfoForm.configValue);
        }).catch(_ => {

        });
      },
      //提交保存
      onSubmit: function () {
        this.$refs['InfoForm'].validate((valid) => {
            if(valid){
               //处理数据
               this.InfoForm.updateUser=store.getters.username;
               this.InfoForm.configValue=JSON.stringify(this.tableData);
                util.postData(api.saveConfig, this.InfoForm, this).then(result => {
                  this.$message({type: 'success',message: '提交成功',});
                  this.$router.push("/industry/industrylist");
                }).catch(_ => {
                });
            }
          });
      },
      //关闭
      close: function () {
       this.$router.push("/industry/industrylist");
      },
      //清除数据
      clearData: function () {
    
      },
    }
  };

</script>
