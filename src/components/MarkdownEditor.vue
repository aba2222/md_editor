<script setup lang="ts">
import { ref, watch } from 'vue'
import markdownit from 'markdown-it'

import 'highlight.js/styles/github.css'
import hljs from 'highlight.js/lib/common'

// TODO: code highlights
const md = markdownit({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value
      } catch (__) {}
    }

    return '' // use external default escaping
  },
})

const textarea = ref<HTMLTextAreaElement | null>(null)
const markdown = ref('')
const html = ref('')

watch(
  markdown,
  (value) => {
    const content = document.getElementById('content') as HTMLTextAreaElement | null

    if (content) {
      content.value = value
    }

    html.value = md.render(value)
  },
  {
    immediate: true,
  },
)

function insertMarkdown(before: string, after: string = '') {
  const el = textarea.value

  if (el) {
    let start = el.selectionStart
    let end = el.selectionEnd
    let selected = markdown.value.substring(start, end)

    markdown.value =
      markdown.value.substring(0, start) + before + selected + after + markdown.value.substring(end)
  }
}
</script>

<template>
  <div class="editor">
    <div class="toolbar">
      <button @click="insertMarkdown('**', '**')">B</button>
      <button @click="insertMarkdown('*', '*')">I</button>
      <button @click="insertMarkdown('~~', '~~')">-</button>
      <button @click="insertMarkdown('> ')">“</button>
      <button @click="insertMarkdown('`', '`')"><></button>
      <button @click="insertMarkdown('[', '名称](链接)')">🔗</button>
      <button @click="insertMarkdown('# ')">H1</button>
    </div>
    <div class="main_editor">
      <textarea
        ref="textarea"
        v-model="markdown"
        class="input"
        placeholder="Write markdown..."
      ></textarea>
      <div class="preview" v-html="html"></div>
    </div>
  </div>
</template>

<style scoped>
.editor {
  display: flex;
  flex-direction: column;
}

.toolbar {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.toolbar button {
  width: 36px;
  height: 36px;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 16px;

  border-radius: 6px;
  border: 1px solid #ccc;

  cursor: pointer;
}

.main_editor {
  display: flex;
  gap: 20px;
}

.input {
  width: 50%;
  height: 500px;
  resize: horizontal;
}

.preview {
  width: 50%;
  padding: 20px;
  border: 1px solid #ccc;
}
</style>
