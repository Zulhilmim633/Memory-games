const container = document.querySelectorAll('.selector');
let isDragging = false;
let startX, startY, scrollLeft, scrollTop;

for (let cont of container) {

    cont.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.pageX - cont.offsetLeft;
        startY = e.pageY - cont.offsetTop;
        scrollLeft = cont.scrollLeft;
        scrollTop = cont.scrollTop;
    });

    cont.addEventListener('mouseleave', () => {
        isDragging = false;
    });

    cont.addEventListener('mouseup', () => {
        isDragging = false;
    });

    cont.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();

        const x = e.pageX - cont.offsetLeft;
        const y = e.pageY - cont.offsetTop;

        const dx = x - startX;
        const dy = y - startY;

        cont.scrollLeft = scrollLeft - dx;
        cont.scrollTop = scrollTop - dy;
    });
}