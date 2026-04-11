import DefaultTheme from 'vitepress/theme'
import './custom.css'
import StickyBoard from './StickyBoard.vue'
import { h } from 'vue'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'doc-after': () => h(StickyBoard),
    })
  },
}
