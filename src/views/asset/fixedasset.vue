<template>
  <div class="app-container">
    <div class="tool-bar"><el-button type="primary" @click="addFormVisible = true">添加资产</el-button></div>
    <el-table
      v-loading="listLoading"
      :data="queryMeans==='backend'?list:currentPageData"
      element-loading-text="Loading"
      stripe
      border
      fit
      highlight-current-row
    >
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
      <el-table-column label="名称">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="品牌" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.mfrs }}
        </template>
      </el-table-column>
      <el-table-column label="型号" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.model }}
        </template>
      </el-table-column>
      <el-table-column label="所属部门" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.department }}
        </template>
      </el-table-column>
      <el-table-column label="所在位置" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.position }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="购买日期" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.buy_time }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="启用日期" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.use_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="责任人" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.manager }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作"  width="200">
      <template slot-scope="scope">
        <el-button
          size="mini"
          @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index,scope.row.id)">删除</el-button>
      </template>
    </el-table-column>
    </el-table>
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 40]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <fixed-asset-edit :dialogFormVisible="dialogFormVisible" :rowdata="rowData" :department-list="departmentList" @updateAssetSuccess="updateAssetSuccess" 
      @visibleChange="visibleChange"/>
    <fixed-asset-add :addFormVisible="addFormVisible" :department-list="departmentList" @addAssetSuccess="addAssetSuccess" @addVisibleChange="addVisibleChange"/>
  </div>
</template>

<script>
import { getAssetList ,deleteAsset} from "@/api/asset";
import fixedAssetEdit from './fixed-asset-edit'
import fixedAssetAdd from './fixed-asset-add'
export default {
  name: "FixedAsset",
  components: {fixedAssetEdit,fixedAssetAdd},
  filters: {
    statusFilter(status) {
      const statusMap = {
        正常: 'success',
        损坏: 'gray',
        维修: 'gray',
        废弃: 'danger',
        丢失: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: [],
      listLoading: true,
      dialogFormVisible:false,
      addFormVisible:false,
      rowData:{},
      currentEditIndex:0,
      departmentList:['办公室','政治处','财务科','管理科','生产科'],
      rowSuccessClass:'',
      currentPage:1, //初始页
      pagesize:10,//每页的数据
      total:0
    }
  },
  computed: {
    currentPageData(){
      return this.list.slice((this.currentPage-1)*this.pagesize,this.currentPage*this.pagesize)
    },
    queryMeans(){
      return this.$store.state.settings.queryMeans
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true

      let params = {
        currentPage:this.currentPage,
        pageSize:this.pagesize,
        queryMeans:this.queryMeans
      }
      getAssetList(params).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        // this.list = response
        this.listLoading = false
      })
    },
    handleEdit(index, row) {
        // console.log(index, row)
        this.rowData = row
        this.currentEditIndex = index
        this.dialogFormVisible = true
      },
    handleDelete(index,id) {
      this.$confirm('将删除该条信息, 是否确定?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
        deleteAsset({id}).then(response => {
          this.$message({
            message: response.message,
            type: 'success'
          })
          this.list.splice(index,1)
        }).catch(err => {
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
      this.dialogFormVisible = false
    },
    addVisibleChange(){
      this.addFormVisible = false
    },
    addAssetSuccess(){
      this.addFormVisible = false
      this.fetchData()
    },
    updateAssetSuccess(row){
      this.dialogFormVisible = false
      this.fetchData()
    },
    handleSizeChange(size) {
      this.pagesize = size;
      console.log(this.pagesize)  //每页下拉显示数据
    },
    handleCurrentChange(currentPage){
      this.currentPage = currentPage;
      console.log(this.currentPage)  //点击第几页
      if(this.queryMeans==='backend'){
        this.fetchData()
      }
    },
  }
}
</script>

<style scoped>
.tool-bar {
  padding: 0 0 20px 0;
}
</style>