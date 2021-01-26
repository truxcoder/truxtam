export default {
  code: [
    { required: true, message: '请输入活动名称', trigger: 'blur' },
    { min: 10, max: 12, message: '长度在 10 到 12 个字符', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入资产名称', trigger: 'blur' },
    { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
  ],
  mfrs: [
    { required: true, message: '请输入品牌', trigger: 'blur' },
    { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
  ],
  model: [
    { required: true, message: '请输入型号，无型号请填未知', trigger: 'blur' },
    { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'blur' },
  ],
  manager: [
    { required: true, message: '请输入责任人', trigger: 'blur' },
    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
  ],
  department: [
    { required: true, message: '请选择单位', trigger: 'blur' },
  ],
  position: [
    { required: true, message: '请输入所在位置', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  buy_time: [
    { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
  ],
  use_time: [
    { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
  ]
}