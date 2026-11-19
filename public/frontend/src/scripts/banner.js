gsap.registerPlugin(Draggable);
gsap.registerPlugin(InertiaPlugin);

Draggable.create(".movivel", {
  type: "x,y",
  inertia: true,
});
