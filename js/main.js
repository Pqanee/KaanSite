

// Kaydedilen renk temasını yükle ve değiştirme olanağı sun.



const themeButton = document.querySelector('.theme-toggle');
const themeIcon = document.querySelector('.theme-icon');
const themeLabel = document.querySelector('.theme-label');
const themeMeta = document.querySelector('meta[name="theme-color"]');

// Kaydırma ilerlemesini göster ve içerikleri görünür oldukça yumuşakça getir.
const progressBar = document.querySelector('.scroll-progress span');
const updateProgress = () => {
    if (!progressBar) return;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    progressBar.style.width = `${Math.min(progress, 100)}%`;
};
window.addEventListener('scroll', updateProgress, { passive: true });
window.addEventListener('resize', updateProgress);
updateProgress();

const revealItems = document.querySelectorAll(
    '[data-reveal], main > .section, main > .heading, .projects .project, .contact > .panel'
);
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    revealItems.forEach((item) => {
        item.setAttribute('data-reveal', '');
        revealObserver.observe(item);
    });
} else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
}

function setTheme(theme) {


    // Tema adını tek bir açık/koyu durumuna çevir.



    const isDark = theme === 'dark';
    document.documentElement.dataset.theme = isDark ? 'dark' : 'light';

    if (themeButton) {


        // Ekran okuyuculara etkin tema durumunu bildir.



        themeButton.setAttribute('aria-pressed', String(isDark));
        themeButton.setAttribute(
            'aria-label',
            isDark ? 'A\u00e7\u0131k temay\u0131 etkinle\u015ftir' : 'Koyu temay\u0131 etkinle\u015ftir'
        );
    }

    if (themeIcon) {
        themeIcon.textContent = isDark ? '\u2600' : '\u263E';
    }

    if (themeLabel) {
        themeLabel.textContent = isDark ? 'A\u00e7\u0131k tema' : 'Koyu tema';
    }

    if (themeMeta) {
        themeMeta.setAttribute('content', isDark ? '#0d1020' : '#f5f1e8');
    }
}


// İlk ziyaret koyu temayla başlar; önceki seçim korunur.



let savedTheme = 'dark';
try {


    // Kayıtlı seçim yoksa koyu tema varsayılan olarak kullanılır.



    savedTheme = localStorage.getItem('kaansite-theme') || 'dark';
} catch (error) {


    // Tarayıcı depolaması kullanılamasa da site çalışmaya devam eder.



}
setTheme(savedTheme);

if (themeButton) {
    themeButton.addEventListener('click', () => {


        // Düğmeye her basışta diğer temaya geç.



        const nextTheme = document.documentElement.dataset.theme === 'dark'
            ? 'light'
            : 'dark';
        setTheme(nextTheme);
        try {


            // Tercihi sonraki sayfa ziyaretleri için sakla.



            localStorage.setItem('kaansite-theme', nextTheme);
        } catch (error) {


            // Depolama kullanılamıyorsa seçim yalnızca bu sayfa açıkken geçerlidir.



        }
    });
}


// Mobil gezinme menüsünü aç ve kapat.



const menuButton = document.querySelector('.toggle');
const menu = document.querySelector('.nav ul');

if (menuButton && menu) {
    menuButton.addEventListener('click', () => {
        const isOpen = menu.classList.toggle('open');
        menuButton.setAttribute('aria-expanded', String(isOpen));
        menuButton.setAttribute(
            'aria-label',
            isOpen ? 'Men\u00fcy\u00fc kapat' : 'Men\u00fcy\u00fc a\u00e7'
        );
    });

    menu.addEventListener('click', (event) => {
        if (event.target.closest('a')) {
            menu.classList.remove('open');
            menuButton.setAttribute('aria-expanded', 'false');
            menuButton.setAttribute('aria-label', 'Men\u00fcy\u00fc a\u00e7');
        }
    });
}


// İletişim mesajını kullanıcının e-posta uygulamasında hazırla.



const contactForm = document.querySelector('#contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();

        if (!contactForm.reportValidity()) {
            return;
        }


        // Form alanlarını e-posta konusu ve gövdesine aktar.



        const formData = new FormData(contactForm);
        const subject = encodeURIComponent(
            'Portfolyo ileti\u015fim: ' + formData.get('konu')
        );
        const body = encodeURIComponent(
            'Ad Soyad: ' + formData.get('ad') +
            '\nE-posta: ' + formData.get('eposta') +
            '\n\n' + formData.get('mesaj')
        );

        window.location.href =
            'mailto:kaanaltas2007.72@gmail.com' +
            '?subject=' + subject +
            '&body=' + body;
    });
}
