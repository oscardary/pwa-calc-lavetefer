import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, AlertTriangle } from "lucide-react";
import TopBar from "@/components/TopBar";

export default function InformacionPage() {
  const version = "1.0.0"; // cambia esto cuando generes nuevas versiones
  const whatsappNumber = "573046199868"; // tu número con código país (57 para Colombia)
  const whatsappMessage = encodeURIComponent(
    "Hola, tengo un problema o sugerencia sobre la app Calculadora-Vet"
  );

  const handleWhatsApp = () => {
    window.open(
      `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`,
      "_blank"
    );
  };

  return (
    <div>
      <TopBar />
      <div className="bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full shadow-lg rounded-2xl border border-gray-200">
          <CardHeader>
            <CardTitle className="text-center text-xl font-bold text-black">
              Calculadora-Vet
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-16 text-center">
            <p className="text-gray-700">
              App diseñada para calcular fácilmente la dosis de medicamentos
              veterinarios según el peso del animal y las recomendaciones del
              laboratorio.
            </p>

            <div className="text-sm text-gray-600">
              <p>
                <strong>Versión:</strong> {version}
              </p>
              <p>
                <strong>Desarrollador:</strong> Oscar Rivera
              </p>
            </div>

            <div className="flex flex-col gap-3 mt-6">
              <Button
                onClick={handleWhatsApp}
                className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white rounded-xl py-2"
              >
                <MessageCircle className="w-5 h-5" />
                Contactar por WhatsApp
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
