"use client";

import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { Icons, ButtonIcons } from "@/constants/icons";

interface TemplatePreviewProps {
  templateComponent: React.ElementType;
  starterContent: Record<string, unknown>;
}

export default function TemplatePreview({
  templateComponent: TemplateComponent,
  starterContent,
}: TemplatePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);
  const isDark = starterContent?.theme_mode === "dark";

  useEffect(() => {
    if (!iframeRef.current) return;

    const iframe = iframeRef.current;
    const doc = iframe.contentDocument;
    if (!doc) return;

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Preview</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <script src="https://cdn.tailwindcss.com"></script>
          <script>
            tailwind.config = {
              darkMode: 'class',
              theme: { extend: { colors: { slate: { 950: '#0d1117' } } } }
            }
          </script>
          <style>
            * { box-sizing: border-box; }
            html, body, #mount-point { margin: 0; padding: 0; width: 100%; height: 100%; }
            body { overflow: hidden; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
            .custom-scroll::-webkit-scrollbar { width: 0px; height: 0px; background: transparent; }
            .custom-scroll { scrollbar-width: none; }
          </style>
        </head>
        <body class="${isDark ? "dark bg-[#0d1117]" : "bg-white"}">
          <div id="mount-point"></div>
        </body>
      </html>
    `);
    doc.close();

    const root = doc.getElementById("mount-point");
    setMountNode(root);
  }, [isDark]);

  const previewSite = {
    ...starterContent,
    id: "preview-mode",
    content: starterContent,
  };

  return (
    <>
      <iframe
        ref={iframeRef}
        title="Template Live Preview"
        className="w-97.5 h-211 border-none rounded-[2.5rem] overflow-hidden bg-white dark:bg-slate-950 shadow-2xl"
      />
      {mountNode &&
        ReactDOM.createPortal(
          <div className="w-full h-full overflow-y-auto custom-scroll">
            <TemplateComponent
              site={previewSite}
              isDark={isDark}
              Icons={Icons}
              BtnIcons={ButtonIcons}
            />
          </div>,
          mountNode,
        )}
    </>
  );
}
