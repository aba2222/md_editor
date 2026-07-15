import { createApp } from 'vue'
import MarkdownEditor from './components/MarkdownEditor.vue'

document.querySelectorAll('.md_editor').forEach((el) => {
  const name = el.getAttribute('data-name') || 'content'
  const value = el.getAttribute('data-value') || ''
  const image_upload_to = el.getAttribute('data-image-upload-to') || null

  createApp(MarkdownEditor, { name, value, image_upload_to }).mount(el)
})
