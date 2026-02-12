(function() {
    const dante = document.getElementById('dante');
    const img = document.getElementById('dante-img');
    
    const gifs = {
        walk: 'dantewalking.gif',
        run: 'danterunning.gif',
        chill: 'dantechilling.gif',
        face: 'danteface.gif'
    };
    
    // Preload
    Object.values(gifs).forEach(src => {
        const preload = new Image();
        preload.src = src;
    });
    
    let x = -100;
    let y = window.innerHeight - 100;
    let direction = 1;
    let state = 'walk';
    let stateTimer = 0;
    let pauseTimer = 0;
    let speed = 2;
    let targetX = null;
    let targetY = null;
    
    dante.style.left = x + 'px';
    dante.style.top = y + 'px';
    
    function setGif(name) {
        img.src = gifs[name];
    }
    
    function flip() {
        img.style.transform = direction === 1 ? 'scaleX(1)' : 'scaleX(-1)';
    }
    
    function getRandomElement() {
        // Elements Dante can sit on
        const selectors = [
            '.nav-link',
            '.section-title',
            '.hero-title',
            '.service-card h3',
            '.badge',
            '.faq-question span',
            '.footer-brand h3'
        ];
        
        const allElements = [];
        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                const rect = el.getBoundingClientRect();
                // Only visible elements
                if (rect.top > 0 && rect.top < window.innerHeight - 100 && rect.width > 30) {
                    allElements.push(el);
                }
            });
        });
        
        if (allElements.length === 0) return null;
        return allElements[Math.floor(Math.random() * allElements.length)];
    }
    
    function moveToElement(el) {
        const rect = el.getBoundingClientRect();
        targetX = rect.left + rect.width / 2 - 40;
        targetY = rect.top - 60;
        
        // Determine direction
        direction = targetX > x ? 1 : -1;
        flip();
        
        return true;
    }
    
    function update() {
        stateTimer++;
        
        // Paused (chilling, face)
        if (pauseTimer > 0) {
            pauseTimer--;
            if (pauseTimer === 0) {
                state = 'walk';
                setGif('walk');
                speed = 2;
                targetX = null;
                targetY = null;
                // Return to bottom
                y = window.innerHeight - 100;
                dante.style.top = y + 'px';
            }
            return;
        }
        
        // Moving to target
        if (targetX !== null && targetY !== null) {
            const dx = targetX - x;
            const dy = targetY - y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 10) {
                // Arrived
                x = targetX;
                y = targetY;
                dante.style.left = x + 'px';
                dante.style.top = y + 'px';
                targetX = null;
                targetY = null;
                
                // Do action
                const action = Math.random();
                if (action < 0.5) {
                    state = 'chill';
                    setGif('chill');
                } else {
                    state = 'face';
                    setGif('face');
                }
                pauseTimer = 100 + Math.floor(Math.random() * 100);
                stateTimer = 0;
            } else {
                // Move toward target
                setGif('run');
                speed = 4;
                x += (dx / dist) * speed;
                y += (dy / dist) * speed;
                direction = dx > 0 ? 1 : -1;
                flip();
                dante.style.left = x + 'px';
                dante.style.top = y + 'px';
            }
            return;
        }
        
        // Normal walking
        if (state === 'walk') {
            x += speed * direction;
            dante.style.left = x + 'px';
            flip();
            
            // Turn at edges
            if (x > window.innerWidth + 50) {
                direction = -1;
                flip();
            } else if (x < -100) {
                direction = 1;
                flip();
            }
            
            // Random actions
            if (stateTimer > 200 && Math.random() < 0.01) {
                const action = Math.random();
                
                if (action < 0.4) {
                    // Go sit on something
                    const el = getRandomElement();
                    if (el) {
                        moveToElement(el);
                        stateTimer = 0;
                    }
                } else if (action < 0.6) {
                    // Chill on ground
                    state = 'chill';
                    setGif('chill');
                    pauseTimer = 80 + Math.floor(Math.random() * 80);
                    stateTimer = 0;
                } else if (action < 0.8) {
                    // Face on ground
                    state = 'face';
                    setGif('face');
                    pauseTimer = 60 + Math.floor(Math.random() * 60);
                    stateTimer = 0;
                } else {
                    // Run fast
                    state = 'run';
                    setGif('run');
                    speed = 5;
                    setTimeout(() => {
                        state = 'walk';
                        setGif('walk');
                        speed = 2;
                    }, 2000);
                    stateTimer = 0;
                }
            }
        }
    }
    
    // Start
    setGif('walk');
    flip();
    setInterval(update, 30);
    
    // Handle resize
    window.addEventListener('resize', () => {
        if (pauseTimer === 0 && targetX === null) {
            y = window.innerHeight - 100;
            dante.style.top = y + 'px';
        }
    });
    
    // Recalculate on scroll (elements move)
    window.addEventListener('scroll', () => {
        // If sitting on element, cancel and return to walking
        if (pauseTimer > 0 && y < window.innerHeight - 150) {
            pauseTimer = 1;
        }
    });
})();
