<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import markdownit from 'markdown-it'

import 'highlight.js/styles/github.css'
import hljs from 'highlight.js/lib/common'

const props = defineProps<{ name?: string; value?: string }>()
const name = props.name || 'content'
const value = props.value || ''
const theme = ref(
  String(document.documentElement.getAttribute('data-bs-theme') || 'light').toLowerCase(),
)
const isDark = computed(() => theme.value === 'dark' || theme.value === 'black')
let observer: MutationObserver | null = null

onMounted(() => {
  observer = new MutationObserver(() => {
    theme.value = (document.documentElement.getAttribute('data-bs-theme') || 'light').toLowerCase()
  })

  observer.observe(document.documentElement, {
    attributeFilter: ['data-bs-theme'],
  })
})

onUnmounted(() => {
  observer?.disconnect()
})

const md = markdownit({
  linkify: true,
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
const markdown = ref(value)
const html = ref('')

watch(
  markdown,
  (value) => {
    html.value = md.render(value)
  },
  {
    immediate: true,
  },
)

function insertMarkdown(before: string, after: string = '') {
  const el = textarea.value
  if (!el) return

  let start = el.selectionStart
  let end = el.selectionEnd
  let selected = markdown.value.substring(start, end)

  markdown.value =
    markdown.value.substring(0, start) + before + selected + after + markdown.value.substring(end)

  nextTick(() => {
    el.focus()
    el.selectionStart = start + before.length
    el.selectionEnd = end + before.length
  })
}
</script>

<template>
  <div class="editor" :class="{ dark: isDark }">
    <div class="toolbar">
      <button type="button" @click="insertMarkdown('**', '**')">
        <i class="bi bi-type-bold"></i>
      </button>
      <button type="button" @click="insertMarkdown('*', '*')">
        <i class="bi bi-type-italic"></i>
      </button>
      <button type="button" @click="insertMarkdown('~~', '~~')">
        <i class="bi bi-type-strikethrough"></i>
      </button>
      <button type="button" @click="insertMarkdown('> ')"><i class="bi bi-quote"></i></button>
      <button type="button" @click="insertMarkdown('`', '`')">
        <i class="bi bi-code-slash"></i>
      </button>
      <button type="button" @click="insertMarkdown('[', '名称](链接)')">
        <i class="bi bi-link-45deg"></i>
      </button>
      <button type="button" @click="insertMarkdown('# ')"><i class="bi bi-type-h1"></i></button>
    </div>
    <div class="main_editor">
      <textarea
        ref="textarea"
        v-model="markdown"
        class="input"
        placeholder="Write markdown..."
        :name="name"
      ></textarea>
      <div class="preview" v-html="html"></div>
    </div>
  </div>
</template>

<style scoped>
.editor {
  display: flex;
  flex-direction: column;
  border: 1px solid #3f3f46;
  border-radius: 10px;
  overflow: hidden;
  background: #ffffff;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  transition:
    box-shadow 0.18s ease,
    border-color 0.18s ease;
}

.editor:focus-within {
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.08);
  border-color: #2b2b2b;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  padding: 10px 12px;
  background: linear-gradient(180deg, #fbfbfb, #fafafa);
  border-bottom: 1px solid #9ca3af;
}

.toolbar button {
  width: 44px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #222;
  font-weight: 600;
  border-radius: 10px;
  border: none;
  background: transparent;
  cursor: pointer;
  transition:
    background 0.12s ease,
    transform 0.08s ease;
}

.toolbar button i {
  font-size: 18px;
}

.toolbar button:hover {
  background: rgba(34, 34, 34, 0.04);
  transform: translateY(-1px);
}

.toolbar button:active {
  transform: translateY(0);
}

.main_editor {
  display: flex;
  gap: 0;
  align-items: stretch;
}

.input,
.preview {
  width: 50%;
  min-height: 480px;
  padding: 18px;
  box-sizing: border-box;
}

.input {
  border: none;
  border-right: 1px solid #9ca3af;
  outline: none;
  resize: none;
  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial;
  font-size: 15px;
  line-height: 1.6;
  color: #111827;
  background: #ffffff;
}

.input::placeholder {
  color: #9ca3af;
}

.preview {
  background: #ffffff;
  color: #0f172a;
}

.editor.dark {
  background: #0f1119;
  border-color: #272c33;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.35);
}

.editor.dark .toolbar {
  background: #11151f;
  border-bottom-color: rgba(255, 255, 255, 0.08);
}

.editor.dark .toolbar button {
  color: #f8fafc;
}

.editor.dark .toolbar button:hover {
  background: rgba(255, 255, 255, 0.08);
}

.editor.dark .input,
.editor.dark .preview {
  background: #0b1220;
  color: #e2e8f0;
}

.editor.dark .input {
  border-right-color: rgba(255, 255, 255, 0.08);
}

.editor.dark .input::placeholder {
  color: #94a3b8;
}

.editor.dark .preview pre {
  background: #111822;
}

.editor.dark .preview code {
  background: rgba(255, 255, 255, 0.08);
}

/* custom scrollbar */
.input::-webkit-scrollbar,
.preview::-webkit-scrollbar {
  height: 10px;
  width: 10px;
}
.input::-webkit-scrollbar-thumb,
.preview::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.12);
  border-radius: 8px;
}

@media (max-width: 800px) {
  .main_editor {
    flex-direction: column;
  }
  .input,
  .preview {
    width: 100%;
    min-height: 320px;
  }
  .input {
    border-right: none;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  }
}
</style>
