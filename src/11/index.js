import { createMachine, interpret } from "xstate";

const elApp = document.querySelector("#app");
const elOffButton = document.querySelector("#offButton");
const elOnButton = document.querySelector("#onButton");
const elModeButton = document.querySelector("#modeButton");

const displayMachine = createMachine(
  {
    initial: "hidden",
    states: {
      hidden: {
        on: {
          TURN_ON: "visible.hist",
        },
      },
      visible: {
        // Add parallel states here for:
        type: "parallel",
        states: {
          hist: {
            type: "history",
            history: "deep",
          },
          // - mode (light or dark)
          mode: {
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
            },
          },
          // - brightness (bright or dim)
          brightness: {
            initial: "bright",
            states: {
              bright: {
                after: {
                  TIMEOUT: {
                    target: "dim",
                  },
                },
              },
              dim: {
                on: {
                  SWITCH: "bright",
                },
              },
            },
          },
        },
        on: {
          TURN_OFF: "hidden",
        },
        // See the README for how the child states of each of those
        // parallel states should transition between each other.
      },
    },
  },
  {
    delays: {
      TIMEOUT: 2000,
    },
  }
);

const displayService = interpret(displayMachine)
  .onTransition((state) => {
    elApp.dataset.state = state.toStrings().join(" ");
  })
  .start();

elOnButton.addEventListener("click", () => {
  displayService.send("TURN_ON");
});

elOffButton.addEventListener("click", () => {
  displayService.send("TURN_OFF");
});

elModeButton.addEventListener("click", () => {
  displayService.send("SWITCH");
});
