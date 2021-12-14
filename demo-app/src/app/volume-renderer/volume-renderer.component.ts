import { Component } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { map, Observable } from 'rxjs';
import { VolumeService } from '../volume.service';

@Component({
  selector: 'app-volume-renderer',
  template: `<div [ngClass]="{'under': volumeStream$ | async }"  >{{params.data.volume | number: '1.0-0'}} </div>`,
  styleUrls: ['./volume-renderer.component.scss']
})
export class VolumeRendererComponent implements AgRendererComponent {
  public params!: ICellRendererParams;

  public volumeStream$!: Observable<boolean>;
  constructor(public volumeService: VolumeService) { }

  agInit(params: ICellRendererParams): void {
    console.count('agInit')
    this.params = params;
    this.volumeStream$ = this.volumeService.getVolumeStream().pipe(
      map(volume => {
        return this.params.data.volume < Number(volume)
      })
    );
  }

  refresh(params: ICellRendererParams): boolean {
    console.count('refresh')
    this.params = params;
    return false;
  }
}
