const { Router } = require('express')
const morgan = require('morgan')
const fetch = require('node-fetch')
const app = Router()


function creatJson (total, comprasPorTDC, nocompraron, compraMasAlta){
    newJson = {}
    newJson["total"] = total
    newJson["comprasPorTDC"] = comprasPorTDC
    newJson["nocompraron"] = nocompraron
    newJson["CompraMasAlta"] = compraMasAlta
    return newJson
}

async function calcular (ans, firstDay, lastDay, numDays){
    let compras = await ans.json()
    let n = compras.length
    let noCompro = 0; 
    let total = 0; 
    let compraMasAlta = 0;
    let mapTDC = {}

    for(let i=0; i<n; i++){
        let thisDay = new Date (compras[i].date)
        if(thisDay >= firstDay && thisDay <= lastDay){
            if(!compras[i].compro){
                noCompro++
            } else {
                if(compras[i].monto > compraMasAlta){
                    compraMasAlta = compras[i].monto
                }
                let monto = parseInt(compras[i].monto)
                total = monto
                if (mapTDC[compras[i].tdc] == undefined){
                    mapTDC[compras[i].tdc] = monto
                } else {
                    mapTDC[compras[i].tdc] += monto
                }           
            }
        }
    }
    let newJson = creatJson(total, mapTDC, noCompro, compraMasAlta)
    return newJson
}  
 
app.get('/resumen/:day', async (req,res) =>{
    let firstDay = new Date(req.params.day)
    let lastDay = new Date(req.params.day)
    let numDays = parseInt(req.query.dias, 10) 

    const ans = await fetch('https://apirecruit-gjvkhl2c6a-uc.a.run.app/compras/2019-12-01')
    lastDay.setDate(lastDay.getDate() + numDays) 

    var newJson = await calcular(ans, firstDay, lastDay, numDays)
    res.json(newJson)
})     

module.exports = app  