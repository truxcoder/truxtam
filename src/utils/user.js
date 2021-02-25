export function transToTreeData(arr,label="label") {
  let newArray = []
  let newObj = {}
  arr.forEach(item => {
    newArray.push({
      id:item.id,
      [label]:item.name,
      parent:item.parent
    })
  })
  newArray.forEach(item => {
    if (newObj[item.parent]) {
      newObj[item.parent].push(item)
    } else {
      newObj[item.parent] = [item]
    }
  })
  let result = newObj[0]
  if(Array.isArray(result)){
    checkChildren(result, newObj)
  }
  return result
}
function checkChildren(array, obj) {
  array.forEach(item => {
    if (!obj[item.id]) {
      return
    } else {
      item.children = obj[item.id]
      checkChildren(item.children, obj)
    }
  })
}