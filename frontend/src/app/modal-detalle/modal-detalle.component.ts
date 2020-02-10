import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FacturacionService } from 'src/services/facturacion.service';

@Component({
  selector: 'app-modal-detalle',
  templateUrl: './modal-detalle.component.html',
  styleUrls: ['./modal-detalle.component.css']
})
export class ModalDetalleComponent implements OnInit {

  detComp: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<ModalDetalleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _facturacionService: FacturacionService
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.getDetalle()
  }

  getDetalle() {
    let item = {
      idComprobante: this.data.id_tp_factura
    }
    this._facturacionService.getDetalle(item).subscribe(
      (res: any) => {
        this.detComp = res.data;
      }
    )
  }

}
