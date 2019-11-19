var vreme = 59;
var tajmer;
var startTajmer = false;
var i = 1;
var j = 1;
var tr_komb = [];
var kombinacija = [];

function playFunction() {

    if (!startTajmer) {
        startTajmer = true;

        tajmer = window.setInterval(function() {
            vremeFunciton();
        }, 1000);

        inicijalizacija();
    }
}

function restartFunction() {
    for (let i = 1; i <= 6; i++) {
        for (let j = 1; j <= 4; j++) {
            let number_k = "k" + i + j;
            let number_o = "o" + i + j;
            document.getElementById(number_k).style.backgroundImage = "none";
            document.getElementById(number_o).style.backgroundColor = "orangered";
        }
    }

    vreme = 60;
    clearInterval(tajmer);
    startTajmer = false;
    i = 1; j = 1;
    tr_komb.splice(0, 4);
}

function vremeFunciton() {
    if (vreme < 60) {
        document.getElementById("vreme").innerHTML = vreme;
    }
    if (vreme > 0) {
        vreme--;
    } else {
        clearInterval(tajmer);
        startTajmer = false;
        window.alert("Niste uspeli da resite igru!!!");
    }
}

function logoFunction(logo) {
    if (!startTajmer) {
        return;
    }

    ime_kocke = "k" + i + j;

    var kocka = document.getElementById(ime_kocke);

    var slika = "url('" + logo + ".jpeg')";
    
    kocka.style.backgroundImage = slika;

    tr_komb.push(logo);

    if (j < 4) {
        j++;
    } else if (i < 6) {
        if (proveraFunciton()) {
            clearInterval(tajmer);
            startTajmer = false;
            window.alert("Pogodili ste kombinaciju");
        }
        tr_komb.splice(0, 4);
        i++;
        j = 1;
    } else {
        if (proveraFunciton()) {
            clearInterval(tajmer);
            startTajmer = false;
            window.alert("Pogodili ste kombinaciju");
        } else {
            startTajmer = false;
            window.alert("Niste uspeli da pogodite");
        }
    }
}

function inicijalizacija() {
    kombinacija.splice(0, 4);

    kombinacija.push(Math.floor(Math.random()*6) + 1);
    kombinacija.push(Math.floor(Math.random()*6) + 1);
    kombinacija.push(Math.floor(Math.random()*6) + 1);
    kombinacija.push(Math.floor(Math.random()*6) + 1);

}

function proveraFunciton() {
    if (kombinacija.length != tr_komb.length)
        return false;

    let br_tr_komb = [0, 0, 0, 0, 0, 0];
    let br_komb = [0, 0, 0, 0, 0, 0];

    let br_tacnih = 0;
    let br_postojecih = 0;

    for (let i = 0; i < 4; i++) {
        if (kombinacija[i] == tr_komb[i])
            br_tacnih++;
        else {
            br_tr_komb[tr_komb[i]-1]++;
            br_komb[kombinacija[i]-1]++;
        }
    }

    for (let i = 0; i < 6; i++) {
        if (br_komb[i] <= br_tr_komb[i])
            br_postojecih += br_komb[i];
        else
            br_postojecih += br_tr_komb[i];
    }

    if (br_tacnih == 4) {
        sviCrvenoFunciton();
        return true;
    } else {
        pomocFuncition(br_tacnih, br_postojecih);
        return false;
    }
}

function pomocFuncition(br_tacnih, br_postojecih) {
    for (var k = 1; k <= br_tacnih; k++) {
        let id_kruga = "o" + i + k;
        document.getElementById(id_kruga).style.backgroundColor = "red";
    }
    for (; k <= br_tacnih+br_postojecih; k++) {
        let id_kruga = "o" + i + k;
        document.getElementById(id_kruga).style.backgroundColor = "yellow";
    }
}

function sviCrvenoFunciton() {
    for (var k = 1; k <= 4; k++) {
        let id_kruga = "o" + i + k;
        document.getElementById(id_kruga).style.backgroundColor = "red";
    }
}