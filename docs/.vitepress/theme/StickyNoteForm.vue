<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from './supabase'

const props = defineProps<{ pagePath: string }>()
const emit = defineEmits<{ posted: [] }>()

const name = ref('')
const email = ref('')
const message = ref('')
const posting = ref(false)
const success = ref(false)

const colors = ['#FFF9C4', '#C8E6C9', '#BBDEFB', '#F8BBD0', '#FFE0B2', '#E1BEE7']

onMounted(() => {
  name.value = localStorage.getItem('playbook_name') || ''
  email.value = localStorage.getItem('playbook_email') || ''
})

async function submit() {
  if (!name.value.trim() || !message.value.trim()) return
  posting.value = true
  localStorage.setItem('playbook_name', name.value.trim())
  if (email.value.trim()) localStorage.setItem('playbook_email', email.value.trim())

  const color = colors[Math.floor(Math.random() * colors.length)]
  const { error } = await supabase.from('playbook_comments').insert({
    page_path: props.pagePath,
    author_name: name.value.trim(),
    email: email.value.trim(),
    message: message.value.trim(),
    color,
  })
  posting.value = false
  if (!error) {
    message.value = ''
    success.value = true
    setTimeout(() => (success.value = false), 2000)
    emit('posted')
  }
}
</script>

<template>
  <div class="sticky-form">
    <h3>付箋を貼る</h3>
    <p class="form-note">コメントや感想を付箋として残せます。ログイン不要です。</p>
    <form @submit.prevent="submit">
      <div class="form-row">
        <input v-model="name" type="text" placeholder="お名前（必須）" maxlength="50" required />
        <input v-model="email" type="email" placeholder="メールアドレス（任意）" />
      </div>
      <textarea
        v-model="message"
        placeholder="コメントを書いてください..."
        maxlength="500"
        rows="3"
        required
      />
      <div class="form-actions">
        <span class="char-count">{{ message.length }}/500</span>
        <button type="submit" :disabled="posting">
          {{ posting ? '送信中...' : '貼る' }}
        </button>
      </div>
      <p v-if="success" class="success-msg">付箋を貼りました！</p>
    </form>
  </div>
</template>

<style scoped>
.sticky-form {
  margin-top: 2rem;
  padding: 20px;
  background: #FFFDE7;
  border-radius: 4px;
  box-shadow: 1px 2px 5px rgba(0, 0, 0, 0.1);
}
.sticky-form h3 {
  margin: 0 0 4px;
  font-size: 1.1rem;
}
.form-note {
  margin: 0 0 12px;
  font-size: 0.8rem;
  color: #666;
}
.form-row {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}
.form-row input {
  flex: 1;
  padding: 8px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
}
textarea {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  resize: vertical;
  box-sizing: border-box;
}
.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}
.char-count {
  font-size: 0.75rem;
  color: #999;
}
button {
  padding: 8px 24px;
  background: #3451b2;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
}
button:hover { background: #2c3e94; }
button:disabled { opacity: 0.5; cursor: not-allowed; }
.success-msg {
  margin: 8px 0 0;
  color: #2e7d32;
  font-size: 0.85rem;
}
</style>
