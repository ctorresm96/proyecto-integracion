import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})

export class FacturacionService implements OnInit {
    private headers = new HttpHeaders().set('Content-Type', 'application/json');
    constructor(
        public http: HttpClient,
    ) { }

    ngOnInit() { }

    getFacturas() {
        const url = environment.URL_BACKEND + `/api/listarFacturas`;
        return this.http.get(url, { headers: this.headers });
    }

}
