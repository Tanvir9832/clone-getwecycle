import sendGridMail from "@sendgrid/mail";

sendGridMail.setApiKey(process.env["SEND_GRID_KEY"] || "");

interface Email {
  to: string | string[];
  subject: string;
  template: string;
}

export const sendEmail = async (data: Email) => {
  return sendGridMail.send({
    from: {
      name: "WeCycle",
      email: "zahin@wecycle.io",
    },
    to: data.to,
    subject: data.subject,
    html: data.template,
  });
};
