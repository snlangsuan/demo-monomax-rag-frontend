<template>
  <div class="chat-box" :style="{ height: `${height}px` }">
    <ul ref="chatBoxListRef" class="chat-box-list" :style="{ height: `${boxHeight}px` }" @scroll="handleOnChangeScroll">
      <li v-for="msg in messages" :key="msg.id" class="chat-box-item">
        <div :class="['chat-box-message', { 'chat-box-message--me': msg.source.id === currentUser.id }]">
          <div class="chat-box-message-box__profile">
            <v-avatar color="white">
              <v-img :src="msg.source.profile" />
            </v-avatar>
          </div>
          <div class="chat-box-message-box__content">
            <div v-if="msg.message.text" class="chat-box-bubble">
              <div class="chat-box-bubble__text">
                <!-- <div class="chat-box-bubble__message">{{ msg.message.text }}</div> -->
                <div class="chat-box-bubble__message">
                  <MDC :value="msg.message.text" />
                </div>
              </div>
              <div class="chat-box-bubble__arrow" />
            </div>
            <div class="chat-box-message-box__timestamp">
              <div>{{ date_format(msg.created_at, 'HH:mm') }}</div>
            </div>
          </div>
        </div>
      </li>
      <li v-if="loading" class="chat-box-item">
        <div class="chat-box-message">
          <div class="chat-box-message-box__profile">
            <v-avatar color="white">
              <v-img :src="targetUser.profile" />
            </v-avatar>
          </div>
          <div class="chat-box-message-box__content">
            <v-img :src="loadingImage" width="60" height="40" cover />
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
      />
    </div>
    <v-fab
      v-if="hasScrolledToBottom"
      icon="mdi-chevron-down"
      :style="{ marginBottom: '56px' }"
      location="bottom center"
      size="48"
      absolute
      app
    />
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import loadingImage from '~/assets/images/loading.gif'
import type { IChatMessage } from '~/types/chat.d'
import type { IUserAccount } from '~/types/user'

const props = defineProps({
  currentUser: {
    default: () => ({}),
    type: Object as PropType<IUserAccount>,
  },
  height: {
    default: 100,
    type: Number,
  },
  loading: {
    default: false,
    type: Boolean,
  },
  modelValue: {
    default: () => [],
    type: Array<IChatMessage>,
  },
  targetUser: {
    default: () => ({}),
    type: Object as PropType<IUserAccount>,
  },
})

const emit = defineEmits(['send'])
const text = ref<string>('')
const chatBoxListRef = ref<HTMLElement>()
const hasScrolledToBottom = ref<boolean>(false)

const messages = computed(() => props.modelValue)
const boxHeight = computed(() => props.height - 56)

function handleSendMessage() {
  if (!text.value) return
  emit('send', text.value)
  text.value = ''
}

function handleOnChangeScroll(el: Event) {
  const targetElm = el.target! as HTMLElement
  hasScrolledToBottom.value = targetElm.offsetHeight + targetElm.scrollTop < targetElm.scrollHeight
}

function scrollDown() {
  const lastElem = chatBoxListRef.value?.lastElementChild as HTMLElement
  lastElem?.scrollIntoView({ behavior: 'smooth' })
}

defineExpose({ scrollDown })
</script>

<style lang="scss" scoped>
.chat-box {
  min-height: 200px;
  display: flex;
  flex-direction: column;
  background-color: #d2dbe8;
  overflow: hidden;

  &-list {
    flex: 1;
    list-style: none;
    padding-top: 16px;
    overflow-y: scroll;
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
      padding: 8px 16px 8px 16px;
    }

    &__arrow {
      position: absolute;
      width: 0;
      bottom: 0;
      top: 0;
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

    &__message {
      & :deep(ol),
      & :deep(ul) {
        list-style-position: inside;
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

      &__content {
        position: relative;
      }

      &__timestamp {
        position: absolute;
        right: -2rem;
        bottom: 0;
        font-size: 0.6rem;
      }
    }

    &--me {
      #{$message-ele}-box {
        &__profile {
          visibility: hidden;
          flex: 1;
        }

        &__timestamp {
          right: 0;
          left: -2rem;
        }
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
