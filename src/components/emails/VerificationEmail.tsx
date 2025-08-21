import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Text,
  Img,
  Hr,
  Button,
  Section,
} from "@react-email/components";
import logo from "@/../public/log.svg";

interface VerificationEmailProps {
  username: string;
  code: string; // 6 digits code
  email: string;
  appName?: string;
}

export const WaitlistEmail = ({
  username,
  code,
  email,
  appName = "SyncFlow",
}: VerificationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your verification code for {appName}</Preview>
      <Body
        style={{
          backgroundColor: "#f8fafc",
          fontFamily:
            "'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          margin: 0,
          padding: 0,
        }}
      >
        <Container
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* Header Section */}
          <Section
            style={{
              backgroundColor: "#164e63",
              padding: "32px 40px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Img
              src="https://res.cloudinary.com/dubsaje5u/image/upload/f_png/v1755766248/log_u0qvcw.svg"
              alt="SyncFlow Logo"
              width="120"
              height="120"
            />

            <Text
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                color: "#ffffff",
                margin: "0",
                fontFamily: "'Work Sans', sans-serif",
              }}
            >
              {appName}
            </Text>
          </Section>

          {/* Main Content */}
          <Section style={{ padding: "40px" }}>
            <Text
              style={{
                fontSize: "20px",
                fontWeight: "600",
                color: "#164e63",
                margin: "0 0 24px 0",
                fontFamily: "'Work Sans', sans-serif",
              }}
            >
              Hello {username},
            </Text>

            <Text
              style={{
                fontSize: "16px",
                lineHeight: "1.6",
                color: "#475569",
                margin: "0 0 32px 0",
              }}
            >
              We received a request to verify your email address. Please use the
              verification code below to complete the process:
            </Text>

            <Section
              style={{
                backgroundColor: "#ecfeff",
                borderRadius: "8px",
                padding: "32px",
                textAlign: "center",
                margin: "32px 0",
                border: "2px dashed #164e63",
              }}
            >
              <Text
                style={{
                  fontSize: "14px",
                  color: "#475569",
                  margin: "0 0 16px 0",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  fontWeight: "500",
                }}
              >
                Verification Code
              </Text>
              <Text
                style={{
                  fontSize: "36px",
                  fontWeight: "bold",
                  letterSpacing: "8px",
                  color: "#f59e0b",
                  margin: "0",
                  fontFamily: "'Work Sans', monospace",
                  textAlign: "center",
                }}
              >
                {code}
              </Text>
            </Section>

            <Section style={{ textAlign: "center", margin: "32px 0" }}>
              <a
                href={`http://localhost:3000/account/verification-email?email=${encodeURIComponent(String(email))}&code=${encodeURIComponent(String(code))}`}
                style={{
                  display: "inline-block",
                  backgroundColor: "#164e63",
                  color: "#fff",
                  padding: "16px 32px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontWeight: "600",
                  fontSize: "16px",
                }}
              >
                Verify Email Address
              </a>
            </Section>

            <Hr
              style={{
                border: "none",
                borderTop: "1px solid #d1d5db",
                margin: "32px 0",
              }}
            />

            <Text
              style={{
                fontSize: "14px",
                color: "#6b7280",
                lineHeight: "1.5",
                margin: "0 0 16px 0",
              }}
            >
              <strong>Security Notice:</strong> This verification code will
              expire in 10 minutes for your security. If you {"didn't"} request
              this verification, please ignore this email or contact our support
              team.
            </Text>

            <Text
              style={{
                fontSize: "14px",
                color: "#6b7280",
                lineHeight: "1.5",
                margin: "0",
              }}
            >
              Need help? Contact us at{" "}
              <a
                href={`mailto:marouaneramali67@gmail.com?subject=Email Verification Issue&body=Hello, I need help with verifying my email.`}
                style={{ color: "#164e63", textDecoration: "none" }}
              >
                marouaneramali67@gmail.com
              </a>
            </Text>
          </Section>

          {/* Footer */}
          <Section
            style={{
              backgroundColor: "#f8fafc",
              padding: "24px 40px",
              textAlign: "center",
              borderTop: "1px solid #e5e7eb",
            }}
          >
            <Text
              style={{
                fontSize: "12px",
                color: "#9ca3af",
                margin: "0",
              }}
            >
              © 2024 {appName}. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};
