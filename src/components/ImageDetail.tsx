import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios, { type AxiosError } from "axios";
import {
  FaArrowLeft,
  FaDownload,
  FaHeart,
  FaEye,
  FaUser,
  FaCalendar,
  FaExclamationTriangle,
} from "react-icons/fa";
import type { Hit } from "../models/IPixabay";

interface ApiError {
  message: string;
}

const ImageDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [imageData, setImageData] = useState<Hit | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchImageDetail = async () => {
      if (!id) {
        setError("No image ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const apiKey = import.meta.env.VITE_PIXABAY_API_KEY;
        const baseUrl = import.meta.env.VITE_PIXABAY_BASE_URL;

        if (!apiKey || !baseUrl) {
          throw new Error("API configuration missing");
        }

        // We gebruiken de search API met ID filter om specifieke image te vinden
        const response = await axios.get(
          `${baseUrl}?key=${apiKey}&id=${id}&image_type=photo`,
        );

        if (
          response.data &&
          Array.isArray(response.data.hits) &&
          response.data.hits.length > 0
        ) {
          setImageData(response.data.hits[0]);
        } else {
          throw new Error("Image not found");
        }
      } catch (err) {
        const error = err as AxiosError<ApiError>;
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "An error occurred while fetching image details";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchImageDetail();
  }, [id]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) {
      return "0 Bytes";
    }
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2"
          >
            <FaArrowLeft />
            <span>Back</span>
          </button>
          <h1 className="text-2xl font-bold text-white">Image Details</h1>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-white/20 border-t-white"></div>
          </div>
          <p className="text-center text-gray-300 mt-4">
            Loading image details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2"
          >
            <FaArrowLeft />
            <span>Back</span>
          </button>
          <h1 className="text-2xl font-bold text-white">Image Details</h1>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          <div className="text-center py-12">
            <FaExclamationTriangle className="text-red-400 text-6xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Error Loading Image
            </h3>
            <p className="text-gray-300 mb-4">{error}</p>
            <button
              onClick={() => navigate(-1)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!imageData) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2"
          >
            <FaArrowLeft />
            <span>Back</span>
          </button>
          <h1 className="text-2xl font-bold text-white">Image Details</h1>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          <div className="text-center py-12">
            <FaExclamationTriangle className="text-yellow-400 text-6xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Image Not Found
            </h3>
            <p className="text-gray-300 mb-4">
              The requested image could not be found.
            </p>
            <button
              onClick={() => navigate(-1)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(-1)}
          className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2"
        >
          <FaArrowLeft />
          <span>Back</span>
        </button>
        <h1 className="text-2xl font-bold text-white">Image Details</h1>
      </div>

      {/* Main Image */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
        <div className="relative group">
          <img
            src={imageData.largeImageURL}
            alt={imageData.tags}
            className="w-full max-h-96 object-contain rounded-xl shadow-2xl"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100">
            <a
              href={imageData.largeImageURL}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg transition-all duration-300 flex items-center space-x-2 backdrop-blur-sm"
            >
              <FaDownload />
              <span>Download</span>
            </a>
          </div>
        </div>

        {/* Image Info */}
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">
              Image Information
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-gray-300">Dimensions</span>
                <span className="text-white font-medium">
                  {imageData.imageWidth} × {imageData.imageHeight}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-gray-300">File Size</span>
                <span className="text-white font-medium">
                  {formatFileSize(imageData.imageSize)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-gray-300">Type</span>
                <span className="text-white font-medium capitalize">
                  {imageData.type}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Statistics</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-800/50 rounded-lg p-4 text-center border border-slate-600">
                <FaHeart className="text-red-400 text-2xl mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">
                  {formatNumber(imageData.likes)}
                </div>
                <div className="text-sm text-gray-400">Likes</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 text-center border border-slate-600">
                <FaEye className="text-blue-400 text-2xl mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">
                  {formatNumber(imageData.views)}
                </div>
                <div className="text-sm text-gray-400">Views</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 text-center border border-slate-600">
                <FaDownload className="text-green-400 text-2xl mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">
                  {formatNumber(imageData.downloads)}
                </div>
                <div className="text-sm text-gray-400">Downloads</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-white mb-3">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {imageData.tags.split(", ").map((tag, index) => (
              <span
                key={index}
                className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm border border-purple-500/30"
              >
                {tag.trim()}
              </span>
            ))}
          </div>
        </div>

        {/* Photographer Info */}
        <div className="mt-6 pt-6 border-t border-white/20">
          <div className="flex items-center space-x-4">
            <img
              src={imageData.userImageURL}
              alt={imageData.user}
              className="w-12 h-12 rounded-full border-2 border-white/20"
            />
            <div>
              <div className="flex items-center space-x-2">
                <FaUser className="text-gray-400" />
                <span className="text-white font-medium">{imageData.user}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <FaCalendar />
                <span>Photographer</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageDetail;
