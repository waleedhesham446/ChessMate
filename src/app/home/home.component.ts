import { Component, OnInit } from '@angular/core';
import Swal, { SweetAlertResult } from 'sweetalert2';

import { ApplyMove, MessageType, MoveAction } from '../shared/Types';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public chessUrl: string = `${window.origin}/iframepage`;
  private chessBoard1: HTMLIFrameElement;
  private chessBoard2: HTMLIFrameElement;
  private previousFEN: string;

  constructor() { }

  ngOnInit(): void {

    this.getPreviousGame();
    
    this.initGame();

    this.initMainListener();
  }

  initGame(): void {
    this.chessBoard1 = (document.getElementById('board-1') as HTMLIFrameElement);
    this.chessBoard2 = (document.getElementById('board-2') as HTMLIFrameElement);
    
    this.chessBoard1.addEventListener("load", () => {
      this.chessBoard1.contentWindow?.postMessage({
        type: MessageType.ASSIGN_ROLE,
        role: 1,
        FEN: this.previousFEN
      });
    });
    
    this.chessBoard2.addEventListener("load", () => {
      this.chessBoard2.contentWindow?.postMessage({
        type: MessageType.ASSIGN_ROLE,
        role: 2,
        FEN: this.previousFEN
      });
    });
  }

  initMainListener(): void {
    window.addEventListener("message", (event: MessageEvent) => {
      
      if (event.origin !== window.origin) return;

      if (event.data?.type === MessageType.MOVE) this.moveHandler(event.data);
      else if(event.data?.type === MessageType.GAME_END) this.checkRestart(event.data?.winnerColor);
      
    }, false);
  }

  getPreviousGame(): void {
    this.previousFEN = localStorage.getItem('FEN') as string;
    localStorage.removeItem('FEN');
  }
  
  moveHandler({ player, move }: MoveAction): void {

    const applyMove: ApplyMove = {
      type: MessageType.APPLY_MOVE,
      move
    }
    if(player === 1) {
      this.chessBoard2.contentWindow?.postMessage(applyMove);
    }else if(player === 2) {
      this.chessBoard1.contentWindow?.postMessage(applyMove);
    }else {
      console.error('SOME THING WENT WRONG HANDLING THE MOVE');
    }
  }

  async checkRestart(winner: number): Promise<void> {
    const result: SweetAlertResult = await Swal.fire({
      title: `${winner} player won`,
      text: 'Create new game?',
      imageUrl: 'https://img.freepik.com/free-vector/neon-glitch-background_52683-3079.jpg?w=2000',
      imageWidth: 400,
      imageHeight: 200,
      imageAlt: 'Custom image',
    });

    if(!result.isConfirmed) return;
    
    this.restartGame();
  }

  restartGame(): void {
    this.chessBoard1.contentWindow?.postMessage({ type: MessageType.RESTART });
    this.chessBoard2.contentWindow?.postMessage({ type: MessageType.RESTART });
  }
}
