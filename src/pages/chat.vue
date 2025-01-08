<template>
  <chat-box v-model="messages" :current-user="currentUser" class="fill-height"></chat-box>
</template>

<script lang="ts" setup>
import type { IChatMessage } from '~/types/chat.d'
import dayjs from 'dayjs'

const currentUser = ref<string>('1')
const messages = ref<Array<IChatMessage>>([
  {
    id: 'aaa',
    message: {
      text: 'สวัสดี'
    },
    timestamp: dayjs('2025-01-08 11:00:00'),
    from: {
      id: '1',
      display_name: 'User',
      profile: 'https://ultrarumble.com/assets/Character/Ch012/GUI/FaceIcon/T_ui_Ch012_CharaImage.png'
    },
    to: {
      id: '2',
      display_name: 'MonoMax',
      profile: 'https://f.ptcdn.info/305/066/000/pyz1ev3leI33MfwBQTo-o.png'
    }
  },
  {
    id: 'bbb',
    message: {
      text: 'สวัสดีคะ'
    },
    timestamp: dayjs('2025-01-08 11:01:00'),
    from: {
      id: '2',
      display_name: 'MonoMax',
      profile: 'https://f.ptcdn.info/305/066/000/pyz1ev3leI33MfwBQTo-o.png'
    },
    to: {
      id: '1',
      display_name: 'User',
      profile: 'https://ultrarumble.com/assets/Character/Ch012/GUI/FaceIcon/T_ui_Ch012_CharaImage.png'
    },
  }
])
</script>

<style>

</style>