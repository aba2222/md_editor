import { createApp } from 'vue'
import MarkdownEditor from './components/MarkdownEditor.vue'

document.querySelectorAll('.md_editor').forEach((el) => {
  const name = el.getAttribute('data-name') || 'content'
  const value = el.getAttribute('data-value') || ''
  const theme = document.documentElement.getAttribute('data-bs-theme')

  createApp(MarkdownEditor, { name, value, theme }).mount(el)
})
