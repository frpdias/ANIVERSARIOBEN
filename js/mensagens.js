document.getElementById("msg-form").addEventListener("submit", function(e){
  e.preventDefault();

  document.getElementById("msg-retorno").innerText = 
    "Sua mensagem foi enviada! Obrigado 💙";
});
