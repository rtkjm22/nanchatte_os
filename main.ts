let zIndexCounter = 1

const makeDraggable = (win: HTMLElement, titleBar: HTMLElement) => {
  let offsetX = 0
  let offsetY = 0
  let isDragging = false

  titleBar.addEventListener('mousedown', (e) => {
    isDragging = true
    offsetX = e.clientX - win.offsetLeft
    offsetY = e.clientY - win.offsetTop
    win.style.zIndex = `${++zIndexCounter}`
  })

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return
    win.style.left = `${e.clientX - offsetX}px`
    win.style.top = `${e.clientY - offsetY}px`
  })

  document.addEventListener('mouseup', () => {
    isDragging = false
  })
}

const createWindow = (title: string, contentHTML: string): HTMLElement => {
  const win = document.createElement('div')
  win.className = 'window'
  Object.assign(win.style, {
    top: '100px',
    left: '100px'
  })

  const titleBar = document.createElement('div')
  titleBar.className = 'titleBar'
  titleBar.innerHTML = `<p>${title}</p>`

  const closeBtn = document.createElement('button')
  closeBtn.className = 'close-btn'
  closeBtn.textContent = '×'
  closeBtn.onclick = () => win.remove()

  titleBar.appendChild(closeBtn)

  const content = document.createElement('div')
  content.className = 'content'
  content.innerHTML = contentHTML

  win.append(titleBar, content)
  document.getElementById('desktop')?.appendChild(win)

  makeDraggable(win, titleBar)
  return content
}

const launchClock = () => {
  const content = createWindow(
    '時計アプリ',
    `<div class="clock">🕒 00:00:00</div>`
  )
  const clockEl = content.querySelector('.clock') as HTMLElement
  clockEl.textContent = '🕒 ' + new Date().toLocaleTimeString()
  setInterval(() => {
    clockEl.textContent = '🕒 ' + new Date().toLocaleTimeString()
  }, 1000)
}

const launchEditor = () => {
  const content = createWindow(
    'テキストエディタ',
    `
    <textarea id="editorArea" placeholder="ここにメモを入力..."></textarea>
    <button id="saveBtn">保存する</button>
  `
  )

  const editor = content.querySelector('#editorArea') as HTMLTextAreaElement
  editor.value = localStorage.getItem('editorContent') || ''

  const saveBtn = content.querySelector('#saveBtn') as HTMLButtonElement
  saveBtn.onclick = () => {
    localStorage.setItem('editorContent', editor.value)
    alert('保存したよー！')
  }
}

const launchTerminal = () => {
  const content = createWindow(
    'ターミナル',
    `
    <div class="terminalOutput"></div>
    <input class="terminalInput" placeholder="help, echo, date, clear" />
  `
  )

  const output = content.querySelector('.terminalOutput') as HTMLElement
  const input = content.querySelector('.terminalInput') as HTMLInputElement

  const displayOutput = (text: string) => {
    const line = document.createElement('div')
    line.textContent = `> ${text}`
    output.appendChild(line)
    output.scrollTop = output.scrollHeight
  }

  const handleCommand = (cmd: string) => {
    const [command, ...args] = cmd.trim().split(' ')
    switch (command) {
      case 'help':
        displayOutput('使えるコマンド一覧: help, echo, clear, date')
        break
      case 'echo':
        displayOutput(args.join(' '))
        break
      case 'date':
        displayOutput(new Date().toLocaleString())
        break
      case 'clear':
        output.innerHTML = ''
        break
      default:
        displayOutput(`こんなコマンド知らん！: ${command}`)
    }
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const command = input.value
      displayOutput(command)
      handleCommand(command)
      input.value = ''
    }
  })
}

document.getElementById('clockBtn')?.addEventListener('click', launchClock)
document.getElementById('editorBtn')?.addEventListener('click', launchEditor)
document
  .getElementById('terminalBtn')
  ?.addEventListener('click', launchTerminal)
