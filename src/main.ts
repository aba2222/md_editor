import { createApp } from 'vue'
import MarkdownEditor from './components/MarkdownEditor.vue'

document.querySelectorAll('.md_editor').forEach((el) => {
  createApp(MarkdownEditor).mount(el)
})
