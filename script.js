const revealElements = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.18,
  }
);

revealElements.forEach((element) => observer.observe(element));

const leadForm = document.getElementById('leadForm');
const formFeedback = document.getElementById('formFeedback');
const submitButton = leadForm.querySelector('button[type="submit"]');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

leadForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(leadForm);
  const nome = String(formData.get('nome') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const perfil = String(formData.get('perfil') || '').trim();
  const objetivo = String(formData.get('objetivo') || '').trim();

  if (!nome || !email || !perfil || !objetivo) {
    showFeedback('Preencha todos os campos para receber seu diagnostico.', false);
    return;
  }

  if (!emailRegex.test(email)) {
    showFeedback('Digite um email valido para continuarmos.', false);
    return;
  }

  // Envia os dados para o email configurado sem precisar de backend.
  formData.set('_subject', `Novo lead ZET MEDIA - ${nome}`);

  submitButton.disabled = true;
  submitButton.textContent = 'Enviando...';
  showFeedback('Enviando seus dados...', true);

  try {
    const response = await fetch('https://formsubmit.co/ajax/arthursouzagtba@gmail.com', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Falha ao enviar formulario.');
    }

    showFeedback('Perfeito! Seus dados foram enviados. Em breve entraremos em contato.', true);
    leadForm.reset();
  } catch (error) {
    showFeedback('Nao foi possivel enviar agora. Tente novamente em instantes.', false);
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = 'Quero meu diagnostico';
  }
});

function showFeedback(message, isSuccess) {
  formFeedback.textContent = message;
  formFeedback.classList.toggle('success', isSuccess);
  formFeedback.classList.toggle('error', !isSuccess);
}
