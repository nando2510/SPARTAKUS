(() => {
  "use strict";

  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".primary-nav");
  const contactForm = document.querySelector("#contact-form");
  const whatsappNumber = "573157210718";

  const updateHeader = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const closeMenu = () => {
    if (!menuToggle || !navigation) return;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menú de navegación");
    navigation.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  };

  menuToggle?.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Abrir menú de navegación" : "Cerrar menú de navegación");
    navigation?.classList.toggle("is-open", !isOpen);
    document.body.classList.toggle("menu-open", !isOpen);
  });

  navigation?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  const emailButton = document.querySelector("[data-copy-email]");
  emailButton?.addEventListener("click", async () => {
    const email = "nandoalahia@gmail.com";
    const status = document.querySelector(".copy-status");
    try {
      await navigator.clipboard.writeText(email);
      status.textContent = "Correo copiado";
    } catch (error) {
      status.textContent = "No fue posible copiarlo. Selecciona el correo para copiarlo.";
    }
  });

  if (!contactForm) return;
  const fields = {
    name: {
      input: contactForm.elements.namedItem("name"),
      message: document.querySelector("#name-error"),
      validate: (value) => value.trim().length >= 2 ? "" : "Escribe tu nombre completo (mínimo 2 caracteres)."
    },
    phone: {
      input: contactForm.elements.namedItem("phone"),
      message: document.querySelector("#phone-error"),
      validate: (value) => /^[+\d][\d\s().-]{6,19}$/.test(value.trim()) ? "" : "Ingresa un teléfono válido de al menos 7 dígitos."
    },
    service: {
      input: contactForm.elements.namedItem("service"),
      message: document.querySelector("#service-error"),
      validate: (value) => value ? "" : "Selecciona el servicio que te interesa."
    },
    message: {
      input: contactForm.elements.namedItem("message"),
      message: document.querySelector("#message-error"),
      validate: (value) => value.trim().length >= 10 ? "" : "Cuéntanos un poco más (mínimo 10 caracteres)."
    }
  };

  const validateField = (field) => {
    const error = field.validate(field.input.value);
    const wrapper = field.input.closest(".form-field");
    field.message.textContent = error;
    wrapper.classList.toggle("has-error", Boolean(error));
    field.input.setAttribute("aria-invalid", String(Boolean(error)));
    return !error;
  };

  Object.values(fields).forEach((field) => {
    field.input.addEventListener("input", () => validateField(field));
    field.input.addEventListener("change", () => validateField(field));
  });

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const isValid = Object.values(fields).map(validateField).every(Boolean);
    const feedback = document.querySelector("#form-feedback");
    if (!isValid) {
      feedback.textContent = "Revisa los campos marcados antes de continuar.";
      contactForm.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }

    const formData = new FormData(contactForm);
    const message = [
      "Hola SPARTAKUS, quiero más información.",
      "",
      `Nombre: ${formData.get("name").toString().trim()}`,
      `Teléfono: ${formData.get("phone").toString().trim()}`,
      `Servicio: ${formData.get("service").toString()}`,
      `Mensaje: ${formData.get("message").toString().trim()}`
    ].join("\n");
    feedback.textContent = "Abriendo WhatsApp con tu mensaje...";
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  });
})();
