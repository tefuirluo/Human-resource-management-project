import pageTools from '@/components/PageTools'
import UploadImg from '@/components/UploadImg'
import ImageHolder from '@/components/ImageHolder'
import Lang from './Lang'
import ScreenFull from '@/components/ScreenFull'

export default { // 导出插件对象
  install(Vue) {
    Vue.component('pageTools', pageTools)
    Vue.component('UploadImg', UploadImg)
    Vue.component('ImageHolder', ImageHolder)
    Vue.component('Lang', Lang)
    Vue.component('ScreenFull', ScreenFull)
  }
}
