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

app.post('/api/registrarEntrada', function(req, res) {
    let query = 'SELECT * FROM empleados WHERE "SER_DOC_ID_ACT"=$1 OR "CODIGO_PERS"=$1';
    let values = [req.body.codigo]

    let day = new Date();
    let horaCompleta = day.getHours() + ':' + day.getMinutes() + ':' + day.getSeconds();

    pool.query(query, values, (err, trabajador) => {
        if (err) {
            return res.status(200).json({
                mensaje: "Error de base de datos",
                ok: false,
                error: 503
            })
        } else {
            if (trabajador.rows[0] != null) {
                if (trabajador.rows[0].ASISTIO == false) {
                    pool.query('UPDATE empleados SET "ASISTIO"= true WHERE "SER_DOC_ID_ACT"= \'' + trabajador.rows[0].SER_DOC_ID_ACT + '\'',
                        (err, result) => {
                            if (err) {
                                return res.status(200).json({
                                    mensaje: "Error de base de datos",
                                    data: err,
                                    error: 503,
                                    ok: false
                                })
                            } else {
                                pool.query(`UPDATE empleados SET "HORA_ENTRADA" = '${horaCompleta}' WHERE "SER_DOC_ID_ACT"= '${trabajador.rows[0].SER_DOC_ID_ACT}'  `,
                                    (err, marcacion) => {
                                        if (err) {
                                            return res.status(200).json({
                                                mensaje: "Error de base de datossssss",
                                                data: err,
                                                error: 503,
                                                ok: false
                                            })
                                        } else {
                                            console.log(trabajador.rows[0])
                                            return res.status(200).json({
                                                ok: true,
                                                mensaje: "Asistencia marcada correctamente",
                                                trabajador: trabajador.rows[0]
                                            })
                                        }
                                    })
                            }
                        })
                } else {
                    return res.status(200).json({
                        ok: false,
                        mensaje: "El trabajador ya marcó su asistencia",
                        error: 401,
                        trabajador: trabajador.rows[0]
                    })
                }
            } else {
                return res.status(200).json({
                    ok: false,
                    data: "No se eencuentra al trabajador en la BD",
                    error: 406
                })
            }
        }
    })
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