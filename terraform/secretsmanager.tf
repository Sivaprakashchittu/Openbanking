# saltedge secrets

resource "aws_secretsmanager_secret" "saltedge_secrets" {
  name = "saltedge_secrets"
  description = "Saltedge Secrets"
}

resource "aws_secretsmanager_secret_version" "saltedge_secrets" {
secret_id = aws_secretsmanager_secret.saltedge_secrets.id

secret_string = jsonencode({
    saltedge_app_id = "n9loeVGUitwbhm6yymUBeBZKA_gUBDTcIlMifoL5oZw",
    saltedge_secret_id = "3hcl5lL-KLoYttkTLb2c51oN_KCUO8RJZWOalY3XqOg"
  })
}





