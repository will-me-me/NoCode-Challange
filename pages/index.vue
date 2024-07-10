<template>
  <div class="overflow-hidden">
    <div
      class="d-flex overflow-hidden position-relative justify-center"
      :class="['container']"
      @wheel="handleScrollAndAnimate"
    >
      <div
        class="text-center position-absolute"
        color="#929292"
        :class="[
          'orbit-date',
          animationDirection,
          { 'date-shift': isAnimation },
        ]"
      >
        <p :class="[animationDirection, { 'date-vanish': isAnimation }]">
          {{ dateFormat(firstItemDate()) }}
        </p>
      </div>
      <!-- {{ usersPerOrbit.length }} -->
      <div
        v-for="i in store.userOrbits.length"
        :key="i"
        class="position-absolute d-flex justify-space-evenly align-center"
        :class="[
          'single-orbit',
          animationDirection,
          isAnimation ? `animation-sequence-${i}` : '',
        ]"
        :style="[calcDimensions(i)]"
      >
        <div
          v-for="j in store.userOrbits[i - 1]?.array"
          :key="j"
          class="user-icon position-absolute"
          :style="calcRotation(i, j, true)"
        >
          <v-avatar
            size="48"
            :style="calcRotation(i, j, false)"
            id="v-avatar-imag"
          >
            <!-- Start of Tooltip -->
            <v-tooltip
              theme="#0A0A0A"
              activator="parent"
              location="end"
              ref="tooltip"
            >
              <template v-slot:activator="{ props }">
                <v-img
                  :src="j.img"
                  class="gradient-border"
                  v-bind="props"
                ></v-img>
              </template>
              <v-card flat="flat" width="600" color="#0A0A0A">
                <v-card-title class="d-flex">
                  <v-avatar size="90">
                    <v-img class="gradient-border" :src="j.img"></v-img>
                  </v-avatar>
                  <div class="ml-8" color="white" style="position: inherit">
                    <div
                      style="
                        font-size: 16px;
                        font-weight: 700;
                        line-height: 19.36px;
                        margin-bottom: 5px;
                      "
                    >
                      <p>{{ j.name }}</p>
                    </div>
                    <div class="contact-position">{{ j?.position }}</div>
                    <div class="contact-city">{{ j?.city }}</div>
                    <div class="d-flex align-center">
                      <div>
                        <v-avatar
                          v-for="i in store.MembersIcons"
                          :key="i"
                          :image="i"
                          size="25"
                        >
                        </v-avatar>
                      </div>
                      <div class="more-contacts">
                        <div>Jason Diamond, John Eremic,</div>
                        <div>and 281 other mutual connections</div>
                      </div>
                    </div>
                  </div>
                  <v-spacer></v-spacer>
                  <v-card class="primary-lg" variant="outlined" height="60">
                    <v-avatar size="60">
                      <v-img
                        class="gradient-border"
                        src="./company.png"
                      ></v-img>
                    </v-avatar>
                  </v-card>
                </v-card-title>
                <v-divider></v-divider>

                <v-card-text
                  class="mt-2 d-flex align-center"
                  variant="outlined"
                >
                  <v-icon class="ml-2" size="large">mdi-email </v-icon>
                  <div class="message-head ml-6">Reply from {{ j.name }}</div>
                </v-card-text>
                <div class="reply-body">
                  <div class="message-date">
                    <div>Saturday, November 4 2023 at 9:04 AM EST</div>
                    <div>2 days ago</div>
                  </div>
                </div>
                <v-divider></v-divider>
                <v-card color="transparent" variant="outlined">
                  <v-expansion-panels
                    bg-color="#0A0A0A"
                    variant="inset"
                    :readonly="store.readonly"
                    v-model="store.panel"
                  >
                    <v-expansion-panel
                      :title="j?._orbits_last_message?.message_head"
                      :text="j?._orbits_last_message?.message"
                    >
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-card>
              </v-card>
            </v-tooltip>
            <!-- End of The TooTip -->
          </v-avatar>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { userMainStore } from "@/stores/mainStore";
import { useNuxtApp } from "#app";
const nuxtApp = useNuxtApp();
import { onMounted, ref } from "vue";

const store = userMainStore();
const orbitShift = ref(nuxtApp.$screenHeight >= 1000 ? "200px" : "160px");
const orbitTranslate = ref(`-${orbitShift.value.slice(0, 3) / 2}px`);
const dateShift = ref(`${orbitShift.value.slice(0, 3) / 2 - 12}px`);
const tooltip = ref(false);
const isAnimation = ref(false);
const animationDirection = ref("animation");
const isConnectionInfoVisible = ref(false);

const calcDimensions = (position) => {
  return {
    height: `calc(100% * 2 - ${
      orbitShift.value.slice(0, 3) * (position - 1)
    }px`,
    top: `calc(${orbitShift.value.slice(0, 3) / 2}px * ${position})`,
  };
};

const dateFormat = (date) => {
  if (date === store.fetchDate) {
    return "Today";
  }
  return new Date(date).toLocaleString("en-GB", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

const firstItemDate = () => {
  let date = store.userOrbits[0]?.contact_date;
  return date;
};

const calcRotation = (orbitNum, user, direction) => {
  const listLength = store.userOrbits[orbitNum - 1]?.array.length;
  const halfList = Math.ceil(listLength / 2);
  const userIndex = store.userOrbits[orbitNum - 1]?.array.indexOf(user) + 1;
  const rotateDirection = direction ? "+" : "-";
  let resultingTransform;
  if (orbitNum === 1 && listLength % 2) {
    if (userIndex <= halfList) {
      resultingTransform = `rotate(${
        rotateDirection + (84 / halfList) * userIndex
      }deg)`;
    } else {
      resultingTransform = `rotate(${
        rotateDirection +
        (96 - 84 / halfList + (84 / halfList) * (userIndex - halfList))
      }deg)`;
    }
  } else {
    resultingTransform = `rotate(${
      rotateDirection + (180 / (listLength + 1)) * userIndex
    }deg)`;
  }
  return {
    transform: resultingTransform,
  };
};

const handleScrollAndAnimate = (e) => {
  isConnectionInfoVisible.value = false;
  animationDirection.value = e.deltaY > 0 ? "animation" : "reverse-animation";
  if (!isAnimation.value) {
    animateOrbitShift(animationDirection.value);
  }
};

// const animateOrbitShift = async (direction = "animation") => {
//   if (direction === "animation" && store.laterBuffer.length) {
//     isAnimation.value = true;
//     setTimeout(async () => {
//       store.priorBuffer.push(store.userOrbits.shift());
//       store.userOrbits.push(store.laterBuffer[0]);
//       store.laterBuffer.shift();
//       let currentDate = new Date(store.fetchDate);
//       currentDate.setDate(currentDate.getDate() - 1);
//       store.fetchDate = currentDate.toISOString().slice(0, 10);
//       console.log(firstItemDate());
//       const arr = await store.getApiData(store.fetchDate);
//       store.laterBuffer = arr;
//       isAnimation.value = false;
//     }, 990);
//   } else if (store.priorBuffer.length) {
//     store.userOrbits.unshift(store.priorBuffer.pop());
//     store.laterBuffer.unshift(store.userOrbits.pop());
//     isAnimation.value = true;
//     setTimeout(() => {
//       isAnimation.value = false;
//     }, 990);
//   }
// };

const animateOrbitShift = async (direction = "animation") => {
  try {
    // Ensure store.laterBuffer is always an array
    if (!Array.isArray(store.laterBuffer)) {
      store.laterBuffer = [];
      console.warn(
        "store.laterBuffer was not initialized, initializing now as an empty array."
      );
    }
    // Debug
    console.log("Initial store.laterBuffer:", store.laterBuffer);
    if (direction === "animation" && store.laterBuffer.length) {
      isAnimation.value = true;
      setTimeout(async () => {
        store.priorBuffer.push(store.userOrbits.shift());
        store.userOrbits.push(store.laterBuffer[0]);
        store.laterBuffer.shift();
        // ##DEBUG
        console.log("After shifting buffers:", {
          priorBuffer: store.priorBuffer,
          userOrbits: store.userOrbits,
          laterBuffer: store.laterBuffer,
        });

        let currentDate = new Date(store.fetchDate);
        // Reduce by 1 day
        currentDate.setDate(currentDate.getDate() - 1);
        store.fetchDate = currentDate.toISOString().slice(0, 10);
        // Debug
        console.log("Fetching new data for date:", store.fetchDate);
        const arr = await store.getApiData(store.fetchDate);
        console.log("here comes arr" + " ", arr);
        store.laterBuffer = arr;
        console.log(store.laterBuffer);
        // store.userOrbits = arr;
        // Debug
        console.log("After fetching new data:", store.laterBuffer);

        isAnimation.value = false;
      }, 900);
    } else {
      store.userOrbits.unshift(store.priorBuffer.pop());
      console.log(store.userOrbits);
      store.laterBuffer.unshift(store.userOrbits.pop());
      isAnimation.value = true;
      setTimeout(() => {
        isAnimation.value = false;
      }, 900);
    }
  } catch (error) {
    console.error("Error in animateOrbitShift:", error);
  }
};

onMounted(async () => {
  await store.getApiData(store.fetchDate);
});
</script>

<style scoped>
.gradient-border {
  background-image: linear-gradient(180deg, #ffffff 0%, #000000 100%);
  background-origin: border-box;
  box-shadow: inset 0 100vw var(--vt-c-black);
  border: 1px solid transparent;
}

.single-orbit {
  height: 100%;
  border-radius: 100%;
  aspect-ratio: 1;
  background-image: linear-gradient(
    180deg,
    #ffffff -6.6%,
    rgba(255, 255, 255, 0) 46.31%
  );
  background-origin: border-box;
  box-shadow: inset 0 100vw var(--vt-c-black);
  border: 1px solid transparent;
}

.container {
  padding-top: 30px;
  height: 100vh;
}

.orbit-date {
  top: v-bind(dateShift);
  background-color: var(--vt-c-black);
  z-index: 10;
}

.user-icon {
  top: 0px;
  left: 0px;
  height: 50%;
  width: 50%;
  transform-origin: bottom right;
  pointer-events: none;
}

#v-avatar-imag {
  z-index: 100;
  position: absolute;
  bottom: -30px;
  left: -30px;
  height: 60px;
  width: 60px;
  pointer-events: all;
}

.animation {
  animation-duration: 1s;
  animation-timing-function: linear;
}

.reverse-animation {
  animation-duration: 1s;
  animation-timing-function: linear;
  animation-direction: reverse;
}

.date-shift {
  animation-name: middle-orbit;
}

.date-vanish {
  animation-name: vanish-animation;
}

.invisible {
  opacity: 0;
}

.animation-sequence-1 {
  animation-name: outer-orbit, scale-factor-1;
}

.animation-sequence-2 {
  animation-name: middle-orbit, scale-factor-2;
}

.animation-sequence-3 {
  animation-name: middle-orbit, scale-factor-3;
}

.animation-sequence-4 {
  animation-name: middle-orbit, scale-factor-4;
}

.animation-sequence-5 {
  animation-name: middle-orbit, scale-factor-5;
}

.animation-sequence-6 {
  animation-name: middle-orbit, scale-factor-6;
}

.animation-sequence-7 {
  animation-name: middle-orbit, scale-factor-7;
}

.animation-sequence-8 {
  animation-name: inner-orbit, scale-factor-8;
}

@keyframes middle-orbit {
  100% {
    transform: translateY(v-bind(orbitTranslate));
  }
}

@keyframes outer-orbit {
  100% {
    transform: translateY(v-bind(orbitTranslate));
    opacity: 0;
  }
}

@keyframes inner-orbit {
  100% {
    transform: translateY(v-bind(orbitTranslate));
    opacity: 1;
  }
}

@keyframes vanish-animation {
  100% {
    opacity: 0;
  }
}

@keyframes scale-factor-1 {
  100% {
    height: calc(100% * 2 + v-bind(orbitShift));
  }
}

@keyframes scale-factor-2 {
  100% {
    height: calc(100% * 2);
  }
}

@keyframes scale-factor-3 {
  100% {
    height: calc(100% * 2 - v-bind(orbitShift) * 2 + v-bind(orbitShift));
  }
}

@keyframes scale-factor-4 {
  100% {
    height: calc(100% * 2 - v-bind(orbitShift) * 3 + v-bind(orbitShift));
  }
}

@keyframes scale-factor-5 {
  100% {
    height: calc(100% * 2 - v-bind(orbitShift) * 4 + v-bind(orbitShift));
  }
}

@keyframes scale-factor-6 {
  100% {
    height: calc(100% * 2 - v-bind(orbitShift) * 5 + v-bind(orbitShift));
  }
}

@keyframes scale-factor-7 {
  100% {
    height: calc(100% * 2 - v-bind(orbitShift) * 6 + v-bind(orbitShift));
  }
}

@keyframes scale-factor-8 {
  100% {
    height: calc(100% * 2 - v-bind(orbitShift) * 7 + v-bind(orbitShift));
  }
}
</style>
