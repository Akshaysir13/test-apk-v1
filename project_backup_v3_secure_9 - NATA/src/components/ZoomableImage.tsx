import { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, Minimize2 } from 'lucide-react';

interface ZoomableImageProps {
    src: string;
    alt: string;
    className?: string;
    minScale?: number;
    maxScale?: number;
}

export default function ZoomableImage({
    src,
    alt,
    className = "",
    minScale = 1,
    maxScale = 4
}: ZoomableImageProps) {
    const [scale, setScale] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [isFullscreen, setIsFullscreen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Reset position when scale goes back to 1
    useEffect(() => {
        if (scale === 1) {
            setPosition({ x: 0, y: 0 });
        }
    }, [scale]);

    const handleZoomIn = (e: React.MouseEvent | React.TouchEvent) => {
        e.stopPropagation(); // Prevent event bubbling
        setScale(prev => Math.min(prev + 0.5, maxScale));
    };

    const handleZoomOut = (e: React.MouseEvent | React.TouchEvent) => {
        e.stopPropagation();
        setScale(prev => Math.max(prev - 0.5, minScale));
    };

    const handleReset = (e: React.MouseEvent | React.TouchEvent) => {
        e.stopPropagation();
        setScale(1);
        setPosition({ x: 0, y: 0 });
    };

    const toggleFullscreen = (e: React.MouseEvent | React.TouchEvent) => {
        e.stopPropagation();
        setIsFullscreen(!isFullscreen);
        // Reset zoom when toggling view mode
        setScale(1);
        setPosition({ x: 0, y: 0 });
    };

    const onMouseDown = (e: React.MouseEvent) => {
        if (scale > 1) {
            setIsDragging(true);
            setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
        }
    };

    const onMouseMove = (e: React.MouseEvent) => {
        if (isDragging && scale > 1) {
            setPosition({
                x: e.clientX - startPos.x,
                y: e.clientY - startPos.y
            });
        }
    };

    const onMouseUp = () => {
        setIsDragging(false);
    };

    // Touch support for dragging
    const onTouchStart = (e: React.TouchEvent) => {
        if (scale > 1) {
            setIsDragging(true);
            setStartPos({
                x: e.touches[0].clientX - position.x,
                y: e.touches[0].clientY - position.y
            });
        }
    };

    const onTouchMove = (e: React.TouchEvent) => {
        if (isDragging && scale > 1) {
            setPosition({
                x: e.touches[0].clientX - startPos.x,
                y: e.touches[0].clientY - startPos.y
            });
        }
    };

    const onTouchEnd = () => {
        setIsDragging(false);
    };

    // Classes for fullscreen mode
    const containerClasses = isFullscreen
        ? "fixed inset-0 z-[1000] bg-black/90 flex items-center justify-center"
        : "relative overflow-hidden bg-gray-50 border-2 border-gray-200 rounded-lg";

    const imgClasses = `transition-transform duration-200 ease-out origin-center ${className}`;

    // Style specifically for the image to handle updates
    const imgStyle = {
        transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
        cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
        maxHeight: isFullscreen ? '90vh' : undefined // Changed from 'undefined' string to undefined value
    };

    return (
        <div
            ref={containerRef}
            className={`${containerClasses} group`}
        >
            {/* Controls Overlay */}
            <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-gray-200 transition-opacity ${!isFullscreen && scale === 1 ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
                <button
                    onClick={handleZoomOut}
                    disabled={scale <= minScale}
                    className="p-2 hover:bg-gray-100 rounded-full disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 transition"
                    title="Zoom Out"
                >
                    <ZoomOut size={20} className="text-gray-700" />
                </button>

                <span className="min-w-[3ch] text-center font-mono text-sm font-semibold select-none">
                    {Math.round(scale * 100)}%
                </span>

                <button
                    onClick={handleZoomIn}
                    disabled={scale >= maxScale}
                    className="p-2 hover:bg-gray-100 rounded-full disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 transition"
                    title="Zoom In"
                >
                    <ZoomIn size={20} className="text-gray-700" />
                </button>

                <div className="w-px h-6 bg-gray-300 mx-1"></div>

                <button
                    onClick={handleReset}
                    className="p-2 hover:bg-gray-100 rounded-full active:scale-95 transition"
                    title="Reset View"
                >
                    <RotateCcw size={18} className="text-gray-700" />
                </button>

                <button
                    onClick={toggleFullscreen}
                    className="p-2 hover:bg-gray-100 rounded-full active:scale-95 transition md:hidden"
                    title={isFullscreen ? "Close Fullscreen" : "Fullscreen"}
                >
                    {isFullscreen ? <Minimize2 size={18} className="text-gray-700" /> : <Maximize2 size={18} className="text-gray-700" />}
                </button>
            </div>

            {/* Close button for fullscreen */}
            {isFullscreen && (
                <button
                    onClick={toggleFullscreen}
                    className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition z-20"
                >
                    <Minimize2 size={24} />
                </button>
            )}

            <div
                className={`w-full flex items-center justify-center overflow-hidden ${isFullscreen ? 'h-full p-4' : ''}`}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseUp}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                <img
                    src={src}
                    alt={alt}
                    draggable={false}
                    className={imgClasses}
                    style={imgStyle}
                />
            </div>

            {/* Hint text only visible when not zoomed and hovered */}
            {scale === 1 && !isFullscreen && (
                <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none">
                    Use buttons to zoom
                </div>
            )}
        </div>
    );
}
