import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useModal } from '../Modal';

interface ImageUploadProps {
  currentImageUrl?: string | null;
  onUploadComplete: (url: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ currentImageUrl, onUploadComplete }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const { user } = useAuth();
  const { showAlert } = useModal();

  // Update preview when currentImageUrl changes
  React.useEffect(() => {
    setPreview(currentImageUrl || null);
  }, [currentImageUrl]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!e.target.files || e.target.files.length === 0) {
        return;
      }

      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload file
      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data } = supabase.storage
        .from('profile-images')
        .getPublicUrl(filePath);

      if (data?.publicUrl) {
        onUploadComplete(data.publicUrl);
      }
    } catch (error: any) {
      await showAlert('Upload Error', 'Error uploading image: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="form-control w-full">
      {preview && (
        <div className="mb-3 sm:mb-4 flex justify-center sm:justify-start">
          <img
            src={preview}
            alt="Preview"
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-2 sm:border-4 border-base-300"
          />
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        className="file-input file-input-bordered file-input-xs sm:file-input-sm md:file-input-md w-full text-xs sm:text-sm"
        onChange={handleFileUpload}
        disabled={uploading}
      />
      {uploading && (
        <div className="mt-2 flex items-center">
          <span className="loading loading-spinner loading-xs sm:loading-sm"></span>
          <span className="ml-2 text-xs sm:text-sm">Uploading...</span>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;

