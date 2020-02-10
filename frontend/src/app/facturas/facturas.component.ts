import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { FacturacionService } from 'src/services/facturacion.service';
import { ModalDetalleComponent } from '../modal-detalle/modal-detalle.component';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.css']
})
export class FacturasComponent implements OnInit {

  displayedColumns: string[] = ['fechaRegistro', 'idFactura', 'total', 'nombrePer', 'numeroDoc', 'acciones'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private _facturacionService: FacturacionService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.listarFacturas();
  }

  listarFacturas() {
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
      width: '650px',
      data: row
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
