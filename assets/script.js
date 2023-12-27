const socket = io({
  auth: {
    serverOffset: 0
  }
});

const message = document.querySelector('.messages')
const form = document.querySelector('form')
const input = document.querySelector('.input')
const nameBlock = document.querySelector('.name')
const connectionBtn = document.querySelector('.connection')

const userName = prompt('Enter your name:')
nameBlock.innerHTML = `${userName}`

form.addEventListener('submit', (e) => {
  e.preventDefault()

  if (input.value) {
    socket.emit('chatMessage', {
      message: input.value,
      name: userName
    })
    input.value = '';
  }
})

socket.emit('userAction', {
  name: userName,
  action: 'JOINED',
})

socket.on('userAction', (data) => {
  const item = document.createElement('li')
  item.innerHTML = `<span class="join">${data.name}: ${data.action}</span>`
  message.appendChild(item)
})

socket.on('chatMessage', (data, serverOffset) => {
  newMessage(data.name, data.message, serverOffset)
})

connectionBtn.addEventListener('click', (e) => {
  e.preventDefault();
  if (socket.connected) {
    socket.emit('userAction', {
      name: userName,
      action: 'DISCONNECT',
    })    
    connectionBtn.innerHTML = '<img src="/link.png" alt="" class="conImg">';
    socket.disconnect();
  } else {
    
    connectionBtn.innerHTML = '<img src="/broken-link.png" alt="" class="conImg">';
    socket.connect();
    socket.emit('userAction', {
      name: userName,
      action: 'RECONNECT',
    })   
  }
});


function newMessage(name, userMessage, serverOffset) {
  const item = document.createElement('li')
  item.innerHTML = `<span>${name}</span>: ${userMessage}`
  message.appendChild(item)
  socket.auth.serverOffset = serverOffset;
}