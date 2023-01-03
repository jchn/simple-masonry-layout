// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

export type ImageResponseItem = {
  id: string;
  url: string;
  size: { width: number; height: number };
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ImageResponseItem[]>
) {
  const sizes = [
    { width: 1024, height: 576 },
    { width: 512, height: 1024 },
    { width: 512, height: 512 },
    { width: 512, height: 1024 },
    { width: 1024, height: 576 },
    { width: 512, height: 1024 },
  ];

  const items: ImageResponseItem[] = Array.from({ length: 50 }).map((_, i) => ({
    id: `${i}`,
    url: `/static/${(i % 5) + 1}.webp`,
    size: sizes[i % 5],
  }));

  res.status(200).json(items);
}
