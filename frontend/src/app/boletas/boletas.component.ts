import { Component, OnInit, ViewChild } from '@angular/core';
import { FacturacionService } from 'src/services/facturacion.service';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { ModalDetalleComponent } from '../modal-detalle/modal-detalle.component';


@Component({
  selector: 'app-boletas',
  templateUrl: './boletas.component.html',
  styleUrls: ['./boletas.component.css']
})
export class BoletasComponent implements OnInit {
  displayedColumns: string[] = ['idFactura', 'nombrePer', 'numeroDoc', 'acciones'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private _facturacionService: FacturacionService,
    public dialog: MatDialog
  ) {

  }

  ngOnInit() {
    this.listarBoletas();
  }

  listarBoletas() {
    this._facturacionService.getFacturas().subscribe(
      (res: any) => {
        console.log(res.data)
        this.dataSource = new MatTableDataSource(res.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    )
  }

  verDetalle(row) {
    const dialogRef = this.dialog.open(ModalDetalleComponent, {
      width: '250px',
      data: row
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
