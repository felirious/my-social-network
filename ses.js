const aws = require("aws-sdk");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./utils/secrets.json"); // in dev they are in secrets.json which is listed in .gitignore
}

const ses = new aws.SES({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
    region: "eu-central-1"
});

exports.sendEmail = function(to, subject, message) {
    return ses
        .sendEmail({
            Source: "My Tester <lang.felix@gmail.com>",
            Destination: {
                ToAddresses: [to]
            },
            Message: {
                Body: {
                    Text: {
                        Data: message
                    }
                },
                Subject: {
                    Data: subject
                }
            }
        })
        .promise()
        .then(() => console.log("it worked!"))
        .catch(err => console.log(err));
};
