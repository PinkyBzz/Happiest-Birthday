document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. OPENING SCREEN & INITIALIZATION
    // ==========================================
    const btnOpen = document.getElementById("btn-open");
    const openingScreen = document.getElementById("opening-screen");
    const mainContent = document.getElementById("main-content");
    const audio = document.getElementById("bg-music");
    const audioToggleBtn = document.getElementById("audio-toggle");
    const iconPlay = document.getElementById("icon-play");
    const iconPause = document.getElementById("icon-pause");
    let isMusicPlaying = false;

    const glitchScreen = document.getElementById("glitch-screen");
    const btnFix = document.getElementById("btn-fix");

    // Buka website (transisi soft)
    btnOpen.addEventListener("click", () => {
        // Pindah ke Glitch Screen
        openingScreen.classList.add("hidden");
        glitchScreen.classList.remove("hidden");
    });
    
    // Fix Button logic
    btnFix.addEventListener("click", () => {
        glitchScreen.style.opacity = "0";
        glitchScreen.style.transition = "opacity 1s ease";
        
        setTimeout(() => {
            glitchScreen.classList.add("hidden");
            mainContent.classList.remove("hidden");
            
            // Start features
            initScrollReveal();
            createFallingStars(); // Starts the wish stars
            
            // Scroll ke atas halaman utama
            window.scrollTo({ top: 0, behavior: "smooth" });
        }, 1000);
    });

    // ==========================================
    // 1.2 LENIS SMOOTH SCROLLING (NEW)
    // ==========================================
    // Fallback simple smooth scrolling implementation 
    // since we are using pure JS without external libraries
    let currentScroll = 0;
    let targetScroll = 0;
    const ease = 0.08;

    // Untuk memastikan smooth scroll CSS tetap bekerja tapi ditambahkan inertia ringan lewat JS
    function updateScroll() {
        // Linear interpolation for smooth stopping
        currentScroll += (targetScroll - currentScroll) * ease;
        
        // Request next frame
        requestAnimationFrame(updateScroll);
    }
    
    // Sync window scroll with our target
    window.addEventListener('scroll', () => {
        targetScroll = window.scrollY;
    });

    // Start the scroll loop
    updateScroll();

    // ==========================================
    // 1.5 CUSTOM CURSOR (GLOWING DOT TRAIL)
    // ==========================================
    const cursor = document.getElementById('custom-cursor');
    const cursorFollower = document.getElementById('custom-cursor-follower');

    if (cursor && cursorFollower) {
        document.addEventListener('mousemove', (e) => {
            // Memindahkan titik kursor utama seketika
            cursor.style.transform = `translate3d(${e.clientX - 6}px, ${e.clientY - 6}px, 0)`;
            
            // Membiarkan lingkaran pengikut tertinggal sedikit (diatur oleh CSS transition)
            cursorFollower.style.transform = `translate3d(${e.clientX - 16}px, ${e.clientY - 16}px, 0)`;
        });

        // Efek kursor mengecil/membesar saat klik
        document.addEventListener('mousedown', () => {
            cursorFollower.style.transform += ' scale(0.8)';
            cursor.style.transform += ' scale(1.5)';
        });
        document.addEventListener('mouseup', () => {
            cursorFollower.style.transform = cursorFollower.style.transform.replace(' scale(0.8)', '');
            cursor.style.transform = cursor.style.transform.replace(' scale(1.5)', '');
        });
    }

    // ==========================================
    // 1.8 3D TILT EFFECT & PARTICLES (NEW)
    // ==========================================
    
    // 1. Scrapbook Card 3D Tilt Effect on Hover
    const cards = document.querySelectorAll('.scrapbook-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10; // Max rotation 10deg
            const rotateY = ((x - centerX) / centerX) * 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            card.style.zIndex = "10";
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = ''; // reset to CSS default (with transitions back to static tilt)
            card.style.zIndex = "1";
        });
    });

    // 2. Generate Sparkles Dynamically
    const sparklesContainer = document.querySelector('.sparkles');
    if (sparklesContainer) {
        for (let i = 0; i < 40; i++) {
            const sparkle = document.createElement('div');
            sparkle.classList.add('glowing-sparkle');
            sparkle.style.left = `${Math.random() * 100}%`;
            sparkle.style.top = `${Math.random() * 100}%`;
            // Random animation duration
            sparkle.style.setProperty('--s', `${2 + Math.random() * 4}s`);
            // Random animation delay
            sparkle.style.setProperty('--d', `${Math.random() * 3}s`);
            
            const size = 2 + Math.random() * 4;
            sparkle.style.width = `${size}px`;
            sparkle.style.height = `${size}px`;
            
            sparklesContainer.appendChild(sparkle);
        }
    }

    // ==========================================
    // 2. AUDIO CONTROL
    // ==========================================
    function playMusic() {
        audio.play().then(() => {
            isMusicPlaying = true;
            iconPlay.classList.add("hidden");
            iconPause.classList.remove("hidden");
        }).catch(() => {
            // Jika autoplay diblokir browser, tidak masalah, user bisa klik tombol play
            isMusicPlaying = false;
        });
    }

    function toggleMusic() {
        if (isMusicPlaying) {
            audio.pause();
            isMusicPlaying = false;
            iconPause.classList.add("hidden");
            iconPlay.classList.remove("hidden");
        } else {
            playMusic();
        }
    }

    audioToggleBtn.addEventListener("click", toggleMusic);

    // ==========================================
    // 3. SCROLL PROGRESS BAR
    // ==========================================
    const scrollProgress = document.getElementById("scroll-progress");
    
    window.addEventListener("scroll", () => {
        // Hitung persentase scroll
        const scrollPx = document.documentElement.scrollTop;
        const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (scrollPx / winHeightPx) * 100;
        
        scrollProgress.style.width = scrolled + "%";
        
        // ==========================================
        // 4. BACK TO TOP BUTTON VISIBILITY
        // ==========================================
        const backToTopBtn = document.getElementById("back-to-top");
        if (scrollPx > 400) {
            backToTopBtn.classList.add("visible");
        } else {
            backToTopBtn.classList.remove("visible");
        }
    });

    // Back to top function
    document.getElementById("back-to-top").addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // ==========================================
    // 5. INTERSECTION OBSERVER (REVEAL ANIMATION)
    // ==========================================
    function initScrollReveal() {
        const revealElements = document.querySelectorAll(".reveal");
        
        // Opsi observer
        const revealOptions = {
            threshold: 0.15, // 15% elemen terlihat baru animasi muncul
            rootMargin: "0px 0px -50px 0px"
        };

        const revealOnScroll = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("active");
                    // Jangan unobserve jika ingin animasi berulang saat scroll bolak-balik
                    // observer.unobserve(entry.target); 
                }
            });
        }, revealOptions);

        revealElements.forEach(el => {
            revealOnScroll.observe(el);
        });
    }

    // ==========================================
    // 6. 3D WOBBLY GIFT BOX
    // ==========================================
    const giftContainer = document.getElementById("gift-container");
    const surpriseText = document.getElementById("surprise-text");
    const giftHint = document.getElementById("gift-hint");
    
    // Array pesan spesial di dalam kado
    const surpriseMessages = [
        "Voucher Makan Malam Berdua! (Berlaku hari ini aja lho).",
        "Kamu selalu jadi bagian terbaik dari hariku.",
        "Terima kasih karena selalu menjadi dirimu yang luar biasa.",
        "Ada hadiah beneran nunggu kamu di dunia nyata, tanya deh!",
        "Voucher 1x Permintaan Bebas! (Syarat & Ketentuan berlaku hihi)."
    ];

    let clickCount = 0;

    if (giftContainer) {
        giftContainer.addEventListener("click", () => {
            if (clickCount >= 3) return; // Kalau sudah terbuka, jangan lakukan apa-apa
            
            clickCount++;

            // Hapus class shake lama biar bisa di-trigger ulang
            giftContainer.classList.remove("shake-1", "shake-2");
            // Paksa browser reflow agar animasi bisa jalan ulang
            void giftContainer.offsetWidth;

            if (clickCount === 1) {
                giftContainer.classList.add("shake-1");
                giftHint.textContent = "Kayaknya ada isinya deh. Ketuk lagi!";
            } 
            else if (clickCount === 2) {
                giftContainer.classList.add("shake-2");
                giftHint.textContent = "Wah ditarik! Ketuk sekali lagi lebih kencang!";
            } 
            else if (clickCount === 3) {
                giftHint.textContent = "Surprise!!!";
                const randomIndex = Math.floor(Math.random() * surpriseMessages.length);
                surpriseText.textContent = `"${surpriseMessages[randomIndex]}"`;
                
                // Buka kadonya!
                giftContainer.classList.add("open");
                
                // Tambahkan ledakan confetti skala kecil khusus buat kado
                shootConfetti();
            }
        });
    }

    // ==========================================
    // 6.5 BLOWABLE CAKE CANDLE (MIC API)
    // ==========================================
    const btnMic = document.getElementById("btn-mic");
    const micStatus = document.getElementById("mic-status");
    const flame = document.getElementById("flame");
    const cakeWishReveal = document.getElementById("cake-wish-reveal");
    
    let audioContext;
    let microphone;
    let analyser;
    let isCandleExtinguished = false;

    // Fungsi trigger meledakkan confetti
    function shootConfetti() {
        // Fallback simple confetti since we have no libraries
        const colors = ['#d8a7a5', '#ffcc00', '#f3eae8', '#fff'];
        for(let i=0; i<50; i++) {
            const conf = document.createElement('div');
            conf.classList.add('confetti');
            conf.style.left = Math.random() * 100 + 'vw';
            conf.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            conf.style.animationDelay = (Math.random() * 0.5) + 's';
            // Random shapes
            if(Math.random() > 0.5) conf.style.borderRadius = '50%';
            document.body.appendChild(conf);
            
            // Clean up DOM after animation
            setTimeout(() => conf.remove(), 3500);
        }
    }

    // Fungsi memonitor tiupan
    function startBlowingDetection() {
        // Nyalakan mode matikan lampu
        const darkOverlay = document.getElementById("dark-overlay");
        const firefliesContainer = document.getElementById("fireflies-container");
        
        if (darkOverlay) {
            darkOverlay.classList.add("active");
            flame.classList.add("dark-mode-glow");
        }

        // Spawn fireflies
        if (firefliesContainer) {
            firefliesContainer.innerHTML = ""; // bersihkan kalau sudah ada
            for(let i=0; i<40; i++) {
                const firefly = document.createElement("div");
                firefly.className = "firefly";
                firefly.style.left = `${Math.random() * 100}vw`;
                firefly.style.top = `${Math.random() * 100}vh`;
                firefly.style.animationDelay = `${Math.random() * 5}s, ${Math.random() * 2}s`;
                firefliesContainer.appendChild(firefly);
            }
            firefliesContainer.classList.add("active");
        }

        navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        .then(function(stream) {
            micStatus.textContent = "Mic aktif! Silakan tiup lilinnya di dekat microphone.";
            btnMic.classList.add("hidden");

            // Setup audio context & analyser
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioContext.createAnalyser();
            microphone = audioContext.createMediaStreamSource(stream);
            
            // Konfigurasi analyser (FFT)
            analyser.smoothingTimeConstant = 0.8;
            analyser.fftSize = 256;
            microphone.connect(analyser);

            const dataArray = new Uint8Array(analyser.frequencyBinCount);
            
            function detectBlow() {
                if (isCandleExtinguished) return; // Stop if already blown
                
                analyser.getByteFrequencyData(dataArray);
                
                // Menghitung volume rata-rata
                let sum = 0;
                for (let i = 0; i < dataArray.length; i++) {
                    sum += dataArray[i];
                }
                let averageVolume = sum / dataArray.length;

                // Jika volume melebihi threshold tiupan (sekitar 80-100+)
                if (averageVolume > 85) { 
                    isCandleExtinguished = true;
                    
                    // Matikan lampu, matikan kunang-kunang & matikan api
                    const firefliesContainer = document.getElementById("fireflies-container");
                    if (darkOverlay) {
                        darkOverlay.classList.remove("active");
                        flame.classList.remove("dark-mode-glow");
                    }
                    if (firefliesContainer) {
                        firefliesContainer.classList.remove("active");
                    }
                    flame.classList.add('extinguished');
                    micStatus.textContent = "Lilin telah padam!";
                    
                    // Trigger surprise message & confetti
                    cakeWishReveal.classList.remove('hidden');
                    shootConfetti();
                    
                    // Trigger pemutaran musik Happy Birthday
                    playMusic();

                    // Matikan track microphone
                    stream.getTracks().forEach(track => track.stop());
                    audioContext.close();
                }

                // Terus memonitor frame berikutnya jika belum padam
                if (!isCandleExtinguished) {
                    requestAnimationFrame(detectBlow);    
                }
            }
            
            detectBlow();

        })
        .catch(function(err) {
            console.error('Error accessing microphone: ', err);
            micStatus.textContent = "Gagal mengakses mic. Pastikan kamu memberi izin ya.";
        });
    }

    if(btnMic) {
        btnMic.addEventListener("click", () => {
            startBlowingDetection();
        });
    }

    // ==========================================
    // 7. SHARE BUTTON (Web Share API)
    // ==========================================
    const btnShare = document.getElementById("btn-share");
    const shareFeedback = document.getElementById("share-feedback");

    btnShare.addEventListener("click", async () => {
        const shareData = {
            title: document.title,
            text: "Lihat surat kecil ini untukmu...",
            url: window.location.href
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                // Fallback: Copy to clipboard
                await navigator.clipboard.writeText(window.location.href);
                showShareFeedback();
            }
        } catch (err) {
            // Jika user membatalkan share, biarkan saja
            if (err.name !== 'AbortError') {
                console.error("Gagal membagikan link:", err);
            }
        }
    });

    function showShareFeedback() {
        shareFeedback.classList.add("show");
        setTimeout(() => {
            shareFeedback.classList.remove("show");
        }, 3000);
    }

}); // end DOMContentLoaded

// =======================================================================
// WISH STARS LOGIC
// =======================================================================
function createFallingStars() {
    const wishSky = document.querySelector(".wish-sky");
    if (!wishSky) return;

    const messages = [
        "Semoga harimu selalu cerah, secerah senyummu.",
        "Jangan lupa makan enak hari ini, ya!",
        "Semoga apa yang kamu semogakan, lekas tersemogakan.",
        "You are loved, more than you know.",
        "Selamat ulang tahun! Teruslah bersinar ✨",
        "Bahagia selalu buat orang baik sepertimu."
    ];

    const starModal = document.getElementById("star-modal");
    const starText = document.getElementById("star-message-text");
    
    // Close modal on clik
    document.addEventListener("click", (e) => {
        if(starModal.classList.contains("active") && !e.target.closest('.falling-star')) {
            starModal.classList.remove("active");
        }
    });

    for (let i = 0; i < messages.length; i++) {
        setTimeout(() => {
            const star = document.createElement("div");
            star.className = "falling-star";
            
            star.style.animationDuration = `${12 + Math.random() * 8}s`;
            star.style.top = `${Math.random() * 50 - 50}px`;
            
            star.innerHTML = `<div class="star-glow"></div>`;

            star.addEventListener("click", (e) => {
                e.stopPropagation();
                starText.innerText = messages[i];
                starModal.classList.add("active");
            });

            wishSky.appendChild(star);
        }, i * 3500);
    }
}