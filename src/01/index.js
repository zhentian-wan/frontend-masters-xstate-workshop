import { createMachine, interpret } from "xstate";

const elBox = document.querySelector("#box");

const machine = {
  initial: "inactive",
  states: {
    inactive: {
      on: {
        mousedown: "active",
      },
    },
    active: {
      on: {
        mouseup: "inactive",
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

elBox.addEventListener("mousedown", (event) => {
  // send a click event
  toggleService.send(event); // {type: 'mousedown'}
});

elBox.addEventListener("mouseup", () => {
  // send a click event
  toggleService.send(event); // {type: 'mouseup'}
});

// toggleService.stop()
