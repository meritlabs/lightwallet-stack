import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams  } from 'ionic-angular';

//import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ConfigService } from "@app/shared/config.service";


@IonicPage({
  defaultHistory: ['OnboardingView']
})
@Component({
  selector: 'page-import',
  templateUrl: 'import.html',
})
export class ImportView {

  //public phraseView = 'ImportPhraseView';
  //public fileView   = 'ImportFileView';
  //public formGroup:FormGroup;

  @ViewChild('fileInput') input:ElementRef;

  public segment = 'phrase';

  public formData = {
    words: '',
    phrasePassword: '',
    derivationPath: '',
    fromHardwareWallet: false,
    testnet: false,
    bwsUrl: '',
    backupFile: null,
    filePassword: ''
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    //private formBuilder:FormBuilder,
    private config:ConfigService
  ) {
    //this.formGroup = this.formBuilder.group({
    //  mapStyle: ['Nancy', Validators.minLength(2)],
    //});

    this.formData.bwsUrl = config.getDefaults().bws.url;
  }

  ionViewDidLoad() {
    //do something here
  }

  openScanner() {
    this.navCtrl.push('ImportScanView');
  }

  openImport() {
    console.log(this.input.nativeElement.click());
  }

  fileChangeListener($event) {
    this.formData.backupFile = $event.target.files[0];
  }


  importMnemonic() {
    this.navCtrl.push('ProfileView');
  }

  importBlob() {
    this.navCtrl.push('ProfileView');
  }

}
