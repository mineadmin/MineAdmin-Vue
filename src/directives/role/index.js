import role from './role'

const checkRole = (el, binding) => {
  const { value } = binding

  if (Array.isArray(value)) {
    if (value.length > 0) {
      let isHas = false
      value.map(item => {
        if(!isHas) {
          isHas = role(item)
        }
      })

      if (!isHas && el.parentNode) {
        el.parentNode.remove()
      }
    }
  } else {
    throw new Error(`need role! Like v-role="['seo', 'cfo']"`)
  }
}

export default {
  mounted(el, binding) {
    checkRole(el, binding)
  },
  updated(el, binding) {
    checkRole(el, binding)
  },
};
