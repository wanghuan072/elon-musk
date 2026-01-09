<template>
  <article class="product-card" role="article">
    <div class="product-image">
      <img
        :src="product.image"
        :alt="`${product.name} product image`"
        class="product-img"
      />
      <div class="image-overlay" aria-hidden="true"></div>
    </div>

    <div class="product-info">
      <h3 class="product-name">{{ product.name }}</h3>
      <p class="product-price" aria-label="Product price">
        {{ formatCurrency(product.price) }}
      </p>
    </div>

    <div class="product-controls" role="group" aria-label="Product purchase controls">
      <button
        class="control-btn sell-btn"
        @click="handleSell"
        :disabled="quantity === 0"
        aria-label="Sell one unit of this product"
        :aria-describedby="`quantity-${product.id}`"
      >
        Sell
      </button>

      <div
        class="quantity-input-container"
        :id="`quantity-${product.id}`"
        aria-label="Quantity input"
      >
        <input
          type="number"
          class="quantity-input"
          :value="quantity"
          @input="handleQuantityChange"
          @blur="handleQuantityBlur"
          min="0"
          step="1"
          placeholder="0"
          :aria-label="`Set quantity for ${product.name}`"
        />
      </div>

      <button
        class="control-btn buy-btn"
        @click="handleBuy"
        :disabled="!canAfford"
        aria-label="Buy one unit of this product"
        :aria-describedby="`quantity-${product.id}`"
      >
        Buy
      </button>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { useGameStore } from '../stores/gameStore'

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
})

const gameStore = useGameStore()
const quantity = computed(() => gameStore.getProductQuantity(props.product.id))

const canAfford = computed(() => {
  const totalCost = props.product.price * 1 // 每次只购买1个
  return gameStore.balance >= totalCost
})

// 处理数量输入变化
const handleQuantityChange = (event) => {
  const inputValue = event.target.value
  const newQuantity = parseInt(inputValue) || 0
  const currentQuantity = quantity.value

  // 如果输入值无效，直接返回
  if (isNaN(newQuantity) || newQuantity < 0) {
    return
  }

  const difference = newQuantity - currentQuantity

  if (difference > 0) {
    // 需要购买更多
    const cost = props.product.price * difference
    if (gameStore.balance >= cost) {
      gameStore.buyProduct(props.product.id, difference)
    } else {
      // 余额不足，计算最大可购买数量
      const maxAffordable = Math.floor(gameStore.balance / props.product.price)
      const maxQuantity = currentQuantity + maxAffordable
      event.target.value = maxQuantity
      if (maxAffordable > 0) {
        gameStore.buyProduct(props.product.id, maxAffordable)
      }
    }
  } else if (difference < 0) {
    // 需要出售
    const sellQuantity = Math.abs(difference)
    if (currentQuantity >= sellQuantity) {
      gameStore.sellProduct(props.product.id, sellQuantity)
    } else {
      // 数量不足，出售所有可用数量
      event.target.value = 0
      gameStore.sellProduct(props.product.id, currentQuantity)
    }
  }
}

// 处理输入框失去焦点
const handleQuantityBlur = (event) => {
  const value = parseInt(event.target.value)
  if (isNaN(value) || value < 0) {
    event.target.value = quantity.value
  }
}

const formatCurrency = (amount) => {
  return gameStore.formatCurrency(amount)
}

// 处理购买 - 增加数量并减少余额
const handleBuy = () => {
  if (gameStore.balance >= props.product.price) {
    gameStore.buyProduct(props.product.id, 1)
  }
}

// 处理出售 - 减少数量并增加余额
const handleSell = () => {
  if (quantity.value > 0) {
    gameStore.sellProduct(props.product.id, 1)
  }
}
</script>

<style scoped>
.product-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-width: 0;
  width: 100%;
}

.product-card:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  border-color: var(--accent);
}

.product-image {
  position: relative;
  aspect-ratio: 1/1;
  overflow: hidden;
  background: #fff;
}

.product-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.4) 100%);
  opacity: 0;
}

.product-info {
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.product-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-price {
  font-size: 18px;
  font-weight: 800;
  color: var(--accent);
  margin: 0;
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', monospace;
}

.product-controls {
  padding: 16px;
  display: flex;
  gap: 8px;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.control-btn {
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  min-width: 50px;
}

.sell-btn {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.sell-btn:hover:not(:disabled) {
  background: var(--danger);
  color: white;
}

.buy-btn {
  background: var(--accent);
  color: white;
}

.buy-btn:hover:not(:disabled) {
  background: var(--accent-2);
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-input-container {
  flex: 1;
}

.quantity-input {
  width: 100%;
  padding: 8px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: var(--text);
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', monospace;
  transition: all 0.3s ease;
}

.quantity-input:focus {
  outline: none;
  border-color: var(--accent);
  background: rgba(255, 255, 255, 0.15);
}

.quantity-input::placeholder {
  color: var(--text-secondary);
  opacity: 0.5;
}

/* 隐藏数字输入框的上下箭头 */
.quantity-input::-webkit-outer-spin-button,
.quantity-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.quantity-input[type='number'] {
  -moz-appearance: textfield;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .product-info {
    margin-bottom: 5px;
  }

  .product-controls {
    gap: 5px;
    flex-direction: column;
  }

  .control-btn {
    padding: 0 8px;
    font-size: 10px;
    width: 100%;
    height: 25px;
  }

  .quantity-input {
    padding: 5px 12px;
    font-size: 14px;
    height: 25px;
  }
}
</style> 