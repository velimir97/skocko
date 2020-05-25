import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { UserModel } from '../models/user.model';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  public vreme: number = 60;
  public tajmer;
  public startTajmer: boolean = false;
  public i: number = 1;
  public j: number = 1;
  public tr_komb: number[] = [];
  public kombinacija: number[] = [];
  public pogodjena_komb: boolean = false;
  public prikazi_rez: boolean = false;

  public pogodakForm: FormGroup;

  private scoreUrl: string = "http://localhost:3000/";

  public rezultati: UserModel[] = [];

  constructor(private formBuilder: FormBuilder,
              private http: HttpClient) { 
    this.pogodakForm = this.formBuilder.group({
      ime: ['', [Validators.required, Validators.pattern("[a-zA-Z][a-zA-Z0-9]+")]]
    });
  }

  public playFunction() {
    if (!this.startTajmer) {
      this.startTajmer = true;

      this.tajmer = window.setInterval(() => {
        this.vremeFunction();
      }, 1000);

      this.inicijalizacija();
    }
  }

  public restartFunction() {
    for (let i = 1; i <= 6; i++) {
      for (let j = 1; j <= 4; j++) {
          let number_k = "k" + i + j;
          let number_o = "o" + i + j;
          document.getElementById(number_k).style.backgroundImage = "none";
          document.getElementById(number_o).style.backgroundColor = "aqua";
      }
    }

    this.vreme = 60;
    this.pogodjena_komb = false;
    this.prikazi_rez = false;
    clearInterval(this.tajmer);
    this.startTajmer = false;
    this.i = 1; this.j = 1;
    this.tr_komb.splice(0, 4);

    this.inicijalizacija();
  }

  public logoFunction(logo) {
    if (!this.startTajmer) {
      return;
    }

    let ime_kocke = "k" + this.i + this.j;

    var kocka = document.getElementById(ime_kocke);

    var slika = "url('../../assets/" + logo + ".jpeg')";

    kocka.style.backgroundImage = slika;

    this.tr_komb.push(logo);

    if (this.j < 4) {
      this.j++;
    } else if (this.i < 6) {
        if (this.proveraFunction()) {
          clearInterval(this.tajmer);
          this.startTajmer = false;
          this.pogodjena_komb = true;
        }
        this.tr_komb.splice(0, 4);
        this.i++;
        this.j = 1;
    } else {
        if (this.proveraFunction()) {
          clearInterval(this.tajmer);
          this.startTajmer = false;
          this.pogodjena_komb = true;
        } else {
          this.startTajmer = false;
          window.alert("Niste uspeli da pogodite kombinaciju");
          this.restartFunction();
        }
    }
  }

  public sacuvajRezultat(podaciForm) {
    const rez = 60 - this.vreme;
    const body = {
      name: podaciForm.ime,
      score: rez
    };
    this.http.post(this.scoreUrl, body).subscribe(res => {
      this.dohvatiRezultate();
    });
  }

  public onNewGame() {
    this.pogodjena_komb = false;
    this.prikazi_rez = false;
    this.startTajmer = false;
    this.vreme = 60;
    this.i = 1;
    this.j = 1;

    clearInterval(this.tajmer);

    this.restartFunction();
  }

  private dohvatiRezultate() {
    this.http.get<UserModel[]>(this.scoreUrl).subscribe(rez => {
      this.rezultati = rez;
    });
    this.prikazi_rez = true;
  }

  private proveraFunction(): boolean {
    if (this.kombinacija.length != this.tr_komb.length)
        return false;

    let br_tr_komb = [0, 0, 0, 0, 0, 0];
    let br_komb = [0, 0, 0, 0, 0, 0];

    let br_tacnih = 0;
    let br_postojecih = 0;

    for (let i = 0; i < 4; i++) {
        if (this.kombinacija[i] == this.tr_komb[i])
            br_tacnih++;
        else {
            br_tr_komb[this.tr_komb[i]-1]++;
            br_komb[this.kombinacija[i]-1]++;
        }
    }

    for (let i = 0; i < 6; i++) {
        if (br_komb[i] <= br_tr_komb[i])
            br_postojecih += br_komb[i];
        else
            br_postojecih += br_tr_komb[i];
    }

    if (br_tacnih == 4) {
        this.sviCrvenoFunciton();
        return true;
    } else {
        this.pomocFuncition(br_tacnih, br_postojecih);
        return false;
    }
  }

  private sviCrvenoFunciton() {
    for (var k = 1; k <= 4; k++) {
        let id_kruga = "o" + this.i + k;
        document.getElementById(id_kruga).style.backgroundColor = "red";
    }
  }

  private pomocFuncition(br_tacnih, br_postojecih) {
    for (var k = 1; k <= br_tacnih; k++) {
        let id_kruga = "o" + this.i + k;
        document.getElementById(id_kruga).style.backgroundColor = "red";
    }
    for (; k <= br_tacnih+br_postojecih; k++) {
        let id_kruga = "o" + this.i + k;
        document.getElementById(id_kruga).style.backgroundColor = "yellow";
    }
}

  private vremeFunction() {
    if (this.vreme < 60) {
      document.getElementById("vreme").innerHTML = this.vreme.toString();
    }
    if (this.vreme > 0) {
      this.vreme--;
    } else {
      clearInterval(this.tajmer);
      this.startTajmer = false;
      window.alert("Niste uspeli da pogodite kombinacijiu!!!");
      this.restartFunction();
    }
  }

  private inicijalizacija() {
    this.kombinacija.splice(0, 4);
    this.pogodjena_komb = false;

    this.kombinacija.push(Math.floor(Math.random()*6) + 1);
    this.kombinacija.push(Math.floor(Math.random()*6) + 1);
    this.kombinacija.push(Math.floor(Math.random()*6) + 1);
    this.kombinacija.push(Math.floor(Math.random()*6) + 1);
  }

  ngOnInit(): void {
  }

}
