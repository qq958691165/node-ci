console.log('aa');

const fs=require('fs');

setTimeout(()=>{
    fs.appendFileSync('./example.log',new Date()+"\n");
    console.log(process.env.CI_ARGS);
    console.log('done');
},10000);