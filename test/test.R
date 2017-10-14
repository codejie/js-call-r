library('rjson')

sumFunc <- function(num1,num2){
  sum(num1, num2)
}

args <- commandArgs(trailingOnly = TRUE)

json <- fromJSON(args)

# print(args);
# print(json);
# print(args[1]);
ret <- sumFunc(as.numeric(json$a),as.numeric(json$b))



output <- list(result = ret);

print(toJSON(output));
# print(result);
