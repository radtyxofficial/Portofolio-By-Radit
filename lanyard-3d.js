/**
 * Lanyard & ID Card 3D Physics and Interaction Script with Gravity & Weight
 * Mengatur gravitasi, gaya tarik pegas (spring physics), drag & drop, serta rotasi 3D real-time.
 */

document.addEventListener('DOMContentLoaded', () => {
    const lanyardMoveable = document.getElementById('lanyardMoveable');
    const singleStrapBase = document.getElementById('singleStrapBase');
    const singleStrapTexture = document.getElementById('singleStrapTexture');
    const singleStrapEdge = document.getElementById('singleStrapEdge');

    if (!lanyardMoveable) return;

    let isDraggingLanyard = false;
    let startMouseX = 0, startMouseY = 0;
    
    let currentX = 0, currentY = -560; 
    let targetX = 0, targetY = 0;
    let velX = 0, velY = 0;
    
    // Parameter Fisika Baru: Gravitasi & Bobot
    const gravity = 0.35;       // Kekuatan gaya gravitasi yang menarik ke bawah
    const springPower = 0.045;  // Kekuatan pegas pengikat atas
    const frictionPower = 0.68; // Redaman gesekan (damping) agar pergerakan natural

    // Event saat pengguna mulai menarik (drag) ID card
    lanyardMoveable.addEventListener('pointerdown', (e) => {
        isDraggingLanyard = true;
        lanyardMoveable.setPointerCapture(e.pointerId);
        
        startMouseX = e.clientX - targetX;
        startMouseY = e.clientY - targetY;
        
        lanyardMoveable.style.cursor = 'grabbing';
        velX = 0; 
        velY = 0;
    });

    // Event saat menggeser kursor / sentuhan
    lanyardMoveable.addEventListener('pointermove', (e) => {
        if (!isDraggingLanyard) return;
        
        let dx = e.clientX - startMouseX;
        let dy = e.clientY - startMouseY;
        
        // Batas maksimal tarikan tali (max stretch)
        const maxStretch = 400; 
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > maxStretch) {
            dx = (dx / dist) * maxStretch;
            dy = (dy / dist) * maxStretch;
        }
        
        targetX = dx;
        targetY = dy;
    });

    // Fungsi saat tarikan dilepas
    const releaseLanyard = () => {
        isDraggingLanyard = false;
        targetX = 0; 
        targetY = 0;
        lanyardMoveable.style.cursor = 'grab';
    };

    lanyardMoveable.addEventListener('pointerup', releaseLanyard);
    lanyardMoveable.addEventListener('pointercancel', releaseLanyard);

    // Loop animasi fisik dengan tambahan efek gravitasi jatuh
    function animatePhysicsLoop() {
        if (isDraggingLanyard) {
            currentX += (targetX - currentX) * 0.3;
            currentY += (targetY - currentY) * 0.3;
        } else {
            // Kalkulasi gaya pegas menuju titik pusat (0,0)
            let ax = (targetX - currentX) * springPower;
            let ay = (targetY - currentY) * springPower;
            
            // Tambahkan komponen GAYA GRAVITASI yang menarik ke arah bawah (sumbu Y positif)
            let gravitationalPull = gravity * 15; 

            velX += ax;
            velY += ay + gravitationalPull; // Kartu akan terasa memiliki beban dan tertarik ke bawah
            
            velX *= frictionPower;
            velY *= frictionPower;
            
            currentX += velX;
            currentY += velY;
        }

        // Kalkulasi sudut kemiringan rotasi 3D (sumbu X, Y, dan Z) berdasarkan kecepatan & posisi
        let rotY = currentX * 0.15 + (velX * 0.05);  
        let rotX = -currentY * 0.12 - (velY * 0.05); 
        let rotZ = currentX * 0.06;  
        
        // Terapkan transformasi 3D pada elemen kartu
        lanyardMoveable.style.transform = `translateX(-50%) translate3d(${currentX}px, ${currentY}px, 0) rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg)`;

        // Pembaruan bentuk kurva SVG pada tali (lanyard strap) agar ikut melengkung dinamis
        const endX = 150 + currentX;
        const endY = 170 + currentY;

        const controlX = 150 + (currentX * 0.5) + (velX * 0.35);
        const controlY = 90 + (currentY * 0.5) + (velY * 0.35) + (Math.abs(velY) * 0.1);

        const singlePathData = `M 150,10 Q ${controlX},${controlY} ${endX},${endY}`;

        if (singleStrapBase) {
            singleStrapBase.setAttribute('d', singlePathData);
            singleStrapTexture.setAttribute('d', singlePathData);
            singleStrapEdge.setAttribute('d', singlePathData);
        }

        requestAnimationFrame(animatePhysicsLoop);
    }
    
    // Jalankan loop animasi
    animatePhysicsLoop();
});
