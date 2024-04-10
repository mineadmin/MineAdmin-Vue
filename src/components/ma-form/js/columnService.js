import { loadDict } from "@cps/ma-form/js/networkRequest"

/**
 * columnService 列服务处理类
 * 首先感谢 @NEKGod 提交的PR，此功能原本写在了 Ma-Crud 组件，我特意摘出来，封装成类通过引用来调用
 * @author NEKGod, X.Mo <root@imoi.cn>
 */

const objectService = function (item) {
  this.setAttr = (key, value) => {
    item[key] = value
  }

  this.getAttr = (key) => {
    return item[key]
  }



  this.get = () => {
    return item
  }

  this.set = (config = {}) => {
    for (let [key, value] of Object.entries(config)) {
      item[key] = value
    }
  }
}

/**
 * dict项服务类
 * @param dataIndex
 * @param dictData
 * @constructor
 */
const dictService = function (dataIndex, dictData, dicts, columns) {
  this.columns = columns
  this.dicts = dicts
  this.dictData = dictData
  this.dataIndex = dataIndex

  /**
   * 返回原DictData对象
   * @returns {*}
   */
  this.getRawDictData = () => {
    return this.dictData
  }
  /**
   * 追加
   * @param label
   * @param value
   * @param extend
   */
  this.append = (label, value, extend = {}) => {
    this.getRawDictData().push(Object.assign({
      label: label,
      value: value,
    }, extend))
  }
  /**
   * 重新加载dict
   * @param dictConfig
   * @returns {Promise<void>}
   */
  this.loadDict = async (dictConfig) => {
    this.columns.setAttr('dict', dictConfig)
    await loadDict(this.dicts, { formType: "select", dict: dictConfig, dataIndex: this.dataIndex })
  }
}

class ColumnService {
  /**
   * @type {Map<string, Object>}
   */
  columnMap = new Map()

  dictMap = new Map()

  columns

  cascaders

  dicts

  refs

  strictMode

  /**
   * @param data
   * @param strictMode
   */
  constructor(data, strictMode) {
    this.columns = data.columns
    this.cascaders = data.cascaders
    this.dicts = data.dicts
    this.refs = data?.refs ?? {}
    this.strictMode = strictMode

    this.columns.forEach(item => {
      this.columnMap.set(item.dataIndex, new objectService(item))
    })

    for (const [dataIndex, dictData] of Object.entries(this.dicts)) {
      this.dictMap.set(dataIndex, new dictService(dataIndex, dictData, this.dicts, this.columnMap.get(dataIndex)))
    }
  }

  getDialogRefs(refName = undefined) {
    return refName ? this.refs[refName] : this.refs
  }

  getDictService(dataIndex) {
    return this.dictMap.get(dataIndex)
  }

  get(dataIndex) {
    return this.columnMap.get(dataIndex)
  }

  isEmpty(dataIndex) {
    return !this.columnMap.has(dataIndex)
  }

  exist(dataIndex) {
    return !this.isEmpty(dataIndex)
  }

  async append(item, appendStartDataIndex = null) {
    if (this.strictMode === true && item.dataIndex && this.exist(item.dataIndex)) {
      console.warn(`严格模式：columnService.append(item) 参数中未有item.dataIndex属性或者item.dataIndex已存在column.${item.dataIndex}`)
      return false
    }
    if (this.cascaders.includes(item.dataIndex) && item.dict) {
      await loadDict(this.dicts, item)
    }
    this.columns.push(item)
    this.columnMap.set(item.dataIndex, new objectService(item))
    // 获取排序
    if (appendStartDataIndex !== null) {
      let appendIndex = this.columns.map(item => {
        return item.dataIndex
      })?.indexOf(appendStartDataIndex) ?? -1
      if (appendIndex === -1) {
        return this.append(item, null)
      }
      let sortIndex = 0
      let appendPosIndex = 0
      this.columns.forEach(sortItem => {
        if (sortItem.dataIndex === appendStartDataIndex) {
          appendPosIndex = sortIndex
        } else if (sortItem.dataIndex === item.dataIndex) {
          sortIndex = appendPosIndex + 1
        } else {
        }
        sortItem.sortIndex = sortIndex
        sortIndex += 2
      })
      this.columns.sort((a, b) => a.sortIndex - b.sortIndex)
    }
    return true
  }
}

export default ColumnService