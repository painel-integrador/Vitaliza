gsap.registerPlugin(Draggable);
gsap.registerPlugin(InertiaPlugin);

Draggable.create(".movivel", {
  type: "x,y",
  inertia: true,
  bounds: ".box",
});

Draggable.create(".giravel", {
  type: "rotation",
  inertia: true,
});
