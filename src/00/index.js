import { createMachine } from "xstate";

const elOutput = document.querySelector("#output");

function output(object) {
  elOutput.innerHTML = JSON.stringify(object, null, 2);
}

const machine = {
  initial: "idle",
  states: {
    idle: {
      on: {
        FETCH: "pending",
      },
    },
    pending: {
      on: {
        RESOLVE: "resolved",
        REJECT: "rejected",
      },
    },
    resolved: {},
    rejected: {},
  },
};

let currentState = machine.initial;
// based on current state and event to get next state
function transition(state, event) {
  return machine.states[state]?.on?.[event] || state;
}

// Interpreter: reset current state based on transition
const send = (event) => {
  const nextState = transition(currentState, event);
  currentState = nextState;
  console.log(currentState);
  return currentState;
};

window.send = send;
