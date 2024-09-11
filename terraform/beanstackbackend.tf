# Define the S3 bucket (if needed)
resource "aws_s3_bucket" "app_bucket" {
  bucket = "beanstack200"  # Use your actual S3 bucket if different
}

# Upload the application ZIP to S3
resource "aws_s3_object" "app_zip" {
  bucket = aws_s3_bucket.app_bucket.bucket
  key    = "beanstack/final2.zip"
  source = "beanstack/final2.zip"  # Path to your local ZIP file

  tags = {
    Name = "application-zip"
  }
}

# Create an Elastic Beanstalk Application
resource "aws_elastic_beanstalk_application" "cloud_backend" {
  name        = "cloud-backend"
  description = "Elastic Beanstalk application for backend"
}

# Create an Elastic Beanstalk Application Version
resource "aws_elastic_beanstalk_application_version" "cloud_backend_version" {
  name        = "cloud-backend-v1"  # Increment this for each version
  application = aws_elastic_beanstalk_application.cloud_backend.name
  bucket      = aws_s3_bucket.app_bucket.bucket
  key         = aws_s3_object.app_zip.key
}

# Create an Elastic Beanstalk Environment
resource "aws_elastic_beanstalk_environment" "cloud_backend_env" {
  name                = "cloud-backend-env"
   cname_prefix = "openbanking-backend"
  application         = aws_elastic_beanstalk_application.cloud_backend.name
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

  setting {
    namespace = "aws:elasticbeanstalk:environment"
    name      = "ServiceRole"
    value     = "arn:aws:iam::076718501063:role/LabRole"  # Replace with your existing service role ARN
  }

  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "IamInstanceProfile"
    value     = "arn:aws:iam::076718501063:instance-profile/LabInstanceProfile"  # Replace with your existing instance profile ARN
  }
  
  version_label = aws_elastic_beanstalk_application_version.cloud_backend_version.name
}
