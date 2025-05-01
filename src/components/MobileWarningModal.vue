<template>
  <div class="mobile-warning" v-if="isVisible">
    <div class="mobile-warning__content">
      <h2>Desktop Experience Recommended</h2>
      <p>This ERD tool is designed for optimal use on desktop devices. Some features may be limited on mobile.</p>
      <div class="mobile-warning__actions">
        <button @click="hideModal" class="mobile-warning__button">I understand</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const isVisible = ref(false);

onMounted(() => {
  if (window.innerWidth < 992) {
    const hasShownWarning = localStorage.getItem('erd-mobile-warning-shown');
    if (!hasShownWarning) {
      isVisible.value = true;
    }
  }
});

const hideModal = () => {
  isVisible.value = false;
  localStorage.setItem('erd-mobile-warning-shown', 'true');
};
</script>

<style lang="scss">
@use '../assets/scss/base/variables' as *;

.mobile-warning {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  
  &__content {
    background-color: white;
    border-radius: 8px;
    padding: 1.5rem;
    width: 90%;
    max-width: 400px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    
    h2 {
      margin-top: 0;
      font-size: 1.25rem;
    }
    
    p {
      margin-bottom: 1.5rem;
      line-height: 1.5;
    }
  }
  
  &__actions {
    display: flex;
    justify-content: flex-end;
  }
  
  &__button {
    background-color: $color-primary;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    
    &:hover {
      background-color: darken($color-primary, 5%);
    }
  }
}
</style>
