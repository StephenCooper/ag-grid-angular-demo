import { Component } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { ColDef, GridOptions, LineSparklineOptions, RowNode } from 'ag-grid-community';
import { tap } from 'rxjs';
import { getData } from './data';
import { VolumeRendererComponent } from './volume-renderer/volume-renderer.component';
import { VolumeService } from './volume.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {

  constructor(private volumeService: VolumeService) {
    this.setupVolumeChanges();
  }

  public gridOptions: GridOptions = {
    defaultColDef: {
      flex: 1,
      minWidth: 100,
      resizable: true,
    },
    rowData: getData(),
    getRowNodeId: (data: any) => {
      return data.symbol;
    },
    enableCellChangeFlash: true,
    rowHeight: 75
  }

  public columnDefs: ColDef[] = [
    {
      field: 'symbol',
      maxWidth: 150
    },
    {
      field: 'name',
    },
    {
      field: 'change',
      cellRenderer: 'agSparklineCellRenderer',
      cellRendererParams: {
        sparklineOptions: {
          type: 'line',
          line: {
            stroke: 'rgb(124, 255, 178)',
            strokeWidth: 2,
          },
          highlightStyle: { size: 10 },
          // cast to give type checking to params
        } as LineSparklineOptions,
      },
    },
    {
      field: 'volume',
      headerName: 'Volume Renderer',
      cellRendererFramework: VolumeRendererComponent,
      maxWidth: 240,
    },
  ];

  private setupVolumeChanges() {
    this.volumeService.getUpdateStream().pipe(tap(update => {
      let toUpdate = this.gridOptions.api?.getRowNode(update.symbol)?.data;
      this.gridOptions.api!.applyTransaction({
        update: [{ ...toUpdate, volume: update.volume, change: [...(toUpdate.change.slice(1)), update.volume] }]
      });
    })).subscribe();
  }
  onSliderChange(e: MatSliderChange) {
    this.volumeService.setLimit(e.value || 0);
  }
}
