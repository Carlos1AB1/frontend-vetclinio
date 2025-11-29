/**
 * Plantilla HTML para PDF de Historias Clínicas
 * Modifica este archivo para cambiar el diseño del PDF
 */

export const medicalRecordPDFTemplate = `
<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 0; color: #1e293b; background: #ffffff; max-width: 210mm; margin: 0 auto;">
    
    <!-- HEADER CON LOGO Y GRADIENTE -->
    <div style="background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); padding: 30px 40px; color: white; position: relative; overflow: hidden;">
        <div style="position: absolute; top: -50px; right: -50px; width: 200px; height: 200px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
        <div style="position: absolute; bottom: -30px; left: -30px; width: 150px; height: 150px; background: rgba(255,255,255,0.05); border-radius: 50%;"></div>
        
        <div style="display: flex; align-items: center; gap: 20px; position: relative; z-index: 1;">
            <div style="width: 80px; height: 80px; background: white; padding: 10px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); display: flex; align-items: center; justify-content: center;">
                <img src="{{logoUrl}}" alt="VetClinic Logo" style="width: 100%; height: 100%; object-fit: contain;" onerror="this.style.display='none'; this.parentElement.innerHTML='<div style=\\'color: #4F46E5; font-size: 24px; font-weight: bold;\\'>VC</div>';" />
            </div>
            <div style="flex: 1;">
                <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                    HISTORIA CLÍNICA VETERINARIA
                </h1>
                <p style="margin: 8px 0 0 0; font-size: 14px; opacity: 0.95; font-weight: 300;">
                    Sistema de Gestión Veterinaria Profesional
                </p>
            </div>
        </div>
    </div>

    <!-- INFORMACIÓN DEL PACIENTE -->
    <div style="background: #f8fafc; padding: 25px 40px; border-bottom: 3px solid #4F46E5;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 15px;">
            <div>
                <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; font-weight: 600; margin-bottom: 5px;">PACIENTE</div>
                <div style="font-size: 20px; font-weight: 700; color: #1e293b;">{{patientName}}</div>
            </div>
            <div style="text-align: right;">
                <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; font-weight: 600; margin-bottom: 5px;">CONSULTA N°</div>
                <div style="font-size: 20px; font-weight: 700; color: #4F46E5;">#{{id}}</div>
            </div>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; padding-top: 15px; border-top: 1px solid #e2e8f0;">
            <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 12px; color: #64748b; font-weight: 500;">📅 Fecha:</span>
                <span style="font-size: 13px; color: #1e293b; font-weight: 600;">{{recordDate}} {{recordTime}}</span>
            </div>
            {{followUpBadge}}
        </div>
    </div>

    <!-- SIGNOS VITALES - TARJETAS MODERNAS -->
    <div style="padding: 30px 40px; background: white;">
        <h2 style="font-size: 16px; font-weight: 700; color: #1e293b; margin: 0 0 20px 0; text-transform: uppercase; letter-spacing: 0.5px; border-left: 4px solid #4F46E5; padding-left: 12px;">
            Signos Vitales
        </h2>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
            <!-- Peso -->
            <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border: 2px solid #3b82f6; border-radius: 12px; padding: 20px; text-align: center; box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15);">
                <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #3b82f6; font-weight: 600; margin-bottom: 8px;">⚖️ Peso</div>
                <div style="font-size: 28px; font-weight: 700; color: #1e40af;">{{weight}}</div>
            </div>
            <!-- Temperatura -->
            <div style="background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); border: 2px solid #ef4444; border-radius: 12px; padding: 20px; text-align: center; box-shadow: 0 2px 8px rgba(239, 68, 68, 0.15);">
                <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #ef4444; font-weight: 600; margin-bottom: 8px;">🌡️ Temperatura</div>
                <div style="font-size: 28px; font-weight: 700; color: #991b1b;">{{temperature}}</div>
            </div>
            <!-- Frecuencia Cardíaca -->
            <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border: 2px solid #10b981; border-radius: 12px; padding: 20px; text-align: center; box-shadow: 0 2px 8px rgba(16, 185, 129, 0.15);">
                <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #10b981; font-weight: 600; margin-bottom: 8px;">❤️ Frec. Cardíaca</div>
                <div style="font-size: 28px; font-weight: 700; color: #065f46;">{{heartRate}}</div>
            </div>
        </div>
    </div>

    <!-- SECCIÓN DE SÍNTOMAS -->
    {{symptomsSection}}

    <!-- DIAGNÓSTICO MÉDICO -->
    <div style="padding: 30px 40px; background: #f8fafc;">
        <div style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-left: 5px solid #4F46E5;">
            <div style="background: linear-gradient(135deg, #4F46E5 0%, #6366f1 100%); padding: 18px 25px; color: white;">
                <h2 style="margin: 0; font-size: 18px; font-weight: 700; display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 24px;">🔬</span> Diagnóstico Médico
                </h2>
            </div>
            <div style="padding: 25px; line-height: 1.8; font-size: 14px; color: #334155;">
                {{diagnosis}}
            </div>
        </div>
    </div>

    <!-- PLAN DE TRATAMIENTO -->
    <div style="padding: 0 40px 30px 40px; background: #f8fafc;">
        <div style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-left: 5px solid #10b981;">
            <div style="background: linear-gradient(135deg, #10b981 0%, #34d399 100%); padding: 18px 25px; color: white;">
                <h2 style="margin: 0; font-size: 18px; font-weight: 700; display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 24px;">💊</span> Plan de Tratamiento
                </h2>
            </div>
            <div style="padding: 25px; line-height: 1.8; font-size: 14px; color: #334155;">
                {{treatment}}
            </div>
        </div>
    </div>

    <!-- NOTAS CLÍNICAS -->
    {{notesSection}}

    <!-- FOOTER PROFESIONAL -->
    <div style="background: #1e293b; color: white; padding: 30px 40px; margin-top: 40px;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 25px;">
            <div>
                <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.7; margin-bottom: 8px;">Veterinario Responsable</div>
                <div style="font-size: 16px; font-weight: 600;">Dr. {{veterinarianName}}</div>
            </div>
            {{followUpDateSection}}
        </div>
        <div style="border-top: 1px solid rgba(255,255,255,0.2); padding-top: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px;">
            <div style="font-size: 11px; opacity: 0.8;">
                Documento generado el {{generatedDate}}
            </div>
            <div style="font-size: 11px; opacity: 0.8; font-weight: 600;">
                VetClinic Pro © Sistema de Gestión Veterinaria
            </div>
        </div>
    </div>
</div>
`;

/**
 * Función helper para reemplazar variables en el template
 */
export function renderMedicalRecordTemplate(template: string, data: Record<string, string>): string {
    let html = template;
    Object.keys(data).forEach(key => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        html = html.replace(regex, data[key] || '');
    });
    return html;
}

