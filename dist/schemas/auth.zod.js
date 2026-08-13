"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePayloadSchema = exports.addPayloadSchema = exports.RegisterSchema = exports.LoginSchema = void 0;
const z = __importStar(require("zod"));
exports.LoginSchema = z.object({
    email: z
        .string({ error: "Email is required" })
        .trim()
        .toLowerCase()
        .email("Please enter a valid email address"),
    password: z
        .string({ error: "Password is required" })
        .min(3, "Password must be at least 3 characters"),
});
exports.RegisterSchema = z.object({
    name: z
        .string()
        .min(4, "Name must be at least 3 characters")
        .max(30, "Name must be smaller than 20 characters"),
    email: z
        .string({ error: "Email is required" })
        .trim()
        .toLowerCase()
        .email("Please enter a valid email address"),
    password: z
        .string({ error: "Password is required" })
        .min(3, "Password must be at least 3 characters"),
});
exports.addPayloadSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Name is required")
        .max(100, "Name cannot exceed 100 characters"),
    description: z
        .string()
        .trim()
        .min(1, "Description is required")
        .max(600, "Description cannot exceed 600 characters"),
    price: z
        .number({
        error: "Price must be a number",
    })
        .positive("Price must be greater than 0"),
    features: z
        .array(z.string().trim().min(1, "Feature cannot be empty"))
        .min(1, "At least one feature is required"),
    technicalData: z
        .array(z.string().trim().min(1, "Technical data cannot be empty"))
        .min(1, "At least one technical data is required"),
    bracelet: z
        .array(z.string().trim().min(1, "Bracelet value cannot be empty"))
        .min(1, "At least one bracelet value is required"),
    pictures: z
        .array(z.string().trim())
        .min(1, "At least one picture is required"),
    tag: z
        .string()
        .trim()
        .min(1, "Tag is required")
        .max(50, "Tag cannot exceed 50 characters"),
});
exports.updatePayloadSchema = exports.addPayloadSchema.partial();
