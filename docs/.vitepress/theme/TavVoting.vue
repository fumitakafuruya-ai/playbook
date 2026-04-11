<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { supabase } from './supabase'

const props = defineProps<{ pagePath: string }>()

const authorName = ref('')
const email = ref('')
const message = ref('')
const entries = ref<any[]>([])
const submitting = ref(false)
const success = ref(false)
let channel: any = null

async function fetchEntries() {
  const { data } = await supabase
    .from('playbook_tav_votes')
    .select('*')
    .eq('page_path', props.pagePath)
    .order('created_at', { ascending: true })
  if (data) entries.value = data
}

function subscribe() {
  channel = supabase
    .channel('tav-' + props.pagePath)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'playbook_tav_votes',
      filter: 'page_path=eq.' + props.pagePath,
    }, (payload: any) => {
      entries.value.push(payload.new)
    })
    .subscribe()
}

onMounted(() => {
  authorName.value = localStorage.getItem('playbook_name') || ''
  email.value = localStorage.getItem('playbook_email') || ''
  fetchEntries()
  subscribe()
})

onUnmounted(() => {
  if (channel) supabase.removeChannel(channel)
})

function isOwner(name: string): boolean {
  return (localStorage.getItem('playbook_name') || '') === name
}

async function deleteEntry(id: string) {
  if (!confirm('この気づきを削除しますか？')) return
  await supabase.from('playbook_tav_votes').delete().eq('id', id)
  entries.value = entries.value.filter(e => e.id !== id)
}

async function submit() {
  if (!authorName.value.trim() || !message.value.trim()) return
  submitting.value = true
  localStorage.setItem('playbook_name', authorName.value.trim())
  if (email.value.trim()) localStorage.setItem('playbook_email', email.value.trim())

  const { error } = await supabase.from('playbook_tav_votes').insert({
    page_path: props.pagePath,
    voter_name: authorName.value.trim(),
    email: email.value.trim(),
    tav_score: 0,
    tav_message: message.value.trim(),
  })

  submitting.value = false
  if (!error) {
    message.value = ''
    success.value = true
    setTimeout(() => (success.value = false), 2000)
  }
}
</script>

<template>
  <div class="tav-section">
    <h3>TAV — 気づき・学びの共有</h3>
    <p class="tav-note">このページを読んで得た気づきや学びを共有してください。</p>

    <div v-if="entries.length > 0" class="tav-entries">
      <div v-for="e in entries" :key="e.id" class="tav-entry">
        <button v-if="isOwner(e.voter_name)" class="tav-delete-btn" @click="deleteEntry(e.id)">x</button>
        <p class="tav-message">{{ e.tav_message || '' }}</p>
        <span class="tav-author">— {{ e.voter_name }}</span>
      </div>
      <p class="tav-count">{{ entries.length }}件の気づき</p>
    </div>

    <form @submit.prevent="submit" class="tav-form">
      <textarea
        v-model="message"
        placeholder="この章で気づいたこと、学んだことを書いてください..."
        maxlength="500"
        rows="3"
        required
      />
      <div class="form-row">
        <input v-model="authorName" type="text" placeholder="お名前（必須）" maxlength="50" required />
        <input v-model="email" type="email" placeholder="メールアドレス（任意）" />
      </div>
      <div class="form-actions">
        <span class="char-count">{{ message.length }}/500</span>
        <button type="submit" :disabled="submitting">
          {{ submitting ? '送信中...' : '共有する' }}
        </button>
      </div>
      <p v-if="success" class="success-msg">共有しました！</p>
    </form>
  </div>
</template>

<style scoped>
.tav-section {
  margin-top: 2rem;
  padding: 20px;
  background: #E8F5E9;
  border-radius: 4px;
  box-shadow: 1px 2px 5px rgba(0, 0, 0, 0.1);
}
.tav-section h3 { margin: 0 0 4px; font-size: 1.1rem; }
.tav-note { margin: 0 0 16px; font-size: 0.8rem; color: #555; }

.tav-entries { margin-bottom: 16px; }
.tav-entry {
  position: relative;
  padding: 12px 16px;
  background: #fff;
  border-left: 3px solid #4CAF50;
  border-radius: 2px;
  margin-bottom: 8px;
}
.tav-delete-btn {
  position: absolute;
  top: 4px;
  right: 6px;
  background: none;
  border: none;
  font-size: 0.85rem;
  color: #999;
  cursor: pointer;
  padding: 2px 5px;
  opacity: 0;
  transition: opacity 0.2s;
}
.tav-entry:hover .tav-delete-btn { opacity: 1; }
.tav-delete-btn:hover { color: #d32f2f; }
.tav-message {
  margin: 0 0 4px;
  font-size: 0.9rem;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
}
.tav-author { font-size: 0.75rem; color: #666; }
.tav-count { font-size: 0.8rem; color: #666; margin: 8px 0 0; }

textarea {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  resize: vertical;
  box-sizing: border-box;
}
.form-row {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}
.form-row input {
  flex: 1; padding: 8px 10px;
  border: 1px solid #ddd; border-radius: 4px; font-size: 0.9rem;
}
.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}
.char-count { font-size: 0.75rem; color: #999; }
button {
  padding: 8px 24px;
  background: #4CAF50; color: #fff;
  border: none; border-radius: 4px;
  font-size: 0.9rem; cursor: pointer;
}
button:hover { background: #388E3C; }
button:disabled { opacity: 0.5; cursor: not-allowed; }
.success-msg { margin: 8px 0 0; color: #2e7d32; font-size: 0.85rem; }
</style>
