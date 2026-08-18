import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getImageById, getErrorMessage, NotFoundError } from "../api/pixabay";
import { buttonClasses } from "../constants/buttonStyles";
import Avatar from "./Avatar";
import Button from "./Button";
import Frame from "./Frame";
import Icon from "./Icon";
import MetaLabel from "./MetaLabel";
import Spinner from "./Spinner";
import StatusCard from "./StatusCard";
import type { IconName } from "../constants/icons";

// Timeout (ms) for the image-download blob fetch.
const DOWNLOAD_TIMEOUT_MS = 15_000;

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

  const {
    data: imageData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["pixabay", "image", id],
    queryFn: () => getImageById(id as string),
    enabled: Boolean(id),
    // "Not found" is a terminal result — retrying won't help. Network errors
    // get the default two retries before surfacing the manual Retry button.
    retry: (failureCount, err) =>
      err instanceof NotFoundError ? false : failureCount < 2,
  });

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

  // Shared page header (back link + title) used by every render state.
  const header = (
    <div className="flex flex-wrap items-center gap-4">
      {backButton}
      <h1 className="font-display text-3xl uppercase tracking-[0.03em] text-paper md:text-4xl">
        Image Details
      </h1>
    </div>
  );

  // Cross-origin `download` attributes are ignored by browsers, so fetch the
  // image as a blob and trigger a real download, falling back to opening the
  // original in a new tab if the fetch is blocked (e.g. CORS).
  const handleDownload = async () => {
    if (!imageData) {
      return;
    }
    try {
      const response = await fetch(imageData.largeImageURL, {
        signal: AbortSignal.timeout(DOWNLOAD_TIMEOUT_MS),
      });
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        {header}
        <div className="border border-line bg-panel p-12 text-center">
          <Spinner className="mx-auto" />
          <p className="mt-4 font-mono text-xs uppercase tracking-meta text-muted">
            Developing frame…
          </p>
        </div>
      </div>
    );
  }

  if (isError && error instanceof NotFoundError) {
    return (
      <div className="space-y-6">
        {header}
        <StatusCard
          tone="gold"
          icon="warning"
          title="Image Not Found"
          message="The requested frame could not be found."
          actions={
            <Button onClick={goBack}>
              <Icon name="arrowLeft" /> Go Back
            </Button>
          }
        />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        {header}
        <StatusCard
          tone="warning"
          icon="warning"
          title="Error Loading Image"
          message={getErrorMessage(error)}
          actions={
            <>
              <Button variant="primary" onClick={() => void refetch()}>
                <Icon name="rotateRight" /> Retry
              </Button>
              <Button onClick={goBack}>
                <Icon name="arrowLeft" /> Go Back
              </Button>
            </>
          }
        />
      </div>
    );
  }

  if (!imageData) {
    return (
      <div className="space-y-6">
        {header}
        <StatusCard
          tone="gold"
          icon="warning"
          title="Image Not Found"
          message="The requested frame could not be found."
          actions={
            <Button onClick={goBack}>
              <Icon name="arrowLeft" /> Go Back
            </Button>
          }
        />
      </div>
    );
  }

  const { tags } = imageData;

  return (
    <div className="space-y-6">
      {header}

      <Frame className="p-6">
        <div className="group relative">
          <img
            src={imageData.largeImageURL}
            alt={tags}
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
              className={buttonClasses("gold", "sm", "mt-4")}
            >
              <Icon name="arrowRight" /> View on Pixabay
            </a>
          </div>

          <div>
            <h2 className="mb-3 font-display text-lg uppercase tracking-[0.03em] text-paper">
              Statistics
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
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
                  <MetaLabel as="div">{label}</MetaLabel>
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
            {tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean)
              .map((tag, index) => (
                <span
                  key={index}
                  className="border border-line px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-muted"
                >
                  {tag}
                </span>
              ))}
          </div>
        </div>

        {/* Photographer */}
        <div className="mt-6 flex items-center gap-3 border-t border-line pt-5">
          <Avatar
            name={imageData.user}
            src={imageData.userImageURL}
            size="md"
          />
          <div>
            <span className="font-display text-sm uppercase tracking-wider text-paper">
              {imageData.user}
            </span>
            <MetaLabel as="p">
              Photographer · Member #{imageData.user_id}
            </MetaLabel>
          </div>
        </div>
      </Frame>
    </div>
  );
};

export default ImageDetail;
