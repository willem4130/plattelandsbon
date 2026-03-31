import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail } from 'lucide-react'

export default function VerifyRequestPage() {
  return (
    <div className="container mx-auto flex max-w-md items-center justify-center py-24">
      <Card className="w-full text-center">
        <CardHeader>
          <div className="mx-auto mb-4 rounded-full bg-primary/10 p-3">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Controleer je e-mail</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            We hebben een inloglink gestuurd naar je e-mailadres. Klik op de link in de e-mail om in te loggen.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
