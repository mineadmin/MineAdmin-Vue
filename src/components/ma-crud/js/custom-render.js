import { defineComponent } from 'vue'
export default defineComponent({
  name: 'CustomRender',
  props: {
    record: Object,
    render: Function,
    rowIndex: Number,
    column: {
      type: Object,
      default: null,
    },
  },
  render() {
    return this.render({ record: this.record, column: this.column, rowIndex: this.rowIndex })
  },
})
