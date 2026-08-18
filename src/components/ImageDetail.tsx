import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios, { type AxiosError } from "axios";
import { API_ENDPOINTS } from "../config/api";
import {
  buttonBase,
  buttonSizes,
  buttonVariants,
} from "../constants/buttonStyles";
import type { Hit } from "../models/IPixabay";
import Button from "./Button";
import Icon from "./Icon";
import type { IconName } from "../constants/icons";

interface ApiError {
  message: string;
}

const ImageDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // If the page was opened directly (deep link), there is no history entry to
  // return to, so fall back to the search page instead of doing nothing.
  const goBack = () => {
    if (location.key === "default") {
      navigate("/search");
    } else {
      navigate(-1);
    }
  };
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

        // Retrieve the image by ID regardless of type (photo/illustration/vector).
        const response = await axios.get(
          `${API_ENDPOINTS.PIXABAY_SEARCH}&id=${id}`,
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

  const backButton = (
    <Button size="sm" onClick={goBack}>
      <Icon name="arrowLeft" /> Back
    </Button>
  );

  // Cross-origin `download` attributes are ignored by browsers, so fetch the
  // image as a blob and trigger a real download, falling back to opening the
  // original in a new tab if the fetch is blocked (e.g. CORS).
  const handleDownload = async () => {
    if (!imageData) {
      return;
    }
    try {
      const response = await fetch(imageData.largeImageURL);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const extension =
        imageData.largeImageURL.split("?")[0].split(".").pop() || "jpg";
      link.download = `pixabay-${imageData.id}.${extension}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch {
      window.open(imageData.largeImageURL, "_blank", "noopener,noreferrer");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          {backButton}
          <h1 className="font-display text-3xl uppercase tracking-[0.03em] text-paper md:text-4xl">
            Image Details
          </h1>
        </div>
        <div className="border border-line bg-panel p-12 text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-line border-t-safelight" />
          <p className="mt-4 font-mono text-xs uppercase tracking-meta text-muted">
            Developing frame…
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          {backButton}
          <h1 className="font-display text-3xl uppercase tracking-[0.03em] text-paper md:text-4xl">
            Image Details
          </h1>
        </div>
        <div className="border border-safelight bg-safelight/10 p-10 text-center">
          <div className="mb-3 text-4xl text-safelight">
            <Icon name="warning" />
          </div>
          <h2 className="mb-2 font-display text-lg uppercase tracking-[0.03em] text-paper">
            Error Loading Image
          </h2>
          <p className="mb-5 font-mono text-xs text-muted">{error}</p>
          <Button onClick={goBack}>
            <Icon name="arrowLeft" /> Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (!imageData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          {backButton}
          <h1 className="font-display text-3xl uppercase tracking-[0.03em] text-paper md:text-4xl">
            Image Details
          </h1>
        </div>
        <div className="border border-gold bg-gold/10 p-10 text-center">
          <div className="mb-3 text-4xl text-gold">
            <Icon name="warning" />
          </div>
          <h2 className="mb-2 font-display text-lg uppercase tracking-[0.03em] text-paper">
            Image Not Found
          </h2>
          <p className="mb-5 font-mono text-xs text-muted">
            The requested frame could not be found.
          </p>
          <Button onClick={goBack}>
            <Icon name="arrowLeft" /> Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        {backButton}
        <h1 className="font-display text-3xl uppercase tracking-[0.03em] text-paper md:text-4xl">
          Image Details
        </h1>
      </div>

      <div className="relative border border-line bg-panel p-6 md:p-8">
        <span className="vf-corner vf-tl" />
        <span className="vf-corner vf-tr" />
        <span className="vf-corner vf-bl" />
        <span className="vf-corner vf-br" />

        <div className="group relative">
          <img
            src={imageData.largeImageURL}
            alt={imageData.tags}
            className="max-h-96 w-full border border-line object-contain"
          />
          <Button
            variant="primary"
            size="sm"
            onClick={handleDownload}
            className="absolute right-3 top-3"
          >
            <Icon name="download" /> Download
          </Button>
        </div>

        {/* Image Info */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <h2 className="mb-3 font-display text-lg uppercase tracking-[0.03em] text-paper">
              Image Information
            </h2>
            <dl className="space-y-2">
              {[
                ["Frame ID", `#${imageData.id}`],
                [
                  "Dimensions",
                  `${imageData.imageWidth} × ${imageData.imageHeight}`,
                ],
                ["File Size", formatFileSize(imageData.imageSize)],
                ["Type", imageData.type],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex justify-between border-b border-line pb-2 font-mono text-xs"
                >
                  <dt className="text-muted">{label}</dt>
                  <dd className="text-paper">{value}</dd>
                </div>
              ))}
            </dl>

            <a
              href={imageData.pageURL}
              target="_blank"
              rel="noopener noreferrer"
              className={`${buttonBase} ${buttonSizes.sm} ${buttonVariants.gold} mt-4`}
            >
              <Icon name="arrowRight" /> View on Pixabay
            </a>
          </div>

          <div>
            <h2 className="mb-3 font-display text-lg uppercase tracking-[0.03em] text-paper">
              Statistics
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
              {" "}
              {(
                [
                  ["heart", formatNumber(imageData.likes), "Likes"],
                  ["eye", formatNumber(imageData.views), "Views"],
                  ["download", formatNumber(imageData.downloads), "Downloads"],
                  ["comment", formatNumber(imageData.comments), "Comments"],
                  [
                    "bookmark",
                    formatNumber(imageData.collections),
                    "Collections",
                  ],
                ] as [IconName, string, string][]
              ).map(([icon, value, label]) => (
                <div
                  key={label}
                  className="border border-line bg-panel-2 p-3 text-center"
                >
                  <div className="text-lg text-safelight">
                    <Icon name={icon} />
                  </div>
                  <div className="font-mono text-lg text-paper">{value}</div>
                  <div className="font-mono text-[10px] uppercase tracking-meta text-muted">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="mt-6">
          <h2 className="mb-3 font-display text-lg uppercase tracking-[0.03em] text-paper">
            Tags
          </h2>
          <div className="flex flex-wrap gap-2">
            {imageData.tags.split(", ").map((tag, index) => (
              <span
                key={index}
                className="border border-line px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-muted"
              >
                {tag.trim()}
              </span>
            ))}
          </div>
        </div>

        {/* Photographer */}
        <div className="mt-6 flex items-center gap-3 border-t border-line pt-5">
          <img
            src={imageData.userImageURL}
            alt={imageData.user}
            className="h-10 w-10 rounded-full border border-line object-cover"
          />
          <div>
            <span className="font-display text-sm uppercase tracking-wider text-paper">
              {imageData.user}
            </span>
            <p className="font-mono text-[10px] uppercase tracking-meta text-muted">
              Photographer · Member #{imageData.user_id}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageDetail;
