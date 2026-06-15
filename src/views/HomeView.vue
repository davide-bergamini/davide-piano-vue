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
          <span v-for="n in 14" :key="`w${n}`"></span>
        </div>

        <div class="black-keys">
          <span class="black-key key-cs"></span>
          <span class="black-key key-ds"></span>

          <span class="black-key key-fs"></span>
          <span class="black-key key-gs"></span>
          <span class="black-key key-as"></span>

          <span class="black-key key-cs-2"></span>
          <span class="black-key key-ds-2"></span>

          <span class="black-key key-fs-2"></span>
          <span class="black-key key-gs-2"></span>
          <span class="black-key key-as-2"></span>
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
  position: relative;
  display: flex;
  height: 100%;
  gap: 0;
  background: #111;
}

.keys span {
  flex: 1;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 0 0 4px 4px;
  animation: key-press 1s infinite;
}

.keys span:nth-child(2n) {
  animation-delay: 0.15s;
}

.keys span:nth-child(3n) {
  animation-delay: 0.3s;
}

.black-keys {
  position: absolute;
  top: 12px;
  left: 12px;
  width: 226px;
  height: 38px;
  pointer-events: none;
}

.black-key {
  position: absolute;
  width: 10px;
  height: 36px;
  background: #050505;
  border-radius: 0 0 3px 3px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.55);
}

/*
  Larghezza tastiera bianca interna: 226px
  14 tasti bianchi = circa 16.14px ciascuno.
  I tasti neri stanno tra:
  C-D, D-E, F-G, G-A, A-B
*/

/* prima ottava */
.key-cs {
  left: 11px;
}

.key-ds {
  left: 27px;
}

.key-fs {
  left: 59px;
}

.key-gs {
  left: 75px;
}

.key-as {
  left: 91px;
}

/* seconda ottava */
.key-cs-2 {
  left: 124px;
}

.key-ds-2 {
  left: 140px;
}

.key-fs-2 {
  left: 172px;
}

.key-gs-2 {
  left: 188px;
}

.key-as-2 {
  left: 204px;
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
