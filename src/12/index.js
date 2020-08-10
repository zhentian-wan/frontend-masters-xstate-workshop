import { createMachine, assign, interpret } from "xstate";

const elBox = document.querySelector("#box");

const randomFetch = () => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      if (Math.random() < 0.5) {
        rej("Fetch failed!");
      } else {
        res("Fetch succeeded!");
      }
    }, 2000);
  });
};

const machine = createMachine({
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
        // cancel the promise
        CANCEL: "idle",
      },
      invoke: {
        // Invoke your promise here.
        // The `src` should be a function that returns the source.
        src: (context, event) => {
          return randomFetch();
        },
        onDone: {
          target: "resolved",
        },
        onError: {
          target: "rejected",
        },
      },
    },
    resolved: {
      // Add a transition to fetch again
      on: {
        FETCH: "pending",
      },
    },
    rejected: {
      // After 2s, retry again
      after: {
        2000: {
          target: "pending",
        },
      },
    },
  },
});

const service = interpret(machine);

service.onTransition((state) => {
  elBox.dataset.state = state.toStrings().join(" ");

  console.log(state);
});

service.start();

elBox.addEventListener("click", (event) => {
  service.send("FETCH");
});

const cancelBtn = document.querySelector("#cancel");
cancelBtn.addEventListener("click", (event) => {
  service.send("CANCEL");
});
