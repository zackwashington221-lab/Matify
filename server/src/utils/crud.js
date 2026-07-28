import { Router } from "express";
import { asyncHandler } from "../middleware/error.js";
import { requireAdmin, requireWriteAdmin } from "../middleware/auth.js";
import { AuditLog } from "../models/index.js";

/**
 * Generic REST resource: list (paginated/sorted/searchable), get, create, update, delete.
 * Every mutation writes an audit-log entry so the admin Audit screen has real data.
 */
export function crudRouter(Model, options = {}) {
  const {
    searchFields = [],
    filterFields = [],
    populate = "",
    defaultSort = "-createdAt",
    readGuard = requireAdmin,
    writeGuard = requireWriteAdmin,
    resourceName = Model.modelName.toLowerCase(),
  } = options;

  const router = Router();

  router.get(
    "/",
    readGuard,
    asyncHandler(async (req, res) => {
      const page = Math.max(1, Number(req.query.page) || 1);
      const limit = Math.min(200, Math.max(1, Number(req.query.limit) || 25));
      const sort = req.query.sort || defaultSort;

      const query = {};
      for (const field of filterFields) {
        if (req.query[field] !== undefined && req.query[field] !== "" && req.query[field] !== "all") {
          query[field] = req.query[field];
        }
      }
      if (req.query.q && searchFields.length) {
        const rx = new RegExp(String(req.query.q).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
        query.$or = searchFields.map((f) => ({ [f]: rx }));
      }

      const [data, total] = await Promise.all([
        Model.find(query).sort(sort).skip((page - 1) * limit).limit(limit).populate(populate),
        Model.countDocuments(query),
      ]);

      res.json({ data, page, limit, total, pages: Math.ceil(total / limit) || 1 });
    })
  );

  router.get(
    "/:id",
    readGuard,
    asyncHandler(async (req, res) => {
      const doc = await Model.findById(req.params.id).populate(populate);
      if (!doc) return res.status(404).json({ error: `${Model.modelName} not found` });
      res.json({ data: doc });
    })
  );

  router.post(
    "/",
    writeGuard,
    asyncHandler(async (req, res) => {
      const doc = await Model.create(req.body);
      await audit(req, `${resourceName}.created`, doc);
      res.status(201).json({ data: doc });
    })
  );

  router.patch(
    "/:id",
    writeGuard,
    asyncHandler(async (req, res) => {
      const doc = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!doc) return res.status(404).json({ error: `${Model.modelName} not found` });
      await audit(req, `${resourceName}.updated`, doc);
      res.json({ data: doc });
    })
  );

  router.delete(
    "/:id",
    writeGuard,
    asyncHandler(async (req, res) => {
      const doc = await Model.findByIdAndDelete(req.params.id);
      if (!doc) return res.status(404).json({ error: `${Model.modelName} not found` });
      await audit(req, `${resourceName}.deleted`, doc, "warning");
      res.json({ data: doc });
    })
  );

  return router;
}

export async function audit(req, action, doc, severity = "info") {
  try {
    await AuditLog.create({
      actor: req.user?.name || "System",
      actorId: req.user?._id,
      action,
      target: doc?.name || doc?.reference || doc?.code || doc?.title || String(doc?._id || ""),
      severity,
      ip: req.ip,
    });
  } catch (e) {
    console.warn("[audit] failed", e.message);
  }
}
