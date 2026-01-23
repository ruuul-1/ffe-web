/**
 * HERO VIDEO SWIPER
 * - Sincroniza CTA (texto/enlace) con el slide activo
 * - Reproduce solo el vídeo del slide visible y avanza al terminar
 * - Repite desde el primer slide al finalizar el último
 * - Muestra el CTA con retardo (7s) en cada slide
 */

document.addEventListener("DOMContentLoaded", () => {
    // CTA
    const btn = document.getElementById("hero-btn");
    const ctaWrap = document.getElementById("hero-cta-wrap");

    // Swiper (instancia creada por theme.js)
    const heroSwiperEl = document.querySelector(".swiper-container.swiper-fullscreen .swiper");
    if (!heroSwiperEl) return;

    let ctaTimer = null;

    // Espera a que Swiper esté inicializado por el theme
    const wait = setInterval(() => {
        const sw = heroSwiperEl.swiper;
        if (!sw) return;
        clearInterval(wait);

        // Actualiza texto/enlace del CTA desde data-attributes del slide activo
        const updateCTA = () => {
            if (!btn) return;

            const slide = sw.slides[sw.activeIndex];
            const text = slide?.dataset?.ctaText || "Saber más";
            const link = slide?.dataset?.ctaLink || "#";

            btn.textContent = text;
            btn.href = link;
        };

        // Oculta el CTA y lo muestra tras 7s, reiniciando la animación
        const scheduleCTA = () => {
            if (!btn || !ctaWrap) return;

            if (ctaTimer) clearTimeout(ctaTimer);

            btn.classList.remove("hero-cta-shown");
            btn.classList.add("hero-cta-hidden");

            ctaWrap.classList.remove("animate__slideInUp");
            void ctaWrap.offsetWidth; // reflow para reiniciar la animación
            ctaWrap.classList.add("animate__slideInUp");

            ctaTimer = setTimeout(() => {
                btn.classList.remove("hero-cta-hidden");
                btn.classList.add("hero-cta-shown");
            }, 1000);
        };

        // Reproduce solo el vídeo del slide activo y avanza al terminar
        const playActiveVideo = () => {
            document
                .querySelectorAll(".swiper-container.swiper-fullscreen .bg-video")
                .forEach(v => {
                    v.pause();
                    v.currentTime = 0;
                    v.onended = null;
                });

            const activeSlide = sw.slides[sw.activeIndex];
            const video = activeSlide?.querySelector("video");
            if (!video) return;

            video.onended = () => {
                const lastRealIndex = sw.slides.length - 1;
                if (sw.activeIndex >= lastRealIndex) {
                    sw.slideTo(0);
                } else {
                    sw.slideNext();
                }
            };

            video.play().catch(() => {});
        };

        // Handler único para cambios de slide
        const onSlideChanged = () => {
            updateCTA();
            scheduleCTA();
            playActiveVideo();
        };

        onSlideChanged();
        sw.on("slideChange", onSlideChanged);
    }, 50);
});
