<template>
  <div class="app-container user-container">
    <el-card class="left-card">
      <el-input v-model="filterText" placeholder="请输入部门名称" size="small" prefix-icon="el-icon-search"></el-input>
      <el-tree
        class="filter-tree"
        :data="departmentTreeList"
        :props="defaultProps"
        default-expand-all
        @node-click="nodeClick"
        :filter-node-method="filterNode"
        :expand-on-click-node="false"
        ref="tree">
      </el-tree>
    </el-card>
    <el-card class="right-card">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="姓名">
          <el-input v-model="formInline.name" size="small" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item label="警号/工号">
          <el-input v-model="formInline.code" size="small" placeholder="警号或工号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" icon="el-icon-search" @click="onSearch">查询</el-button>
        </el-form-item>
      </el-form>
      <div class="user-tool-bar">
        <el-button type="success" @click="addFormVisible = true" icon="el-icon-circle-plus-outline" size="mini">添加</el-button>
        <el-button type="danger" :disabled="!multipleSelection.length" icon="el-icon-delete" @click="deleteMutiData" size="mini">删除</el-button>
        <el-button type="primary"  icon="el-icon-s-data" @click="handleAllData" size="mini">所有数据</el-button>
      </div>
      <el-table
        v-loading="listLoading"
        :data="currentPageData"
        element-loading-text="Loading"
        :header-cell-style="{'background-color':'#f8f8f9','color':'#666'}"
        border
        fit
        highlight-current-row
        @selection-change="handleSelectionChange"
      >
        <el-table-column align="center" type="selection" width="55"> </el-table-column>
        <el-table-column align="center" label="编号" width="150">
          <template slot-scope="scope">
            {{ scope.row.code}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="姓名">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="电话">
          <template slot-scope="scope">
            {{ scope.row.phone }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="角色">
          <template slot-scope="scope">
            {{ scope.row.role_id }}
          </template>
        </el-table-column>
        <el-table-column label="所属部门" width="110" align="center">
          <template slot-scope="scope">
            <span :class="{'text_red':!scope.row.department}">{{ scope.row.department?scope.row.department.name:'未定义' }}</span>
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="状态" width="110" align="center">
          <template slot-scope="scope">
            <span :class="scope.row.status?'text_green':'text_red'">{{ scope.row.status?'启用':'停用' }}</span>
            <!-- <el-switch v-model="scope.row.status"> </el-switch> -->
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
            <el-link type="success" class="oper-btn" icon="el-icon-edit" :underline="false" @click="handleEdit(scope.$index, scope.row)">编辑</el-link>
            <el-link type="danger" class="oper-btn" icon="el-icon-delete" :underline="false" @click="handleDelete(scope.$index,scope.row.id)">删除</el-link>
            <el-link type="primary" class="oper-btn" icon="el-icon-refresh" :underline="false" @click="handleDelete(scope.$index,scope.row.id)">重置</el-link>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
      background
      class="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 40]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
    <user-add :addFormVisible="addFormVisible" :department-list="departmentFormList" @addDataSuccess="addDataSuccess" @addVisibleChange="addVisibleChange"/>
    <user-edit :editFormVisible="editFormVisible" :rowdata="rowData" :department-list="departmentFormList" @updateDataSuccess="updateDataSuccess" @visibleChange="visibleChange"/>
  </div>
</template>

<script>
import { getUserList, deleteUser } from '@/api/user'
import UserAdd from './UserAdd'
import UserEdit from './UserEdit'
import { mixin } from '@/common/mixin'
export default {
  name: 'User',
  mixins: [mixin],
  components: { UserAdd, UserEdit },
  data() {
    return {
      currentData: [],
      originData: [],
      listLoading: true,
      editFormVisible: false,
      addFormVisible: false,
      rowData: {},
      currentEditIndex: 0,
      rowSuccessClass: '',
      currentPage: 1, //初始页
      pagesize: 10,//每页的数据
      filterText: '',
      formInline: {
        name: '',
        code: ''
      },
      multipleSelection: [],
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  created() {
    this.fetchData()
    this.fetchDptData()
  },
  computed: {
    currentPageData(){
      return this.currentData.slice((this.currentPage-1)*this.pagesize, this.currentPage*this.pagesize)
    },
    total() {
      return this.currentData.length
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    nodeClick(nodeobj){
      if (nodeobj.parent === "0") {
        this.fetchData()
      } else if (nodeobj.label === "大队") {
        return
      } else {
        this.currentData = this.originData.filter(item => item.departmentId === nodeobj.id)
      }
    },
    onSearch() {
      if (this.formInline.name){
        this.currentData = this.originData.filter(item => item.name === this.formInline.name)
      } else if (this.formInline.code){
        this.currentData = this.originData.filter(item => item.code === this.formInline.code)
      } else {
        this.$message({
          type: 'info',
          message: '查询条件不能为空！'
        })
        return
      }
      this.formInline = {
        name: '',
        code: ''
      }
    },
    fetchData(params = {}) {
      this.listLoading = true
      getUserList(params).then(response => {
        this.originData = response.data.items
        this.currentData = [ ...this.originData ]
        this.listLoading = false
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleAllData() {
      this.currentData = [...this.originData]
    },
    handleEdit(index, row) {
      // console.log(index, row)
      this.rowData = row
      this.currentEditIndex = index
      this.editFormVisible = true
    },
    handleDelete(index,id) {
      this.$confirm('将删除该条信息, 是否确定?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
        deleteUser({id:[id]}).then(response => {
          this.$message({
            message: response.message,
            type: 'success'
          })
          this.originData.splice(index,1)
          this.currentData.splice(index,1)
        }).catch(err => {
          console.log(err)
          // this.$message.error(err.message)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    visibleChange(){
      this.editFormVisible = false
    },
    deleteMutiData(){
      this.$confirm('将删除选中信息, 是否确定?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
        deleteUser({id:this.multipleSelection.map(item => item.id)}).then(response => {
          this.$message({
            message: response.message,
            type: 'success'
          })
          this.fetchData()
        }).catch(err => {
          // this.$message.error(err.message)
          console.log(err)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    addVisibleChange(){
      this.addFormVisible = false
    },
    addDataSuccess(){
      this.addFormVisible = false
      this.fetchData()
    },
    updateDataSuccess(row){
      this.editFormVisible = false
      this.fetchData()
    },
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

<style>
/* @tailwind base;
@tailwind components;
@tailwind utilities; */
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


.el-table--border, .el-table--group {
    border-color: #dedede;
}
.el-table--border:after, .el-table--group:after, .el-table:before {
    background-color: #dedede;
}
.el-table td, .el-table--border th,.el-table th.is-leaf {
    border-bottom-color: #dedede;
}
.el-table--border td, .el-table--border th {
    border-right-color: #dedede;
}

.pagination {
  margin-top: 15px;
}

.user-tool-bar {
  padding: 0 0 10px 0;
}
</style>
