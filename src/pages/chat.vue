<template>
  <div class="fill-height">
    <v-app-bar density="compact" color="#35435e">
      <v-app-bar-title>{{ targetUser?.display_name }}</v-app-bar-title>
      <v-spacer />
      <v-menu>
        <template #activator="{ props }">
          <v-btn icon="mdi-dots-vertical" variant="text" v-bind="props" />
        </template>
        <v-list>
          <v-list-item @click="handleOnReset">
            <template #prepend>
              <v-icon icon="mdi-refresh" />
            </template>
            <v-list-item-title>รีเซ็ต</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <chat-box
      ref="chatBoxRef"
      v-model="chatHistories"
      :current-user="currentUser"
      :target-user="targetUser"
      :height="windowHeight"
      :loading="chatLoading && botMode"
      @send="handleOnSendMessage"
    />
    <v-overlay :model-value="pageLoading" class="align-center justify-center">
      <v-progress-circular color="primary" size="64" indeterminate />
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
const botMode = ref<boolean>(true)

async function handleOnSendMessage(text: string) {
  if (!currentRoom.value || !currentRoom.value.id) return
  if (timeoutInstance) clearTimeout(timeoutInstance)
  chatLoading.value = true
  timeoutInstance = setTimeout(() => (chatLoading.value = false), 6000)
  const message: IChatMessageObject = { text, type: 'text' }
  await chatApi.sendMessage(currentRoom.value!.id, message, currentUser.value!.id)
}

function initSocket(roomId?: string) {
  const token = sessionStorage.getItem('auth.token')
  socketInstance = io(config.public.socketChat, { auth: { token } })
  socketInstance.on('connection', async (socket) => {
    console.log('connected', socket)
    if (roomId) await socketInstance?.emit('join', roomId)
  })
  socketInstance.on('connect_error', (error) => {
    console.error(error)
  })
  socketInstance.on('disconnect', (reason, details) => {
    console.log(reason, details)
  })

  socketInstance.on('joined', (data) => {
    console.log('joined', data)
    botMode.value = data.bot_mode
  })

  socketInstance.on('message', (data: IChatMessage | string) => {
    console.log('new message', data)
    const message: IChatMessage = typeof data === 'string' ? JSON.parse(data) : data
    const isExist = chatHistories.value.find((msg) => msg.id === message.id)
    if (isExist) return
    chatHistories.value.push(message)
    if (message.source.id === targetUser.value!.id) {
      chatLoading.value = false
      if (timeoutInstance) clearTimeout(timeoutInstance)
    }
    nextTick(() => {
      chatBoxRef.value?.scrollDown()
    })
  })
}

async function createAccount() {
  try {
    const response = await userApi.getToken()
    sessionStorage.setItem('auth.token', response.token)
  } catch (error) {
    console.error(error)
  }
}

function handleOnChangeSizeWindow() {
  windowHeight.value = window.innerHeight - 48
}

async function initChat() {
  const profile = await userApi.getMe()
  currentUser.value = profile

  const roomList = await chatApi.getRoomList()
  let room = roomList.items.length > 0 ? roomList.items[0] : null
  if (!room) room = await chatApi.createRoom([MONOMAX_OFFICIAL_ID])
  currentRoom.value = room
  const roomMembers = currentRoom.value!.members
  targetUser.value = roomMembers.find((member) => member.id !== currentUser.value!.id)
}

async function handleOnReset() {
  pageLoading.value = true
  if (socketInstance && currentRoom.value) {
    await socketInstance.emit('leave', currentRoom.value.id)
  }
  await createAccount()
  await initChat()
  pageLoading.value = false
  chatHistories.value = []
  if (currentRoom.value!.id) await socketInstance?.emit('join', currentRoom.value!.id)
}

async function init() {
  const token = sessionStorage.getItem('auth.token')
  if (!token) await createAccount()

  await initChat()

  const history = await chatApi.getMessageHistory(currentRoom.value!.id)
  chatHistories.value = history.items || []
  console.log('room', currentRoom.value)
  pageLoading.value = false
  initSocket(currentRoom.value!.id)
  nextTick(() => {
    chatBoxRef.value?.scrollDown()
  })
}

onMounted(() => {
  init()
  handleOnChangeSizeWindow()
  window.addEventListener('resize', handleOnChangeSizeWindow)
})

onBeforeUnmount(async () => {
  if (socketInstance) {
    if (currentRoom.value) await socketInstance.emit('leave', currentRoom.value!.id)
    await socketInstance.close()
  }
  window.removeEventListener('resize', handleOnChangeSizeWindow)
})

useHead({
  title: targetUser.value?.display_name,
})
</script>

<style></style>
