import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mnemonic-phrase',
  templateUrl: './mnemonic-phrase.component.html',
  styleUrls: ['./mnemonic-phrase.component.sass']
})
export class MnemonicPhraseComponent implements OnInit {
  show: boolean = false;

  constructor() {
  }

  ngOnInit() {
  }

}
