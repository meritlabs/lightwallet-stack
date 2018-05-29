import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-spread-master',
  templateUrl: './spread-master.component.html',
  styleUrls: ['./spread-master.component.sass'],
})
export class SpreadMasterComponent implements OnInit {
  constructor(private http: HttpClient) {}

  ngOnInit() {}
  status: string = 'progress';
  validate(link) {
    this.http.get(`https://cors.now.sh/${link}`).subscribe(res => {
      console.log(res);
    });
  }
}
