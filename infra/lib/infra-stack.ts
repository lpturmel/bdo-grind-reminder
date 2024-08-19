import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class InfraStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const bucket = new cdk.aws_s3.Bucket(this, 'BdoGrindReminderBucket', {
            bucketName: 'bdo-grind-reminder',
            enforceSSL: true,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            publicReadAccess: true,
            blockPublicAccess: {
                blockPublicPolicy: false,
                blockPublicAcls: false,
                ignorePublicAcls: false,
                restrictPublicBuckets: false,
            },
        });

    }
}
