import { createMachine, interpret } from "xstate";

const elBox = document.querySelector("#box");

const machine = {
  initial: "inactive",
  states: {
    inactive: {
      on: {
        TOGGLE: "active",
      },
    },
    active: {
      on: {
        TOGGLE: "inactive",
      },
    },
  },
};

const toggleMachine = createMachine(machine);
const toggleService = interpret(toggleMachine);
// Determine the next value of `currentState`
toggleService.onTransition((state) => {
  console.log(state);
  elBox.dataset.state = state.value;
});

toggleService.start();

elBox.addEventListener("click", () => {
  // send a click event
  toggleService.send({ type: "TOGGLE" });
});

// toggleService.stop()
