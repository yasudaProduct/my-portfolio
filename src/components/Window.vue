<template>
  <div 
    class="window"
    :style="windowStyle"
    @mousedown="onWindowClick"
  >
    <!-- Window Header -->
    <div 
      class="window-header"
      @mousedown="startDrag"
    >
      <div class="window-title">{{ title }}</div>
      <div class="window-controls">
        <button class="control-btn minimize" @click="minimize">−</button>
        <button class="control-btn maximize" @click="maximize">□</button>
        <button class="control-btn close" @click="close">×</button>
      </div>
    </div>
    
    <!-- Window Content -->
    <div class="window-content" v-html="content"></div>
    
    <!-- Resize Handles -->
    <div class="resize-handle resize-n" @mousedown="startResize('n')"></div>
    <div class="resize-handle resize-s" @mousedown="startResize('s')"></div>
    <div class="resize-handle resize-e" @mousedown="startResize('e')"></div>
    <div class="resize-handle resize-w" @mousedown="startResize('w')"></div>
    <div class="resize-handle resize-ne" @mousedown="startResize('ne')"></div>
    <div class="resize-handle resize-nw" @mousedown="startResize('nw')"></div>
    <div class="resize-handle resize-se" @mousedown="startResize('se')"></div>
    <div class="resize-handle resize-sw" @mousedown="startResize('sw')"></div>
  </div>
</template>

<script>
export default {
  name: 'Window',
  props: {
    id: Number,
    title: String,
    content: String,
    x: Number,
    y: Number,
    width: Number,
    height: Number,
    zIndex: Number
  },
  emits: ['close', 'focus'],
  data() {
    return {
      isDragging: false,
      isResizing: false,
      resizeDirection: '',
      dragStartX: 0,
      dragStartY: 0,
      windowX: this.x,
      windowY: this.y,
      windowWidth: this.width,
      windowHeight: this.height,
      startX: 0,
      startY: 0,
      startWidth: 0,
      startHeight: 0,
      isMaximized: false,
      restoreData: null
    }
  },
  computed: {
    windowStyle() {
      return {
        left: this.windowX + 'px',
        top: this.windowY + 'px',
        width: this.windowWidth + 'px',
        height: this.windowHeight + 'px',
        zIndex: this.zIndex
      }
    }
  },
  mounted() {
    document.addEventListener('mousemove', this.onMouseMove)
    document.addEventListener('mouseup', this.onMouseUp)
  },
  beforeUnmount() {
    document.removeEventListener('mousemove', this.onMouseMove)
    document.removeEventListener('mouseup', this.onMouseUp)
  },
  methods: {
    close() {
      this.$emit('close', this.id)
    },
    minimize() {
      // Minimize functionality can be implemented
      console.log('Minimize window', this.id)
    },
    maximize() {
      if (this.isMaximized) {
        // Restore
        if (this.restoreData) {
          this.windowX = this.restoreData.x
          this.windowY = this.restoreData.y
          this.windowWidth = this.restoreData.width
          this.windowHeight = this.restoreData.height
        }
        this.isMaximized = false
      } else {
        // Maximize
        this.restoreData = {
          x: this.windowX,
          y: this.windowY,
          width: this.windowWidth,
          height: this.windowHeight
        }
        this.windowX = 0
        this.windowY = 0
        this.windowWidth = window.innerWidth
        this.windowHeight = window.innerHeight - 50 // Account for taskbar
        this.isMaximized = true
      }
    },
    onWindowClick() {
      this.$emit('focus', this.id)
    },
    startDrag(e) {
      if (this.isMaximized) return
      
      this.isDragging = true
      this.dragStartX = e.clientX - this.windowX
      this.dragStartY = e.clientY - this.windowY
      this.$emit('focus', this.id)
    },
    startResize(direction) {
      if (this.isMaximized) return
      
      this.isResizing = true
      this.resizeDirection = direction
      this.startX = this.windowX
      this.startY = this.windowY
      this.startWidth = this.windowWidth
      this.startHeight = this.windowHeight
    },
    onMouseMove(e) {
      if (this.isDragging) {
        this.windowX = e.clientX - this.dragStartX
        this.windowY = e.clientY - this.dragStartY
        
        // Keep window within bounds
        this.windowX = Math.max(0, Math.min(this.windowX, window.innerWidth - this.windowWidth))
        this.windowY = Math.max(0, Math.min(this.windowY, window.innerHeight - this.windowHeight - 50))
      }
      
      if (this.isResizing) {
        const deltaX = e.clientX - this.dragStartX
        const deltaY = e.clientY - this.dragStartY
        
        if (this.resizeDirection.includes('e')) {
          this.windowWidth = Math.max(200, this.startWidth + deltaX)
        }
        if (this.resizeDirection.includes('w')) {
          const newWidth = Math.max(200, this.startWidth - deltaX)
          this.windowX = this.startX + (this.startWidth - newWidth)
          this.windowWidth = newWidth
        }
        if (this.resizeDirection.includes('s')) {
          this.windowHeight = Math.max(150, this.startHeight + deltaY)
        }
        if (this.resizeDirection.includes('n')) {
          const newHeight = Math.max(150, this.startHeight - deltaY)
          this.windowY = this.startY + (this.startHeight - newHeight)
          this.windowHeight = newHeight
        }
      }
    },
    onMouseUp() {
      if (this.isDragging || this.isResizing) {
        this.dragStartX = event.clientX - this.windowX
        this.dragStartY = event.clientY - this.windowY
      }
      this.isDragging = false
      this.isResizing = false
      this.resizeDirection = ''
    }
  }
}
</script>

<style scoped>
.window {
  position: absolute;
  background: white;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  user-select: none;
  min-width: 200px;
  min-height: 150px;
}

.window-header {
  height: 32px;
  background: linear-gradient(90deg, #4a90e2, #357abd);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  cursor: move;
  color: white;
}

.window-title {
  font-size: 14px;
  font-weight: 500;
  pointer-events: none;
}

.window-controls {
  display: flex;
  gap: 4px;
}

.control-btn {
  width: 20px;
  height: 20px;
  border: none;
  border-radius: 3px;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.control-btn.minimize {
  background: #ffc107;
  color: #333;
}

.control-btn.maximize {
  background: #28a745;
  color: white;
}

.control-btn.close {
  background: #dc3545;
  color: white;
}

.control-btn:hover {
  opacity: 0.8;
}

.window-content {
  height: calc(100% - 32px);
  overflow: auto;
  background: white;
}

.resize-handle {
  position: absolute;
  background: transparent;
}

.resize-n {
  top: 0;
  left: 8px;
  right: 8px;
  height: 4px;
  cursor: n-resize;
}

.resize-s {
  bottom: 0;
  left: 8px;
  right: 8px;
  height: 4px;
  cursor: s-resize;
}

.resize-e {
  top: 8px;
  right: 0;
  bottom: 8px;
  width: 4px;
  cursor: e-resize;
}

.resize-w {
  top: 8px;
  left: 0;
  bottom: 8px;
  width: 4px;
  cursor: w-resize;
}

.resize-ne {
  top: 0;
  right: 0;
  width: 8px;
  height: 8px;
  cursor: ne-resize;
}

.resize-nw {
  top: 0;
  left: 0;
  width: 8px;
  height: 8px;
  cursor: nw-resize;
}

.resize-se {
  bottom: 0;
  right: 0;
  width: 8px;
  height: 8px;
  cursor: se-resize;
}

.resize-sw {
  bottom: 0;
  left: 0;
  width: 8px;
  height: 8px;
  cursor: sw-resize;
}
</style>