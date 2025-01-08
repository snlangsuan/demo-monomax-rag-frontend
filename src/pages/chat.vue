<template>
  <chat-box v-model="messages" :current-user="currentUser.id" class="fill-height" @send="handleOnSendMessage"></chat-box>
</template>

<script lang="ts" setup>
import type { IChatMessage, IChatAccount } from '~/types/chat.d'
import dayjs from 'dayjs'

const currentUser = ref<IChatAccount>({
  id: '1',
  display_name: 'User',
  profile: 'https://ultrarumble.com/assets/Character/Ch012/GUI/FaceIcon/T_ui_Ch012_CharaImage.png',
})

const targetUser = ref<IChatAccount>({
  id: '2',
  display_name: 'MonoMax',
  profile: 'https://f.ptcdn.info/305/066/000/pyz1ev3leI33MfwBQTo-o.png'
})

const messages = ref<Array<IChatMessage>>([
  {
    id: 'aaa',
    message: {
      text: 'สวัสดี'
    },
    timestamp: dayjs('2025-01-08 11:00:00'),
    from: { ...currentUser.value },
    to: { ...targetUser.value },
  },
  {
    id: 'bbb',
    message: {
      text: 'สวัสดีคะ'
    },
    timestamp: dayjs('2025-01-08 11:01:00'),
    from: { ...targetUser.value },
    to: { ...currentUser.value },
  }
])

function handleOnSendMessage(text: string) {
  const message: IChatMessage = {
    id: String(Date.now()),
    message: {
      text,
    },
    timestamp: dayjs(),
    from: { ...currentUser.value },
    to: { ...targetUser.value },
  }
  messages.value.push(message)
}

useHead({
  title: targetUser.value.display_name,
})
</script>

<style>

</style>