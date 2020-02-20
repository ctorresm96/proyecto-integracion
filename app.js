var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

//Conexion a postgress
const { Pool, Client } = require('pg')

// Credenciales BD Remota
const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost/sunat-core',
})

var app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, 'public')));
app.use('', express.static(path.join(__dirname, './frontend/dist/sunat-angular')));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method, token');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

app.post('/api/registrarFactura', async (req, res) => {

    let body = req.body;
    if ((body.tipoComp == 1 && body.tipoDoc == 1 && body.numeroDoc.length == 8) || (body.tipoComp == 2 && body.tipoDoc == 2 && body.numeroDoc.length == 11)) {
        let query = `INSERT INTO tp_factura(id_tp_factura, idfactura, "tipoComp", "codEstablecimiento", "numeroSerie", 
        "tipoDoc", "numeroDoc", "nombrePer","direccionPer", igv, total, estado, "fechaRegistro")
        VALUES ( nextval('seq_facturas'), $1, $2, $3, $4, $5, $6, $7 , $8, $9, $10, $11, $12) RETURNING id_tp_factura`

        let idFactura = `B${req.body.numeroSerie}${req.body.codEstablecimiento}`

        let values = [
            idFactura, req.body.tipoComp, req.body.codEstablecimiento, req.body.numeroSerie, req.body.tipoDoc, req.body.numeroDoc,
            req.body.nombrePer, req.body.direccionPer, req.body.igv, req.body.total, req.body.estado,
            req.body.fechaRegistro
        ]

        pool.query(query, values, (err, factura) => {
            if (err) {
                console.log(err)
                return res.status(200).json({
                    ok: false,
                    msg: 'Error al generar el comprobante.',
                    error: err
                })
            } else {
                let queryProd = `INSERT INTO ts_factura_detalle(
                id_tp_factura, id_producto, nom_producto, cant_producto, precio_producto)
                VALUES`
                for (let i = 0; i < req.body.items.length; i++) {
                    let producto = req.body.items[i];
                    queryProd = queryProd + `(${factura.rows[0].id_tp_factura}, '${producto.codItem}', '${producto.descripcionItem}', ${producto.cantidadItem}, ${producto.precioItem}),`
                }
                queryProd = queryProd.slice(0, -1)
                pool.query(queryProd, (err, item) => {
                    if (err) {
                        return res.status(401).json({
                            ok: false,
                            msg: 'Error al registrar el comprobante',
                        });
                    } else {
                        return res.status(200).json({
                            ok: true,
                            msg: 'Se ingreso correctamente el comprobante'
                        })
                    }
                })
            }
        });
    } else {
        return res.status(200).json({
            ok: false,
            msg: 'Caracteres del numero de documento no concuerda con el tipo'
        })
    }

});

app.get('/api/listarFacturas', function (req, res) {
    let query =
        `SELECT * 
        FROM tp_factura tp
        WHERE "tipoComp" = 2
        ORDER BY tp."fechaRegistro" DESC`;

    pool.query(query, (err, facturas) => {
        if (facturas) {
            return res.status(200).json({
                ok: true,
                data: facturas.rows,
            })
        } else {
            return res.status(200).json({
                ok: false,
                data: "No se encuentra al trabajador en la BD",
                error: err
            })
        }
    })
});

app.get('/api/listarBoletas', function (req, res) {
    let query =
        `SELECT * 
        FROM tp_factura tp
        WHERE "tipoComp" = 1
        ORDER BY tp."fechaRegistro" DESC`;

    pool.query(query, (err, facturas) => {
        if (facturas) {
            return res.status(200).json({
                ok: true,
                data: facturas.rows,
            })
        } else {
            return res.status(200).json({
                ok: false,
                data: "No se encuentra al trabajador en la BD",
                error: err
            })
        }
    })
});

app.post('/api/detalleComprobante', function (req, res) {
    let id = req.body.idComprobante;
    let query =
        `SELECT * 
        FROM tp_factura tp
        INNER JOIN ts_factura_detalle ts
        ON tp.id_tp_factura = ts.id_tp_factura
        WHERE tp.id_tp_factura = ${id}`;

    pool.query(query, (err, comprobante) => {
        if (comprobante) {
            return res.status(200).json({
                ok: true,
                data: comprobante.rows,
            })
        } else {
            console.log(err)
            return res.status(200).json({
                ok: false,
                data: "No se encuentra al trabajador en la BD",
                error: err
            })
        }
    })
});

var port = process.env.PORT || 3000

app.listen(port, function () {
    console.log(`Example app listening on port ${port}!`);
});