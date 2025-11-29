import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    Calendar,
    User,
    Activity,
    Thermometer,
    HeartPulse,
    Pill,
    ClipboardList,
    AlertCircle,
    Edit,
    Trash2,
    Stethoscope,
    Weight,
    Clock,
    FileText,
    Download,
    Printer
} from 'lucide-react';
import type { MedicalRecord } from '@/types/medicalRecord';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// @ts-ignore - html2pdf.js no tiene tipos TypeScript
import html2pdf from 'html2pdf.js';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { medicalRecordPDFTemplate, renderMedicalRecordTemplate } from '@/templates/medical-record-pdf-template';

interface MedicalRecordDetailsDialogProps {
    record: MedicalRecord;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onEdit?: () => void;
    onDelete?: () => void;
}

export function MedicalRecordDetailsDialog({
    record,
    open,
    onOpenChange,
    onEdit,
    onDelete,
}: MedicalRecordDetailsDialogProps) {

    const formatDate = (dateString: string) => {
        return format(new Date(dateString), "dd 'de' MMMM, yyyy", { locale: es });
    };

    const formatTime = (dateString: string) => {
        return format(new Date(dateString), "HH:mm");
    };

    const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    // Genera HTML completo con DOCTYPE para impresión (usa el template centralizado)
    const generatePDFFullHTML = () => {
        const bodyContent = generatePDFHTML();
        return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Historia Clínica - ${record.patientName}</title>
    <style>
        @media print {
            @page { margin: 2cm; }
        }
        body {
            font-family: Arial, sans-serif;
            padding: 20px;
            color: #333;
            background: white;
        }
    </style>
</head>
<body>
    ${bodyContent}
</body>
</html>`;
    };

    const generatePDF = () => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        const htmlContent = generatePDFFullHTML();
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        return printWindow;
    };

    const handlePrint = () => {
        const printWindow = generatePDF();
        if (printWindow) {
            printWindow.onload = () => {
                setTimeout(() => {
                    printWindow.print();
                }, 250);
            };
        }
    };

    // Función centralizada para generar y descargar PDF desde HTML
    const downloadPDFFromHTML = async (htmlContent: string, filename: string) => {
        let container: HTMLDivElement | null = null;
        try {
            // Crear un contenedor temporal
            container = document.createElement('div');
            container.innerHTML = htmlContent;
            
            // Estilos para hacer el contenedor visible pero fuera de la vista
            Object.assign(container.style, {
                position: 'fixed',
                left: '0',
                top: '0',
                width: '794px', // Ancho A4 en píxeles (210mm a 96 DPI)
                backgroundColor: 'white',
                padding: '20px',
                zIndex: '99999', // Muy alto para estar encima
                transform: 'translateX(-100%)', // Mover fuera de la pantalla pero visible
                visibility: 'visible',
                opacity: '1'
            });
            
            document.body.appendChild(container);

            // Esperar a que el contenido se renderice completamente
            await new Promise(resolve => {
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        // Forzar reflow
                        void container?.offsetHeight;
                        setTimeout(resolve, 500);
                    });
                });
            });

            if (!container) {
                throw new Error('Contenedor no disponible');
            }

            // Usar html2canvas para capturar el contenido
            const canvas = await html2canvas(container, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
                width: container.scrollWidth,
                height: container.scrollHeight,
                windowWidth: container.scrollWidth,
                windowHeight: container.scrollHeight
            });

            // Crear PDF con jsPDF
            const imgWidth = 210; // Ancho A4 en mm
            const pageHeight = 297; // Alto A4 en mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            const pdf = new jsPDF('portrait', 'mm', 'a4');
            let heightLeft = imgHeight;
            let position = 0;

            // Agregar la imagen al PDF
            pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            // Si el contenido es más alto que una página, agregar páginas adicionales
            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            // Descargar el PDF
            pdf.save(filename);

        } catch (error) {
            console.error('Error al generar PDF:', error);
            throw error;
        } finally {
            // Limpiar el contenedor temporal siempre
            if (container && document.body.contains(container)) {
                setTimeout(() => {
                    document.body.removeChild(container!);
                }, 500);
            }
        }
    };

    const handleDownloadPDF = async () => {
        try {
            const htmlContent = generatePDFHTML();
            const filename = `Historia_Clinica_${record.patientName.replace(/\s+/g, '_')}_${record.id}_${format(new Date(), 'yyyyMMdd_HHmmss', { locale: es })}.pdf`;
            
            await downloadPDFFromHTML(htmlContent, filename);
        } catch (error) {
            console.error('Error al descargar PDF:', error);
            // Fallback: usar el método de impresión
            handlePrint();
        }
    };

    const generatePDFHTML = () => {
        // Obtener la URL del logo (ruta absoluta desde el servidor)
        const logoUrl = `${window.location.origin}/logo.png`;
        
        // Preparar los datos para el template
        const templateData = {
            logoUrl: logoUrl,
            patientName: record.patientName,
            id: record.id.toString(),
            recordDate: formatDate(record.recordDate),
            recordTime: formatTime(record.recordDate),
            followUpBadge: record.followUpRequired 
                ? '<div style="display: inline-flex; align-items: center; gap: 6px; background: linear-gradient(135deg, #F59E0B 0%, #F97316 100%); color: white; padding: 8px 16px; border-radius: 8px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 2px 6px rgba(245, 158, 11, 0.3);"><span>⚠️</span> SEGUIMIENTO REQUERIDO</div>' 
                : '',
            weight: record.weight ? `${record.weight} kg` : '--',
            temperature: record.temperature ? `${record.temperature}°C` : '--',
            heartRate: record.heartRate ? `${record.heartRate} bpm` : '--',
            symptomsSection: record.symptoms 
                ? `<div style="padding: 0 40px 30px 40px; background: #f8fafc;">
                    <div style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-left: 5px solid #f59e0b;">
                        <div style="background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%); padding: 18px 25px; color: white;">
                            <h2 style="margin: 0; font-size: 18px; font-weight: 700; display: flex; align-items: center; gap: 10px;">
                                <span style="font-size: 24px;">🩺</span> Síntomas Reportados
                            </h2>
                        </div>
                        <div style="padding: 25px; line-height: 1.8; font-size: 14px; color: #334155;">
                            ${record.symptoms}
                        </div>
                    </div>
                   </div>`
                : '',
            diagnosis: record.diagnosis,
            treatment: record.treatment,
            notesSection: record.notes 
                ? `<div style="padding: 0 40px 30px 40px; background: #f8fafc;">
                    <div style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-left: 5px solid #6366f1;">
                        <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 18px 25px; color: white;">
                            <h2 style="margin: 0; font-size: 18px; font-weight: 700; display: flex; align-items: center; gap: 10px;">
                                <span style="font-size: 24px;">📝</span> Notas Clínicas
                            </h2>
                        </div>
                        <div style="padding: 25px; line-height: 1.8; font-size: 14px; color: #334155; font-style: italic;">
                            ${record.notes}
                        </div>
                    </div>
                   </div>`
                : '',
            veterinarianName: record.veterinarianName,
            followUpDateSection: record.followUpDate 
                ? `<div style="text-align: right;">
                    <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.7; margin-bottom: 8px;">Próxima Visita</div>
                    <div style="font-size: 16px; font-weight: 600; color: #f59e0b;">📅 ${formatDate(record.followUpDate)}</div>
                   </div>` 
                : '',
            generatedDate: format(new Date(), "dd/MM/yyyy HH:mm", { locale: es })
        };

        // Renderizar el template con los datos
        return renderMedicalRecordTemplate(medicalRecordPDFTemplate, templateData);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl p-0 overflow-hidden h-[85vh] flex flex-col gap-0">

                {/* --- HEADER --- */}
                <div className="bg-slate-50 border-b px-6 py-4 flex justify-between items-start shrink-0">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-14 w-14 border-2 border-white shadow-sm">
                            <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                                {getInitials(record.patientName)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">{record.patientName}</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="bg-white text-slate-600 font-normal">
                                    Consulta #{record.id}
                                </Badge>
                                <span className="text-sm text-muted-foreground flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> {formatDate(record.recordDate)}
                                </span>
                            </div>
                        </div>
                    </div>
                    {record.followUpRequired && (
                        <div className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-bold border border-red-100 flex items-center gap-1 animate-pulse">
                            <AlertCircle className="w-3 h-3" />
                            SEGUIMIENTO REQUERIDO
                        </div>
                    )}
                </div>

                <div className="flex flex-1 overflow-hidden">

                    {/* --- SIDEBAR (SIGNOS VITALES) --- */}
                    <div className="w-64 bg-slate-50/50 border-r p-5 overflow-y-auto hidden md:block shrink-0">
                        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">Signos Vitales</h3>
                        <div className="space-y-3">
                            <VitalCard
                                icon={<Weight className="w-4 h-4 text-blue-500" />}
                                label="Peso"
                                value={record.weight ? `${record.weight} kg` : '--'}
                            />
                            <VitalCard
                                icon={<Thermometer className="w-4 h-4 text-red-500" />}
                                label="Temperatura"
                                value={record.temperature ? `${record.temperature}°C` : '--'}
                            />
                            <VitalCard
                                icon={<HeartPulse className="w-4 h-4 text-emerald-500" />}
                                label="Frec. Cardíaca"
                                value={record.heartRate ? `${record.heartRate} bpm` : '--'}
                            />
                        </div>

                        <Separator className="my-6" />

                        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">Metadatos</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Especialista</p>
                                <div className="flex items-center gap-2">
                                    <User className="w-3 h-3 text-muted-foreground" />
                                    <span className="text-sm font-medium">Dr. {record.veterinarianName.split(' ')[0]}</span>
                                </div>
                            </div>
                            {record.followUpDate && (
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">Próxima Visita</p>
                                    <div className="flex items-center gap-2 text-orange-600">
                                        <Calendar className="w-3 h-3" />
                                        <span className="text-sm font-bold">{formatDate(record.followUpDate)}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* --- MAIN CONTENT (HISTORIA) --- */}
                    <ScrollArea className="flex-1 p-6 md:p-8">
                        <div className="max-w-2xl mx-auto space-y-8 pb-10">

                            {/* Sección Síntomas */}
                            {record.symptoms && (
                                <section>
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="p-1.5 bg-orange-100 rounded-md text-orange-600">
                                            <Activity className="w-5 h-5" />
                                        </div>
                                        <h3 className="font-bold text-lg text-slate-800">Síntomas Reportados</h3>
                                    </div>
                                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-slate-700 leading-relaxed text-sm">
                                        {record.symptoms}
                                    </div>
                                </section>
                            )}

                            {/* Sección Diagnóstico */}
                            <section>
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="p-1.5 bg-blue-100 rounded-md text-blue-600">
                                        <ClipboardList className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-bold text-lg text-slate-800">Diagnóstico Médico</h3>
                                </div>
                                <div className="bg-white border rounded-xl p-5 shadow-sm text-slate-800 font-medium leading-relaxed">
                                    {record.diagnosis}
                                </div>
                            </section>

                            {/* Sección Tratamiento */}
                            <section>
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="p-1.5 bg-emerald-100 rounded-md text-emerald-600">
                                        <Pill className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-bold text-lg text-slate-800">Plan de Tratamiento</h3>
                                </div>
                                <div className="bg-emerald-50/50 border border-emerald-100/50 rounded-xl p-5 text-emerald-900 leading-relaxed shadow-sm">
                                    {record.treatment}
                                </div>
                            </section>

                            {/* Notas Adicionales */}
                            {record.notes && (
                                <section>
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="p-1.5 bg-slate-100 rounded-md text-slate-600">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <h3 className="font-bold text-lg text-slate-800">Notas Clínicas</h3>
                                    </div>
                                    <p className="text-sm text-muted-foreground italic pl-2 border-l-2 border-slate-200">
                                        "{record.notes}"
                                    </p>
                                </section>
                            )}

                        </div>
                    </ScrollArea>
                </div>

                {/* --- FOOTER --- */}
                <div className="border-t p-4 bg-white flex justify-between items-center shrink-0">
                    <div className="text-xs text-muted-foreground hidden sm:block">
                        Reg: {format(new Date(record.createdAt), "dd/MM/yyyy HH:mm")}
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto justify-end">
                        <Button onClick={handlePrint} variant="outline" className="border-slate-300">
                            <Printer className="h-4 w-4 mr-2" /> Imprimir
                        </Button>
                        <Button onClick={handleDownloadPDF} variant="outline" className="border-slate-300">
                            <Download className="h-4 w-4 mr-2" /> Descargar PDF
                        </Button>
                        {onEdit && (
                            <Button onClick={onEdit} variant="outline" className="border-slate-300">
                                <Edit className="h-4 w-4 mr-2" /> Editar
                            </Button>
                        )}
                        {onDelete && (
                            <Button onClick={onDelete} variant="destructive">
                                <Trash2 className="h-4 w-4 mr-2" /> Eliminar
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// Helper Component for Sidebar
function VitalCard({ icon, label, value }: { icon: any, label: string, value: string }) {
    return (
        <div className="bg-white p-3 rounded-lg border shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
                {icon}
                <span className="text-xs font-medium text-slate-600">{label}</span>
            </div>
            <span className="font-bold text-sm text-slate-900">{value}</span>
        </div>
    );
}