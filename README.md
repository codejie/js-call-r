# js-call-r
JavaScript call R function with a simple way.

Integrate JaveScript and R.\
JavaScript passes JSON to R script, and get JSON from R script by js-call-r module.

## Install
```
npm install --save js-call-r
```

## Usage
```js
const rscript = require('js-call-r');

// Sync
rscript.callSync(RScript, [Args], [Options]);

// Async, support Promise while callback is undefined
rscript.call(RScript, [Args], [Options]);
rscript.call(Rscript, [Args], [Options], [callback]);
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

## Options
```json
{
    "verboseResult": true/[false]
}
```
`false` is default.

## Result

If `verboseResult` of Options is `true`, call() or callSync() will return the following object.
```json
{
    "pid": <number>,
    "result": <return from R script>
}
```
If it is `false`, the result will only include `<return from R script>` part.

While any `error` occurs, the result will be the following object.
```json
{
    "pid": <number>,
    "error": <error message>
}
```

## R script template
Transcate JSON data between JavaScript and R, so input and output for R scripts have to convert to JSON format. 
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



