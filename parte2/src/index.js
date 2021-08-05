const parse = require('csv-parse')
const fs = require('fs')

const csvData = []
let newJson = [];

function creatNeworganization(dataRow){
    let newObject = {}
    newObject["organization"] =  dataRow[0]
    let newUsers = []
    let newObjectUsers = {}
    newObjectUsers["username"] = dataRow[1]
    let newRoles = []
    newRoles.push(dataRow[2])
    newObjectUsers["roles"] = newRoles
    newUsers.push(newObjectUsers)
    newObject["users"] =  newUsers
    newJson.push(newObject)
}

function createNewUser(dataRow, i) {
    let newObjectUsers = {}
    let newRole = []
    newRole.push(dataRow[2])
    newObjectUsers["username"] = dataRow[1]
    newObjectUsers["roles"] = newRole
    newJson[i].users.push(newObjectUsers)
}

fs.createReadStream(__dirname + '/test.csv')
    .pipe(
        parse({
            delimiter: ','
        })
    )
    .on('data', (dataRow) => {
        csvData.push(dataRow)
        let flag = false
        let i
        for(i=0; i<newJson.length; i++){
            if(newJson[i].organization == dataRow[0]){
                flag = true
                break
            }
        }
        
        if(!flag){
            creatNeworganization(dataRow)
        } else {
            flag = false
            let j
            for(j=0; j<newJson[i].users.length; j++){
                if(newJson[i].users[j].username == dataRow[1]){
                    flag = true
                    break
                }
            }

            if (!flag){
                createNewUser(dataRow, i)
            } else {
                newJson[i].users[j].roles.push(dataRow[2])
            }   
        }
    })
    .on('end', () => {
        newJson.splice(0,1)
        let dictstring = JSON.stringify(newJson, null, '\t')
        console.log(dictstring)
        fs.writeFile("thing.json", dictstring, function(err, result) {
            if(err) console.log('error', err);
        });
    })