import { useState, useCallback, useRef, useEffect } from "react";
import Cropper from "react-easy-crop";
import { imgcruncher } from "imgcruncher";
import { motion } from "motion/react";
import { FiX, FiZoomIn, FiZoomOut, FiRotateCcw, FiCheck, FiUpload } from "react-icons/fi";

function createImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", reject);
    img.src = url;
  });
}

function getRadianAngle(deg) {
  return (deg * Math.PI) / 180;
}

async function getCroppedImg(imageSrc, pixelCrop, rotation = 0) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const rotRad = getRadianAngle(rotation);
  const w = Math.abs(Math.cos(rotRad) * image.width) + Math.abs(Math.sin(rotRad) * image.height);
  const h = Math.abs(Math.sin(rotRad) * image.width) + Math.abs(Math.cos(rotRad) * image.height);

  canvas.width = w;
  canvas.height = h;

  ctx.translate(w / 2, h / 2);
  ctx.rotate(rotRad);
  ctx.translate(-image.width / 2, -image.height / 2);
  ctx.drawImage(image, 0, 0);

  const { x, y, width: cw, height: ch } = pixelCrop;
  const data = ctx.getImageData(x, y, cw, ch);

  canvas.width = cw;
  canvas.height = ch;
  ctx.putImageData(data, 0, 0);

  return canvas.toDataURL("image/webp");
}

export default function ImageCropperModal({ open, onClose, onSave, initialImage, aspect = 4 / 5 }) {
  const fileInputRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open && initialImage) {
      setImageSrc(initialImage);
    }
  }, [open, initialImage]);

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    setSaving(true);
    try {
      const croppedBase64 = await getCroppedImg(imageSrc, croppedAreaPixels, rotation);
      if (!croppedBase64) return;

      const compressed = await imgcruncher(croppedBase64, 0.85, 1200, 1200);
      const blob = await (await fetch(compressed)).blob();
      const file = new File([blob], "product-image.webp", { type: "image/webp" });
      onSave(file, compressed);
      handleClose();
    } catch (err) {
      console.error("Image processing failed", err);
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setImageSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setCroppedAreaPixels(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onClose();
  };

  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="relative bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <input ref={fileInputRef} type="file" accept=".jpg,.jpeg,.png,.webp" onChange={handleFileSelect} className="hidden" />
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
          <h2 className="text-sm font-medium text-red-600">Edit Image</h2>
          <button onClick={handleClose} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors">
            <FiX size={16} className="text-red-400" />
          </button>
        </div>

        {!imageSrc ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center h-80 cursor-pointer hover:bg-red-50/50 transition-colors"
          >
            <FiUpload size={40} className="text-red-300 mb-3" />
            <p className="text-sm text-red-500">Click to select an image</p>
            <p className="text-xs text-gray-400 mt-1">JPG, PNG, or WebP</p>
          </div>
        ) : (
          <>
            <div className="relative w-full h-[400px] bg-gray-100">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={aspect}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onRotationChange={setRotation}
                onCropComplete={onCropComplete}
              />
            </div>

            <div className="px-5 py-4 space-y-3 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="flex-1 accent-red-500 h-1.5 cursor-pointer"
                />
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setRotation(0)}
                  className="p-1 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <FiRotateCcw size={14} className="text-red-400 shrink-0" />
                </button>
                <input
                  type="range"
                  min={0}
                  max={360}
                  step={1}
                  value={rotation}
                  onChange={(e) => setRotation(Number(e.target.value))}
                  className="flex-1 accent-red-500 h-1.5 cursor-pointer"
                />
                <span className="text-xs text-red-500 w-8 text-right tabular-nums shrink-0">{rotation}°</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 px-5 py-3 border-t border-gray-200">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-2 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                Change Image
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 rounded-xl text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-all"
                >
                  <FiCheck size={14} />
                  {saving ? "Saving..." : "Update"}
                </button>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
