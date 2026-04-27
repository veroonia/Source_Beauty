// Auto-scroll featured strip; pauses on hover/focus
(function(){
    const strip = document.querySelector('.featured-strip');
    if (!strip) return;

    let speed = 0.5; // pixels per frame
    let rafId = null;
    let pos = 0;

    function step(){
        pos += speed;
        if (pos >= strip.scrollWidth - strip.clientWidth){
            pos = 0;
        }
        strip.scrollLeft = pos;
        rafId = requestAnimationFrame(step);
    }

    function start(){
        if (!rafId) rafId = requestAnimationFrame(step);
    }

    function stop(){
        if (rafId){
            cancelAnimationFrame(rafId);
            rafId = null;
        }
    }

    strip.addEventListener('mouseenter', stop);
    strip.addEventListener('mouseleave', start);
    strip.addEventListener('focusin', stop);
    strip.addEventListener('focusout', start);

    // start
    start();
})();
