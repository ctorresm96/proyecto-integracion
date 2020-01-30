var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

//Conexion a postgress
const { Pool, Client } = require('pg')

// Credenciales BD Remota
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'core-sunat',
    password: 'postgres',
    port: 5432,
})

var app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, 'public')));
app.use('', express.static(path.join(__dirname, './angular')));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method, token');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

app.post('/api/registrarFactura', function(req, res) {
    let i = 0;
    let count = 0;
    for (i = 0; i < req.body.items.length; i++) {
        let query = `INSERT INTO public.tp_factura(id, "tipoComp", "codEstablecimiento", "numeroSerie", 
        "tipoDoc", "numeroDoc", "nombrePer","direccionPer", "codItem", "descripcionItem", "cantidadItem", "precioItem", 
        "igv", total, estado, "fechaRegistro", "idFactura") VALUES (nextval('seq_facturas'), $1, $2, $3, $4, $5, $6, $7, $8, $9, 
        $10, $11, $12, $13, $14, $15, $16)`

        let idFactura = `B${req.body.numeroSerie}${req.body.codEstablecimiento}`

        let values = [
            req.body.tipoComp, req.body.codEstablecimiento, req.body.numeroSerie, req.body.tipoDoc, req.body.numeroDoc,
            req.body.nombrePer, req.body.direccionPer, req.body.items[0].codItem, req.body.items[i].descripcionItem,
            req.body.items[0].cantidadItem, req.body.items[0].precioItem, req.body.igv, req.body.total, req.body.estado,
            req.body.fechaRegistro, idFactura
        ]

        pool.query(query, values, (err, trabajador) => {
            if (err) {
                console.log(err)
            } else {
                console.log('row inserted')
            }
        })
        count = count + 1;
        if (count == 2) {
            return res.status(200).json({
                ok: 'ok'
            })
        }
    }

});

app.get('/api/registrarFactura', function(req, res) {
    return res.status(200).json({
        ok: false,
        data: "No se eencuentra al trabajador en la BD",
        error: 406
    })
});


app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});