document.getElementById('search-container-icon').addEventListener('click', function(){
    document.getElementById('search-box').classList.toggle('active');
    document.getElementById('search-icon').classList.toggle('active');
})

document.querySelectorAll('.top-bar-items').forEach(item => {
    item.addEventListener('click', ()=> {
        document.querySelectorAll('.top-bar-items').forEach(i => i.classList.remove('active'))
        item.classList.add('active')
    })
})


document.addEventListener('DOMContentLoaded', (event) => {
    const openPopupBtn = document.getElementById('openPopupBtn');
    const popup = document.getElementById('popup');
    const closeBtn = document.querySelector('.close-btn');

    openPopupBtn.addEventListener('click', () => {
        popup.style.display = 'block';
    });

    closeBtn.addEventListener('click', () => {
        popup.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === popup) {
            popup.style.display = 'none';
        }
    });
});
