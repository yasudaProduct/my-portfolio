<template>
  <div class="desktop">
    <div class="wallpaper"></div>
    
    <!-- Desktop Icons -->
    <div class="desktop-icons">
      <DesktopIcon 
        v-for="app in apps" 
        :key="app.id"
        :icon="app.icon"
        :name="app.name"
        :x="app.x"
        :y="app.y"
        @click="openWindow(app)"
      />
    </div>

    <!-- Windows -->
    <Window
      v-for="window in openWindows"
      :key="window.id"
      :id="window.id"
      :title="window.title"
      :content="window.content"
      :x="window.x"
      :y="window.y"
      :width="window.width"
      :height="window.height"
      :z-index="window.zIndex"
      @close="closeWindow"
      @focus="focusWindow"
    />

    <!-- Taskbar -->
    <Taskbar 
      :open-windows="openWindows"
      @window-click="focusWindow"
    />
  </div>
</template>

<script>
import DesktopIcon from './components/DesktopIcon.vue'
import Window from './components/Window.vue'
import Taskbar from './components/Taskbar.vue'

export default {
  name: 'App',
  components: {
    DesktopIcon,
    Window,
    Taskbar
  },
  data() {
    return {
      nextWindowId: 1,
      nextZIndex: 1000,
      apps: [
        { id: 1, name: 'フォルダ', icon: '📁', x: 50, y: 50 },
        { id: 2, name: 'テキストエディタ', icon: '📝', x: 50, y: 150 },
        { id: 3, name: '計算機', icon: '🧮', x: 50, y: 250 },
        { id: 4, name: 'ブラウザ', icon: '🌐', x: 50, y: 350 },
        { id: 5, name: '設定', icon: '⚙️', x: 150, y: 50 },
        { id: 6, name: 'パーティクル', icon: '✨', x: 150, y: 150 }
      ],
      openWindows: []
    }
  },
  methods: {
    openWindow(app) {
      const windowId = this.nextWindowId++
      const newWindow = {
        id: windowId,
        title: app.name,
        content: this.getWindowContent(app),
        x: 200 + (windowId * 30),
        y: 100 + (windowId * 30),
        width: 600,
        height: 400,
        zIndex: this.nextZIndex++
      }
      this.openWindows.push(newWindow)
    },
    closeWindow(windowId) {
      this.openWindows = this.openWindows.filter(w => w.id !== windowId)
    },
    focusWindow(windowId) {
      const window = this.openWindows.find(w => w.id === windowId)
      if (window) {
        window.zIndex = this.nextZIndex++
      }
    },
    getWindowContent(app) {
      const contents = {
        'フォルダ': `
          <div class="folder-content">
            <div class="file-list">
              <div class="file-item">📄 ドキュメント.txt</div>
              <div class="file-item">🖼️ 画像.png</div>
              <div class="file-item">📁 サブフォルダ</div>
              <div class="file-item">📋 データ.csv</div>
            </div>
          </div>
        `,
        'テキストエディタ': `
          <div class="editor-content">
            <textarea placeholder="ここにテキストを入力してください..." style="width: 100%; height: 100%; border: none; outline: none; font-family: monospace; padding: 10px;"></textarea>
          </div>
        `,
        '計算機': `
          <div class="calculator">
            <div class="calc-display">0</div>
            <div class="calc-buttons">
              <button onclick="clearCalc()">C</button>
              <button onclick="appendCalc('/')">/</button>
              <button onclick="appendCalc('*')">×</button>
              <button onclick="deleteCalc()">←</button>
              <button onclick="appendCalc('7')">7</button>
              <button onclick="appendCalc('8')">8</button>
              <button onclick="appendCalc('9')">9</button>
              <button onclick="appendCalc('-')">-</button>
              <button onclick="appendCalc('4')">4</button>
              <button onclick="appendCalc('5')">5</button>
              <button onclick="appendCalc('6')">6</button>
              <button onclick="appendCalc('+')">+</button>
              <button onclick="appendCalc('1')">1</button>
              <button onclick="appendCalc('2')">2</button>
              <button onclick="appendCalc('3')">3</button>
              <button onclick="calculateResult()" rowspan="2">=</button>
              <button onclick="appendCalc('0')" colspan="2">0</button>
              <button onclick="appendCalc('.')">.</button>
            </div>
          </div>
        `,
        'ブラウザ': `
          <div class="browser">
            <div class="browser-bar">
              <input type="text" placeholder="URLを入力してください..." style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
            </div>
            <div class="browser-content" style="padding: 20px; text-align: center;">
              <h2>ウェブブラウザ</h2>
              <p>これはデモ用のブラウザウィンドウです。</p>
            </div>
          </div>
        `,
        '設定': `
          <div class="settings">
            <h3>システム設定</h3>
            <div class="setting-item">
              <label>壁紙:</label>
              <select>
                <option>デフォルト</option>
                <option>ブルー</option>
                <option>グリーン</option>
              </select>
            </div>
            <div class="setting-item">
              <label>テーマ:</label>
              <select>
                <option>ライト</option>
                <option>ダーク</option>
              </select>
            </div>
          </div>
        `,
        'パーティクル': `
          <div class="particle-app">
            <div class="particle-controls">
              <div class="control-group">
                <label>パーティクル数:</label>
                <input type="range" id="particleCount" min="1000" max="50000" value="10000" step="1000">
                <span id="particleCountValue">10000</span>
              </div>
              <div class="control-group">
                <button onclick="toggleParticles()" id="toggleBtn">開始</button>
                <button onclick="resetParticles()">リセット</button>
              </div>
            </div>
            <canvas id="particleCanvas" width="560" height="320" style="background: #000; border: 1px solid #333; cursor: crosshair;"></canvas>
            <div class="particle-info">
              <p>マウスでパーティクルと相互作用できます</p>
              <p>WebGPU非対応ブラウザではCanvas 2Dで動作します</p>
            </div>
          </div>
        `
      }
      return contents[app.name] || '<p>コンテンツが見つかりません</p>'
    }
  }
}
</script>

<style>
.desktop {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
}

.wallpaper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  z-index: 0;
}

.desktop-icons {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: calc(100% - 50px);
  z-index: 1;
}

.folder-content .file-list {
  padding: 20px;
}

.file-item {
  padding: 8px;
  margin: 4px 0;
  cursor: pointer;
  border-radius: 4px;
}

.file-item:hover {
  background-color: #e3f2fd;
}

.calculator {
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.calc-display {
  background: #000;
  color: #fff;
  padding: 15px;
  text-align: right;
  font-size: 24px;
  margin-bottom: 10px;
  border-radius: 4px;
}

.calc-buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  flex: 1;
}

.calc-buttons button {
  padding: 15px;
  font-size: 18px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: #f0f0f0;
}

.calc-buttons button:hover {
  background: #e0e0e0;
}

.browser-bar {
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.settings {
  padding: 20px;
}

.setting-item {
  margin: 15px 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.setting-item label {
  min-width: 80px;
}

.setting-item select {
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.particle-app {
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.particle-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 6px;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.control-group label {
  font-weight: 500;
  min-width: 80px;
}

.control-group input[type="range"] {
  width: 120px;
}

.control-group button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.control-group button:first-of-type {
  background: #4CAF50;
  color: white;
}

.control-group button:first-of-type:hover {
  background: #45a049;
}

.control-group button:last-of-type {
  background: #2196F3;
  color: white;
}

.control-group button:last-of-type:hover {
  background: #1976D2;
}

#particleCanvas {
  border-radius: 4px;
  margin: 10px 0;
}

.particle-info {
  margin-top: 10px;
  padding: 10px;
  background: #e8f4f8;
  border-radius: 4px;
  font-size: 13px;
  color: #666;
}

.particle-info p {
  margin: 2px 0;
}
</style>