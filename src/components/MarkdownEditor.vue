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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          class="bi bi-type-bold"
          viewBox="0 0 16 16"
        >
          <path
            d="M8.21 13c2.106 0 3.412-1.087 3.412-2.823 0-1.306-.984-2.283-2.324-2.386v-.055a2.176 2.176 0 0 0 1.852-2.14c0-1.51-1.162-2.46-3.014-2.46H3.843V13zM5.908 4.674h1.696c.963 0 1.517.451 1.517 1.244 0 .834-.629 1.32-1.73 1.32H5.908V4.673zm0 6.788V8.598h1.73c1.217 0 1.88.492 1.88 1.415 0 .943-.643 1.449-1.832 1.449H5.907z"
          />
        </svg>
      </button>
      <button type="button" @click="insertMarkdown('*', '*')">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          class="bi bi-type-italic"
          viewBox="0 0 16 16"
        >
          <path
            d="M7.991 11.674 9.53 4.455c.123-.595.246-.71 1.347-.807l.11-.52H7.211l-.11.52c1.06.096 1.128.212 1.005.807L6.57 11.674c-.123.595-.246.71-1.346.806l-.11.52h3.774l.11-.52c-1.06-.095-1.129-.211-1.006-.806z"
          />
        </svg>
      </button>
      <button type="button" @click="insertMarkdown('~~', '~~')">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          class="bi bi-type-strikethrough"
          viewBox="0 0 16 16"
        >
          <path
            d="M6.333 5.686c0 .31.083.581.27.814H5.166a2.8 2.8 0 0 1-.099-.76c0-1.627 1.436-2.768 3.48-2.768 1.969 0 3.39 1.175 3.445 2.85h-1.23c-.11-1.08-.964-1.743-2.25-1.743-1.23 0-2.18.602-2.18 1.607zm2.194 7.478c-2.153 0-3.589-1.107-3.705-2.81h1.23c.144 1.06 1.129 1.703 2.544 1.703 1.34 0 2.31-.705 2.31-1.675 0-.827-.547-1.374-1.914-1.675L8.046 8.5H1v-1h14v1h-3.504c.468.437.675.994.675 1.697 0 1.826-1.436 2.967-3.644 2.967"
          />
        </svg>
      </button>
      <button type="button" @click="insertMarkdown('> ')">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          class="bi bi-quote"
          viewBox="0 0 16 16"
        >
          <path
            d="M12 12a1 1 0 0 0 1-1V8.558a1 1 0 0 0-1-1h-1.388q0-.527.062-1.054.093-.558.31-.992t.559-.683q.34-.279.868-.279V3q-.868 0-1.52.372a3.3 3.3 0 0 0-1.085.992 4.9 4.9 0 0 0-.62 1.458A7.7 7.7 0 0 0 9 7.558V11a1 1 0 0 0 1 1zm-6 0a1 1 0 0 0 1-1V8.558a1 1 0 0 0-1-1H4.612q0-.527.062-1.054.094-.558.31-.992.217-.434.559-.683.34-.279.868-.279V3q-.868 0-1.52.372a3.3 3.3 0 0 0-1.085.992 4.9 4.9 0 0 0-.62 1.458A7.7 7.7 0 0 0 3 7.558V11a1 1 0 0 0 1 1z"
          />
        </svg>
      </button>
      <button type="button" @click="insertMarkdown('`', '`')">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          class="bi bi-code-slash"
          viewBox="0 0 16 16"
        >
          <path
            d="M10.478 1.647a.5.5 0 1 0-.956-.294l-4 13a.5.5 0 0 0 .956.294zM4.854 4.146a.5.5 0 0 1 0 .708L1.707 8l3.147 3.146a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0m6.292 0a.5.5 0 0 0 0 .708L14.293 8l-3.147 3.146a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0"
          />
        </svg>
      </button>
      <button type="button" @click="insertMarkdown('[', '名称](链接)')">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          class="bi bi-link-45deg"
          viewBox="0 0 16 16"
        >
          <path
            d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1 1 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4 4 0 0 1-.128-1.287z"
          />
          <path
            d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243z"
          />
        </svg>
      </button>
      <button type="button" @click="insertMarkdown('# ')">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          class="bi bi-type-h1"
          viewBox="0 0 16 16"
        >
          <path
            d="M7.648 13V3H6.3v4.234H1.348V3H0v10h1.348V8.421H6.3V13zM14 13V3h-1.333l-2.381 1.766V6.12L12.6 4.443h.066V13z"
          />
        </svg>
      </button>
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
  width: 35px;
  height: 35px;
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
