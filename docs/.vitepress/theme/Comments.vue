<template>
  <div class="comments-section">
    <hr />
    <h3>コメント・フィードバック</h3>
    <p class="comments-note">
      このページについてのコメントや質問を残せます（GitHubアカウントが必要です）。<br />
      GitHubアカウントをお持ちでない方は<a href="/guide/feedback">こちらからフィードバック</a>をお寄せください。
    </p>
    <Giscus
      repo="fumitakafuruya-ai/playbook"
      repo-id="R_kgDOR8E0WQ"
      category="General"
      category-id="DIC_kwDOR8E0Wc4C6bMW"
      mapping="pathname"
      reactions-enabled="1"
      emit-metadata="0"
      input-position="top"
      theme="preferred_color_scheme"
      lang="ja"
      loading="lazy"
    />
  </div>
</template>

<script setup>
import Giscus from '@giscus/vue'
</script>

<style scoped>
.comments-section {
  margin-top: 3rem;
  padding-top: 1rem;
}
.comments-section h3 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}
.comments-note {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 1rem;
}
</style>
