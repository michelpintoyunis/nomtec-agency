
import React, { useState, useCallback } from 'react';
import { useEvents } from '../../context/EventContext';
import { Save, Trash2, Plus, Edit, Upload, Check, X, Image, Shield, GripVertical } from 'lucide-react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../../lib/imageUtils';
import { supabase } from '../../lib/supabase';
import { Event } from '../../types';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableItem = ({ id, children }: { id: number, children: React.ReactNode }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 1,
        opacity: isDragging ? 0.8 : 1,
        position: 'relative' as 'relative',
        touchAction: 'none'
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {children}
        </div>
    );
};

const EventsManager: React.FC = () => {
    const { events, addEvent, deleteEvent, updateEvent, reorderEvents } = useEvents();
    const [editingId, setEditingId] = useState<number | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            const oldIndex = events.findIndex((e) => e.id === active.id);
            const newIndex = events.findIndex((e) => e.id === over!.id);
            const newEvents = arrayMove(events, oldIndex, newIndex);
            reorderEvents(newEvents);
        }
    };

    // Cropper states
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [isCropping, setIsCropping] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [activeImageField, setActiveImageField] = useState<'cover' | 'home' | 'away'>('cover');

    // Gallery states
    const [showGallery, setShowGallery] = useState(false);
    const [galleryImages, setGalleryImages] = useState<any[]>([]);
    const [loadingGallery, setLoadingGallery] = useState(false);

    const initialFormState: any = {
        title: '',
        date: '',
        time: '',
        location: '',
        description: '',
        image: 'https://images.unsplash.com/photo-1522778119026-d647f0565c6a?auto=format&fit=crop&w=800&q=80', // Default football field
        category: 'Partido',
        home_team: '',
        away_team: '',
        home_team_abbr: '',
        away_team_abbr: '',
        home_team_logo: 'https://cdn-icons-png.flaticon.com/512/9307/9307963.png',
        away_team_logo: 'https://cdn-icons-png.flaticon.com/512/9307/9307963.png',
        home_score: 0,
        away_score: 0,
        status: 'scheduled'
    };

    const [formData, setFormData] = useState(initialFormState);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Auto-generate title when teams change
    React.useEffect(() => {
        if (formData.home_team && formData.away_team && !editingId) {
            setFormData((prev: any) => ({
                ...prev,
                title: `${prev.home_team} vs ${prev.away_team}`
            }));
        }
    }, [formData.home_team, formData.away_team, editingId]);

    const fetchGalleryImages = async () => {
        try {
            setLoadingGallery(true);
            const { data, error } = await supabase
                .storage
                .from('events')
                .list('', {
                    limit: 100,
                    offset: 0,
                    sortBy: { column: 'created_at', order: 'desc' },
                });

            if (error) {
                console.error('Error fetching images:', error);
                return;
            }

            // Filter out system files and transform data to include public URL
            const imagesWithUrl = data
                .filter(file => file.name !== '.emptyFolderPlaceholder')
                .map(file => {
                    const { data: { publicUrl } } = supabase
                        .storage
                        .from('events')
                        .getPublicUrl(file.name);
                    return { ...file, publicUrl };
                });

            setGalleryImages(imagesWithUrl);
        } catch (error) {
            console.error('Error in gallery fetch:', error);
        } finally {
            setLoadingGallery(false);
        }
    };

    const openGallery = (field: 'cover' | 'home' | 'away') => {
        setActiveImageField(field);
        setShowGallery(true);
        fetchGalleryImages();
    };

    const selectFromGallery = (url: string) => {
        if (activeImageField === 'cover') {
            setFormData((prev: any) => ({ ...prev, image: url }));
        } else if (activeImageField === 'home') {
            setFormData((prev: any) => ({ ...prev, home_team_logo: url }));
        } else if (activeImageField === 'away') {
            setFormData((prev: any) => ({ ...prev, away_team_logo: url }));
        }
        setShowGallery(false);
    };

    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>, field: 'cover' | 'home' | 'away') => {
        if (e.target.files && e.target.files.length > 0) {
            setActiveImageField(field);
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setImageSrc(reader.result as string);
                setIsCropping(true);
            });
            reader.readAsDataURL(file);
            // Reset input so same file can be selected again
            e.target.value = '';
        }
    };

    const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const showCroppedImage = async () => {
        if (!imageSrc || !croppedAreaPixels) return;

        try {
            setUploading(true);
            const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);

            // Generate unique filename
            const fileName = `img-${activeImageField}-${Date.now()}.jpg`;

            // Upload to Supabase
            const { data, error } = await supabase.storage
                .from('events')
                .upload(fileName, croppedImageBlob, {
                    contentType: 'image/jpeg',
                    upsert: true
                });

            if (error) {
                console.error('Error uploading image:', error);
                alert(`Error al subir imagen: ${error.message}\n\nAsegúrate de:\n1. Crear un bucket llamado 'events' en Storage.\n2. Configurar las políticas (Policies) para permitir subidas (Upload/Insert) y lectura (Select) públicas o autenticadas.`);
                setUploading(false);
                return;
            }

            // Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('events')
                .getPublicUrl(fileName);

            if (activeImageField === 'cover') {
                setFormData((prev: any) => ({ ...prev, image: publicUrl }));
            } else if (activeImageField === 'home') {
                setFormData((prev: any) => ({ ...prev, home_team_logo: publicUrl }));
            } else if (activeImageField === 'away') {
                setFormData((prev: any) => ({ ...prev, away_team_logo: publicUrl }));
            }

            setIsCropping(false);
            setImageSrc(null);
        } catch (e) {
            console.error(e);
            alert('Error al procesar la imagen');
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteEvent = async (event: any) => {
        if (!window.confirm(`¿Estás seguro de que quieres eliminar el partido "${event.title}"?`)) {
            return;
        }
        try {
            await deleteEvent(event.id);
        } catch (error) {
            console.error('Error processing delete:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editingId) {
                await updateEvent({ ...formData, id: editingId });
                alert('Partido actualizado correctamente');
                setEditingId(null);
            } else {
                await addEvent(formData);
                alert('Partido creado correctamente');
            }

            setFormData(initialFormState);
        } catch (error) {
            console.error(error);
        }
    };

    const handleEdit = (event: any) => {
        setFormData({
            title: event.title,
            date: event.date,
            time: event.time,
            location: event.location,
            description: event.description || '',
            image: event.image,
            category: event.category,
            home_team: event.home_team || '',
            away_team: event.away_team || '',
            home_team_abbr: event.home_team_abbr || '',
            away_team_abbr: event.away_team_abbr || '',
            home_team_logo: event.home_team_logo || 'https://cdn-icons-png.flaticon.com/512/9307/9307963.png',
            away_team_logo: event.away_team_logo || 'https://cdn-icons-png.flaticon.com/512/9307/9307963.png',
            home_score: event.home_score || 0,
            away_score: event.away_score || 0,
            status: event.status || 'scheduled'
        });
        setEditingId(event.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setFormData(initialFormState);
    };

    const renderImageInput = (label: string, field: 'cover' | 'home' | 'away', currentUrl: string) => (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400">{label}</label>
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-900 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 flex-shrink-0">
                    <img src={currentUrl} alt={label} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex gap-2">
                    <div className="relative flex-1">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => onFileChange(e, field)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <button type="button" className="w-full h-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg px-3 py-2 text-sm font-medium flex items-center justify-center gap-2 transition-colors">
                            <Upload size={14} /> Subir
                        </button>
                    </div>
                    <button
                        type="button"
                        onClick={() => openGallery(field)}
                        className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg px-3 py-2 text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                        <Image size={14} /> Galería
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Formulario */}
                <div className="xl:col-span-1">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-100 dark:border-slate-700 sticky top-8">
                        <h2 className="text-xl font-display font-bold uppercase tracking-wide mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
                            {editingId ? <Edit size={20} className="text-blue-600" /> : <Plus size={20} className="text-blue-600" />}
                            {editingId ? 'Editar Partido' : 'Nuevo Partido'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">

                            {/* Visual Match Editor */}
                            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 mb-4">
                                <div className="text-center mb-4 text-xs font-display font-bold text-slate-400 uppercase tracking-widest">Equipos</div>
                                <div className="flex items-start gap-2">
                                    <div className="flex-1 space-y-2">
                                        <input
                                            type="text"
                                            name="home_team"
                                            placeholder="Equipo Local"
                                            value={formData.home_team}
                                            onChange={handleChange}
                                            className="w-full text-center px-2 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold"
                                        />
                                        <input
                                            type="text"
                                            name="home_team_abbr"
                                            placeholder="ABR (Ej. MAD)"
                                            maxLength={3}
                                            value={formData.home_team_abbr}
                                            onChange={handleChange}
                                            className="w-full text-center px-2 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono uppercase"
                                        />
                                    </div>
                                    <div className="pt-2 font-bold text-slate-300">VS</div>
                                    <div className="flex-1 space-y-2">
                                        <input
                                            type="text"
                                            name="away_team"
                                            placeholder="Equipo Visitante"
                                            value={formData.away_team}
                                            onChange={handleChange}
                                            className="w-full text-center px-2 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold"
                                        />
                                        <input
                                            type="text"
                                            name="away_team_abbr"
                                            placeholder="ABR (Ej. BAR)"
                                            maxLength={3}
                                            value={formData.away_team_abbr}
                                            onChange={handleChange}
                                            className="w-full text-center px-2 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono uppercase"
                                        />
                                    </div>
                                </div>
                            </div>

                            {renderImageInput('Escudo Local', 'home', formData.home_team_logo)}
                            {renderImageInput('Escudo Visitante', 'away', formData.away_team_logo)}
                            {renderImageInput('Imagen de Portada / Estadio', 'cover', formData.image)}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-slate-500 dark:text-slate-400">Día</label>
                                    <input
                                        type="date"
                                        name="date"
                                        required
                                        value={formData.date}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-slate-500 dark:text-slate-400">Hora</label>
                                    <input
                                        type="time"
                                        name="time"
                                        required
                                        value={formData.time}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-slate-500 dark:text-slate-400">Estadio / Ubicación</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Ej. Santiago Bernabéu"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-slate-500 dark:text-slate-400">Nombre del Partido (Auto)</label>
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-500"
                                />
                            </div>

                            <div className="flex gap-2 pt-2">
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
                                >
                                    <Save size={18} /> <span className="font-display uppercase tracking-wider text-sm">{editingId ? 'Actualizar' : 'Crear Partido'}</span>
                                </button>

                                {editingId && (
                                    <button
                                        type="button"
                                        onClick={cancelEdit}
                                        className="px-4 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-xl transition-colors font-semibold"
                                    >
                                        Cancelar
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                {/* Lista de Partidos */}
                <div className="xl:col-span-2">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-100 dark:border-slate-700 h-full">
                        <h2 className="text-xl font-display font-bold uppercase tracking-wide mb-6">Partidos Programados ({events.length})</h2>

                        <div className="space-y-4">
                            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                <SortableContext items={events.map(e => e.id)} strategy={verticalListSortingStrategy}>
                                    {events.map((event) => (
                                        <SortableItem key={event.id} id={event.id}>
                                            <div className={`relative flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl border transition-colors cursor-grab active:cursor-grabbing ${editingId === event.id ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : 'bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-700'}`}>

                                                {/* Drag Handle Indicator (Optional visually, intrinsic via listeners) */}
                                                <div className="hidden sm:flex text-slate-300">
                                                    <GripVertical size={20} />
                                                </div>

                                                {event.status !== 'scheduled' && event.status !== null && (
                                                    <div className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600 flex items-center gap-1">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                                        EN VIVO
                                                    </div>
                                                )}

                                                {/* Match Info */}
                                                <div className="flex-1 w-full">
                                                    <div className="flex items-center justify-between w-full mb-3">
                                                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{event.date} • {event.time}</div>
                                                        <div className="text-xs font-bold text-slate-400">{event.location}</div>
                                                    </div>

                                                    <div className="flex items-center justify-between gap-4">
                                                        {/* Home */}
                                                        <div className="flex items-center gap-3 flex-1 justify-end">
                                                            <span className="font-bold text-slate-900 dark:text-white text-right hidden sm:block">{event.home_team}</span>
                                                            <span className="font-bold text-slate-900 dark:text-white text-right sm:hidden">{event.home_team_abbr}</span>
                                                            <img src={event.home_team_logo} alt={event.home_team} className="w-10 h-10 object-contain" />
                                                        </div>

                                                        {/* Score */}
                                                        <div className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-lg text-lg font-display font-bold text-blue-700 dark:text-blue-400">
                                                            {event.home_score} - {event.away_score}
                                                        </div>

                                                        {/* Away */}
                                                        <div className="flex items-center gap-3 flex-1 justify-start">
                                                            <img src={event.away_team_logo} alt={event.away_team} className="w-10 h-10 object-contain" />
                                                            <span className="font-bold text-slate-900 dark:text-white text-left hidden sm:block">{event.away_team}</span>
                                                            <span className="font-bold text-slate-900 dark:text-white text-left sm:hidden">{event.away_team_abbr}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex sm:flex-col gap-2 w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-slate-700 sm:pl-4 justify-end" onPointerDown={(e) => e.stopPropagation()}>
                                                    {/* Stop propagation so buttons don't trigger drag */}
                                                    <button
                                                        onClick={() => handleEdit(event)}
                                                        className="flex-1 sm:flex-none p-2 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors flex items-center justify-center gap-2"
                                                        title="Editar partido"
                                                    >
                                                        <Edit size={16} /> <span className="sm:hidden text-xs font-display font-bold uppercase tracking-wider">Editar</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteEvent(event)}
                                                        className="flex-1 sm:flex-none p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors flex items-center justify-center gap-2"
                                                        title="Eliminar partido"
                                                    >
                                                        <Trash2 size={16} /> <span className="sm:hidden text-xs font-display font-bold uppercase tracking-wider">Borrar</span>
                                                    </button>
                                                </div>

                                            </div>
                                        </SortableItem>
                                    ))}
                                </SortableContext>
                            </DndContext>

                            {events.length === 0 && (
                                <div className="text-center py-12 text-slate-500 dark:text-slate-400 flex flex-col items-center gap-3">
                                    <Shield size={48} className="text-slate-200 dark:text-slate-700" />
                                    <p>No hay partidos programados.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Cropper Modal */}
            {isCropping && imageSrc && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <h3 className="text-lg font-bold">Recortar {activeImageField === 'cover' ? 'Portada' : 'Escudo'}</h3>
                            <button
                                onClick={() => setIsCropping(false)}
                                className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="relative h-80 bg-slate-100 text-black">
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={activeImageField === 'cover' ? 16 / 9 : 1}
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                            />
                        </div>

                        <div className="p-6 bg-white dark:bg-slate-900 space-y-4">
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsCropping(false)}
                                    className="flex-1 py-3 px-4 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={showCroppedImage}
                                    disabled={uploading}
                                    className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
                                >
                                    {uploading ? 'Subiendo...' : 'Confirmar'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Gallery Modal */}
            {showGallery && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh]">
                        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <h3 className="text-lg font-bold">Galería</h3>
                            <button onClick={() => setShowGallery(false)} className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6">
                            {loadingGallery ? (
                                <div className="text-center">Cargando...</div>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {galleryImages.map((file) => (
                                        <div key={file.id} onClick={() => selectFromGallery(file.publicUrl)} className="cursor-pointer hover:opacity-80">
                                            <img src={file.publicUrl} alt={file.name} className="w-full h-32 object-contain bg-slate-100 rounded-lg" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventsManager;
