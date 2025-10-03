class ValidaFormulario {
  constructor() {
    this.formulario = document.querySelector(".formulario");

    this.eventos();
  }

  eventos() {
    this.formulario.addEventListener("submit", (e) => {
      this.handleSubmit(e);
    });

    for (const campo of this.formulario.querySelectorAll('.validar')) {
      campo.addEventListener('blur', (e) => {
        this.handleFieldBlur(e.target);
      });
    }
  }

  handleFieldBlur(campo) {
    // Remove previous error for this field
    const errorText = campo.nextElementSibling;
    if (errorText && errorText.classList.contains('error-text')) {
      errorText.remove();
    }

    const label = campo.previousElementSibling.innerText;
    if (!campo.value) {
      this.criaErro(campo, `Campo "${label}" não pode estar em branco`);
      return; // Stop validation if field is empty
    }

    if (campo.classList.contains("cpf")) {
      this.validaCPF(campo);
    }

    if (campo.classList.contains("usuario")) {
      this.validaUsusario(campo);
    }

    if (campo.classList.contains("senha") || campo.classList.contains("repetir-senha")) {
      const senha = this.formulario.querySelector('.senha');
      const repetirSenha = this.formulario.querySelector('.repetir-senha');
      const errorSenha = senha.nextElementSibling;
      if (errorSenha && errorSenha.classList.contains('error-text')) errorSenha.remove();
      const errorRepetir = repetirSenha.nextElementSibling;
      if (errorRepetir && errorRepetir.classList.contains('error-text')) errorRepetir.remove();
      this.senhasSaoValidas();
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    const camposValidos = this.camposSaoValidos();
    const senhasValidas = this.senhasSaoValidas();
    if (camposValidos && senhasValidas) alert("formulário foi Enviado!");
  }
  senhasSaoValidas() {
    let valid = true;
    const senha = this.formulario.querySelector(".senha");
    const repetirSenha = this.formulario.querySelector(".repetir-senha");

    if (senha.value !== repetirSenha.value) {
      valid = false;
      this.criaErro(senha, "Campos 'Senha' e repetir senha precisar ser iguais");
      this.criaErro(repetirSenha, "Campos 'Senha' e 'repetir senha' precisar ser iguais");
    }

    if (senha.value.length < 6 || senha.value.length > 18) {
      valid = false;
      this.criaErro(senha, "Campo senha precisa estar entre 6 e 12 caracteres ");
    }

    if (repetirSenha.value.length < 6 || repetirSenha.value.length > 18) {
      valid = false;
      this.criaErro(repetirSenha, "Campo repetir senha precisa estar entre 6 e 12 caracteres ");
    }

    return valid;
  }

  camposSaoValidos() {
    let valid = true;
    for (let errorText of this.formulario.querySelectorAll(".error-text")) {
      errorText.remove();
    }

    for (let campo of this.formulario.querySelectorAll(".validar")) {
      const label = campo.previousElementSibling.innerText;
      if (!campo.value) {
        this.criaErro(campo, `Campo "${label}" não pode estar em branco`);
        valid = false;
      }
      if (campo.classList.contains("cpf")) {
        if (!this.validaCPF(campo)) valid = false;
      }
      if (campo.classList.contains("usuario")) {
        if (!this.validaUsusario(campo)) valid = false;
      }
    }
    return valid;
  }

  validaUsusario(campo) {
    const usuario = campo.value;
    let valid = true;
    if (usuario.length < 3 || usuario.length > 20) {
      this.criaErro(campo, "Usuario precisa ter entre 3 e 20 caracteres");
      valid = false;
    }

    if (!usuario.match(/^[a-zA-Z0-9]+$/g)) {
      this.criaErro(campo, "Nome de usuário precisa conter somente letras e/ou números");
      valid = false;
    }

    return valid;
  }

  validaCPF(campo) {
    const cpf = new ValidaCPF(campo.value);
    if (!cpf.valida()) {
      this.criaErro(campo, "CPF inválido");
      return false;
    }
    return true;
  }

  criaErro(campo, msg) {
    const errorText = campo.nextElementSibling;
    if (errorText && errorText.classList.contains('error-text')) {
      return;
    }
    const div = document.createElement("div");
    div.innerHTML = msg;
    div.classList.add("error-text");
    campo.insertAdjacentElement("afterend", div);
  }
}

const valida = new ValidaFormulario();
