import { WatchGetPayload } from "./../../generated/models/Watch";
import { ca } from "zod/locales";
import { prisma } from "../config/db";
import { AppError } from "../global/AppError";

const addWatchInDb = async (payload: any) => {
  const {
    name,
    description,
    price,
    features,
    technicalData,
    bracelet,
    pictures,
    tag,
  } = payload;

  const category = await addCategoryInDb(tag);

  const watch = await prisma.watch.create({
    data: {
      name,
      description,
      price,
      features,
      technicalData,
      bracelet,
      pictures,
      categoriId: category.id,
    },
  });

  return watch;
};

const upadateWatchInDb = async (payload: any, watchId: string) => {
  const {
    name,
    description,
    price,
    features,
    technicalData,
    bracelet,
    pictures,
    tag,
  } = payload;

  const category = await addCategoryInDb(tag);

  const watch = await prisma.watch.update({
    where: {
      id: watchId,
    },
    data: {
      name,
      description,
      price,
      features,
      technicalData,
      bracelet,
      pictures,
      categoriId: category.id,
    },
  });

  if (!watch) {
    throw new AppError("Watch update failed", 400);
  }

  return watch;
};

const addCategoryInDb = async (tag: string) => {
  const existingCategory = await prisma.category.findUnique({
    where: {
      tags: tag,
    },
  });

  if (existingCategory) {
    return existingCategory;
  }

  const category = await prisma.category.create({
    data: {
      tags: tag,
    },
  });

  return category;
};

export const adminService = {
  addWatchInDb,
  upadateWatchInDb,
};
