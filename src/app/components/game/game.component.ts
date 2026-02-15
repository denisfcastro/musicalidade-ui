import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MusicaService } from '../../services/musica.service';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent implements OnInit {
  escalaAtual: string[] = [];
  tomBase: string = 'C';
  opcaoEsquerda: string = '';
  opcaoDireita: string = '';
  respostaCorreta: string = '';
  statusResposta: string = ''; // 'correct' ou 'wrong'

  todasNotas: string[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  constructor(private musicaService: MusicaService) {}

  ngOnInit() {
    this.proximoDesafio();
  }

  proximoDesafio() {
    this.tomBase = this.todasNotas[Math.floor(Math.random() * this.todasNotas.length)];

    this.musicaService.getEscalaMaior(this.tomBase).subscribe({
      next: (dados) => {
        this.escalaAtual = dados;
        this.gerarOpcoes();
      },
      error: (err) => console.error('Erro na API:', err)
    });
  }

  gerarOpcoes() {
    // Pega notas da escala (excluindo a tônica)
    const notasDaEscala = this.escalaAtual.filter(n => n !== this.tomBase);
    this.respostaCorreta = notasDaEscala[Math.floor(Math.random() * notasDaEscala.length)];

    // Pega notas que NÃO estão na escala
    const notasErradas = this.todasNotas.filter(n => !this.escalaAtual.includes(n));
    const notaErrada = notasErradas[Math.floor(Math.random() * notasErradas.length)];

    if (Math.random() > 0.5) {
      this.opcaoEsquerda = this.respostaCorreta;
      this.opcaoDireita = notaErrada;
    } else {
      this.opcaoEsquerda = notaErrada;
      this.opcaoDireita = this.respostaCorreta;
    }
  }

  verificarResposta(notaClicada: string) {
    if (this.statusResposta !== '') return;

    if (notaClicada === this.respostaCorreta) {
      this.statusResposta = 'correct';
      setTimeout(() => {
        this.statusResposta = '';
        this.proximoDesafio();
      }, 800);
    } else {
      this.statusResposta = 'wrong';
      setTimeout(() => this.statusResposta = '', 500);
    }
  }
  mostrarGabarito: boolean = false;
}
