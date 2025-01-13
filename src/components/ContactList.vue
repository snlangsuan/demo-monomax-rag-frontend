<template>
  <v-list lines="two" class="pa-0" :height="height" density="compact">
    <template v-for="(user, i) in messages" :key="user.id">
      <v-list-item :max-height="48" @click="handleOnSelect(user)">
        <template #prepend>
          <v-avatar variant="outlined" color="grey-lighten-2" :size="32">
            <v-img :src="user.profile" />
          </v-avatar>
        </template>
        <v-list-item-title>{{ user.name }}</v-list-item-title>
        <v-list-item-subtitle>{{ user.message?.text }}</v-list-item-subtitle>
      </v-list-item>
      <v-divider v-if="i < modelValue.length - 1" />
    </template>
  </v-list>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { IChatRoom } from '~/types/chat.d'

const props = defineProps({
  height: {
    default: 200,
    type: Number,
  },
  modelValue: {
    default: () => [],
    type: Array as PropType<Array<IChatRoom>>,
  },
})

const messages = computed(() => props.modelValue.filter((msg) => !!msg.message))

const emit = defineEmits(['click'])

function handleOnSelect(user: IChatRoom) {
  emit('click', user)
}
</script>
