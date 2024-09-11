provider "aws" {
  region = "us-east-1"  
}

resource "aws_kinesis_stream" "account_stream" {
  name= "account"

  stream_mode_details {
    stream_mode = "ON_DEMAND"
  }

}

resource "aws_kinesis_stream" "transaction_stream" {
  name= "transaction"

  stream_mode_details {
    stream_mode = "ON_DEMAND"
  }

}