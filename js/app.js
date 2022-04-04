'use strict'

const switcher = document.querySelector('.btn');

switcher.addEventListener('click', function () {
  document.body.classList.toggle('dark-theme')

  var className = document.body.className;
  if (className == "light-theme") {
    this.textContent = "Dark";
  }
  else {
    this.textContent = "Light";
  }

  //console.log('nom classe actuelle: ' + className);

});

//on déclare des variables pour les mesures
var accelerometer = null;


var takeMesureAcl = false;


//on déclare des variables pour les boutons
var switcherAcl = document.getElementById('btn_acl');


//on déclare des variables pour les textes
var txtAclx = document.getElementById("aclx");
var txtAcly = document.getElementById("acly");
var txtAclz = document.getElementById("aclz");
var txtPas = document.getElementById("nbrepas");


//on déclare des variables et les constantes pour les fonctions
let SEUIL_MARCHE = 6;
var magnitudePrecedente = 0;
var nbrePas = 0;
var distanceParcourue = 0;


//########### FONCTIONS PRINCIPALES DE MESURES ###########
function prendreMesureAcl(){
  if (! takeMesureAcl) {
    switcherAcl.style.backgroundColor = 'red';
    switcherAcl.textContent = 'Arrêter Mesures Acl';
    takeMesureAcl = true;
  }
  else if(takeMesureAcl) {
    switcherAcl.style.backgroundColor = 'green';
    switcherAcl.textContent = 'Prendre Mesures Acl';
    takeMesureAcl = false;
  }
  try {
    accelerometer = new Accelerometer({ frequency: 10 });
    accelerometer.onerror = (event) => {
      // Handle runtime errors.
      if (event.error.name === 'NotAllowedError') {
        console.log('Permission to access sensor Acl was denied.');
      } else if (event.error.name === 'NotReadableError') {
        console.log('Cannot connect to the sensor Acl.');
      }
    };
      accelerometer.addEventListener('reading', function lecture(){
        //console.info("affichage mesure en cours, take = " + takeMesureAcl + ", aff = " + afficherMesure);
        if (takeMesureAcl){
          //console.log("Valeur accélération : \n-x = " + accelerometer.x + "\n-y = " + accelerometer.y + "\n-z = " + accelerometer.z + "\n\n");
          
          //on affiche les valeurs de l'accéléromètre
          txtAclx.innerHTML = "- Valeur de x: " + accelerometer.x.toFixed(4);
          txtAcly.innerHTML = "- Valeur de y: " + accelerometer.y.toFixed(4);
          txtAclz.innerHTML = "- Valeur de z: " + accelerometer.z.toFixed(4);

          //on calcule le nombre de pas
          calculNombrePas(accelerometer.x, accelerometer.y, accelerometer.z);
        }
      });
      if (takeMesureAcl){
        accelerometer.start();
      }else{
        console.info("Arrêt des mesures Acl");
        txtAclx.innerHTML = "- Valeur de x: " + "";
        txtAcly.innerHTML = "- Valeur de y: " + "";
        txtAclz.innerHTML = "- Valeur de z: " + "";
        txtPas.innerHTML = "- Nombre de pas: " + "";
        accelerometer.removeEventListener('reading', lecture);
        accelerometer.stop();
      }
  } catch (error) {
    // Handle construction errors.
    if (error.name === 'SecurityError') {
      console.log('Sensor Acl construction was blocked by the Permissions Policy.');
    } else if (error.name === 'ReferenceError') {
      console.log('Sensor Acl is not supported by the User Agent.');
    } else {
      throw error;
    }
  }
}



//########### FONCTIONS SECONDAIRES POUR DIFFERENT CALCUL ###########
function calculNombrePas(acclx, accly, acclz){
  var magnitude = Math.sqrt(acclx*acclx + accly*accly + acclz*acclz);
  var magnitudeDelta = magnitude - magnitudePrecedente;
  magnitudePrecedente = magnitude;

  if(magnitudeDelta > SEUIL_MARCHE){
    nbrePas ++;
    console.log("Nombre de pas ajouté : " + nbrePas)
  }
  txtPas.innerHTML = "- Nombre de pas: " + nbrePas;

}
