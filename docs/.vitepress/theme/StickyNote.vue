<script setup lang="ts">
const props = defineProps<{
  authorName: string
  message: string
  color: string
  createdAt: string
}>()

const rotation = Math.random() * 4 - 2

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const min = Math.floor(diff / 60000)
  if (min < 1) return 'たった今'
  if (min < 60) return `${min}分前`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}時間前`
  const day = Math.floor(hr / 24)
  return `${day}日前`
}
</script>

<template>
  <div
    class="sticky-note"
    :style="{ backgroundColor: color, transform: `rotate(${rotation}deg)` }"
  >
    <p class="sticky-message">{{ message }}</p>
    <div class="sticky-footer">
      <span class="sticky-author">— {{ authorName }}</span>
      <span class="sticky-time">{{ timeAgo(createdAt) }}</span>
    </div>
  </div>
</template>

<style scoped>
.sticky-note {
  width: 220px;
  min-height: 130px;
  padding: 16px 16px 12px;
  box-shadow: 2px 3px 7px rgba(0, 0, 0, 0.15);
  border-radius: 2px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.2s;
  cursor: default;
}
.sticky-note:hover {
  transform: scale(1.04) rotate(0deg) !important;
  z-index: 1;
}
.sticky-message {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.5;
  word-break: break-word;
  white-space: pre-wrap;
}
.sticky-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  font-size: 0.75rem;
  opacity: 0.7;
}
.sticky-author {
  font-weight: 600;
}
</style>
