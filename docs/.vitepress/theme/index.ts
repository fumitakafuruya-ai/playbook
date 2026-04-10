import DefaultTheme from 'vitepress/theme'
import './custom.css'
import Comments from './Comments.vue'
import { h } from 'vue'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'doc-after': () => h(Comments),
    })
  },
}
