<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { supabase } from './supabase'

const props = defineProps<{ pagePath: string }>()

const voterName = ref('')
const email = ref('')
const selectedScore = ref<number | null>(null)
const votes = ref<{ voter_name: string; tav_score: number }[]>([])
const submitting = ref(false)
const submitted = ref(false)
let channel: any = null

const avgScore = computed(() => {
  if (votes.value.length === 0) return '—'
  const sum = votes.value.reduce((a, v) => a + v.tav_score, 0)
  return (sum / votes.value.length).toFixed(1)
})

const distribution = computed(() => {
  const dist: Record<number, number> = {}
  for (let i = 1; i <= 10; i++) dist[i] = 0
  votes.value.forEach((v) => dist[v.tav_score]++)
  return dist
})

const maxCount = computed(() => Math.max(1, ...Object.values(distribution.value)))

async function fetchVotes() {
  const { data } = await supabase
    .from('playbook_tav_votes')
    .select('voter_name, tav_score')
    .eq('page_path', props.pagePath)
  if (data) votes.value = data
}

function subscribe() {
  channel = supabase
    .channel('tav-' + props.pagePath)
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'playbook_tav_votes',
      filter: 'page_path=eq.' + props.pagePath,
    }, () => fetchVotes())
    .subscribe()
}

onMounted(() => {
  voterName.value = localStorage.getItem('playbook_name') || ''
  email.value = localStorage.getItem('playbook_email') || ''
  fetchVotes()
  subscribe()
})

onUnmounted(() => {
  if (channel) supabase.removeChannel(channel)
})

async function submitVote() {
  if (!voterName.value.trim() || !selectedScore.value) return
  submitting.value = true
  localStorage.setItem('playbook_name', voterName.value.trim())
  if (email.value.trim()) localStorage.setItem('playbook_email', email.value.trim())

  const { error } = await supabase.from('playbook_tav_votes').upsert({
    page_path: props.pagePath,
    voter_name: voterName.value.trim(),
    email: email.value.trim(),
    tav_score: selectedScore.value,
  }, { onConflict: 'page_path,voter_name' })

  submitting.value = false
  if (!error) {
    submitted.value = true
    fetchVotes()
  }
}
</script>

<template>
  <div class="tav-voting">
    <h3>TAV 投票</h3>
    <p class="tav-note">このセッションを評価してください（1〜10）</p>

    <div class="tav-result" v-if="votes.length > 0">
      <div class="tav-avg">
        <span class="avg-number">{{ avgScore }}</span>
        <span class="avg-label">平均スコア（{{ votes.length }}票）</span>
      </div>
      <div class="tav-bars">
        <div v-for="score in 10" :key="score" class="tav-bar-row">
          <span class="bar-label">{{ score }}</span>
          <div class="bar-track">
            <div
              class="bar-fill"
              :style="{ width: (distribution[score] / maxCount * 100) + '%' }"
            />
          </div>
          <span class="bar-count">{{ distribution[score] }}</span>
        </div>
      </div>
    </div>

    <form @submit.prevent="submitVote" class="tav-form">
      <div class="score-selector">
        <button
          v-for="s in 10"
          :key="s"
          type="button"
          class="score-btn"
          :class="{ selected: selectedScore === s }"
          @click="selectedScore = s"
        >
          {{ s }}
        </button>
      </div>
      <div class="form-row">
        <input v-model="voterName" type="text" placeholder="お名前（必須）" maxlength="50" required />
        <input v-model="email" type="email" placeholder="メールアドレス（任意）" />
      </div>
      <button type="submit" class="submit-btn" :disabled="submitting || !selectedScore">
        {{ submitted ? '投票済み（変更可）' : submitting ? '送信中...' : '投票する' }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.tav-voting {
  margin-top: 2rem;
  padding: 20px;
  background: #E3F2FD;
  border-radius: 4px;
  box-shadow: 1px 2px 5px rgba(0, 0, 0, 0.1);
}
.tav-voting h3 { margin: 0 0 4px; font-size: 1.1rem; }
.tav-note { margin: 0 0 16px; font-size: 0.8rem; color: #555; }

.tav-result { margin-bottom: 20px; }
.tav-avg {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 12px;
}
.avg-number { font-size: 2.5rem; font-weight: 700; color: #1565C0; }
.avg-label { font-size: 0.85rem; color: #666; }

.tav-bars { display: flex; flex-direction: column; gap: 3px; }
.tav-bar-row { display: flex; align-items: center; gap: 6px; }
.bar-label { width: 20px; text-align: right; font-size: 0.8rem; color: #666; }
.bar-track { flex: 1; height: 16px; background: #BBDEFB; border-radius: 2px; overflow: hidden; }
.bar-fill { height: 100%; background: #1565C0; border-radius: 2px; transition: width 0.3s; }
.bar-count { width: 20px; font-size: 0.8rem; color: #666; }

.score-selector { display: flex; gap: 6px; margin-bottom: 12px; flex-wrap: wrap; }
.score-btn {
  width: 40px; height: 40px;
  border: 2px solid #90CAF9;
  border-radius: 50%;
  background: #fff;
  font-size: 1rem; font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}
.score-btn:hover { background: #E3F2FD; }
.score-btn.selected {
  background: #1565C0; color: #fff; border-color: #1565C0;
}

.form-row { display: flex; gap: 8px; margin-bottom: 8px; }
.form-row input {
  flex: 1; padding: 8px 10px;
  border: 1px solid #ddd; border-radius: 4px; font-size: 0.9rem;
}
.submit-btn {
  padding: 8px 24px;
  background: #1565C0; color: #fff;
  border: none; border-radius: 4px;
  font-size: 0.9rem; cursor: pointer;
}
.submit-btn:hover { background: #0D47A1; }
.submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
</style>
