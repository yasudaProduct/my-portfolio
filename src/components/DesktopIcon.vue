<template>
  <div 
    class="desktop-icon"
    :style="{ left: x + 'px', top: y + 'px' }"
    @click="$emit('click')"
    @dblclick="$emit('click')"
  >
    <div class="icon-image">{{ icon }}</div>
    <div class="icon-label">{{ name }}</div>
  </div>
</template>

<script>
export default {
  name: 'DesktopIcon',
  props: {
    icon: String,
    name: String,
    x: Number,
    y: Number
  },
  emits: ['click']
}
</script>

<style scoped>
.desktop-icon {
  position: absolute;
  width: 80px;
  height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.desktop-icon:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.desktop-icon:active {
  background-color: rgba(255, 255, 255, 0.2);
}

.icon-image {
  font-size: 32px;
  margin-bottom: 4px;
}

.icon-label {
  font-size: 12px;
  color: white;
  text-align: center;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
  word-wrap: break-word;
  max-width: 70px;
}
</style>