// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

export type ImageResponseItem = {
  id: string;
  url: string;
  size: { width: number; height: number };
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ImageResponseItem>
) {
  const { id } = req.query;

  if (!id) return res.status(404);

  const sizes = [
    { width: 1024, height: 576 },
    { width: 512, height: 1024 },
    { width: 512, height: 512 },
    { width: 512, height: 1024 },
    { width: 1024, height: 576 },
    { width: 512, height: 1024 },
  ];

  const item: ImageResponseItem = {
    id: id as string,
    url: `/static/${(parseInt(id as string) % 5) + 1}.webp`,
    size: sizes[parseInt(id as string) % 5],
  };

  res.status(200).json(item);
}
