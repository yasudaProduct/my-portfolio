<template>
  <div class="taskbar">
    <div class="start-button" @click="toggleStartMenu">
      <span class="start-icon">🪟</span>
      <span class="start-text">スタート</span>
    </div>
    
    <div class="taskbar-items">
      <div 
        v-for="window in openWindows" 
        :key="window.id"
        class="taskbar-item"
        @click="$emit('window-click', window.id)"
      >
        {{ window.title }}
      </div>
    </div>
    
    <div class="system-tray">
      <div class="time">{{ currentTime }}</div>
    </div>

    <!-- Start Menu -->
    <div v-if="showStartMenu" class="start-menu">
      <div class="start-menu-header">
        <div class="user-info">
          <div class="user-avatar">👤</div>
          <div class="user-name">ユーザー</div>
        </div>
      </div>
      <div class="start-menu-apps">
        <div class="app-item">📁 ファイルマネージャー</div>
        <div class="app-item">⚙️ 設定</div>
        <div class="app-item">🌐 ブラウザ</div>
        <div class="app-item">📝 テキストエディタ</div>
        <div class="app-item">🧮 計算機</div>
      </div>
      <div class="start-menu-footer">
        <div class="power-button">🔌 電源</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Taskbar',
  props: {
    openWindows: Array
  },
  emits: ['window-click'],
  data() {
    return {
      showStartMenu: false,
      currentTime: ''
    }
  },
  mounted() {
    this.updateTime()
    setInterval(this.updateTime, 1000)
  },
  methods: {
    toggleStartMenu() {
      this.showStartMenu = !this.showStartMenu
    },
    updateTime() {
      const now = new Date()
      this.currentTime = now.toLocaleTimeString('ja-JP', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    }
  }
}
</script>

<style scoped>
.taskbar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50px;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  z-index: 9999;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.start-button {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  margin: 0 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  cursor: pointer;
  color: white;
  transition: background-color 0.2s;
}

.start-button:hover {
  background: rgba(255, 255, 255, 0.2);
}

.start-icon {
  margin-right: 8px;
  font-size: 16px;
}

.start-text {
  font-size: 14px;
  font-weight: 500;
}

.taskbar-items {
  flex: 1;
  display: flex;
  align-items: center;
  overflow-x: auto;
}

.taskbar-item {
  padding: 8px 16px;
  margin: 0 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  cursor: pointer;
  color: white;
  font-size: 13px;
  white-space: nowrap;
  transition: background-color 0.2s;
  min-width: 120px;
  text-align: center;
}

.taskbar-item:hover {
  background: rgba(255, 255, 255, 0.2);
}

.system-tray {
  display: flex;
  align-items: center;
  padding: 0 16px;
  color: white;
}

.time {
  font-size: 14px;
  font-weight: 500;
}

.start-menu {
  position: fixed;
  bottom: 50px;
  left: 8px;
  width: 300px;
  height: 400px;
  background: rgba(40, 40, 40, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  color: white;
  display: flex;
  flex-direction: column;
}

.start-menu-header {
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.user-info {
  display: flex;
  align-items: center;
}

.user-avatar {
  font-size: 24px;
  margin-right: 12px;
}

.user-name {
  font-size: 16px;
  font-weight: 500;
}

.start-menu-apps {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}

.app-item {
  padding: 12px 16px;
  margin: 4px 0;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.app-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.start-menu-footer {
  padding: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.power-button {
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  cursor: pointer;
  text-align: center;
  transition: background-color 0.2s;
}

.power-button:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>