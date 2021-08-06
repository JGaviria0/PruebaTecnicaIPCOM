const { Router } = require('express')
const morgan = require('morgan')
const fetch = require('node-fetch')
const app = Router()


function creatJson (total, ansPorTDC, nocompraron, compraMasAlta){
    newJson = {}
    newJson["total"] = total
    newJson["ansPorTDC"] = ansPorTDC
    newJson["nocompraron"] = nocompraron
    newJson["CompraMasAlta"] = compraMasAlta
    return newJson
}

async function calcular (ans){

    let noCompro = 0; 
    let total = 0; 
    let compraMasAlta = 0;
    let mapTDC = {}
    
    for(let k = 0; k<ans.length; k++){
        for(let i=0; i<ans[k].length; i++){
            
            if(!ans[k][i].compro){
                noCompro++
            } else {
                if(ans[k][i].monto > compraMasAlta){
                    compraMasAlta = ans[k][i].monto
                }
                let monto = parseInt(ans[k][i].monto) 
                total += monto
                if (mapTDC[ans[k][i].tdc] == undefined){
                    mapTDC[ans[k][i].tdc] = monto
                } else {
                    mapTDC[ans[k][i].tdc] += monto
                }           
            }

        }
    }
    let newJson = creatJson(total, mapTDC, noCompro, compraMasAlta)
    // console.log(newJson)
    return newJson
}  
 
app.get('/resumen/:day', async (req,res) =>{
    let firstDay = new Date(req.params.day)
    let lastDay = new Date(req.params.day)
    let numDays = parseInt(req.query.dias, 10) 
    lastDay.setDate(lastDay.getDate() + numDays) 
    firstDay.setDate(firstDay.getDate() + 1) 
    let ans = [] 
    for(let i = firstDay; i<=lastDay; i.setDate(i.getDate() + 1)){
        let year = i.getFullYear() 
        let month = i.getMonth() + 1
        month = month < 9 ? "0" + month.toString() : month
        let thisday = i.getDate()
        thisday = thisday < 9 ? "0" + thisday.toString() : thisday
        console.log(`${year}-${month}-${thisday}`)

        let queri =  await fetch(`https://apirecruit-gjvkhl2c6a-uc.a.run.app/compras/${year}-${month}-${thisday}`)
        ans.push(await queri.json())
    }
    
    var newJson = await calcular(ans)
    res.json(newJson) 
})     

module.exports = app  