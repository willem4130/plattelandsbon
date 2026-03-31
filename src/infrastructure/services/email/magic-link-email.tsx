import { Html, Head, Body, Container, Text, Button, Section } from '@react-email/components'

interface MagicLinkEmailProps {
  url: string
}

export function MagicLinkEmail({ url }: MagicLinkEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: 'Inter, sans-serif', backgroundColor: '#f9fafb' }}>
        <Container style={{ maxWidth: 480, margin: '0 auto', padding: 32 }}>
          <Text style={{ fontSize: 20, fontWeight: 600, color: '#166534' }}>Plattelandsbon</Text>
          <Text style={{ fontSize: 14, color: '#374151' }}>
            Klik op de knop hieronder om in te loggen bij Plattelandsbon.
          </Text>
          <Section style={{ textAlign: 'center' as const, margin: '24px 0' }}>
            <Button href={url} style={{
              backgroundColor: '#166534',
              color: '#ffffff',
              padding: '12px 24px',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 500,
              textDecoration: 'none',
            }}>
              Inloggen
            </Button>
          </Section>
          <Text style={{ fontSize: 12, color: '#6b7280' }}>
            Heb je deze link niet aangevraagd? Dan kun je deze e-mail veilig negeren.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
