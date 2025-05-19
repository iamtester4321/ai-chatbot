import { Request, Response } from "express";

export const getSuggestions = (req: Request, res: Response) => {
  console.log(req.query);

  const seggestUpon = req.query?.text;

  res.send(200);
};
