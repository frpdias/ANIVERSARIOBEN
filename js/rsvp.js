document.getElementById("rsvp-form").addEventListener("submit", function(e){
  e.preventDefault();

  document.getElementById("rsvp-msg").innerText = "Presença confirmada! 🎉";
});
