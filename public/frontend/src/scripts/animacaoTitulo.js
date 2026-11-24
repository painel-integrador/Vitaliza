gsap.registerPlugin(ScrollTrigger, SplitText);

document.querySelectorAll("h2, h3").forEach((titulo) => {
  SplitText.create(titulo, {
    type: "words",
    autoSplit: true, // refaz o split em resize / troca de fonte
    onSplit(self) {
      gsap.set(self.words, { opacity: 0.1, top: 8 });

      return gsap.to(self.words, {
        opacity: 1,
        top: 0,
        ease: "none",
        duration: 0.3,
        stagger: 0.2, // palavra por palavra
        scrollTrigger: {
          trigger: titulo,
          start: "top 99%", // a partir de 1% começa a transicão
          end: "top 65%",
          scrub: true,
        },
      });
    },
  });
});
