import store from '@/store'

export default { // 自定义指令规则对象
  inserted(el, binding) { // 自定义指令固定名字配置项
    const points = store.state.user.userInfo.roles.points // 按钮权限点英文字符串数组 []
    if (!points.includes(binding.value)) {
      el.parentNode.removeChild(el)
    }
  }
}
