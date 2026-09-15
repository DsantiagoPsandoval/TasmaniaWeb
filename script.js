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

    // Hover Demo Video Playback
    portfolioItems.forEach(item => {
        const previewVideo = item.querySelector('.portfolio-preview-video');
        if (previewVideo) {
            item.addEventListener('mouseenter', () => {
                previewVideo.play().catch(() => {});
            });
            item.addEventListener('mouseleave', () => {
                previewVideo.pause();
                previewVideo.currentTime = 0;
            });
        }
    });


    /* --- 5. Custom Dialog Video Lightbox --- */
    const lightbox = document.getElementById('video-lightbox');
    const lightboxClose = document.getElementById('lightbox-close');
    const iframe = document.getElementById('lightbox-iframe');
    const ytWrapper = document.getElementById('lightbox-video-wrapper');
    const igWrapper = document.getElementById('lightbox-instagram-wrapper');
    const igBtn = document.getElementById('lightbox-instagram-btn');

    portfolioItems.forEach(item => {
        item.addEventListener('click', () => {
            const videoId = item.getAttribute('data-video-id');
            const instagramUrl = item.getAttribute('data-instagram-url');

            if (videoId) {
                ytWrapper.classList.remove('hidden');
                igWrapper.classList.add('hidden');
                iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&showinfo=0&modestbranding=1`;
                lightbox.showModal();
            } else if (instagramUrl) {
                ytWrapper.classList.add('hidden');
                igWrapper.classList.remove('hidden');
                igBtn.href = instagramUrl;
                lightbox.showModal();
            }
        });
    });

    const closeLightbox = () => {
        if (lightbox && lightbox.open) {
            lightbox.close();
            iframe.src = '';
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
            iframe.src = '';
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


    /* --- 8. DYNAMIC UX: Interactive Budget Calculator --- */
    const calcServiceRadios = document.querySelectorAll('input[name="calc-service"]');
    const calcDurationInput = document.getElementById('calc-duration');
    const calcDurationVal = document.getElementById('calc-duration-val');
    const calcAddons = document.querySelectorAll('.calc-addon');
    const calcPriceDisplay = document.getElementById('calc-price-display');
    const calcTransferBtn = document.getElementById('calc-transfer-btn');

    if (calcPriceDisplay) {
        const serviceBasePrices = {
            videoclip: 1800000,
            corporativo: 2200000,
            fotografia: 1200000,
            eventos: 1500000
        };

        const updateCalculator = () => {
            let total = 0;

            let selectedService = 'videoclip';
            calcServiceRadios.forEach(radio => {
                const label = radio.closest('.calc-service-option');
                if (radio.checked) {
                    selectedService = radio.value;
                    total += serviceBasePrices[radio.value] || 1800000;
                    label.classList.add('border-brand-orange', 'bg-brand-orange/10');
                    label.classList.remove('border-brand-greyDark/50', 'bg-brand-shadow');
                } else {
                    label.classList.remove('border-brand-orange', 'bg-brand-orange/10');
                    label.classList.add('border-brand-greyDark/50', 'bg-brand-shadow');
                }
            });

            const minutes = parseInt(calcDurationInput.value, 10);
            if (calcDurationVal) calcDurationVal.textContent = `${minutes} ${minutes === 1 ? 'Minuto' : 'Minutos'}`;
            
            if (minutes > 1) {
                total += (minutes - 1) * 150000;
            }

            calcAddons.forEach(addon => {
                if (addon.checked) {
                    total += parseInt(addon.value, 10);
                }
            });

            const formattedTotal = new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                maximumFractionDigits: 0
            }).format(total);

            calcPriceDisplay.textContent = `${formattedTotal} COP`;
        };

        calcServiceRadios.forEach(r => r.addEventListener('change', updateCalculator));
        if (calcDurationInput) calcDurationInput.addEventListener('input', updateCalculator);
        calcAddons.forEach(a => a.addEventListener('change', updateCalculator));

        updateCalculator();

        if (calcTransferBtn) {
            calcTransferBtn.addEventListener('click', () => {
                const activeRadio = document.querySelector('input[name="calc-service"]:checked');
                const serviceVal = activeRadio ? activeRadio.value : 'videoclip';
                const duration = calcDurationInput.value;

                const selectedAddonsText = [];
                calcAddons.forEach(a => {
                    if (a.checked) {
                        selectedAddonsText.push(a.nextElementSibling.textContent.trim());
                    }
                });

                const priceText = calcPriceDisplay.textContent;

                const formServiceSelect = document.getElementById('form-service');
                if (formServiceSelect) {
                    if (serviceVal === 'videoclip') formServiceSelect.value = 'videoclips';
                    else if (serviceVal === 'corporativo') formServiceSelect.value = 'corporativo';
                    else if (serviceVal === 'fotografia') formServiceSelect.value = 'fotografia';
                    else if (serviceVal === 'eventos') formServiceSelect.value = 'eventos';
                }

                const formMessage = document.getElementById('form-message');
                if (formMessage) {
                    formMessage.value = `¡Hola! Me gustaría cotizar un proyecto de tipo ${serviceVal.toUpperCase()}.\n` +
                        `- Duración estimada: ${duration} minutos\n` +
                        `- Adicionales: ${selectedAddonsText.length > 0 ? selectedAddonsText.join(', ') : 'Ninguno'}\n` +
                        `- Estimado aproximado del cotizador: ${priceText}\n\n` +
                        `Quedo atento a coordinar la propuesta formal.`;
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
