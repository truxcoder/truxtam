<template>
  <div class="app-container user-container">
    <el-card class="left-card">
      <el-input v-model="filterText" placeholder="请输入部门名称" size="small" prefix-icon="el-icon-search"></el-input>
      <el-tree
        class="filter-tree"
        :data="data"
        :props="defaultProps"
        default-expand-all
        :filter-node-method="filterNode"
        ref="tree">
      </el-tree>
    </el-card>
    <el-card class="right-card">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="姓名">
          <el-input v-model="formInline.user" size="small" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item label="警号/工号">
          <el-select v-model="formInline.region" size="small" placeholder="警号/工号">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" icon="el-icon-search" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table
        v-loading="listLoading"
        :data="currentPageData"
        element-loading-text="Loading"
        stripe
        border
        fit
        highlight-current-row
        @selection-change="handleSelectionChange"
      >
        <el-table-column align="center" type="selection" width="55"> </el-table-column>
        <el-table-column align="center" label="ID" width="50">
          <template slot-scope="scope">
            {{ scope.$index }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="编号" width="150">
          <template slot-scope="scope">
            {{ scope.row.code}}
          </template>
        </el-table-column>
        <el-table-column label="姓名">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column label="所属部门" width="110" align="center">
          <template slot-scope="scope">
            {{ scope.row.department }}
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="状态" width="110" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status"> </el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="created_at" label="创建日期" width="200">
          <template slot-scope="scope">
            <i class="el-icon-time" />
            <span>{{ scope.row.create_time }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作"  width="200">
          <template slot-scope="scope">
            <el-link type="primary" class="oper-btn" icon="el-icon-edit" :underline="false" @click="handleEdit(scope.$index, scope.row)">编辑</el-link>
            <el-link type="primary" class="oper-btn" icon="el-icon-delete" :underline="false" @click="handleDelete(scope.$index,scope.row.id)">删除</el-link>
            <el-link type="primary" class="oper-btn" icon="el-icon-refresh" :underline="false" @click="handleDelete(scope.$index,scope.row.id)">重置</el-link>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
  import { getUserList} from "@/api/user";
  export default {
    name:"User",
    data() {
      return {
        userData:[],
        listLoading: true,
        dialogFormVisible:false,
        addFormVisible:false,
        rowData:{},
        currentEditIndex:0,
        departmentList:['办公室','政治处','财务科','管理科','生产科'],
        rowSuccessClass:'',
        currentPage:1, //初始页
        pagesize:10,//每页的数据
        total:0,
        filterText: '',
        formInline: {
          user: '',
          region: ''
        },
        multipleSelection: [],
        data: [{
          id:1,
          label:'资阳强戒所',
          children:[{
            id: 1,
            label: '所领导',
          }, {
            id: 1,
            label: '政治处',
          }, {
            id: 1,
            label: '办公室',
          }, {
            id: 1,
            label: '财务科',
          }, {
            id: 2,
            label: '大队',
            children: [{
              id: 5,
              label: '一大队'
            }, {
              id: 6,
              label: '二大队'
            }]
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      currentPageData(){
        return this.userData.slice((this.currentPage-1)*this.pagesize,this.currentPage*this.pagesize)
      },
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
    methods: {      
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      onSubmit() {
        console.log('submit!');
      },
      fetchData() {
        this.listLoading = true
        let params = {}
        getUserList(params).then(response => {
          this.userData = response.data.items
          console.log(this.userData)
          this.total = response.data.total
          // this.list = response
          this.listLoading = false
        })
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      // handleEdit(index, row) {
      //     // console.log(index, row)
      //     this.rowData = row
      //     this.currentEditIndex = index
      //     this.dialogFormVisible = true
      //   },
      // handleDelete(index,id) {
      //   this.$confirm('将删除该条信息, 是否确定?', '提示', {
      //       confirmButtonText: '确定',
      //       cancelButtonText: '取消',
      //       type: 'warning'
      //   }).then(() => {
      //     deleteAsset({id}).then(response => {
      //       this.$message({
      //         message: response.message,
      //         type: 'success'
      //       })
      //       this.list.splice(index,1)
      //     }).catch(err => {
      //       // this.$message.error(err.message)
      //     })
      //   }).catch(() => {
      //     this.$message({
      //       type: 'info',
      //       message: '已取消删除'
      //     })
      //   })
      // },
      // visibleChange(){
      //   this.dialogFormVisible = false
      // },
      // addVisibleChange(){
      //   this.addFormVisible = false
      // },
      // addAssetSuccess(){
      //   this.addFormVisible = false
      //   this.fetchData()
      // },
      // updateAssetSuccess(row){
      //   this.dialogFormVisible = false
      //   this.fetchData()
      // },
      handleSizeChange(size) {
        this.pagesize = size;
        console.log(this.pagesize)  //每页下拉显示数据
      },
      handleCurrentChange(currentPage){
        this.currentPage = currentPage;
        console.log(this.currentPage)  //点击第几页
      },
    },
  }
</script>

<style scoped>
.user-container {
  display: flex;
}
.left-card {
  flex: 0 1 300px;
  margin-right: 10px;
}
.right-card {
  flex: 1;

}
.filter-tree {
  margin-top: 10px;
}
.oper-btn{
  font-size: 12px;
  margin: 0 5px;
}
</style>
