<template>
  <div class="app-container">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="编号">
        <el-input v-model="formInline.code" size="small" placeholder="编号"></el-input>
      </el-form-item>
      <el-form-item label="名称">
        <el-input v-model="formInline.name" size="small" placeholder="名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" icon="el-icon-search" @click="onSearch">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="tool-bar">
      <el-button type="success" @click="addFormVisible = true" icon="el-icon-circle-plus-outline" size="mini">添加</el-button>
      <el-button type="danger" :disabled="!multipleSelection.length" icon="el-icon-delete" @click="deleteMutiData" size="mini">删除</el-button>
      <el-button type="primary"  icon="el-icon-s-data" @click="handleAllData" size="mini">所有数据</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="queryMeans==='backend'?currentData:currentPageData"
      element-loading-text="Loading"
      stripe
      border
      fit
      @selection-change="handleSelectionChange"
      highlight-current-row>
      <el-table-column align="center" type="selection" width="55"> </el-table-column>
      <el-table-column align="center" label="编号" width="100">
        <template slot-scope="scope">
          {{ scope.row.code}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="名称">
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
          <span :class="{'text_red':!scope.row.department}">{{ scope.row.department?scope.row.department.name:'未定义' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所在位置" align="center">
        <template slot-scope="scope">
          {{ scope.row.position }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" width="110" align="center">
        <template slot-scope="scope">
          <el-tag effect="plain" size="small" :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="购买价格" width="100" align="center">
        <template slot-scope="scope">
          {{ scope.row.price | priceFilter }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="购买日期" width="120">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.buy_time }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="启用日期" width="120">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.use_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报废年限" width="80" align="center">
        <template slot-scope="scope">
          {{ scope.row.scrap_year }}年
        </template>
      </el-table-column>
      <el-table-column label="责任人" width="80" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.manager }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作"  width="240">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index,scope.row.id)">删除</el-button>
          <el-button
            size="mini"
            type="primary"
            @click="handlePrint(scope.$index,scope.row)">打印</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 40]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"/>
    <fixed-asset-edit
      :dialogFormVisible="dialogFormVisible"
      :rowdata="rowData"
      :department-list="departmentFormList"
      @updateAssetSuccess="updateAssetSuccess" 
      @visibleChange="visibleChange"/>
    <fixed-asset-add :addFormVisible="addFormVisible" :department-list="departmentFormList" @addAssetSuccess="addAssetSuccess" @addVisibleChange="addVisibleChange"/>
    <fixed-asset-print :rowdata="rowData" :dialogPrintVisible="dialogPrintVisible" @printVisibleChange="printVisibleChange"/>
  </div>
</template>

<script>
import { getAssetList, deleteAsset} from '@/api/asset'
import { mixin } from '@/common/mixin'
import FixedAssetEdit from './FixedAssetEdit'
import FixedAssetAdd from './FixedAssetAdd'
import FixedAssetPrint from './FixedAssetPrint'
export default {
  name: "FixedAsset",
  components: { FixedAssetEdit, FixedAssetAdd, FixedAssetPrint },
  mixins: [mixin],
  filters: {
    statusFilter(status) {
      const statusMap = {
        正常: 'success',
        损坏: 'gray',
        维修: 'gray',
        报废: 'info',
        丢失: 'danger'
      }
      return statusMap[status]
    },
    priceFilter(price) {
      return '￥'+price.toFixed(0)
    }
  },
  data() {
    return {
      originData: [],
      currentData: [],
      listLoading: true,
      dialogFormVisible: false,
      addFormVisible: false,
      dialogPrintVisible: false,
      rowData: {},
      currentEditIndex: 0,
      multipleSelection: [],
      rowSuccessClass:'',
      currentPage: 1,
      pagesize: 10,
      formInline: {
        name: '',
        code: ''
      },
    }
  },
  computed: {
    currentPageData: {
      get: function () {
        return this.currentData.slice((this.currentPage-1)*this.pagesize, this.currentPage*this.pagesize)
      },
      set: function (newValue) {
        let originValue = this.currentData.slice((this.currentPage-1)*this.pagesize, this.currentPage*this.pagesize)
        // Object.assign(originValue[this.currentEditIndex], newValue)
        // originValue[this.currentEditIndex] = newValue
        this.$set(this.currentPageData, this.currentEditIndex, newValue)
      }
    },
    // currentPageData(){
    //   return this.currentData.slice((this.currentPage-1)*this.pagesize, this.currentPage*this.pagesize)
    // },
    queryMeans(){
      return this.$store.state.settings.queryMeans
    },
    total() {
      return this.currentData.length
    }
  },
  created() {
    this.fetchData()
    this.fetchDptData()
  },
  methods: {
    fetchData(params = {}) {
      this.listLoading = true
      params.currentPage = this.currentPage
      params.pageSize = this.pageSize
      params.queryMeans = this.queryMeans
      getAssetList(params).then(response => {
        this.originData = response.data.items
        this.currentData = [...this.originData]
        this.listLoading = false
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handlePrint(index, row) {
      // console.log(index, row)
      this.rowData = row
      // this.currentEditIndex = index
      this.dialogPrintVisible = true
    },
    handleAllData() {
      this.queryMeans === 'backend'?this.fetchData():(this.currentData = [...this.originData])
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
      })
      .then(() => {
        deleteAsset({id}).then(response => {
          this.$message({
            message: response.message,
            type: 'success'
          })
          this.originData.splice(index,1)
          this.currentData.splice(index,1)
        }).catch(err => {
          // this.$message.error(err.message)
          console.log(err)
        })
      })
      .catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    deleteMutiData(){
      this.$confirm('将删除选中信息, 是否确定?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
        deleteAsset({id:this.multipleSelection.map(item => item.id)}).then(response => {
          this.$message({
            message: response.message,
            type: 'success'
          })
          this.fetchData()
        }).catch(err => {
          // this.$message.error(err.message)
          console.log()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    onSearch() {
      if (this.formInline.name){
        this.queryMeans === 'backend'?this.fetchData({name:this.formInline.name}):(this.currentData = this.originData.filter(item => item.name === this.formInline.name))
      } else if (this.formInline.code){
        this.queryMeans === 'backend'?this.fetchData({name:this.formInline.code}):(this.currentData = this.originData.filter(item => item.name === this.formInline.code))
      } else {
        this.$message({
          type: 'info',
          message: '查询条件不能为空！'
        })
        return
      }
    },
    visibleChange(){
      this.dialogFormVisible = false
    },
    printVisibleChange(){
      this.dialogPrintVisible = false
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
      console.log(row)
      this.currentPageData = row
      // this.fetchData()
    },
    handleSizeChange(size) {
      this.pagesize = size
    },
    handleCurrentChange(currentPage){
      this.currentPage = currentPage
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
.pagination {
  margin-top: 15px;
}
</style>