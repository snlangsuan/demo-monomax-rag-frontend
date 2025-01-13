<template>
  <div class="fill-height">
    <v-app-bar density="compact" color="#35435e">
      <v-app-bar-title>Admin Chat</v-app-bar-title>
    </v-app-bar>
    <div class="chat-content">
      <div
        :class="{ 'chat-content--hide': !!targetUser }"
        :style="{ flex: '0 320px', height: `${windowHeight}px`, overflow: 'hidden' }"
      >
        <v-toolbar color="white" density="compact" />
        <v-divider />
        <contact-list v-model="contacts" :height="windowHeight - 48" @click="handleOnSelectRoom" />
      </div>
      <div :style="{ flex: 1, height: `${windowHeight}px`, overflow: 'hidden' }">
        <v-toolbar color="white" density="compact">
          <v-btn class="chat-content-back" icon @click="handleOnBackContact">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-toolbar-title>{{ targetUser?.display_name ?? '' }}</v-toolbar-title>
          <v-spacer />
          <v-menu v-if="targetUser">
            <template #activator="{ props }">
              <v-btn icon="mdi-dots-vertical" variant="text" v-bind="props" />
            </template>
            <v-list>
              <v-list-item @click="handleOnSetResolve">
                <template #prepend>
                  <v-icon icon="mdi-message-check" />
                </template>
                <v-list-item-title>Resolve</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
        <v-divider />
        <chat-box
          ref="chatBoxRef"
          v-model="chatHistories"
          :current-user="currentUser"
          :target-user="targetUser"
          :height="windowHeight - 48"
          :loading="chatLoading"
          @send="handleOnSendMessage"
        />
      </div>
    </div>
    <v-overlay :model-value="pageLoading" class="align-center justify-center">
      <v-progress-circular color="primary" size="48" indeterminate />
    </v-overlay>
  </div>
</template>

<script lang="ts" setup>
import io from 'socket.io-client'
import type { Socket } from 'socket.io-client'
import type ChatBox from '~/components/ChatBox.vue'
import { MONOMAX_OFFICIAL_ID } from '~/constants/chat'
import type { IChatMessage, IChatMessageObject, IChatRoom } from '~/types/chat.d'
import type { IUserAccount } from '~/types/user.d'

const config = useRuntimeConfig()
const userApi = useUserApi()
const chatApi = useChatApi()

let socketInstance: Socket | null = null

const currentUser = ref<IUserAccount>()
const targetUser = ref<IUserAccount>()
const currentRoom = ref<IChatRoom>()
const windowHeight = ref<number>(100)

const chatBoxRef = ref<InstanceType<typeof ChatBox>>()
const chatHistories = ref<Array<IChatMessage>>([])
const chatLoading = ref<boolean>(false)
const pageLoading = ref<boolean>(true)
let timeoutInstance: ReturnType<typeof setTimeout> | null = null

const contacts = ref<Array<IChatRoom>>([])

function handleOnBackContact() {
  targetUser.value = undefined
}

async function handleOnSelectRoom(room: IChatRoom) {
  if (socketInstance && currentRoom.value) {
    console.log('leave', currentRoom.value)
    await socketInstance.emit('leave', currentRoom.value!.id)
  }
  currentRoom.value = room
  await socketInstance?.emit('join', currentRoom.value!.id)
  targetUser.value = room.members.find((user) => user.id !== currentUser.value!.id)
  const history = await chatApi.getMessageHistory(currentRoom.value!.id, true)
  console.log(history)
  chatHistories.value = history.items || []
  initSocket()
}

function initSocket() {
  const token = sessionStorage.getItem('auth.token')
  socketInstance = io(config.public.socketChat, { auth: { token } })
  socketInstance.on('connection', (socket) => {
    // socketInstance!.emit('join', roomId)
    console.log('connected', socket)
  })
  socketInstance.on('connect_error', (error) => {
    console.error(error)
  })
  socketInstance.on('disconnect', (reason, details) => {
    console.log(reason, details)
  })

  socketInstance.on('message', (data: IChatMessage | string) => {
    const message: IChatMessage = typeof data === 'string' ? JSON.parse(data) : data
    const isExist = chatHistories.value.find((msg) => msg.id === message.id)
    if (isExist) return
    if (targetUser.value?.id == message.room) {
      chatHistories.value.push(message)
      chatBoxRef.value?.scrollDown()
    }
    console.log('message', message)
    // const contactRoom = contacts.value.find((room) => room.id == message.room)
    // if (contactRoom) {
    //   contactRoom.message = message.message
    // } else {
    //   getChatRoom()
    // }
  })

  socketInstance.on('notify', (data: IChatMessage | string) => {
    const message: IChatMessage = typeof data === 'string' ? JSON.parse(data) : data
    console.log('notify', message)
  })

  socketInstance.on('rooms', () => {
    console.log('refresh rooms')
  })
}

async function handleOnSetResolve() {
  console.log('resolve')
}

async function getAccount() {
  try {
    const response = await userApi.getAdminToken()
    sessionStorage.setItem('auth.token', response.token)
  } catch (error) {
    console.error(error)
  }
}

async function handleOnSendMessage(text: string) {
  if (!currentRoom.value || !currentRoom.value.id) return
  if (timeoutInstance) clearTimeout(timeoutInstance)
  timeoutInstance = setTimeout(() => (chatLoading.value = false), 6000)
  const message: IChatMessageObject = { text, type: 'text' }
  await chatApi.sendMessage(currentRoom.value!.id!, message, currentUser.value!.id)
}

async function getChatRoom() {
  const roomResult = await chatApi.getRoomList()
  contacts.value = roomResult.items.map((item) => {
    const target = item.members.filter((user) => user.id !== currentUser.value!.id)
    item.name = target.length > 0 ? target[0].display_name : 'Unknown'
    item.profile = target.length > 0 ? target[0].profile : undefined
    return item
  })
}

async function init() {
  const token = sessionStorage.getItem('auth.token')
  if (!token) await getAccount()

  let profile = await userApi.getMe()
  if (profile.id !== MONOMAX_OFFICIAL_ID) {
    await getAccount()
    profile = await userApi.getMe()
  }
  currentUser.value = profile
  getChatRoom()

  // const history = await chatApi.getMessageHistory(currentRoomId.value!)
  // chatHistories.value = history.items || []
  // console.log(history.items)
  pageLoading.value = false
  // initSocket(currentRoomId.value!)
  initSocket()
}

function handleOnChangeSizeWindow() {
  windowHeight.value = window.innerHeight - 48
}

onMounted(() => {
  init()
  handleOnChangeSizeWindow()
  window.addEventListener('resize', handleOnChangeSizeWindow)
})

onBeforeUnmount(async () => {
  if (socketInstance) await socketInstance.close()
  window.removeEventListener('resize', handleOnChangeSizeWindow)
})

useHead({
  title: targetUser.value?.display_name,
})
</script>

<style lang="scss" scoped>
.chat-content {
  display: flex;
  position: relative;

  & > * {
    position: relative;
    &::after {
      content: '';
      position: absolute;
      background-color: #35435e;
      opacity: 0.3;
      top: 0;
      bottom: 0;
      width: 1px;
      height: 100%;
    }
  }

  &-back {
    opacity: 0;
  }
}

@media screen and (max-width: 640px) {
  .chat-content {
    & > * {
      position: absolute;
      left: 0;
      right: 0;

      &:first-child {
        z-index: 2;
      }
      &:last-child {
        z-index: 1;
      }
    }

    &--hide {
      display: none;
    }

    &-back {
      opacity: 1;
    }
  }
}
</style>
