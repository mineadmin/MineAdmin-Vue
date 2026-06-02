/**
 * MineAdmin is committed to providing solutions for quickly building web applications
 * Please view the LICENSE file that was distributed with this source code,
 * For the full copyright and license information.
 * Thank you very much for using MineAdmin.
 *
 * @Author X.Mo<root@imoi.cn>
 * @Link   https://github.com/mineadmin
 */

import type { MaSearchItem } from '@mineadmin/search'
import MaDictSelect from '@/components/ma-dict-picker/ma-dict-select.vue'

export default function getSearchItems(t: any): MaSearchItem[] {
  return [
    {
      label: () => t('baseUserManage.username'),
      prop: 'username',
      render: 'input',
    },
    {
      label: () => t('baseUserManage.nickname'),
      prop: 'nickname',
      render: 'input',
    },
    {
      label: () => t('baseUserManage.phone'),
      prop: 'phone',
      render: 'input',
    },
    {
      label: () => t('baseUserManage.email'),
      prop: 'email',
      render: 'input',
    },
    {
      label: () => t('crud.status'),
      prop: 'status',
      render: () => MaDictSelect,
      renderProps: {
        clearable: true,
        placeholder: '',
        dictName: 'system-status',
      },
    },
  ]
}
