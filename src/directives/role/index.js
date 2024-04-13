import role from './role'

const checkRole = (el, binding) => {
  const { value } = binding

  if (Array.isArray(value)) {
    if (value.length > 0) {
      let isHas = false
      for(let i = 0; i < value.length; i++) {
        isHas = role(value[i]);
        if(isHas) {
          break;
        }
      }

      if (!isHas && el.parentNode) {
        el.parentNode.removeChild(el)
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
