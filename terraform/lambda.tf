resource "aws_lambda_layer_version" "aws_sdk" {
  filename          = "lambda_layer/aws_sdk.zip" 
  layer_name        = "aws_sdk"
  compatible_runtimes = ["nodejs20.x"]
   compatible_architectures = ["x86_64", "arm64"]
     lifecycle {
    create_before_destroy = true
  }
}

# Create the account_kinesis funtion
resource "aws_lambda_function" "account_kinesis" {
  filename         = "lambda_functions/accountkinesis.zip" 
  function_name    = "accountkinesis"
  handler          = "index.handler"  
  runtime          = "nodejs20.x" 
  role             = "arn:aws:iam::076718501063:role/LabRole"
  source_code_hash = filebase64sha256("lambda_functions/accountkinesis.zip")
  layers = [
    aws_lambda_layer_version.aws_sdk.arn  
  ]
  timeout = 90
}


resource "aws_lambda_event_source_mapping" "kinesis_trigger" {
  event_source_arn  = aws_kinesis_stream.account_stream.arn
  function_name     = aws_lambda_function.account_kinesis.arn
  starting_position = "LATEST"
}


# Create the transaction_kinesis funtion

resource "aws_lambda_function" "transaction_kinesis" {
  filename         = "lambda_functions/transactionkinesis.zip" 
  function_name    = "transactionkinesis"
  handler          = "transactionkinesis.handler"  
  runtime          = "nodejs20.x" 
  role             = "arn:aws:iam::076718501063:role/LabRole"
  source_code_hash = filebase64sha256("lambda_functions/transactionkinesis.zip")
  layers = [
    aws_lambda_layer_version.aws_sdk.arn  
  ]
  timeout = 90
}



resource "aws_lambda_event_source_mapping" "kinesis_trigger1" {
  event_source_arn  = aws_kinesis_stream.transaction_stream.arn
  function_name     = aws_lambda_function.transaction_kinesis.arn
  starting_position = "LATEST"
}
