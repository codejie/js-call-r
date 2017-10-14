'use strict'

const call = require('../');


console.log('call R script to calc(Sync) "1 + 3 = "');
const result = call.callSync('./test/test.R', {
    a: 1,
    b: 3
});
console.log(result.result);

console.log('call R script to calc(Async) "1 + 3 = "');
call.call('./test/test.R', {
    a: 1,
    b: 3
})
.then((result) => {
    console.log(result);
})
.catch(err => {
    console.log('err = ', err);
});

console.log('call R script to calc(Async) "1 + 3 = "');
call.call('./test/test.R', {
    a: 1,
    b: 3
}, (err, result) => {
    if (err) {
        console.log('err = ', err);
    } else {
        console.log(result);
    }
});
