# js-call-r
JavaScript call R function with a simple way.

Integrate JaveScript and R.

JavaScript passes JSON to R script, and get JSON from R script by js-call-r module.

## Install
```
npm install --save js-call-r
```

## Usage
```
    const rscript = require('js-call-r');

    // Sync
    rscript.callSync(RScript, [Args], [Options]);

    // Async Promise
    rscript.call(RScript, [Args], [Options]);
    // Async callback
    rscript.call(Rscript, Args, Options, callback);
```

## Synchronous
```js
const result = call.callSync('./test/test.R', {
    a: 1,
    b: 3
});
console.log(result.result);
```

## Asynchronous
```js
call.call('./test/test.R', {
    a: 1,
    b: 3
})
.then((result) => {
    console.log(result.result);
})
.catch(err => {
    console.log('err = ', err);
});

```
Or
```js
call.call('./test/test.R', {
    a: 1,
    b: 3
}, undefined, (result) => {
    console.log(result.result);
});
```

## R script template
```r
# json library
library('rjson')

# function to call
sumFunc <- function (num1, num2){
  sum(num1, num2)
}

# get arguments of cli
args <- commandArgs(trailingOnly = TRUE)

# arguments to JSON
json <- fromJSON(args)

# call function
ret <- sumFunc(as.numeric(json$a),as.numeric(json$b))

# convert return of function to list
output <- list(result = ret)

# output JSON
print(toJSON(output));
```

## Example
```
    npm test
```

## License

No License



