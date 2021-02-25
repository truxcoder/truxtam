import rules from '@/common/rules/department'
import models from '@/common/model/department'
export const mixin = {
  props:{
    departmentList:{
      type:Array,
      default(){
        return []
      }
    },
  },
  data(){
    return {
      entityList:[{label:'是',value:true},{label:'否',value:false}],
      form:{},
      formLabelWidth: '120px',
      formItemWidth: {width:'300px'},
      rules,
      dialogLoading:false,
      models
    }
  },
  computed:{
    formItemData(){
     return  Object.keys(models).sort( (a,b) => models[a].order - models[b].order)
    },
    newDeptList(){
      return [{id:'0',name:'戒毒局'},...this.departmentList]
      // return this.departmentList.length ? this.departmentList : [{id:'0',name:'戒毒局'}]
    }
  },
  
}

