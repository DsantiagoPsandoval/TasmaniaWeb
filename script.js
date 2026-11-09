document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. Header Scroll Effect --- */
    const header = document.getElementById('main-header');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();


    /* --- 2. Mobile Drawer Navigation --- */
    const menuToggle = document.getElementById('menu-toggle');
    const menuClose = document.getElementById('menu-close');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuBackdrop = document.getElementById('menu-backdrop');
    const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('nav a') : [];

    const openMenu = () => {
        mobileMenu.classList.remove('hidden');
        menuBackdrop.classList.remove('hidden');
        setTimeout(() => {
            mobileMenu.classList.add('open');
            menuToggle.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
        }, 10);
    };

    const closeMenu = () => {
        mobileMenu.classList.remove('open');
        menuBackdrop.classList.add('hidden');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        setTimeout(() => {
            mobileMenu.classList.add('hidden');
        }, 400);
    };

    if (menuToggle) menuToggle.addEventListener('click', openMenu);
    if (menuClose) menuClose.addEventListener('click', closeMenu);
    if (menuBackdrop) menuBackdrop.addEventListener('click', closeMenu);
    
    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('open')) {
            closeMenu();
        }
    });


    /* --- 3. Scroll Reveal Fallback Strategy --- */
    const animatedElements = document.querySelectorAll('.timeline-item, .service-card, .portfolio-item');
    animatedElements.forEach(el => el.classList.add('reveal-on-scroll'));

    if (!CSS.supports('(animation-timeline: view()) and (animation-range: entry)')) {
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -10% 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }


    /* --- 4. Portfolio Category Filtering & Preview Video Handlers --- */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => {
                b.classList.remove('active', 'bg-brand-orange', 'text-white', 'border-brand-orange');
                b.classList.add('border-brand-greyDark', 'text-brand-greyLight');
            });

            btn.classList.add('active', 'bg-brand-orange', 'text-white', 'border-brand-orange');
            btn.classList.remove('border-brand-greyDark', 'text-brand-greyLight');

            const filterValue = btn.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                
                if (filterValue === 'all' || itemCategory === filterValue) {
                    item.classList.remove('hidden-item');
                    item.classList.add('show-item');
                } else {
                    item.classList.remove('show-item');
                    item.classList.add('hidden-item');
                }
            });
        });
    });

    /* --- Interactive Shoot Hotspots & Detail Cards --- */
    const hotspotWrappers = document.querySelectorAll('.hotspot-wrapper');
    const hotspotCards = document.querySelectorAll('.hotspot-card');
    const mainShootPhoto = document.getElementById('main-shoot-photo');

    if (hotspotWrappers.length && hotspotCards.length) {
        hotspotWrappers.forEach(hw => {
            hw.addEventListener('mouseenter', () => {
                const id = hw.getAttribute('data-hotspot');
                hotspotCards.forEach(c => {
                    if (c.getAttribute('data-card') === id) {
                        c.classList.add('border-brand-orange', 'bg-brand-orange/15');
                    } else {
                        c.classList.remove('border-brand-orange', 'bg-brand-orange/15');
                    }
                });
            });
            hw.addEventListener('mouseleave', () => {
                hotspotCards.forEach(c => c.classList.remove('border-brand-orange', 'bg-brand-orange/15'));
            });
        });

        hotspotCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                const id = card.getAttribute('data-card');
                hotspotWrappers.forEach(hw => {
                    if (hw.getAttribute('data-hotspot') === id) {
                        hw.classList.add('active');
                        hw.querySelector('.hotspot-pulse').classList.add('scale-125');
                    } else {
                        hw.classList.remove('active');
                        hw.querySelector('.hotspot-pulse').classList.remove('scale-125');
                    }
                });
            });
            card.addEventListener('mouseleave', () => {
                hotspotWrappers.forEach(hw => {
                    hw.classList.remove('active');
                    hw.querySelector('.hotspot-pulse').classList.remove('scale-125');
                });
            });
        });
    }

    /* --- Interactive Story Tabs --- */
    const storyTabs = document.querySelectorAll('.story-tab-btn');
    const storyPanels = document.querySelectorAll('.story-content-panel');

    storyTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const storyId = tab.getAttribute('data-story');

            storyTabs.forEach(t => {
                t.classList.remove('active', 'border-brand-orange', 'bg-brand-orange', 'text-white');
                t.classList.add('border-brand-greyDark', 'bg-brand-shadow', 'text-brand-greyLight');
            });

            tab.classList.add('active', 'border-brand-orange', 'bg-brand-orange', 'text-white');
            tab.classList.remove('border-brand-greyDark', 'bg-brand-shadow', 'text-brand-greyLight');

            storyPanels.forEach(p => {
                if (p.id === `story-panel-${storyId}`) {
                    p.classList.add('active');
                } else {
                    p.classList.remove('active');
                }
            });
        });
    });


    /* --- 5. Custom Dialog Video Lightbox --- */
    const lightbox = document.getElementById('video-lightbox');
    const lightboxClose = document.getElementById('lightbox-close');
    const iframe = document.getElementById('lightbox-iframe');
    const ytWrapper = document.getElementById('lightbox-video-wrapper');
    const mp4Wrapper = document.getElementById('lightbox-mp4-wrapper');
    const mp4Video = document.getElementById('lightbox-mp4-video');
    const igWrapper = document.getElementById('lightbox-instagram-wrapper');
    const igBtn = document.getElementById('lightbox-instagram-btn');

    portfolioItems.forEach(item => {
        item.addEventListener('click', () => {
            const videoId = item.getAttribute('data-video-id');
            const videoMp4 = item.getAttribute('data-video-mp4');
            const instagramUrl = item.getAttribute('data-instagram-url');

            // Reset wrappers
            if (ytWrapper) ytWrapper.classList.add('hidden');
            if (mp4Wrapper) mp4Wrapper.classList.add('hidden');
            if (igWrapper) igWrapper.classList.add('hidden');
            if (iframe) iframe.src = '';
            if (mp4Video) {
                mp4Video.pause();
                mp4Video.removeAttribute('src');
                mp4Video.load();
            }

            if (videoMp4) {
                if (mp4Wrapper && mp4Video) {
                    mp4Wrapper.classList.remove('hidden');
                    mp4Video.src = videoMp4;
                    mp4Video.load();
                    lightbox.showModal();
                    mp4Video.play().catch(() => {});
                }
            } else if (videoId) {
                if (ytWrapper && iframe) {
                    ytWrapper.classList.remove('hidden');
                    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&showinfo=0&modestbranding=1`;
                    lightbox.showModal();
                }
            } else if (instagramUrl) {
                if (igWrapper && igBtn) {
                    igWrapper.classList.remove('hidden');
                    igBtn.href = instagramUrl;
                    lightbox.showModal();
                }
            }
        });
    });

    const closeLightbox = () => {
        if (lightbox && lightbox.open) {
            lightbox.close();
            if (iframe) iframe.src = '';
            if (mp4Video) {
                mp4Video.pause();
                mp4Video.removeAttribute('src');
                mp4Video.load();
            }
        }
    };

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            const dialogDimensions = lightbox.getBoundingClientRect();
            if (
                e.clientX < dialogDimensions.left ||
                e.clientX > dialogDimensions.right ||
                e.clientY < dialogDimensions.top ||
                e.clientY > dialogDimensions.bottom
            ) {
                closeLightbox();
            }
        });

        lightbox.addEventListener('close', () => {
            if (iframe) iframe.src = '';
            if (mp4Video) {
                mp4Video.pause();
                mp4Video.removeAttribute('src');
                mp4Video.load();
            }
        });
    }


    /* --- 6. Form Interactivity & Validation --- */
    const form = document.getElementById('contact-form');
    const toast = document.getElementById('toast');

    if (form) {
        const inputs = form.querySelectorAll('input, select, textarea');

        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                input.classList.add('interacted');
                validateField(input);
            });

            input.addEventListener('input', () => {
                if (input.classList.contains('interacted')) {
                    validateField(input);
                }
            });
        });

        const validateField = (field) => {
            const errorMsg = field.parentElement.querySelector('.error-msg');
            if (!errorMsg) return;

            if (field.checkValidity()) {
                errorMsg.classList.add('hidden');
            } else {
                errorMsg.classList.remove('hidden');
            }
        };

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let isFormValid = true;

            inputs.forEach(input => {
                input.classList.add('interacted');
                validateField(input);
                if (!input.checkValidity()) {
                    isFormValid = false;
                }
            });

            if (isFormValid) {
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn.textContent;
                submitBtn.textContent = 'Enviando...';
                submitBtn.disabled = true;

                setTimeout(() => {
                    toast.classList.remove('translate-y-24', 'opacity-0');
                    toast.classList.add('translate-y-0', 'opacity-100');

                    form.reset();
                    inputs.forEach(input => input.classList.remove('interacted'));

                    submitBtn.textContent = originalBtnText;
                    submitBtn.disabled = false;

                    setTimeout(() => {
                        toast.classList.remove('translate-y-0', 'opacity-100');
                        toast.classList.add('translate-y-24', 'opacity-0');
                    }, 4000);

                }, 1200);
            }
        });
    }


    /* --- 7. DYNAMIC UX: Magnetic Custom Cursor --- */
    const cursor = document.getElementById('custom-cursor');
    const cursorDot = document.getElementById('custom-cursor-dot');

    if (cursor && cursorDot && window.innerWidth >= 768) {
        document.body.classList.add('custom-cursor-active');

        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        });

        const animateCursor = () => {
            cursorX += (mouseX - cursorX) * 0.15;
            cursorY += (mouseY - cursorY) * 0.15;

            cursor.style.left = `${cursorX}px`;
            cursor.style.top = `${cursorY}px`;

            requestAnimationFrame(animateCursor);
        };
        animateCursor();

        const hoverables = document.querySelectorAll('a, button, input, select, textarea');
        hoverables.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('cursor-expand'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-expand'));
        });

        portfolioItems.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('cursor-play'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-play'));
        });
    }


    /* --- 8. LUXURY INTERACTIVE PROJECT CALCULATOR (STUDIO QUOTER V2.6) --- */
    const calcServiceRadios = document.querySelectorAll('input[name="calc-service"]');
    const calcCameraRadios = document.querySelectorAll('input[name="calc-camera"]');
    const calcDurationInput = document.getElementById('calc-duration');
    const calcDurationVal = document.getElementById('calc-duration-val');
    const calcDayBtns = document.querySelectorAll('.calc-day-btn');
    const calcDaysTag = document.getElementById('calc-days-tag');
    const calcAddons = document.querySelectorAll('.calc-addon');
    const calcPriceDisplay = document.getElementById('calc-price-display');
    const calcTransferBtn = document.getElementById('calc-transfer-btn');
    const calcCopyBtn = document.getElementById('calc-copy-btn');
    const copyBtnText = document.getElementById('copy-btn-text');

    // Receipt Elements
    const receiptRefCode = document.getElementById('receipt-ref-code');
    const receiptServiceName = document.getElementById('receipt-service-name');
    const receiptCameraName = document.getElementById('receipt-camera-name');
    const receiptDaysVal = document.getElementById('receipt-days-val');
    const receiptDurationVal = document.getElementById('receipt-duration-val');
    const receiptAddonsCount = document.getElementById('receipt-addons-count');
    const receiptAddonsList = document.getElementById('receipt-addons-list');

    let selectedDaysCount = 1;

    if (calcPriceDisplay) {
        // Base prices by service
        const serviceData = {
            videoclip: { name: 'Videoclip Musical', price: 2400000, formVal: 'videoclips' },
            corporativo: { name: 'Video Corporativo', price: 2000000, formVal: 'corporativo' },
            fotografia: { name: 'Fotografía de Marca', price: 1300000, formVal: 'fotografia' },
            eventos: { name: 'Cubrimiento de Eventos', price: 1700000, formVal: 'eventos' },
            publicidad: { name: 'Spot Publicitario', price: 2800000, formVal: 'corporativo' },
            marketing: { name: 'Pack Social Reels', price: 1500000, formVal: 'corporativo' }
        };

        const cameraData = {
            indie: { name: 'Sony FX Cinema Line (4K S-Log3)', price: 0 },
            master: { name: 'RED / ARRI Cine Ultra (6K Raw)', price: 1800000 }
        };

        const daysMultipliers = {
            1: { label: '1 Jornada (10 Horas)', extra: 0 },
            2: { label: '2 Jornadas de Rodaje', extra: 1200000 },
            3: { label: '3 Jornadas de Rodaje', extra: 2200000 },
            4: { label: '4+ Jornadas (Intensivo)', extra: 3200000 }
        };

        // Generate dynamic quote ref id
        const randomRef = 'TF-BOG-2026-X' + Math.floor(10 + Math.random() * 89);
        if (receiptRefCode) receiptRefCode.textContent = randomRef;
        const calcRefId = document.getElementById('calc-ref-id');
        if (calcRefId) calcRefId.textContent = randomRef;

        const updateCalculator = () => {
            let total = 0;

            // 1. Service Type
            let currentServiceKey = 'videoclip';
            calcServiceRadios.forEach(radio => {
                const label = radio.closest('.calc-service-option');
                if (radio.checked) {
                    currentServiceKey = radio.value;
                    total += (serviceData[radio.value] ? serviceData[radio.value].price : 2400000);
                    if (label) {
                        label.classList.add('border-brand-orange', 'bg-brand-orange/10');
                        label.classList.remove('border-brand-greyDark/50', 'bg-brand-shadow');
                    }
                } else if (label) {
                    label.classList.remove('border-brand-orange', 'bg-brand-orange/10');
                    label.classList.add('border-brand-greyDark/50', 'bg-brand-shadow');
                }
            });

            // 2. Camera Tier
            let currentCameraKey = 'indie';
            calcCameraRadios.forEach(radio => {
                const card = radio.closest('.camera-tier-card');
                if (radio.checked) {
                    currentCameraKey = radio.value;
                    total += (cameraData[radio.value] ? cameraData[radio.value].price : 0);
                    if (card) {
                        card.classList.add('border-brand-orange', 'bg-brand-orange/10');
                        card.classList.remove('border-brand-greyDark/50', 'bg-brand-shadow');
                    }
                } else if (card) {
                    card.classList.remove('border-brand-orange', 'bg-brand-orange/10');
                    card.classList.add('border-brand-greyDark/50', 'bg-brand-shadow');
                }
            });

            // 3. Shooting Days
            const dayInfo = daysMultipliers[selectedDaysCount] || daysMultipliers[1];
            total += dayInfo.extra;
            if (calcDaysTag) calcDaysTag.textContent = dayInfo.label;

            // 4. Duration
            const minutes = calcDurationInput ? parseInt(calcDurationInput.value, 10) : 3;
            let durationLabel = `${minutes} ${minutes === 1 ? 'Minuto' : 'Minutos'}`;
            if (minutes === 1) durationLabel = '30s - 1 Minuto (Reel / Spot)';
            if (calcDurationVal) calcDurationVal.textContent = durationLabel;

            if (minutes > 3) {
                total += (minutes - 3) * 150000;
            }

            // 5. Addons
            const activeAddonItems = [];
            calcAddons.forEach(addon => {
                const chip = addon.closest('.addon-chip');
                if (addon.checked) {
                    const price = parseInt(addon.value, 10) || 0;
                    total += price;
                    const name = addon.nextElementSibling ? addon.nextElementSibling.textContent.trim() : 'Módulo';
                    activeAddonItems.push({ name, price });
                    if (chip) {
                        chip.classList.add('border-brand-orange', 'bg-brand-orange/10');
                        chip.classList.remove('border-brand-greyDark/40', 'bg-brand-shadow/80');
                    }
                } else if (chip) {
                    chip.classList.remove('border-brand-orange', 'bg-brand-orange/10');
                    chip.classList.add('border-brand-greyDark/40', 'bg-brand-shadow/80');
                }
            });

            // Format Total COP
            const formattedTotal = new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                maximumFractionDigits: 0
            }).format(total);

            calcPriceDisplay.textContent = `${formattedTotal} COP`;

            // Update Receipt Panel
            if (receiptServiceName) {
                receiptServiceName.textContent = serviceData[currentServiceKey] ? serviceData[currentServiceKey].name : currentServiceKey;
            }
            if (receiptCameraName) {
                receiptCameraName.textContent = cameraData[currentCameraKey] ? cameraData[currentCameraKey].name : currentCameraKey;
            }
            if (receiptDaysVal) {
                receiptDaysVal.textContent = dayInfo.label;
            }
            if (receiptDurationVal) {
                receiptDurationVal.textContent = durationLabel;
            }
            if (receiptAddonsCount) {
                receiptAddonsCount.textContent = activeAddonItems.length.toString();
            }

            if (receiptAddonsList) {
                if (activeAddonItems.length === 0) {
                    receiptAddonsList.innerHTML = '<div class="text-brand-greyLight/60 italic">Ningún módulo adicional seleccionado</div>';
                } else {
                    receiptAddonsList.innerHTML = activeAddonItems.map(item => {
                        const fmtPrice = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(item.price);
                        return `<div class="flex justify-between items-center text-white/90">
                            <span>+ ${item.name}</span>
                            <span class="text-brand-orange text-[10px]">${fmtPrice}</span>
                        </div>`;
                    }).join('');
                }
            }
        };

        // Day Selector Button Clicks
        calcDayBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                calcDayBtns.forEach(b => {
                    b.classList.remove('active', 'bg-brand-orange', 'text-white', 'border-brand-orange');
                    b.classList.add('bg-brand-shadow', 'text-brand-greyLight', 'border-brand-greyDark/50');
                });
                btn.classList.add('active', 'bg-brand-orange', 'text-white', 'border-brand-orange');
                btn.classList.remove('bg-brand-shadow', 'text-brand-greyLight', 'border-brand-greyDark/50');
                selectedDaysCount = parseInt(btn.dataset.days, 10) || 1;
                updateCalculator();
            });
        });

        calcServiceRadios.forEach(r => r.addEventListener('change', updateCalculator));
        calcCameraRadios.forEach(r => r.addEventListener('change', updateCalculator));
        if (calcDurationInput) calcDurationInput.addEventListener('input', updateCalculator);
        calcAddons.forEach(a => a.addEventListener('change', updateCalculator));

        // Initial Calculation
        updateCalculator();

        // Transfer to Contact Form
        if (calcTransferBtn) {
            calcTransferBtn.addEventListener('click', () => {
                const activeServiceRadio = document.querySelector('input[name="calc-service"]:checked');
                const serviceKey = activeServiceRadio ? activeServiceRadio.value : 'videoclip';
                const serviceObj = serviceData[serviceKey] || serviceData.videoclip;

                const activeCameraRadio = document.querySelector('input[name="calc-camera"]:checked');
                const cameraKey = activeCameraRadio ? activeCameraRadio.value : 'indie';
                const cameraObj = cameraData[cameraKey] || cameraData.indie;

                const duration = calcDurationVal ? calcDurationVal.textContent : '3 Minutos';
                const dayInfo = daysMultipliers[selectedDaysCount] || daysMultipliers[1];

                const selectedAddonsText = [];
                calcAddons.forEach(a => {
                    if (a.checked) {
                        const chipLabel = a.closest('label').querySelector('span.text-white');
                        selectedAddonsText.push(chipLabel ? chipLabel.textContent.trim() : a.id);
                    }
                });

                const priceText = calcPriceDisplay.textContent;

                const formServiceSelect = document.getElementById('form-service');
                if (formServiceSelect) {
                    formServiceSelect.value = serviceObj.formVal || 'videoclips';
                }

                const formMessage = document.getElementById('form-message');
                if (formMessage) {
                    formMessage.value = `¡Hola Tasmania Films! Deseo cotizar y reservar fecha con la siguiente configuración estimada:\n\n` +
                        `• Referencia de Cotizador: ${randomRef}\n` +
                        `• Tipo de Proyecto: ${serviceObj.name.toUpperCase()}\n` +
                        `• Paquete de Cámara: ${cameraObj.name}\n` +
                        `• Jornadas de Rodaje: ${dayInfo.label}\n` +
                        `• Duración Estimada de Master: ${duration}\n` +
                        `• Módulos Adicionales: ${selectedAddonsText.length > 0 ? selectedAddonsText.join(', ') : 'Ninguno seleccionado'}\n` +
                        `• Estimado Aproximado Total: ${priceText}\n\n` +
                        `Quedo atento a coordinar la reunión de preproducción y el desglose formal.`;
                }

                const contactSec = document.getElementById('contacto');
                if (contactSec) {
                    contactSec.scrollIntoView({ behavior: 'smooth' });
                    setTimeout(() => {
                        const nameInput = document.getElementById('form-name');
                        if (nameInput) nameInput.focus();
                    }, 800);
                }
            });
        }

        // Copy Quote Summary Button
        if (calcCopyBtn) {
            calcCopyBtn.addEventListener('click', () => {
                const activeServiceRadio = document.querySelector('input[name="calc-service"]:checked');
                const serviceKey = activeServiceRadio ? activeServiceRadio.value : 'videoclip';
                const serviceObj = serviceData[serviceKey] || serviceData.videoclip;
                const activeCameraRadio = document.querySelector('input[name="calc-camera"]:checked');
                const cameraObj = cameraData[activeCameraRadio ? activeCameraRadio.value : 'indie'] || cameraData.indie;
                const duration = calcDurationVal ? calcDurationVal.textContent : '3 Minutos';
                const dayInfo = daysMultipliers[selectedDaysCount] || daysMultipliers[1];
                const priceText = calcPriceDisplay.textContent;

                const selectedAddonsText = [];
                calcAddons.forEach(a => {
                    if (a.checked) {
                        const chipLabel = a.closest('label').querySelector('span.text-white');
                        selectedAddonsText.push(chipLabel ? chipLabel.textContent.trim() : a.id);
                    }
                });

                const summaryText = `🎬 COTIZACIÓN ESTIMADA // TASMANIA FILMS\n` +
                    `Ref: ${randomRef}\n` +
                    `• Servicio: ${serviceObj.name}\n` +
                    `• Cámara: ${cameraObj.name}\n` +
                    `• Jornadas de Set: ${dayInfo.label}\n` +
                    `• Duración Master: ${duration}\n` +
                    `• Adicionales: ${selectedAddonsText.length > 0 ? selectedAddonsText.join(', ') : 'Ninguno'}\n` +
                    `• Total Estimado: ${priceText}\n\n` +
                    `Tasmania Films - Bogotá, Colombia\n` +
                    `Instagram: @tasmania_films`;

                navigator.clipboard.writeText(summaryText).then(() => {
                    if (copyBtnText) {
                        const prev = copyBtnText.textContent;
                        copyBtnText.textContent = '¡Copiado con Éxito al Portapapeles! ✓';
                        calcCopyBtn.classList.add('border-brand-orange', 'text-brand-orange');
                        setTimeout(() => {
                            copyBtnText.textContent = prev;
                            calcCopyBtn.classList.remove('border-brand-orange', 'text-brand-orange');
                        }, 2500);
                    }
                }).catch(err => {
                    console.error('Error al copiar:', err);
                });
            });
        }
    }


    /* --- 9. DYNAMIC UX: Ambient Web Audio Synth Drone --- */
    const ambientBtn = document.getElementById('ambient-toggle');
    const ambientLabel = document.getElementById('ambient-label');
    let audioCtx = null;
    let osc = null;
    let gainNode = null;
    let isAudioPlaying = false;

    if (ambientBtn) {
        const toggleAmbientSound = () => {
            if (!isAudioPlaying) {
                try {
                    const AudioContext = window.AudioContext || window.webkitAudioContext;
                    audioCtx = new AudioContext();

                    osc = audioCtx.createOscillator();
                    gainNode = audioCtx.createGain();

                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(110, audioCtx.currentTime);

                    gainNode.gain.setValueAtTime(0.01, audioCtx.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.05, audioCtx.currentTime + 2);

                    osc.connect(gainNode);
                    gainNode.connect(audioCtx.destination);

                    osc.start();
                    isAudioPlaying = true;

                    ambientBtn.querySelector('.eq-bars').classList.add('playing');
                    ambientBtn.classList.add('border-brand-orange', 'text-brand-orange');
                    if (ambientLabel) ambientLabel.textContent = 'ON';
                } catch (e) {
                    console.log('Web Audio setup error:', e);
                }
            } else {
                if (gainNode && audioCtx) {
                    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.5);
                    setTimeout(() => {
                        if (osc) osc.stop();
                        if (audioCtx) audioCtx.close();
                        isAudioPlaying = false;
                        
                        ambientBtn.querySelector('.eq-bars').classList.remove('playing');
                        ambientBtn.classList.remove('border-brand-orange', 'text-brand-orange');
                        if (ambientLabel) ambientLabel.textContent = 'Audio';
                    }, 500);
                }
            }
        };

        ambientBtn.addEventListener('click', toggleAmbientSound);
    }


    /* --- 10. THREE.JS 3D WEBGL GRAPHICS --- */
    const canvas = document.getElementById('three-canvas');
    if (canvas && typeof THREE !== 'undefined') {
        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 30;

        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // 3D Geometry 1: Camera Lens Outer Aperture Torus
        const ringGeo = new THREE.TorusGeometry(12, 0.35, 16, 100);
        const ringMat = new THREE.MeshStandardMaterial({
            color: 0xFF6200,
            wireframe: true,
            metalness: 0.8,
            roughness: 0.2
        });
        const lensRing = new THREE.Mesh(ringGeo, ringMat);
        scene.add(lensRing);

        // 3D Geometry 2: Core Camera Aperture Icosahedron
        const coreGeo = new THREE.IcosahedronGeometry(5, 1);
        const coreMat = new THREE.MeshStandardMaterial({
            color: 0xFF6200,
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });
        const coreMesh = new THREE.Mesh(coreGeo, coreMat);
        scene.add(coreMesh);

        // 3D Geometry 3: Floating Sparks / Particles Cloud
        const particleCount = 600;
        const particleGeo = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 80;
            positions[i + 1] = (Math.random() - 0.5) * 80;
            positions[i + 2] = (Math.random() - 0.5) * 80;
        }
        particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const particleMat = new THREE.PointsMaterial({
            color: 0xFF6200,
            size: 0.25,
            transparent: true,
            opacity: 0.7
        });
        const particleCloud = new THREE.Points(particleGeo, particleMat);
        scene.add(particleCloud);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xFF6200, 2, 100);
        pointLight.position.set(15, 15, 15);
        scene.add(pointLight);

        // Mouse Parallax & Scroll Reactivity
        let targetX = 0;
        let targetY = 0;

        document.addEventListener('mousemove', (e) => {
            targetX = (e.clientX - window.innerWidth / 2) * 0.0008;
            targetY = (e.clientY - window.innerHeight / 2) * 0.0008;
        });

        // Animation Render Loop
        const animate3D = () => {
            const scrollY = window.scrollY;

            // Rotation driven by time & scroll
            lensRing.rotation.x += 0.003;
            lensRing.rotation.y += 0.005;
            lensRing.rotation.z = scrollY * 0.001;

            coreMesh.rotation.x -= 0.004;
            coreMesh.rotation.y -= 0.003;

            particleCloud.rotation.y += 0.001;

            // Mouse parallax tilt smoothing
            camera.position.x += (targetX * 20 - camera.position.x) * 0.05;
            camera.position.y += (-targetY * 20 - camera.position.y) * 0.05;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
            requestAnimationFrame(animate3D);
        };
        animate3D();

        // Responsive Resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

});
