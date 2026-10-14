import { Body, Button, Container, Head, Html, Preview, Text } from "react-email";
import { site } from "../lib/site";
import * as s from "./styles";

export default function ConfirmEmail({ confirmUrl }: { confirmUrl: string }) {
  return (
    <Html lang="en">
      <Head />
      <Preview>One click to confirm your subscription.</Preview>
      <Body style={s.body}>
        <Container style={s.container}>
          <Text style={s.text}>Hi,</Text>
          <Text style={s.text}>
            Please confirm you want to receive {site.brand}, the newsletter by {site.author.name}.
          </Text>
          <Button
            href={confirmUrl}
            style={{
              background: "#1a1a1a",
              color: "#ffffff",
              borderRadius: "6px",
              padding: "12px 18px",
              fontSize: "16px",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Confirm subscription
          </Button>
          <Text style={{ ...s.muted, marginTop: "24px" }}>
            The link expires in 48 hours. If you didn&apos;t ask for this, ignore this email and
            nothing will happen.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

ConfirmEmail.PreviewProps = { confirmUrl: `${site.url}/api/confirm?token=preview` };
