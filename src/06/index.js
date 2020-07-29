import { createMachine, assign, interpret } from "xstate";

const elBox = document.querySelector("#box");
const elBody = document.body;

const assignPoint = assign({
  px: (context, event) => event.clientX,
  py: (context, event) => event.clientY,
});

const assignPosition = assign({
  x: (context, event) => {
    return context.x + context.dx;
  },
  y: (context, event) => {
    return context.y + context.dy;
  },
  dx: 0,
  dy: 0,
  px: 0,
  py: 0,
});

const assignDelta = assign({
  dx: (context, event) => {
    return event.clientX - context.px;
  },
  dy: (context, event) => {
    return event.clientY - context.py;
  },
});

const resetPosition = assign({
  dx: 0,
  dy: 0,
  px: 0,
  py: 0,
});

const countDrags = assign({
  drags: (context) => {
    return context.drags + 1;
  },
});

const machine = createMachine(
  {
    initial: "idle",
    context: {
      x: 0,
      y: 0,
      dx: 0,
      dy: 0,
      px: 0,
      py: 0,
      drags: 0,
    },
    states: {
      idle: {
        on: {
          // if use Array with cond,
          // for first cond which is false
          // then it continue to second state 'draggedOut'
          mousedown: [
            {
              cond: "noMoreThanFiveTimes",
              actions: assignPoint,
              target: "dragging",
            },
            {
              target: "draggedOut",
            },
          ],
        },
      },
      draggedOut: {
        type: "final",
      },
      dragging: {
        entry: countDrags,
        on: {
          mousemove: {
            actions: assignDelta,
          },
          mouseup: {
            actions: [assignPosition],
            target: "idle",
          },
          "keyup.escape": {
            target: "idle",
            actions: resetPosition,
          },
        },
      },
    },
  },
  {
    guards: {
      noMoreThanFiveTimes: (context) => {
        return context.drags >= 5 ? false : true;
      },
    },
  }
);

const service = interpret(machine);

service.onTransition((state) => {
  if (state.changed) {
    console.log(state);

    elBox.dataset.state = state.value;
    elBox.dataset.drags = state.context.drags;

    elBox.style.setProperty("--dx", state.context.dx);
    elBox.style.setProperty("--dy", state.context.dy);
    elBox.style.setProperty("--x", state.context.x);
    elBox.style.setProperty("--y", state.context.y);
  }
});

service.start();

elBox.addEventListener("mousedown", (event) => {
  service.send(event);
});

elBody.addEventListener("mousemove", (event) => {
  service.send(event);
});

elBody.addEventListener("mouseup", (event) => {
  service.send(event);
});

elBody.addEventListener("keyup", (e) => {
  if (e.key === "Escape") {
    service.send("keyup.escape");
  }
});
