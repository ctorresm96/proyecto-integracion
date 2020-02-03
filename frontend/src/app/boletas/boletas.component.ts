import { Component, OnInit, ViewChild } from '@angular/core';
import { FacturacionService } from 'src/services/facturacion.service';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';


@Component({
  selector: 'app-boletas',
  templateUrl: './boletas.component.html',
  styleUrls: ['./boletas.component.css']
})
export class BoletasComponent implements OnInit {
  displayedColumns: string[] = ['idFactura', 'acciones'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private _facturacionService: FacturacionService
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

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
