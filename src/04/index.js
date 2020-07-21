import { assign, createMachine, interpret } from "xstate";

const elBox = document.querySelector("#box");

const setPoint = (context, event) => {
  // Set the data-point attribute of `elBox`
  // ...
  elBox.dataset.point = `${event.clientX} - ${event.clientY} - ${context.count}`;
};

const countAssign = assign({
  count: (context, event) => {
    return context.count + 1;
  },
});

const machine = createMachine(
  {
    initial: "idle",
    context: {
      count: 0,
    },
    states: {
      idle: {
        on: {
          mousedown: {
            // Add your action here
            // ...
            target: "dragging",
            actions: [setPoint, countAssign],
          },
        },
      },
      dragging: {
        on: {
          mouseup: {
            target: "idle",
          },
        },
      },
    },
  }
  /*{
    actions: {
      setPoint: () => {
        console.log("set point");
      },
    },
  }*/
);

const service = interpret(machine);

service.onTransition((state) => {
  elBox.dataset.state = state.value;
});

service.start();

elBox.addEventListener("mousedown", (event) => {
  service.send(event);
});

elBox.addEventListener("mouseup", (event) => {
  service.send(event);
});
