<!--
 - MineAdmin is committed to providing solutions for quickly building web applications
 - Please view the LICENSE file that was distributed with this source code,
 - For the full copyright and license information.
 - Thank you very much for using MineAdmin.
 -
 - @Author X.Mo<root@imoi.cn>
 - @Link   https://github.com/mineadmin
-->
<i18n lang="yaml">
zh_CN:
  pluginNotExists: '要安装的插件：%{name} 不存在'
  installed: '已安装'
  notInstalled: '未安装'
  action: 操作
  uninstall: 卸载
  frontendDeps: 前端依赖
  backendDeps: 后端依赖
zh_TW:
  pluginNotExists: '要安裝的外掛程式：%{name} 不存在'
  installed: '已安裝'
  notInstalled: '未安裝'
  action: 操作
  uninstall: 卸載
  frontendDeps: 前端依賴
  backendDeps: 後端依賴
en:
  pluginNotExists: 'Plugin to install：%{name} Does not exist'
  installed: 'Installed'
  notInstalled: 'Not Installed'
  action: Action
  uninstall: Uninstall
  frontendDeps: Frontend Deps
  backendDeps: Backend Deps
</i18n>

<script setup lang="tsx">
import type { MaTableExpose } from '@mineadmin/table'
import type { TerminalAction } from '../api/terminal.ts'
import hasAuth from '@/utils/permission/hasAuth.ts'

const tableRef = ref<MaTableExpose>()
const dataList = inject('dataList') as Record<string, any>
const openTerminal = inject('openTerminal') as (payload: { action: TerminalAction, identifier?: string, version?: string, title?: string }) => Promise<void>
const { localTrans: t } = useTrans()

function rows() {
  return Object.keys(dataList.value.local).map((name) => {
    return {
      name,
      status: dataList.value.local[name].status,
      version: dataList.value.local[name].version,
      description: dataList.value.local[name].description,
      author: dataList.value.local[name].author,
    }
  })
}

function refreshTable() {
  tableRef.value?.setData(rows())
}

function runTerminal(action: TerminalAction, row: any) {
  return openTerminal({
    action,
    identifier: row.name,
    version: row.version,
    title: `${t(action === 'uninstall' ? 'uninstall' : action === 'frontend_deps' ? 'frontendDeps' : 'backendDeps')} ${row.name}`,
  })
}

watch(() => dataList.value.local, refreshTable, { deep: true })

nextTick(() => {
  const data = Object.keys(dataList.value.local).map((name) => {
    return {
      name,
      status: dataList.value.local[name].status,
      version: dataList.value.local[name].version,
      description: dataList.value.local[name].description,
      author: dataList.value.local[name].author,
    }
  })
  tableRef.value?.setData(data)
  tableRef.value?.setColumns([
    { label: '名称', prop: 'name' },
    { label: '版本', prop: 'version' },
    { label: '描述', prop: 'description' },
    { label: '作者', prop: 'author', cellRender: ({ row }) => row.author.map((item: any) => item.name).join(',') },
    { label: '状态', prop: 'status', cellRender: ({ row }) => (
      <el-tag type={row.status === true ? 'success' : 'error'}>
        {row.status === true ? t('installed') : t('notInstalled') }
      </el-tag>
    ),
    },
    {
      label: t('action'),
      prop: 'action',
      width: 240,
      cellRender: ({ row }) => (
        <el-space>
          {hasAuth('plugin:store:terminal:uninstall') && row.name !== 'mine-admin/app-store'
            ? (
                <el-button link type="danger" onClick={() => runTerminal('uninstall', row)}>
                  {t('uninstall')}
                </el-button>
              )
            : null}
          {hasAuth('plugin:store:terminal:frontend-deps')
            ? (
                <el-button link type="primary" onClick={() => runTerminal('frontend_deps', row)}>
                  {t('frontendDeps')}
                </el-button>
              )
            : null}
          {hasAuth('plugin:store:terminal:backend-deps')
            ? (
                <el-button link type="success" onClick={() => runTerminal('backend_deps', row)}>
                  {t('backendDeps')}
                </el-button>
              )
            : null}
        </el-space>
      ),
    },
  ])
})
</script>

<template>
  <div class="mine-card">
    <ma-table ref="tableRef" />
  </div>
</template>
