import { createMachine, interpret } from "xstate";

const elApp = document.querySelector("#app");
const elOffButton = document.querySelector("#offButton");
const elOnButton = document.querySelector("#onButton");
const elModeButton = document.querySelector("#modeButton");

const displayMachine = createMachine({
  initial: "hidden",
  states: {
    hidden: {
      on: {
        TURN_ON: "visible.hist",
      },
    },
    visible: {
      initial: "light",
      states: {
        light: {
          on: {
            SWITCH: {
              target: "dark",
            },
          },
        },
        dark: {
          on: {
            SWITCH: {
              target: "light",
            },
          },
        },
        hist: {
          type: "history",
        },
      },
      on: {
        TURN_OFF: "hidden",
      },
    },
  },
});

const displayService = interpret(displayMachine)
  .onTransition((state) => {
    elApp.dataset.state = state.toStrings().join(" ");
  })
  .start();

// Add event listeners for:
// - clicking elOnButton (TURN_ON)
// - clicking elOffButton (TURN_OFF)
// - clicking elModeButton (SWITCH)

elOnButton.addEventListener("click", () => {
  displayService.send("TURN_ON");
});

elOffButton.addEventListener("click", () => {
  displayService.send("TURN_OFF");
});

elModeButton.addEventListener("click", () => {
  displayService.send("SWITCH");
});
