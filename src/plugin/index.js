export default {
  install: (Vue) => {
    const pluginList = import.meta.glob('./*/main.js')
    Object.keys(pluginList).forEach((path) => {
      pluginList[path]().then(plugin => Vue.use(plugin.default || plugin))
    })
  }
}