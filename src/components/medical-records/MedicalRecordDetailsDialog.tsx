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
    FileText
} from 'lucide-react';
import type { MedicalRecord } from '@/types/medicalRecord';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
                {(onEdit || onDelete) && (
                    <div className="border-t p-4 bg-white flex justify-between items-center shrink-0">
                        <div className="text-xs text-muted-foreground hidden sm:block">
                            Reg: {format(new Date(record.createdAt), "dd/MM/yyyy HH:mm")}
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto justify-end">
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
                )}
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