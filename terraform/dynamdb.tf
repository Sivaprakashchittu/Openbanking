resource "aws_dynamodb_table" "Account" {
  name           = "Account"
 billing_mode    = "PROVISIONED"
  hash_key        = "accountId"
  range_key       = "connectionId"
  read_capacity  = 5
  write_capacity = 5
  attribute {
    name = "accountId"
    type = "S"  
  }
  attribute {
    name = "connectionId"
    type = "S"
  }
}

resource "aws_dynamodb_table" "Transaction" {
  name           = "Transaction"
  billing_mode    = "PROVISIONED"
  hash_key        = "transactionId"
  range_key       = "accountId"
  read_capacity  = 5
  write_capacity = 5

  attribute {
    name = "transactionId"
    type = "S" 
  }

  attribute {
    name = "accountId"
    type = "S"
  }

}

resource "aws_dynamodb_table" "Connections" {
  name           = "Connections"
  billing_mode    = "PROVISIONED"  
  hash_key        = "connectionId"
  range_key       = "customerId"
  read_capacity  = 5
  write_capacity = 5

  attribute {
    name = "connectionId"
    type = "S" 
  }

  attribute {
    name = "customerId"
    type = "S"
  }
}


resource "aws_dynamodb_table" "Users" {
  name           = "Users"
  billing_mode    = "PROVISIONED" 
  hash_key        = "email"
  read_capacity  = 5
  write_capacity = 5

  attribute {
    name = "email"
    type = "S"  
  }

}


