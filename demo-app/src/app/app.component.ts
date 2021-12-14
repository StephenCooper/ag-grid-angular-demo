import { Component } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { ColDef, GridOptions, LineSparklineOptions, RangeSelectionChangedEvent, RowNode } from 'ag-grid-community';
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
    getRowNodeId: (data: any) => data.symbol,
    enableCellChangeFlash: true,
    cellFlashDelay: 10,
    rowHeight: 75
  }

  public columnDefs: ColDef[] = [
    {
      field: 'symbol',
      maxWidth: 150
    },
    { field: 'name' },
    {
      field: 'volume',
      headerName: 'Volume Renderer',
      cellRendererFramework: VolumeRendererComponent,
      maxWidth: 240,
    },
    {
      field: 'change',
      cellRenderer: 'agSparklineCellRenderer',
      cellRendererParams: {
        sparklineOptions: {
          type: 'line',
          line: {
            strokeWidth: 4,
          },
          highlightStyle: { size: 10 },
          // cast to give type checking to params
        } as LineSparklineOptions,
      },
    }
  ];

  private setupVolumeChanges() {
    this.volumeService.getUpdateStream().pipe(tap(update => {
      let toUpdate = this.gridOptions.api?.getRowNode(update.symbol)?.data;
      this.gridOptions.api!.applyTransaction({
        update: [{ ...toUpdate, volume: update.volume, change: [...(toUpdate.change.slice(1)), update.volume] }]
      });
    })).subscribe();
    this.volumeService.setLimit(50000);
    this.gridOptions.api?.refreshCells();

  }
  onSliderChange(e: MatSliderChange) {
    this.volumeService.setLimit(e.value || 0);
    this.gridOptions.api?.refreshCells();
  }
}
