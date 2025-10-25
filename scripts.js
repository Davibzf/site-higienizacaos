// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    
    // ========== MENU MOBILE ==========
    const btnMobile = document.getElementById('btn-mobile');
    const menu = document.getElementById('menu');
    
    function toggleMenu() {
        const isActive = menu.classList.contains('active');
        btnMobile.classList.toggle('active');
        menu.classList.toggle('active');
        btnMobile.setAttribute('aria-expanded', !isActive);
    }
    
    btnMobile.addEventListener('click', toggleMenu);
    
    // Fechar menu ao clicar em um link
    const menuLinks = document.querySelectorAll('#menu a');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            btnMobile.classList.remove('active');
            menu.classList.remove('active');
            btnMobile.setAttribute('aria-expanded', 'false');
        });
    });
    
    // ========== HEADER SCROLL ==========
    const header = document.getElementById('header');
    
    function headerScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', headerScroll);
    
    // ========== ANIMAÇÃO AO ROLAR ==========
    const fadeElements = document.querySelectorAll('.service-card, .step, .feature, .pricing-card, .gallery-item, .testimonial-card, .faq-item, .about-content, .about-image, .contact-info, .contact-form');
    
    function checkScroll() {
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('visible');
            }
        });
    }
    
    // Verifica elementos visíveis ao carregar e ao rolar
    window.addEventListener('load', checkScroll);
    window.addEventListener('scroll', checkScroll);
    
    // ========== FAQ ACCORDION ==========
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const isActive = answer.classList.contains('active');
            
            // Fecha todas as respostas
            document.querySelectorAll('.faq-answer').forEach(item => {
                item.classList.remove('active');
            });
            
            // Remove a classe active de todas as perguntas
            document.querySelectorAll('.faq-question').forEach(item => {
                item.classList.remove('active');
            });
            
            // Se não estava ativa, abre esta
            if (!isActive) {
                answer.classList.add('active');
                question.classList.add('active');
            }
        });
    });
    
    // ========== FORMULÁRIO DE CONTATO ==========
    const contactForm = document.getElementById('contact-form');
    const confirmationModal = document.getElementById('confirmation-modal');
    const closeModal = document.querySelector('.close-modal');
    const closeConfirmation = document.getElementById('close-confirmation');
    
    // Máscara para telefone
    const phoneInput = document.getElementById('phone');
    
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length <= 10) {
            value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
        } else {
            value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
        }
        
        e.target.value = value;
    });
    
    // Validação e envio do formulário
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validação básica
        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const email = document.getElementById('email').value.trim();
        const service = document.getElementById('service').value;
        const date = document.getElementById('date').value;
        const message = document.getElementById('message').value.trim();
        
        let isValid = true;
        
        // Validação de nome
        if (name === '') {
            showError('name', 'Por favor, informe seu nome');
            isValid = false;
        } else {
            removeError('name');
        }
        
        // Validação de telefone
        const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
        if (!phoneRegex.test(phone)) {
            showError('phone', 'Por favor, informe um telefone válido');
            isValid = false;
        } else {
            removeError('phone');
        }
        
        // Validação de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showError('email', 'Por favor, informe um e-mail válido');
            isValid = false;
        } else {
            removeError('email');
        }
        
        // Validação de serviço
        if (service === '') {
            showError('service', 'Por favor, selecione um serviço');
            isValid = false;
        } else {
            removeError('service');
        }
        
        // Se tudo estiver válido, enviar para WhatsApp
        if (isValid) {
            enviarParaWhatsApp(name, phone, email, service, date, message);
        }
    });
    
    // Função para enviar dados para WhatsApp
    function enviarParaWhatsApp(nome, telefone, email, servico, data, mensagem) {
        // Número do WhatsApp da empresa
        const numeroWhatsApp = '5585991945040'; // (85) 99194-5040
        
        // Mapear serviços para nomes legíveis
        const servicosMap = {
            'sofa': 'Limpeza de Sofá',
            'colchao': 'Limpeza de Colchão',
            'cadeira': 'Limpeza de Cadeira',
            'automotivo': 'Limpeza Automotiva',
            'tapete': 'Limpeza de Tapete',
            'outro': 'Outro Serviço'
        };
        
        // Formatar data se existir
        const dataFormatada = data ? new Date(data).toLocaleDateString('pt-BR') : 'Não informada';
        
        // Criar mensagem formatada
        const textoMensagem = `*HIGIENIZATOP*%0A%0A` +
                             `*Nome:* ${nome}%0A` +
                             `*Telefone:* ${telefone}%0A` +
                             `*E-mail:* ${email}%0A` +
                             `*Serviço Desejado:* ${servicosMap[servico]}%0A` +
                             `*Data Preferida:* ${dataFormatada}%0A` +
                             `*Mensagem:* ${mensagem || 'Não informada'}`;
        
        // Criar URL do WhatsApp
        const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${textoMensagem}`;
        
        // Abrir WhatsApp em nova aba
        window.open(urlWhatsApp, '_blank');
        
        // Mostrar modal de confirmação
        confirmationModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        contactForm.reset();
    }
    
    // Funções auxiliares para validação
    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const formGroup = field.closest('.form-group');
        
        // Remove mensagem de erro existente
        const existingError = formGroup.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Adiciona mensagem de erro
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.style.color = '#e74c3c';
        errorElement.style.fontSize = '0.9rem';
        errorElement.style.marginTop = '5px';
        errorElement.textContent = message;
        
        formGroup.appendChild(errorElement);
        
        // Adiciona estilo de erro ao campo
        field.style.borderColor = '#e74c3c';
    }
    
    function removeError(fieldId) {
        const field = document.getElementById(fieldId);
        const formGroup = field.closest('.form-group');
        
        // Remove mensagem de erro
        const existingError = formGroup.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Remove estilo de erro
        field.style.borderColor = '';
    }
    
    // Fechar modal de confirmação
    closeModal.addEventListener('click', () => {
        confirmationModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    closeConfirmation.addEventListener('click', () => {
        confirmationModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    // Fechar modal clicando fora
    confirmationModal.addEventListener('click', (e) => {
        if (e.target === confirmationModal) {
            confirmationModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // ========== SCROLL SUAVE ==========
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ========== ATUALIZAR ANO NO FOOTER ==========
    const currentYear = new Date().getFullYear();
    const yearElement = document.getElementById('current-year');
    
    if (yearElement) {
        yearElement.textContent = currentYear;
    }
    
    // ========== INICIALIZAÇÃO ==========
    // Executa funções iniciais
    headerScroll();
    checkScroll();
});
