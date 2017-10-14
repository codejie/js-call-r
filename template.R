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
