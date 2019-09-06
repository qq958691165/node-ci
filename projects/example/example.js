console.log('aa');

const fs=require('fs');

setTimeout(()=>{
    fs.appendFileSync('./example.log',new Date()+"\n");
    console.log('done');
},10000);