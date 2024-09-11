# Define the S3 bucket
resource "aws_s3_bucket" "app_bucket1" {
  bucket = "beanstack100"  # Replace with your actual bucket name if different
}

# Upload the application ZIP to S3 using the new resource
resource "aws_s3_object" "frontend_zip" {
  bucket = aws_s3_bucket.app_bucket1.bucket
  key    = "beanstack/frontend2.zip"
  source = "beanstack/frontend2.zip"  # Path to your local ZIP file

  tags = {
    Name = "frontend-application-zip"
  }
}

# Create an Elastic Beanstalk Application
resource "aws_elastic_beanstalk_application" "cloud_frontend" {
  name        = "cloud-frontend"
  description = "Elastic Beanstalk application for frontend"
}

# Create an Elastic Beanstalk Application Version
resource "aws_elastic_beanstalk_application_version" "cloud_frontend_version" {
  name        = "cloud-frontend-v1"  # Increment this for each version
  application = aws_elastic_beanstalk_application.cloud_frontend.name
  bucket      = aws_s3_bucket.app_bucket1.bucket
  key         = aws_s3_object.frontend_zip.key
}

# Create an Elastic Beanstalk Environment
resource "aws_elastic_beanstalk_environment" "cloud_frontend_env" {
  name                = "cloud-frontend-env"
  cname_prefix = "openbanking-frontend"
  application         = aws_elastic_beanstalk_application.cloud_frontend.name
  solution_stack_name = "64bit Amazon Linux 2023 v6.1.8 running Node.js 20"  # Updated platform version

  # Environment settings are configured through option_settings
  setting {
    namespace = "aws:elasticbeanstalk:environment"
    name      = "EnvironmentType"
    value     = "LoadBalanced"
  }

setting {
    namespace = "aws:autoscaling:asg"
    name      = "MinSize"
    value     = "1"
  }

  setting {
    namespace = "aws:autoscaling:asg"
    name      = "MaxSize"
    value     = "5"
  }

  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "InstanceType"
    value     = "t2.large"
  }

  setting {
    namespace = "aws:elasticbeanstalk:environment:loadbalancer"
    name      = "LoadBalancerType"
    value     = "application"
  }

setting {
    namespace = "aws:elbv2:listener"
    name      = "ListenerProtocol"
    value     = "HTTP"
  }

  setting {
    namespace = "aws:elbv2:listener"
    name      = "ListenerPort"
    value     = "80"
  }



   setting {
    namespace = "aws:elasticbeanstalk:application"
    name      = "Application Healthcheck URL"
    value     = "/"
  }

 

  setting {
    namespace = "aws:ec2:vpc"
    name      = "VPCId"
    value     = aws_vpc.cloud_term_project.id
  }

  setting {
    namespace = "aws:ec2:vpc"
    name      = "Subnets"
    value     = "${aws_subnet.public_subnet_1.id},${aws_subnet.public_subnet_2.id}"
  }

  version_label = aws_elastic_beanstalk_application_version.cloud_frontend_version.name

  # Specify the service role in option settings
  setting {
    namespace = "aws:elasticbeanstalk:environment"
    name      = "ServiceRole"
    value     = "arn:aws:iam::076718501063:role/LabRole"  # Replace with your existing service role ARN
  }

  # Specify the instance profile in the correct namespace
  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "IamInstanceProfile"
    value     = "arn:aws:iam::076718501063:instance-profile/LabInstanceProfile"  # Replace with your existing instance profile ARN
  }
}
