import Layout from '@/layout'

export default {
  path: '/social', // 社保
  component: Layout,
  children: [
    {
      path: '',
      name: 'Social_Securitys',
      component: () => import('@/views/social'),
      meta: { title: '社保', icon: 'table' }
    }
  ]
}
