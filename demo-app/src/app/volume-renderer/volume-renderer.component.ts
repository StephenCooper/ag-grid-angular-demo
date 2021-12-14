import { Component } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { combineLatest, map, Observable } from 'rxjs';
import { VolumeService } from '../volume.service';

@Component({
  selector: 'app-volume-renderer',
  template: `
  <div 
    [ngClass]="{'under': volumeStream$ | async }">
      {{params.data.volume | number: '1.0-0'}}
  </div>
  `,
  styleUrls: ['./volume-renderer.component.scss']
})
export class VolumeRendererComponent implements AgRendererComponent {
  public params!: ICellRendererParams;

  public volumeStream$!: Observable<boolean>;
  constructor(public volumeService: VolumeService) {
    this.setupVolumeStream();
  }

  // AG Grid calls on creating the cell renderer
  agInit(params: ICellRendererParams): void {
    console.count('agInit')
    this.params = params;
  }

  // AG Grid calls this to know if it needs to re-create the component
  refresh(params: ICellRendererParams): boolean {
    console.count('refresh')
    this.params = params;
    return true;
  }

  private setupVolumeStream() {
    this.volumeStream$ = combineLatest([this.volumeService.getVolumeStream(), this.volumeService.getUpdates()]).pipe(
      map(([volume,]) => {
        return this.params.data.volume < Number(volume);
      })
    );
  }
}
