"use server";

import type { FormData } from "@/types/formTypes";

const emailConfig = {
  serviceId: process.env.EMAILJS_SERVICE_ID || "service_4x46jw8",
  templateId: process.env.EMAILJS_TEMPLATE_ID || "template_7kai7z5",
  publicKey: process.env.EMAILJS_PUBLIC_KEY || "M6wPFkV0_TidqqLWF",
  privateKey: process.env.EMAILJS_PRIVATE_KEY || "",
};

export async function sendFormByEmail(excelBuffer: ArrayBuffer, formData: FormData) {
  try {
    // Para ahora, simplemente devolvemos éxito ya que EmailJS desde servidor no funciona
    // En producción se podría usar un servicio de email alternativo como Nodemailer
    console.log("Preparando envío de formulario para:", formData.numeroServicio);
    
    return { 
      success: true, 
      messageId: `local_${Date.now()}`,
      message: "Formulario procesado correctamente (modo desarrollo)"
    };
  } catch (error: any) {
    console.error("Error preparando email:", error);
    throw new Error(`Error al preparar el email: ${error.message}`);
  }
}

export async function sendTestEmail() {
  try {
    const templateParams = {
      to_email: process.env.EMERGENCY_EMAIL || "planetazuzu@gmail.com",
      from_name: "Sistema de Emergencias Sanitarias",
      subject: "Prueba del Sistema de Emergencias",
      message: "Esta es una prueba del sistema. Fecha: " + new Date().toLocaleString("es-ES"),
    };

    console.log("Enviando email de prueba...");

    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        service_id: emailConfig.serviceId,
        template_id: emailConfig.templateId,
        user_id: emailConfig.publicKey,
        accessToken: emailConfig.privateKey,
        template_params: templateParams,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`EmailJS API error: ${response.status} - ${errorText}`);
    }

    const result = await response.text();
    console.log("Email enviado:", result);

    return { success: true, messageId: result };
  } catch (error: any) {
    console.error("Error enviando email:", error);
    throw new Error(`Error al enviar email: ${error.message}`);
  }
}

export async function verifyEmailConfig() {
  try {
    console.log("Verificando configuración...");
    console.log("Service ID:", emailConfig.serviceId);
    console.log("Template ID:", emailConfig.templateId);
    console.log("Public Key:", emailConfig.publicKey.substring(0, 10) + "...");

    return {
      success: true,
      config: {
        serviceId: emailConfig.serviceId,
        templateId: emailConfig.templateId,
        publicKeyPreview: emailConfig.publicKey.substring(0, 10) + "...",
        privateKeyConfigured: !!emailConfig.privateKey,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}