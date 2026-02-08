(function() {
    const images = {
        idle: ['xoloidle.png', 'xoloidle2.png', 'xoloidle3.png', 'xoloidle4.png'],
        right: 'xoloLtoR.png',
        left: 'xolorunRtoL.png',
        down: 'xolorunTtoB.png',
        up: 'xolorunTtoB.png', // using same image, will flip
        pet: 'xolobeingpet.png',
        sleep: 'xolosleeping.png'
    };

    // Preload
    [...images.idle, images.right, images.left, images.down, images.up, images.pet, images.sleep].forEach(src => {
        const img = new Image();
        img.src = src;
    });

    const pet = document.createElement('div');
    pet.id = 'site-pet';
    pet.style.cssText = `
        position: fixed;
        width: 64px;
        height: 64px;
        z-index: 9998;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        transition: top 1.5s linear, left 1.5s linear;
        cursor: pointer;
    `;
    document.body.appendChild(pet);

    let x = -64;
    let y = Math.floor(window.innerHeight / 2);
    let state = 'right';
    let moving = false;
    let sleepCounter = 0;
    let idleFrame = 0;
    let frameCount = 0;

    pet.style.left = x + 'px';
    pet.style.top = y + 'px';

    function setImage(src, flipX = false, flipY = false) {
        pet.style.backgroundImage = `url(${src})`;
        let transform = '';
        if (flipX) transform += 'scaleX(-1) ';
        if (flipY) transform += 'scaleY(-1) ';
        pet.style.transform = transform;
    }

    function update() {
        frameCount++;

        // Cycle idle frames
        if (frameCount % 8 === 0) {
            idleFrame = (idleFrame + 1) % images.idle.length;
        }

        // Being pet - don't interrupt
        if (state === 'pet') {
            setImage(images.pet);
            return;
        }

        // Sleeping
        if (state === 'sleep') {
            setImage(images.sleep);
            sleepCounter--;
            if (sleepCounter <= 0) {
                state = 'idle';
            }
            return;
        }

        // Check if reached destination
        const currentX = parseInt(pet.style.left);
        const currentY = parseInt(pet.style.top);
        
        if (Math.abs(currentX - x) < 10 && Math.abs(currentY - y) < 10) {
            moving = false;
        }

        // Decide next action
        if (!moving) {
            const rand = Math.random();

            if (rand < 0.15) {
                // Sleep
                state = 'sleep';
                sleepCounter = 30;
                setImage(images.sleep);
            } else if (rand < 0.4) {
                // Idle
                state = 'idle';
                setImage(images.idle[idleFrame]);
            } else {
                // Move
                const dir = Math.floor(Math.random() * 4);
                let newX = x;
                let newY = y;

                if (dir === 0 && x < window.innerWidth - 100) {
                    newX = x + 64;
                    state = 'right';
                } else if (dir === 1 && x > 64) {
                    newX = x - 64;
                    state = 'left';
                } else if (dir === 2 && y < window.innerHeight - 100) {
                    newY = y + 64;
                    state = 'down';
                } else if (dir === 3 && y > 64) {
                    newY = y - 64;
                    state = 'up';
                } else {
                    // Default: move right if stuck
                    newX = x + 64;
                    state = 'right';
                }

                // Force enter screen if off-screen
                if (x < 0) {
                    newX = 64;
                    state = 'right';
                }

                x = newX;
                y = newY;
                moving = true;

                pet.style.left = x + 'px';
                pet.style.top = y + 'px';

                // Set image based on direction
                if (state === 'right') {
                    setImage(images.right);
                } else if (state === 'left') {
                    setImage(images.left);
                } else if (state === 'down') {
                    setImage(images.down);
                } else if (state === 'up') {
                    setImage(images.up, false, true);
                }
            }
        } else {
            // Keep showing movement image
            if (state === 'right') {
                setImage(images.right);
            } else if (state === 'left') {
                setImage(images.left);
            } else if (state === 'down') {
                setImage(images.down);
            } else if (state === 'up') {
                setImage(images.up, false, true);
            }
        }

        // Idle animation
        if (state === 'idle') {
            setImage(images.idle[idleFrame]);
        }
    }

    setInterval(update, 150);

    // Click to pet
    pet.addEventListener('click', () => {
        if (state !== 'pet' && state !== 'sleep') {
            state = 'pet';
            moving = false;
            setImage(images.pet);
            setTimeout(() => {
                state = 'idle';
            }, 2000);
        }
    });

    // Handle resize
    window.addEventListener('resize', () => {
        if (y > window.innerHeight - 64) {
            y = window.innerHeight - 100;
            pet.style.top = y + 'px';
        }
        if (x > window.innerWidth - 64) {
            x = window.innerWidth - 100;
            pet.style.left = x + 'px';
        }
    });
})();
