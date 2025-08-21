import { render } from "@react-email/render";
import { transporter } from "./emailConfig";
import {WaitlistEmail} from "@/components/emails/VerificationEmail"
import { MailOptions } from "nodemailer/lib/json-transport";

export async function sendVerificationEmailCode({from,to,subject}:MailOptions, username: string, code: string) {

    const emailHtml = await render(<WaitlistEmail username={username} email={String(to)} code={code} />);

    await transporter.sendMail({
    from, 
    to,
    subject,
    html: emailHtml, 
  });
}
