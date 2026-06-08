<template>
  <section class="home-animation">
    <div class="pianist">
      <div class="head"></div>

      <div class="body">
        <div class="arm arm-left"></div>
        <div class="arm arm-right"></div>
      </div>

      <div class="piano">
        <div class="keys">
          <span v-for="n in 14" :key="n"></span>
        </div>
      </div>
    </div>

    <h2>MIDI Piano</h2>
    <p>Brani classici per pianoforte con player MIDI.</p>
  </section>
</template>

<style scoped>
.home-animation {
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 22px;
  text-align: center;
}

.pianist {
  position: relative;
  width: 320px;
  height: 240px;
}

.head {
  position: absolute;
  top: 20px;
  left: 135px;
  width: 54px;
  height: 54px;
  background: #f0c7a7;
  border-radius: 50%;
}

.body {
  position: absolute;
  top: 78px;
  left: 120px;
  width: 80px;
  height: 90px;
  background: #212529;
  border-radius: 18px 18px 8px 8px;
}

.arm {
  position: absolute;
  top: 34px;
  width: 92px;
  height: 14px;
  background: #212529;
  border-radius: 20px;
  transform-origin: top left;
}

.arm-left {
  left: -70px;
  animation: play-left 0.6s infinite alternate;
}

.arm-right {
  left: 58px;
  animation: play-right 0.55s infinite alternate;
}

.piano {
  position: absolute;
  bottom: 20px;
  left: 35px;
  width: 250px;
  height: 70px;
  background: #111;
  border-radius: 10px;
  padding: 12px;
}

.keys {
  display: flex;
  height: 100%;
  gap: 3px;
}

.keys span {
  flex: 1;
  background: white;
  border-radius: 0 0 4px 4px;
  animation: key-press 1s infinite;
}

.keys span:nth-child(2n) {
  animation-delay: 0.15s;
}

.keys span:nth-child(3n) {
  animation-delay: 0.3s;
}

@keyframes play-left {
  from {
    transform: rotate(12deg);
  }

  to {
    transform: rotate(-8deg);
  }
}

@keyframes play-right {
  from {
    transform: rotate(-10deg);
  }

  to {
    transform: rotate(10deg);
  }
}

@keyframes key-press {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(4px);
  }
}

.home-animation h2 {
  margin: 0;
  font-size: 2.2rem;
}

.home-animation p {
  color: #6c757d;
}
</style>
