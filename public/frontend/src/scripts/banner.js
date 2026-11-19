gsap.registerPlugin(Draggable);
gsap.registerPlugin(InertiaPlugin);

function movivel() {
  forEach(document.getElementById("banner").chi)

  Draggable.create(".movivel", {
    type: "x,y",
    inertia: true,
    bounds: ".box",
  });
}

Draggable.create(".giravel", {
  type: "rotation",
  inertia: true,
});
