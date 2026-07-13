import { createApp } from 'vue'
import MarkdownEditor from './components/MarkdownEditor.vue'
import 'bootstrap-icons/font/bootstrap-icons.css'

document.querySelectorAll('.md_editor').forEach((el) => {
  const name = el.getAttribute('data-name') || 'content'
  const value = el.getAttribute('data-value') || ''

  createApp(MarkdownEditor, { name, value }).mount(el)
})
