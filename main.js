/* ============================================
   ملف JavaScript الرئيسي - منصة المنح الدراسية
   ============================================ */

// انتظار تحميل الصفحة بالكامل قبل تنفيذ الكود
document.addEventListener('DOMContentLoaded', function() {
    
    /* ============================================
       1. تفعيل القائمة النشطة في شريط التنقل
       ============================================ */
    function setActiveNavLink() {
        // الحصول على مسار الصفحة الحالية
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        // الحصول على جميع روابط التنقل
        const navLinks = document.querySelectorAll('.nav-link');
        
        // إزالة الكلاس النشط من جميع الروابط
        navLinks.forEach(link => {
            link.classList.remove('active');
            
            // إضافة الكلاس النشط للرابط المطابق للصفحة الحالية
            const linkHref = link.getAttribute('href');
            if (linkHref === currentPage || 
                (currentPage === '' && linkHref === 'index.html')) {
                link.classList.add('active');
            }
        });
    }
    
    /* ============================================
       2. تأثير التمرير السلس للروابط الداخلية
       ============================================ */
    function smoothScroll() {
        // الحصول على جميع الروابط التي تبدأ بـ #
        const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
        
        smoothScrollLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    /* ============================================
       3. تأثير تغيير شريط التنقل عند التمرير
       ============================================ */
    function navbarScrollEffect() {
        const header = document.querySelector('.header');
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // إضافة تأثير الظل عند التمرير
            if (scrollTop > 50) {
                header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.3)';
                header.style.backgroundColor = 'rgba(74, 14, 23, 0.98)';
            } else {
                header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
                header.style.backgroundColor = 'var(--primary-dark)';
            }
            
            lastScrollTop = scrollTop;
        });
    }
    
    /* ============================================
       4. تأثيرات الظهور عند التمرير (Intersection Observer)
       ============================================ */
    function scrollReveal() {
        // العناصر التي ستحصل على تأثير الظهور
        const elementsToReveal = document.querySelectorAll(
            '.feature-card, .scholarship-card, .form-container, .contact-info, .contact-form-container'
        );
        
        // إنشاء Intersection Observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        // تطبيق الأنماط الأولية ومراقبة العناصر
        elementsToReveal.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'all 0.6s ease';
            observer.observe(element);
        });
    }
    
    /* ============================================
       5. التحقق من صحة النماذج (Form Validation)
       ============================================ */
    function validateForms() {
        // نموذج التقديم
        const applicationForm = document.querySelector('.application-form');
        if (applicationForm) {
            applicationForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // الحصول على جميع الحقول المطلوبة
                const fullname = document.getElementById('fullname');
                const email = document.getElementById('email');
                const phone = document.getElementById('phone');
                const country = document.getElementById('country');
                const scholarship = document.getElementById('scholarship');
                const cv = document.getElementById('cv');
                const motivation = document.getElementById('motivation');
                
                let isValid = true;
                let errorMessage = '';
                
                // التحقق من الاسم الكامل
                if (!fullname.value.trim()) {
                    showError(fullname, 'الرجاء إدخال الاسم الكامل');
                    isValid = false;
                } else if (fullname.value.trim().length < 3) {
                    showError(fullname, 'الاسم يجب أن يكون 3 أحرف على الأقل');
                    isValid = false;
                } else {
                    removeError(fullname);
                }
                
                // التحقق من البريد الإلكتروني
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!email.value.trim()) {
                    showError(email, 'الرجاء إدخال البريد الإلكتروني');
                    isValid = false;
                } else if (!emailRegex.test(email.value.trim())) {
                    showError(email, 'الرجاء إدخال بريد إلكتروني صحيح');
                    isValid = false;
                } else {
                    removeError(email);
                }
                
                // التحقق من رقم الهاتف
                if (!phone.value.trim()) {
                    showError(phone, 'الرجاء إدخال رقم الهاتف');
                    isValid = false;
                } else if (!/^[\+\d\s\-\(\)]{8,20}$/.test(phone.value.trim())) {
                    showError(phone, 'الرجاء إدخال رقم هاتف صحيح');
                    isValid = false;
                } else {
                    removeError(phone);
                }
                
                // التحقق من الدولة
                if (!country.value) {
                    showError(country, 'الرجاء اختيار الدولة');
                    isValid = false;
                } else {
                    removeError(country);
                }
                
                // التحقق من اختيار المنحة
                if (!scholarship.value) {
                    showError(scholarship, 'الرجاء اختيار المنحة');
                    isValid = false;
                } else {
                    removeError(scholarship);
                }
                
                // التحقق من رفع السيرة الذاتية
                if (!cv.files.length) {
                    showError(cv, 'الرجاء رفع السيرة الذاتية');
                    isValid = false;
                } else {
                    const file = cv.files[0];
                    const allowedTypes = ['application/pdf', 'application/msword', 
                                          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
                    if (!allowedTypes.includes(file.type)) {
                        showError(cv, 'الرجاء رفع ملف PDF أو Word فقط');
                        isValid = false;
                    } else if (file.size > 5 * 1024 * 1024) { // 5MB
                        showError(cv, 'حجم الملف يجب أن لا يتجاوز 5 ميجابايت');
                        isValid = false;
                    } else {
                        removeError(cv);
                    }
                }
                
                // التحقق من الرسالة التحفيزية
                if (!motivation.value.trim()) {
                    showError(motivation, 'الرجاء كتابة الرسالة التحفيزية');
                    isValid = false;
                } else if (motivation.value.trim().length < 50) {
                    showError(motivation, 'الرسالة التحفيزية يجب أن تكون 50 حرفاً على الأقل');
                    isValid = false;
                } else {
                    removeError(motivation);
                }
                
                // إذا كان النموذج صحيحاً
                if (isValid) {
                    showSuccessMessage(applicationForm, 'تم إرسال طلبك بنجاح! سنتواصل معك قريباً.');
                    
                    // إعادة تعيين النموذج بعد 3 ثواني
                    setTimeout(() => {
                        applicationForm.reset();
                        removeAllErrors();
                    }, 3000);
                }
            });
        }
        
        // نموذج التواصل
        const contactForm = document.querySelector('.contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const contactName = document.getElementById('contact-name');
                const contactEmail = document.getElementById('contact-email');
                const contactSubject = document.getElementById('contact-subject');
                const contactMessage = document.getElementById('contact-message');
                
                let isValid = true;
                
                // التحقق من الاسم
                if (!contactName.value.trim()) {
                    showError(contactName, 'الرجاء إدخال الاسم الكامل');
                    isValid = false;
                } else {
                    removeError(contactName);
                }
                
                // التحقق من البريد الإلكتروني
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!contactEmail.value.trim()) {
                    showError(contactEmail, 'الرجاء إدخال البريد الإلكتروني');
                    isValid = false;
                } else if (!emailRegex.test(contactEmail.value.trim())) {
                    showError(contactEmail, 'الرجاء إدخال بريد إلكتروني صحيح');
                    isValid = false;
                } else {
                    removeError(contactEmail);
                }
                
                // التحقق من الموضوع
                if (!contactSubject.value.trim()) {
                    showError(contactSubject, 'الرجاء إدخال الموضوع');
                    isValid = false;
                } else {
                    removeError(contactSubject);
                }
                
                // التحقق من الرسالة
                if (!contactMessage.value.trim()) {
                    showError(contactMessage, 'الرجاء كتابة الرسالة');
                    isValid = false;
                } else {
                    removeError(contactMessage);
                }
                
                if (isValid) {
                    showSuccessMessage(contactForm, 'تم إرسال رسالتك بنجاح! سنرد عليك في أقرب وقت.');
                    
                    setTimeout(() => {
                        contactForm.reset();
                        removeAllErrors();
                    }, 3000);
                }
            });
        }
    }
    
    /* ============================================
       6. عرض رسائل الخطأ والنجاح
       ============================================ */
    function showError(inputElement, message) {
        // إزالة أي رسالة خطأ سابقة
        removeError(inputElement);
        
        // إضافة كلاس الخطأ
        inputElement.style.borderColor = '#e74c3c';
        inputElement.style.backgroundColor = '#fff5f5';
        
        // إنشاء عنصر رسالة الخطأ
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `
            color: #e74c3c;
            font-size: 13px;
            margin-top: 5px;
            padding: 5px 10px;
            background-color: #ffe8e8;
            border-radius: 5px;
            animation: shake 0.3s ease;
        `;
        errorDiv.textContent = message;
        
        // إضافة الرسالة بعد الحقل
        inputElement.parentNode.appendChild(errorDiv);
        
        // إضافة تأثير الاهتزاز
        inputElement.style.animation = 'shake 0.3s ease';
        setTimeout(() => {
            inputElement.style.animation = '';
        }, 300);
    }
    
    function removeError(inputElement) {
        // استعادة التنسيق الأصلي
        inputElement.style.borderColor = '';
        inputElement.style.backgroundColor = '';
        
        // إزالة رسالة الخطأ
        const errorDiv = inputElement.parentNode.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.remove();
        }
    }
    
    function removeAllErrors() {
        document.querySelectorAll('.error-message').forEach(error => error.remove());
        document.querySelectorAll('.form-input').forEach(input => {
            input.style.borderColor = '';
            input.style.backgroundColor = '';
        });
    }
    
    function showSuccessMessage(formElement, message) {
        // إزالة أي رسائل سابقة
        const existingMessage = formElement.querySelector('.success-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // إنشاء رسالة النجاح
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.style.cssText = `
            background-color: #27ae60;
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            margin-bottom: 20px;
            text-align: center;
            font-size: 16px;
            font-weight: bold;
            animation: slideDown 0.5s ease;
        `;
        successDiv.textContent = '✅ ' + message;
        
        // إضافة الرسالة قبل النموذج
        formElement.insertBefore(successDiv, formElement.firstChild);
        
        // إزالة الرسالة بعد فترة
        setTimeout(() => {
            if (successDiv) {
                successDiv.style.animation = 'slideUp 0.5s ease';
                setTimeout(() => successDiv.remove(), 500);
            }
        }, 5000);
    }
    
    /* ============================================
       7. عداد تنازلي للمواعيد النهائية للمنح
       ============================================ */
    function initializeCountdowns() {
        const scholarships = [
            { selector: '.scholarship-card:nth-child(1)', date: '2024-12-15' },
            { selector: '.scholarship-card:nth-child(2)', date: '2025-01-20' },
            { selector: '.scholarship-card:nth-child(3)', date: '2025-03-10' },
            { selector: '.scholarship-card:nth-child(4)', date: '2025-02-05' },
            { selector: '.scholarship-card:nth-child(5)', date: '2025-04-30' },
            { selector: '.scholarship-card:nth-child(6)', date: '2024-12-31' }
        ];
        
        scholarships.forEach(scholarship => {
            const card = document.querySelector(scholarship.selector);
            if (!card) return;
            
            const countdownDate = new Date(scholarship.date).getTime();
            
            // إنشاء عنصر العداد
            const countdownDiv = document.createElement('div');
            countdownDiv.className = 'countdown-timer';
            countdownDiv.style.cssText = `
                background-color: #f8f9fa;
                padding: 10px;
                border-radius: 8px;
                margin: 10px 0;
                text-align: center;
                font-weight: bold;
                color: #c0392b;
                border: 1px solid #e0e0e0;
            `;
            
            // إضافة العداد بعد تفاصيل المنحة
            const detailsDiv = card.querySelector('.scholarship-details');
            if (detailsDiv) {
                detailsDiv.after(countdownDiv);
            }
            
            // تحديث العداد كل ثانية
            function updateCountdown() {
                const now = new Date().getTime();
                const distance = countdownDate - now;
                
                if (distance < 0) {
                    countdownDiv.textContent = '⏰ انتهى موعد التقديم';
                    countdownDiv.style.color = '#95a5a6';
                    clearInterval(countdownInterval);
                    return;
                }
                
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                
                countdownDiv.textContent = `⏳ متبقي ${days} يوم و ${hours} ساعة للتقديم`;
                
                // تغيير اللون حسب الوقت المتبقي
                if (days < 7) {
                    countdownDiv.style.color = '#e74c3c';
                    countdownDiv.style.backgroundColor = '#ffe8e8';
                } else if (days < 30) {
                    countdownDiv.style.color = '#f39c12';
                    countdownDiv.style.backgroundColor = '#fff8e1';
                }
            }
            
            updateCountdown();
            const countdownInterval = setInterval(updateCountdown, 3600000); // تحديث كل ساعة
        });
    }
    
    /* ============================================
       8. تأثيرات إضافية للبطاقات
       ============================================ */
    function addCardEffects() {
        // تأثير الـ hover على بطاقات المنح
        document.querySelectorAll('.scholarship-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px) scale(1.02)';
                this.style.transition = 'all 0.3s ease';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
        
        // تأثير الـ hover على بطاقات المميزات
        document.querySelectorAll('.feature-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                const icon = this.querySelector('.feature-icon');
                if (icon) {
                    icon.style.transform = 'scale(1.2) rotate(10deg)';
                    icon.style.transition = 'all 0.3s ease';
                }
            });
            
            card.addEventListener('mouseleave', function() {
                const icon = this.querySelector('.feature-icon');
                if (icon) {
                    icon.style.transform = 'scale(1) rotate(0deg)';
                }
            });
        });
    }
    
    /* ============================================
       9. زر العودة إلى الأعلى
       ============================================ */
    function createScrollToTopButton() {
        // إنشاء زر العودة إلى الأعلى
        const scrollButton = document.createElement('button');
        scrollButton.innerHTML = '⬆';
        scrollButton.className = 'scroll-to-top';
        scrollButton.setAttribute('aria-label', 'العودة إلى الأعلى');
        scrollButton.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 30px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: var(--accent);
            color: white;
            border: none;
            font-size: 24px;
            cursor: pointer;
            display: none;
            z-index: 999;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(scrollButton);
        
        // إظهار وإخفاء الزر حسب التمرير
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollButton.style.display = 'block';
                scrollButton.style.animation = 'fadeIn 0.3s ease';
            } else {
                scrollButton.style.display = 'none';
            }
        });
        
        // التمرير إلى الأعلى عند النقر
        scrollButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // تأثير hover على الزر
        scrollButton.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(360deg)';
            this.style.backgroundColor = 'var(--accent-hover)';
        });
        
        scrollButton.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
            this.style.backgroundColor = 'var(--accent)';
        });
    }
    
    /* ============================================
       10. عرض السنة الحالية في حقوق النشر
       ============================================ */
    function updateCopyrightYear() {
        const footerBottom = document.querySelector('.footer-bottom p');
        if (footerBottom) {
            const currentYear = new Date().getFullYear();
            footerBottom.innerHTML = footerBottom.innerHTML.replace('2024', currentYear);
        }
    }
    
    /* ============================================
       11. تأثير كتابة النص في القسم الترحيبي
       ============================================ */
    function typeWriterEffect() {
        const heroTitle = document.querySelector('.hero-title');
        if (!heroTitle) return;
        
        const originalText = heroTitle.textContent;
        heroTitle.textContent = '';
        heroTitle.style.borderLeft = '3px solid var(--accent-hover)';
        heroTitle.style.paddingLeft = '10px';
        
        let i = 0;
        function type() {
            if (i < originalText.length) {
                heroTitle.textContent += originalText.charAt(i);
                i++;
                setTimeout(type, 50);
            } else {
                heroTitle.style.borderLeft = 'none';
                heroTitle.style.paddingLeft = '0';
            }
        }
        
        // بدء التأثير بعد تحميل الصفحة
        setTimeout(type, 500);
    }
    
    /* ============================================
       12. معاينة الملف المرفوع
       ============================================ */
    function filePreview() {
        const fileInput = document.getElementById('cv');
        if (!fileInput) return;
        
        fileInput.addEventListener('change', function() {
            const file = this.files[0];
            if (!file) return;
            
            // إنشاء أو تحديث عنصر عرض الملف
            let fileInfo = this.parentNode.querySelector('.file-info');
            if (!fileInfo) {
                fileInfo = document.createElement('div');
                fileInfo.className = 'file-info';
                fileInfo.style.cssText = `
                    margin-top: 10px;
                    padding: 10px;
                    background-color: #e8f5e9;
                    border-radius: 5px;
                    font-size: 14px;
                    color: #27ae60;
                `;
                this.parentNode.appendChild(fileInfo);
            }
            
            const fileSize = (file.size / 1024).toFixed(2);
            fileInfo.textContent = `📄 ${file.name} (${fileSize} KB)`;
        });
    }
    
    /* ============================================
       13. تحسين تجربة النماذج
       ============================================ */
    function enhanceFormExperience() {
        document.querySelectorAll('.form-input').forEach(input => {
            // إضافة تأثير عند التركيز
            input.addEventListener('focus', function() {
                this.closest('.form-group').querySelector('.form-label').style.color = 'var(--accent)';
            });
            
            input.addEventListener('blur', function() {
                this.closest('.form-group').querySelector('.form-label').style.color = '';
            });
            
            // تحويل النص إلى أحرف كبيرة في حقل الاسم
            if (input.id === 'fullname' || input.id === 'contact-name') {
                input.addEventListener('input', function() {
                    this.style.textTransform = 'capitalize';
                });
            }
        });
    }
    
    /* ============================================
       14. منع إرسال النموذج بالضغط على Enter
       ============================================ */
    function preventEnterSubmit() {
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
                const form = e.target.closest('form');
                if (form && e.target.type !== 'submit') {
                    e.preventDefault();
                    // الانتقال إلى الحقل التالي
                    const inputs = Array.from(form.querySelectorAll('input:not([type="hidden"])'));
                    const currentIndex = inputs.indexOf(e.target);
                    if (currentIndex < inputs.length - 1) {
                        inputs[currentIndex + 1].focus();
                    }
                }
            }
        });
    }
    
    /* ============================================
       15. تحميل الخطوط من Google Fonts
       ============================================ */
    function loadGoogleFonts() {
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
        
        // تطبيق الخط على body بعد التحميل
        document.body.style.fontFamily = "'Cairo', 'Segoe UI', Tahoma, sans-serif";
    }
    
    /* ============================================
       تهيئة جميع الوظائف
       ============================================ */
    function init() {
        setActiveNavLink();
        smoothScroll();
        navbarScrollEffect();
        scrollReveal();
        validateForms();
        initializeCountdowns();
        addCardEffects();
        createScrollToTopButton();
        updateCopyrightYear();
        filePreview();
        enhanceFormExperience();
        preventEnterSubmit();
        loadGoogleFonts();
        
        // تشغيل تأثير الكتابة في الصفحة الرئيسية فقط
        if (window.location.pathname.includes('index.html') || 
            window.location.pathname === '/' || 
            window.location.pathname === '') {
            typeWriterEffect();
        }
        
        console.log('🚀 منصة المنح الدراسية جاهزة للعمل!');
        console.log('✅ جميع الوظائف تم تحميلها بنجاح');
    }
    
    // بدء التطبيق
    init();
});

/* ============================================
   إضافة أنماط CSS ديناميكية للرسوم المتحركة
   ============================================ */
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
    
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-20px);
        }
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    .success-message {
        animation: slideDown 0.5s ease;
    }
    
    .error-message {
        animation: shake 0.3s ease;
    }
    
    .scroll-to-top:hover {
        animation: pulse 0.5s ease infinite;
    }
`;
document.head.appendChild(style);