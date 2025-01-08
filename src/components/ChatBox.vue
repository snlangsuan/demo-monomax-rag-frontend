<template>
  <div class="chat-box">
    <ul class="chat-box-list">
      <li v-for="msg in messages" :key="msg.id" class="chat-box-item">
        <div :class="['chat-box-message', { 'chat-box-message--me': msg.from.id === currentUser }]">
          <div class="chat-box-message-box__profile">
            <v-avatar color="white">
              <v-img :src="msg.from.profile" />
            </v-avatar>
          </div>
          <div class="chat-box-message-box__content">
            <div v-if="msg.message.text" class="chat-box-bubble">
              <div class="chat-box-bubble__text">
                <div class="chat-box-bubble__message">{{ msg.message.text }}</div>
              </div>
              <div class="chat-box-bubble__arrow"></div>
            </div>
          </div>
        </div>
      </li>
    </ul>
    <div class="chat-box-text">
      <v-text-field
        v-model="text"
        append-inner-icon="mdi-send-variant-outline"
        class="text-white"
        color="white"
        rounded
        hide-details
        @click:append-inner="handleSendMessage"
        @keydown.enter="handleSendMessage"
      ></v-text-field>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IChatMessage } from '~/types/chat.d'

const props = defineProps({
  modelValue: {
    type: Array<IChatMessage>,
    default: () => [],
  },
  currentUser: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['send'])

const text = ref<string>('')

const messages = computed(() => props.modelValue)

function handleSendMessage() {
  if (!text) return
  emit('send', text)
  text.value = ''
}
</script>

<style lang="scss" scoped>
.chat-box {
  min-height: 200px;
  display: flex;
  flex-direction: column;
  background-color: #d2dbe8;

  &-list {
    flex: 1;
    list-style: none;
    padding-top: 16px;
  }

  &-item {
    padding-right: 16px;
  }

  &-bubble {
    width: 240px;
    height: auto;
    display: block;
    background: #f5f5f5;
    border-radius: 24px;
    position: relative;
    margin: 0 0 0 8px;

    &__text {
      padding: 8px 55px 8px 14px;
    }

    &__arrow {
      position: absolute;
      width: 0;
      bottom: 42px;
      left: -16px;
      height: 0;

      &::after {
        content: '';
        position: absolute;
        border: 0 solid transparent;
        border-top: 9px solid #f5f5f5;
        border-radius: 0 20px 0;
        width: 15px;
        height: 30px;
        transform: rotate(145deg);
      }
    }
  }

  $root-ele: &;
  &-message {
    $message-ele: &;

    display: flex;
    padding-top: 8px;
    padding-bottom: 8px;
    padding-left: 8px;

    &-box {
      &__profile {
        width: 56px;
      }
    }

    &--me {
      #{$message-ele}-box__profile {
        visibility: hidden;
        flex: 1;
      }

      #{$root-ele}-bubble__arrow {
        right: -2px;
        bottom: 40px;
        left: auto;

        &::after {
          transform: rotate(45deg) scaleY(-1);
        }
      }

      #{$root-ele}-bubble {
        margin: 0 8px 0 0;
      }
    }
  }

  &-text {
    padding: 8px 16px;
    flex: 0;
    height: 72px;
    background-color: #35435e;
  }
}
</style>
