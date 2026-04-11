<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useRoute, useData } from 'vitepress'
import { supabase } from './supabase'
import StickyNote from './StickyNote.vue'
import StickyNoteForm from './StickyNoteForm.vue'
import TavVoting from './TavVoting.vue'

const route = useRoute()
const { frontmatter } = useData()
const pagePath = computed(() => route.path)
const showTav = computed(() => frontmatter.value?.tav === true)

const comments = ref<any[]>([])
let channel: any = null

async function fetchComments() {
  const { data } = await supabase
    .from('playbook_comments')
    .select('*')
    .eq('page_path', pagePath.value)
    .order('created_at', { ascending: true })
  if (data) comments.value = data
}

function subscribe() {
  if (channel) supabase.removeChannel(channel)
  channel = supabase
    .channel('comments-' + pagePath.value)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'playbook_comments',
      filter: 'page_path=eq.' + pagePath.value,
    }, (payload: any) => {
      comments.value.push(payload.new)
    })
    .subscribe()
}

onMounted(() => {
  fetchComments()
  subscribe()
})

watch(pagePath, () => {
  comments.value = []
  fetchComments()
  subscribe()
})

onUnmounted(() => {
  if (channel) supabase.removeChannel(channel)
})
</script>

<template>
  <div class="sticky-board">
    <hr class="board-divider" />

    <TavVoting v-if="showTav" :page-path="pagePath" />

    <StickyNoteForm :page-path="pagePath" @posted="fetchComments" />

    <div v-if="comments.length > 0" class="notes-section">
      <h3>みんなの付箋（{{ comments.length }}件）</h3>
      <div class="notes-grid">
        <StickyNote
          v-for="c in comments"
          :key="c.id"
          :author-name="c.author_name"
          :message="c.message"
          :color="c.color"
          :created-at="c.created_at"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.sticky-board { margin-top: 3rem; }
.board-divider {
  border: none;
  border-top: 1px solid #e2e2e3;
  margin-bottom: 1.5rem;
}
.notes-section { margin-top: 1.5rem; }
.notes-section h3 {
  font-size: 1.1rem;
  margin-bottom: 12px;
}
.notes-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
</style>
