import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/utils/getAllPosts";

export const runtime = "nodejs";
export const alt = "Blog Post";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

interface OGImageProps {
  params: Promise<{ locale: string; slug: string }>;
}

// Helper to extract SEO fields from the seo array format
function extractSeoField(seo: any[] | undefined, field: string): any {
  if (!seo || !Array.isArray(seo)) return undefined;
  const item = seo.find(
    (obj) => obj && typeof obj === "object" && field in obj
  );
  return item?.[field];
}

export default async function Image({ params }: OGImageProps) {
  const { locale, slug } = await params;
  const post = getPostBySlug(slug, locale);

  if (!post) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f5f1e8",
            color: "#1a1a18",
            fontFamily: "Georgia, serif",
            fontSize: 48,
          }}
        >
          Post not found
        </div>
      ),
      { ...size }
    );
  }

  const { frontmatter } = post;
  const seo = frontmatter.seo;
  const title = extractSeoField(seo, "title") || frontmatter.title || slug;
  const date = frontmatter.date
    ? new Date(frontmatter.date).toLocaleDateString(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f5f1e8", // eink-paper color
          padding: "80px",
        }}
      >
        {/* Content container */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            maxWidth: "900px",
            gap: "32px",
          }}
        >
          {/* Title - centered */}
          <div
            style={{
              display: "flex",
              fontSize: 64,
              fontWeight: 700,
              color: "#1a1a18", // eink-ink color
              fontFamily: "Georgia, serif",
              lineHeight: 1.2,
              textAlign: "center",
              maxWidth: "100%",
              wordWrap: "break-word",
            }}
          >
            {title}
          </div>

          {/* Date */}
          {date && (
            <div
              style={{
                display: "flex",
                fontSize: 24,
                color: "#8a8a84", // eink-ink-muted
                fontFamily: "Georgia, serif",
              }}
            >
              {date}
            </div>
          )}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
